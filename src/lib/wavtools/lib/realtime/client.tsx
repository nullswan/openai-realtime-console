import React, { createContext, useRef, ReactNode, useState, useEffect } from 'react';
import { WavStreamPlayer } from '../wav_stream_player';
import { WavRecorder } from '../wav_recorder';
import { RealtimeClient } from '@openai/realtime-api-beta';
import client from './singleton';

interface GlobalRefs {
  wavRecorderRef: React.RefObject<WavRecorder>;
  wavStreamPlayerRef: React.RefObject<WavStreamPlayer>;
  clientRef: React.RefObject<RealtimeClient>;
  startRecording: () => void;
  stopRecording: () => void;
  addMessage: (content: string) => void;
  changeTurnEndType: (value: string) => void;
  connectConversation: (instructions: string, tools?: any) => Promise<void>;
  disconnectConversation: () => Promise<void>;
}

export const GlobalRefsContext = createContext<GlobalRefs | null>(null);

interface GlobalRefsProviderProps {
  children: ReactNode;
}

export const GlobalRefsProvider: React.FC<GlobalRefsProviderProps> = ({ children }) => {
  const wavRecorderRef = useRef<WavRecorder>(new WavRecorder({ sampleRate: 24000 }));
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(new WavStreamPlayer({ sampleRate: 24000 }));

  const clientRef = useRef<RealtimeClient>(client);

  const [isConnected, setIsConnected] = useState(false);
  const [canPushToTalk, setCanPushToTalk] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const connectConversation = async (
    instructions: string,
    tools?: any[],
  ) => {
    if (isConnected) {
      return;
    }

    setIsConnected(true);

    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    console.log('Connecting conversation...');

    // Connect to microphone
    await wavRecorder.begin();

    // Connect to audio output
    await wavStreamPlayer.connect();

    if (client.isConnected()) {
      return;
    }

    await client.connect();
    client.updateSession({
      instructions,
      tool_choice: 'auto',
    })

    for (const tool of tools || []) {
      client.addTool(tool.config, tool.callback);
    }

    console.log('Adding event listeners...');

    client.on('conversation.interrupted', async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });
    client.on('conversation.updated', async ({ item, delta }: any) => {
      if (delta?.transcript)
        console.log(delta?.transcript)
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === 'completed' && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
    });

    if (client.getTurnDetectionType() === 'server_vad') {
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
    }
  }

  const addMessage = async (content: string) => {
    const client = clientRef.current;
    client.sendUserMessageContent([
      {
        type: `input_text`,
        text: content,
      },
    ])
  }

  const disconnectConversation = async () => {
    setIsConnected(false);

    const client = clientRef.current;
    client.disconnect();

    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.end();

    const wavStreamPlayer = wavStreamPlayerRef.current;
    await wavStreamPlayer.interrupt();
  };

  const startRecording = async () => {
    setIsRecording(true);
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const trackSampleOffset = await wavStreamPlayer.interrupt();
    if (trackSampleOffset?.trackId) {
      const { trackId, offset } = trackSampleOffset;
      await client.cancelResponse(trackId, offset);
    }
    await wavRecorder.record((data) => client.appendInputAudio(data.mono));
  };

  const stopRecording = async () => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    await wavRecorder.pause();
    client.createResponse();
  };

  const changeTurnEndType = (value: string) => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    if (value === 'none' && wavRecorder.getStatus() === 'recording') {
      wavRecorder.pause();
    }
    client.updateSession({
      turn_detection: value === 'none' ? null : { type: 'server_vad' },
    });
    if (value === 'server_vad' && client.isConnected()) {
      wavRecorder.record((data) => client.appendInputAudio(data.mono));
    }
    setCanPushToTalk(value === 'none');
  };

  useEffect(() => {
    return () => {
      if (isConnected)
        disconnectConversation();
      if (isRecording)
        stopRecording();
    };
  }, []);

  const value: GlobalRefs = {
    wavRecorderRef,
    wavStreamPlayerRef,
    clientRef,
    startRecording,
    stopRecording,
    addMessage,
    changeTurnEndType,
    connectConversation,
    disconnectConversation,
  };

  return (
    <GlobalRefsContext.Provider value={value}>
      {children}
    </GlobalRefsContext.Provider>
  );
};
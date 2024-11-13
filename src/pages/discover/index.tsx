import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { OPENAI_API_KEY } from '../../lib/wavtools/lib/realtime/core';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { useEffect, useState } from 'react';

interface RoadmapTopic {
  name: string;
  description: string;
}

interface RoadmapResponse {
  subject: string;
  topics: RoadmapTopic[];
  images: string[]
}

const RoadmapResponse = z.object({
  subject: z.string(),
  topics: z.array(z.object({
    name: z.string(),
  })),
})

const getRoadmapSystemPrompt = ``;
const getRoadmapUserPrompt = (subjectId: string) => `
  I want to learn about ${subjectId}, return 3 topics
`;

const getTopicSystemPrompt = ``;
const getTopicUserPrompt = (subjectId: string, topicId: string) => `
  I want to learn more about ${topicId} in ${subjectId}
`;

async function getRoadmap(
  subjectId: string,
) {
  const client = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

  const stream = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: getRoadmapSystemPrompt },
      { role: "user", content: getRoadmapUserPrompt(subjectId) }
    ],
    response_format: zodResponseFormat(RoadmapResponse, "learning_roadmap"),
  });

  const message = JSON.parse(stream.choices[0].message.content);
  return RoadmapResponse.parse(message);
}

async function getTopic(
  subjectId: string,
  topicId: string,
  streamCallback: (message: string) => void
) {
  const client = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

  const stream = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: getTopicSystemPrompt },
      { role: "user", content: getTopicUserPrompt(subjectId, topicId) }
    ],
    stream: true,
  });

  for await (const message of stream) {
    streamCallback(message.choices[0]?.delta?.content || '');
  }
}

export default function Discover() {
  const { subjectId } = useParams<{ subjectId: string }>();

  const [description, setDescription] = useState<string>('');
  const subjects: Map<string, RoadmapResponse> = new Map();

  useEffect(() => {
    if (subjects.has(subjectId)) {
      return;
    }

    (async () => {
      const roadmap = await getRoadmap(subjectId);
      console.log(roadmap);
      getTopic(subjectId, roadmap.topics[0].name, (chunk) => {
        setDescription((prevDescription) => prevDescription + chunk);
      });
    })();
  }, [subjectId]);

  return (
    <div className="min-h-screen bg-white ">
      <Header />
      <div>{subjectId}</div>
      <div>{description}</div>
    </div>
  );
}
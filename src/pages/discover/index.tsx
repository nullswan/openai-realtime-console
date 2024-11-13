import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { OPENAI_API_KEY } from '../../lib/wavtools/lib/realtime/core';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { useEffect, useState } from 'react';
import { getRoadmapSystemPrompt } from './roadmap_prompt.js';
import { getTopicSystemPrompt } from './topic_prompt.js';

interface RoadmapTopic {
  name: string;
  description: string;
}

interface RoadmapResponse {
  subject: string;
  topics: RoadmapTopic[];
  images: string[]
}

interface SubtopicResponse {
  title: string;
  description: string;
}

interface FunFact {
  title: string;
  description: string[];
}

interface TopicResponse {
  title: string;
  introduction: string;
  subtopics: SubtopicResponse[];
  fun_fact?: FunFact;
}

const RoadmapResponse = z.object({
  subject: z.string(),
  topics: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })),
  images: z.array(z.string()),
})

const SubtopicResponse = z.object({
  title: z.string(),
  description: z.string()
});

const FunFact = z.object({
  title: z.string(),
  description: z.array(z.string()),
});

const TopicResponse = z.object({
  title: z.string(),
  introduction: z.string(),
  subtopics: z.array(SubtopicResponse),
  fun_fact: z.optional(FunFact),
})

// Topics = un array de choses à apprendre sur le sujet
const getRoadmapUserPrompt = (subjectId: string) => `
  I want to learn about ${subjectId}, return 3 topics
`;

// Html to return
// Titre => intro avec sous chapitres et description a chaque fois bullet points + optionnel fun fact
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
    response_format: zodResponseFormat(TopicResponse, "topic"),
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
      <div><pre>{description}</pre></div>
    </div>
  );
}

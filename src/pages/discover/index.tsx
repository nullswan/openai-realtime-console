import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { OPENAI_API_KEY } from '../../lib/wavtools/lib/realtime/core';
import OpenAI from 'openai';
import { z } from 'zod';
import { getTopicSystemPrompt } from './topic_prompt';
import { zodResponseFormat } from 'openai/helpers/zod';
import { getRoadmapSystemPrompt } from './roadmap_prompt';

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
  links?: string[];
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
  links: z.array(z.string()).optional(),
})
/* Les images seront gérées séparément en fonction du subjectId */

const TopicResponseSchema = z.object({
  title: z.string(),
  introduction: z.string(),
  subtopics: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
  fun_fact: z
    .object({
      title: z.string(),
      description: z.array(z.string()),
    })
    .optional(),
});

// Html to return
// Titre => intro avec sous chapitres et description a chaque fois bullet points + optionnel fun fact
const getTopicUserPrompt = (subjectId: string, topicId: string) => `
  I want to learn more about ${topicId} in ${subjectId}
`;

const getRoadmapUserPrompt = (subjectId: string) => `
  I want to learn about ${subjectId}, return 3 topics
`;

async function getRoadmap(
  subjectId: string,
): Promise<RoadmapResponse> {
  const client = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: getRoadmapSystemPrompt },
      { role: "user", content: getRoadmapUserPrompt(subjectId) }
    ],
    response_format: zodResponseFormat(RoadmapResponse, "learning_roadmap"),
  });

  const message = JSON.parse(stream.choices[0].message.content);
  return message as RoadmapResponse;
}

async function getTopic(
  subjectId: string,
  topicId: string,
): Promise<TopicResponse> {
  const client = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: getTopicSystemPrompt },
      { role: "user", content: getTopicUserPrompt(subjectId, topicId) }
    ],
    response_format: zodResponseFormat(TopicResponse, "topic"),
  });

  // Parse the JSON string from the response before validating with Zod
  const responseData = JSON.parse(stream.choices[0].message.content);
  return responseData as TopicResponse;
}

function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="space-y-6">
        <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded" />
        <div className="flex items-center gap-2">
          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-[4/3] bg-gray-200 animate-pulse rounded" />
          <div className="aspect-[4/3] bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-1/4 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-4/5 bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Discover() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [contents, setContents] = useState<TopicResponse[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const asyncGetRoadmap = async () => {
    const roadmap = await getRoadmap(subjectId);
    console.log('roadmap', roadmap);
    return roadmap;
  }

  useEffect(() => {
    (async () => {
      const roadmapResponse: RoadmapResponse = await asyncGetRoadmap();
      console.log('roadmapResponse', roadmapResponse);
      if (roadmapResponse) {
        setRoadmap(roadmapResponse);
      }
    })();
  }, [subjectId]);

  useEffect(() => {
    if (roadmap) {
      Promise.all(
        roadmap.topics.map(topic =>
          getTopic(subjectId, topic.name)
        )
      ).then((topics) => {
        setContents(topics);
        setLoading(false);
      });
    }
  }, [subjectId, roadmap]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : contents.length > 0 ? (
          <div className="max-w-3xl mx-auto px-4 space-y-12">
            {contents.map((content, contentIndex) => (
              <div key={contentIndex}>
                <div className="space-y-8">
                  <h1 className="text-2xl font-bold">{content.title}</h1>

                  <div className="flex items-center gap-2 justify-start">
                    <img src="/logo.svg" alt="" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`${content.title} illustration ${index + 1}`}
                        className="aspect-[4/3] rounded-lg shadow-md object-cover"
                      />
                    ))}
                  </div>


                  {/* Introduction */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">
                      {content.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {content.introduction}
                    </p>
                  </div>

                  {content.links && <div className="p-4 bg-gray-100 border border-gray-300 rounded overflow-hidden"><h4 className="text-lg font-medium mb-2">References</h4><ul className="flex flex-col space-y-2">{content.links.map((link, index) => <li key={index} className="flex items-center truncate"><span className="mr-2 text-blue-600">🔗</span><a href={link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{link.replace(/^https?:\/\/(www\.)?/, '')}</a></li>)}</ul></div>}

                  {/* Subtopics */}
                  {content.subtopics && content.subtopics.map((subtopic, index) => (
                    <div key={index} className="space-y-4">
                      <h3 className="text-xl font-semibold">{subtopic.title}</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {subtopic.description}
                      </p>
                    </div>
                  ))}

                  {/* Fun Fact */}
                  {content.fun_fact && content.fun_fact && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium">{content.fun_fact.title}</h4>
                      {content.fun_fact.description.map((fact, index) => (
                        <p key={index} className="text-gray-600 leading-relaxed">
                          {fact}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                {contentIndex < contents.length - 1 && (
                  <hr className="my-12 border-black border-t-4 border-dotted" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 text-center text-gray-600">
            Contenu en cours de chargement...
          </div>
        )}
      </main>
    </div>
  );
}
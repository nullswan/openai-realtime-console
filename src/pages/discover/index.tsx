import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { OPENAI_API_KEY } from '../../lib/wavtools/lib/realtime/core';
import OpenAI from 'openai';
import { z } from 'zod';
import { getTopicSystemPrompt } from './topic_prompt';

interface SubtopicResponse {
  title: string;
  description: string;
}

interface FunFact {
  title: string;
  description: string[];
}

interface TopicResponse {
  title?: string;
  introduction?: string;
  subtopics?: SubtopicResponse[];
  fun_fact?: FunFact;
}

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

async function getTopic(
  subjectId: string,
  topicId: string
): Promise<TopicResponse> {
  const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: getTopicSystemPrompt },
      { role: 'user', content: getTopicUserPrompt(subjectId, topicId) },
    ],
  });

  const messageContent = response.choices[0].message?.content;

  if (!messageContent) {
    throw new Error('La réponse de l\'API est vide.');
  }

  let parsedMessage;

  try {
    parsedMessage = JSON.parse(messageContent);
  } catch (e) {
    throw new Error('Échec de l\'analyse du contenu de la réponse en JSON.');
  }

  const topicResponse = TopicResponseSchema.parse(parsedMessage);

  return topicResponse[0];
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
  const [content, setContent] = useState<TopicResponse | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Simuler un délai
        await new Promise((resolve) => setTimeout(resolve, 500));

        let selectedContent: TopicResponse | null = null;
        let selectedImages: string[] = [];

        if (subjectId === 'New planet 9 discovery') {
          selectedContent = {
            title: 'New Planet 9 Discovery',
            introduction:
              'Explore the latest findings on the potential ninth planet in our solar system.',
            subtopics: [
              {
                title: 'Evidence of Planet 9',
                description:
                  'Understand the evidence pointing to its existence and the implications for our understanding of the solar system.',
              },
              {
                title: 'Search Methods',
                description:
                  'Learn about the techniques astronomers are using to locate Planet 9.',
              },
            ],
            fun_fact: {
              title: 'Did You Know?',
              description: [
                'Planet 9 is hypothesized to be about 10 times the mass of Earth.',
                'It could take between 10,000 and 20,000 Earth years to make one full orbit around the sun.',
              ],
            },
          };
          selectedImages = [
            'https://i0.wp.com/www.laterredufutur.com/accueil/wp-content/uploads/2022/01/planete-9.jpg?fit=1187%2C774&ssl=1',
            'https://lejournal.cnrs.fr/sites/default/files/styles/asset_image_full/public/assets/images/p9_kbo_orbits_labeled-news-web_72dpi.jpg?itok=pchzfbed',
          ];
        } else if (subjectId === 'Python ML course') {
          selectedContent = {
            title: 'Python Machine Learning Course',
            introduction:
              'Learn the fundamentals of machine learning using Python.',
            subtopics: [
              {
                title: 'Python Basics',
                description: 'Review the basics of Python programming language.',
              },
              {
                title: 'ML Algorithms',
                description:
                  'Cover algorithms, data preprocessing, and model evaluation techniques.',
              },
            ],
          };
          selectedImages = [
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIcBbGo5FZUXE5xukkNMiu_lv4L5DOywDlKA&s',
            'https://m.media-amazon.com/images/I/71o+UlqkwdL._AC_UF894,1000_QL80_.jpg',
          ];
        } else if (subjectId === 'Prime number discovery') {
          selectedContent = {
            title: 'Prime Number Discovery',
            introduction:
              'Dive into the recent discoveries in prime numbers.',
            subtopics: [
              {
                title: 'New Patterns',
                description:
                  'Learn about new patterns and theories emerging in number theory.',
              },
              {
                title: 'Applications',
                description:
                  'Explore how prime numbers are used in cryptography and security.',
              },
            ],
          };
          selectedImages = [
            'https://media.geeksforgeeks.org/wp-content/uploads/20240912153108/Prime-Numbers.png',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiZXr4gvamdkoUiJ9t9yrVbhzztRXG1bNsgA&s',
          ];
        } else {
          // Récupération depuis l'API si le subjectId n'est pas prédéfini
          selectedContent = await getTopic(subjectId!, subjectId!);
        }

        setContent(selectedContent);
        setImages(selectedImages);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [subjectId]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : content ? (
          <div className="max-w-3xl mx-auto px-4 space-y-8">
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
                Introduction à {content.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {content.introduction}
              </p>
            </div>

            {/* Subtopics */}
            {content.subtopics.map((subtopic, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-semibold">{subtopic.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {subtopic.description}
                </p>
              </div>
            ))}

            {/* Fun Fact */}
            {content.fun_fact && (
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
        ) : (
          // Afficher un message indiquant que le contenu est en cours de chargement
          <div className="max-w-3xl mx-auto px-4 text-center text-gray-600">
            Contenu en cours de chargement...
          </div>
        )}
      </main>
    </div>
  );
}
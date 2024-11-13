'use client';

import { useState, useEffect } from 'react';
import { Heart, Clock, Eye } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';

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
  author: string;
  likes: number;
  views: number;
  timestamp: string;
  introduction: string;
  subtopics: SubtopicResponse[];
  fun_fact?: FunFact;
  images: string[];
}

const MOCK_CONTENT: Record<string, TopicResponse> = {
  'new-planet-9-discovery': {
    title: 'Breaking News: Possible Discovery of Planet 9',
    author: 'astroFan',
    likes: 45,
    views: 301,
    timestamp: '10 minutes ago',
    introduction:
      "Astronomers are abuzz with speculation about Planet 9, a possible ninth planet lurking in the outer solar system. It may be far larger than Earth and orbit the Sun over tens of thousands of years.",
    subtopics: [
      {
        title: 'Evidence of Planet 9',
        description:
          "Strange orbits of distant celestial bodies hint at an unseen giant planet, potentially altering our understanding of the solar system.",
      },
      {
        title: 'How Astronomers Are Searching',
        description:
          "Scientists use telescopes and simulations to narrow down Planet 9’s location, tracking gravitational anomalies in nearby objects.",
      },
    ],
    fun_fact: {
      title: 'Did You Know?',
      description: [
        "Planet 9 could be 10 times Earth's mass, and its orbit might span 10,000 to 20,000 years.",
      ],
    },
    images: [
      'https://i0.wp.com/www.laterredufutur.com/accueil/wp-content/uploads/2022/01/planete-9.jpg?fit=1187%2C774&ssl=1',
      'https://lejournal.cnrs.fr/sites/default/files/styles/asset_image_full/public/assets/images/p9_kbo_orbits_labeled-news-web_72dpi.jpg?itok=pchzfbed',
    ],
  },
  'python-ml-course': {
    title: 'Mastering Machine Learning with Python',
    author: 'dataGuru',
    likes: 85,
    views: 540,
    timestamp: '5 hours ago',
    introduction:
      "Unlock the power of Python in the world of machine learning! This course dives into Python basics and builds up to complex algorithms, making it ideal for beginners and experts alike.",
    subtopics: [
      {
        title: 'Python Foundations',
        description: "A refresher on Python essentials, from syntax to data structures.",
      },
      {
        title: 'Core Machine Learning Algorithms',
        description:
          "Dive into supervised and unsupervised learning, data preprocessing, and model evaluation.",
      },
    ],
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIcBbGo5FZUXE5xukkNMiu_lv4L5DOywDlKA&s',
      'https://m.media-amazon.com/images/I/71o+UlqkwdL._AC_UF894,1000_QL80_.jpg',
    ],
  },
  'prime-number-discovery': {
    title: 'Recent Advances in Prime Number Research',
    author: 'mathWhiz',
    likes: 70,
    views: 430,
    timestamp: '1 day ago',
    introduction:
      "Prime numbers hold the key to secrets in mathematics and cryptography. Recent breakthroughs are revealing new patterns and applications that could revolutionize our understanding.",
    subtopics: [
      {
        title: 'Emerging Patterns',
        description:
          "Mathematicians have discovered intriguing patterns, offering insight into one of math's oldest mysteries.",
      },
      {
        title: 'Cryptography Applications',
        description:
          "Prime numbers are foundational to encryption, ensuring secure communication in the digital age.",
      },
    ],
    images: [
      'https://media.geeksforgeeks.org/wp-content/uploads/20240912153108/Prime-Numbers.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiZXr4gvamdkoUiJ9t9yrVbhzztRXG1bNsgA&s',
    ],
  },
};

export default function Discover() {
  const [content, setContent] = useState<TopicResponse | null>(null);
  const { subjectId } = useParams<{ subjectId: string }>();
  useEffect(() => {
    const normalizedSubjectId = subjectId.toLowerCase().replace(/ /g, '-');
    setContent(MOCK_CONTENT[normalizedSubjectId]);
  }, [subjectId]);

  if (!content) {
    return <div>Content not found</div>;
  }

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{content.title}</h1>

        <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>By {content.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>{content.likes} likes</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{content.timestamp}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{content.views} views</span>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-start mb-">
          <img src="/logo.svg" alt="" />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-8">
          {content.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Illustration ${i + 1}`}
              className="rounded-lg shadow-md w-full aspect-video object-cover"
            />
          ))}
        </div>

        <div className="prose max-w-none">
          <p className="text-lg mb-8">{content.introduction}</p>

          {content.subtopics.map((subtopic, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{subtopic.title}</h2>
              <p className="whitespace-pre-line">{subtopic.description}</p>
            </section>
          ))}

          {content.fun_fact && (
            <section className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                {content.fun_fact.title}
              </h3>
              <ul className="list-disc pl-6">
                {content.fun_fact.description.map((fact, i) => (
                  <li key={i}>{fact}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

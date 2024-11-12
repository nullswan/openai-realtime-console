'use client';

import { useState } from 'react';
import { Button } from '../../@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../@/components/ui/accordion';
import { RoadmapResponse } from '../../lib/types';

const roadmapData: RoadmapResponse = {
  subject: 'Machine Learning Roadmap',
  tasks: [
    {
      priority: 1,
      name: 'Learn the basics',
      description:
        'Study Python basics, focusing on NumPy and pandas. Cover essential math: linear algebra, probability, and statistics (basic level).',
      key_concepts: [
        'Python',
        'NumPy',
        'pandas',
        'Linear Algebra',
        'Probability',
        'Statistics',
      ],
      resources: [
        'Python Documentation',
        'NumPy Documentation',
        'pandas Documentation',
      ],
      practical_applications: 'Data manipulation and analysis',
      progress: false,
    },
    {
      priority: 2,
      name: 'Understand core ML concepts',
      description:
        'Master fundamental machine learning concepts. Learn about different types of algorithms.',
      key_concepts: [
        'Supervised Learning',
        'Unsupervised Learning',
        'Regression',
        'Classification',
      ],
      resources: ['Machine Learning Coursera', 'Scikit-learn Documentation'],
      practical_applications: 'Building predictive models',
      progress: false,
    },
    {
      priority: 3,
      name: 'Build a quick project',
      description:
        'Apply your knowledge to a real project. Get hands-on experience with ML implementation.',
      key_concepts: [
        'Project Planning',
        'Data Collection',
        'Model Training',
        'Evaluation',
      ],
      resources: ['Kaggle Datasets', 'GitHub ML Projects'],
      practical_applications: 'Solving real-world problems with ML',
      progress: false,
    },
  ],
};

export default function Component() {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  const handleAccordionChange = (value: string) => {
    setOpenItem(value === openItem ? undefined : value);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold mb-8">
          👨‍🏫 Ok Ethan! Here is your roadmap:
        </h1>
        <div className="space-y-4">
          {roadmapData.tasks.map((task, index) => (
            <div key={index} className="bg-gray-50 rounded-xl w-[40vw]">
              <Accordion
                type="single"
                collapsible
                value={openItem}
                onValueChange={handleAccordionChange}
                className="w-full"
              >
                <AccordionItem value={`item-${index}`} className="border-none">
                  <AccordionTrigger className="hover:no-underline px-6 py-4">
                    <div className="text-left">
                      <h2 className="text-xl font-medium text-gray-800">
                        <span className="font-semibold">
                          Step {task.priority}{' '}
                        </span>
                        : {task.name}
                      </h2>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 w-[60vw]">
                    <div className="relative">
                      <p className="text-gray-600 mb-4 max-w-[40vw]">{task.description}</p>
                      <h3 className="font-medium text-gray-800 mb-2">
                        Key Concepts:
                      </h3>
                      <ul className="space-y-1 list-disc list-inside text-gray-600 mb-4">
                        {task.key_concepts.map((concept, i) => (
                          <li key={i} className="leading-relaxed">
                            {concept}
                          </li>
                        ))}
                      </ul>
                      <h3 className="font-medium text-gray-800 mb-2">
                        Resources:
                      </h3>
                      <ul className="space-y-1 list-disc list-inside text-gray-600 mb-4">
                        {task.resources.map((resource, i) => (
                          <li key={i} className="leading-relaxed">
                            {resource}
                          </li>
                        ))}
                      </ul>
                      {task.practical_applications && (
                        <p className="text-gray-600 mb-4">
                          <span className="font-medium text-gray-800">
                            Practical Applications:
                          </span>{' '}
                          {task.practical_applications}
                        </p>
                      )}
                      <div className="w-[65%] flex items-center justify-end">
                        <Button
                          variant="default"
                          className="bg-black text-white hover:bg-gray-800 rounded-full px-8 z-10"
                          onClick={() => {
                            // Handle task progress here
                            console.log(`Starting task: ${task.name}`);
                          }}
                        >
                          {task.progress ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

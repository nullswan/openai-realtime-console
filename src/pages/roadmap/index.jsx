'use client';

import { Button } from '../../@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../@/components/ui/accordion';

const chapters = [
  {
    name: 'Step 1: Learn the basics',
    description: [
      'Study Python basics, focusing on NumPy and pandas.',
      'Cover essential math: linear algebra, probability, and statistics (basic level).',
    ],
    hint: 'Start here if you are new.',
    redirectTo: '/learning/subject/1',
  },
  {
    name: 'Step 2: Understand core ML concepts',
    description: [
      'Master fundamental machine learning concepts',
      'Learn about different types of algorithms',
    ],
    hint: 'Recommended for intermediate users.',
    redirectTo: '/learning/subject/2',
  },
  {
    name: 'Step 3: Build a quick project',
    description: [
      'Apply your knowledge to a real project',
      'Get hands-on experience with ML implementation',
    ],
    hint: 'For practical application.',
    redirectTo: '/learning/subject/3',
  },
];

export default function Component() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold mb-8">
          👨‍🏫 Ok Ethan! Here is your roadmap:
        </h1>
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <div key={index} className="bg-gray-50 rounded-xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`item-${index}`} className="border-none">
                  <AccordionTrigger className="hover:no-underline px-6 py-4">
                    <div className="text-left">
                      <h2 className="text-xl font-medium text-gray-800">
                        {chapter.name}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {chapter.hint}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="relative">
                      <ul className="space-y-3 list-disc list-inside text-gray-600 mb-12">
                        {chapter.description.map((desc, i) => (
                          <li key={i} className="leading-relaxed">
                            {desc}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="default"
                        className="absolute bottom-0 right-0 bg-black text-white hover:bg-gray-800 rounded-full px-8"
                        onClick={() =>
                          (window.location.href = chapter.redirectTo)
                        }
                      >
                        Start
                      </Button>
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

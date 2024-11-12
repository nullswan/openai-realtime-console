'use client';

import { useEffect, useState } from 'react';
import { Button } from '../../@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../@/components/ui/accordion';
import { useNavigate, useParams } from 'react-router-dom';

interface KeyConcepts {
  name: string;
  isLearned: boolean;
  description: string;
}

interface Task {
  priority: number;
  name: string;
  description: string;
  key_concepts: KeyConcepts[];
  resources: string[];
  practical_applications?: string;
  image?: string;
  progress: string;
}

interface RoadmapResponse {
  subject: string;
  tasks: Task[];
}

export default function Roadmap() {
  // TODO: Fix UI glitches in panels
  // TODO: Implement continue to Learning page

  const name = localStorage.getItem('name') || 'learner';
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();

  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [subject, setSubject] = useState<RoadmapResponse | undefined>(undefined);

  useEffect(() => {
    console.log('subjectId:', subjectId);
    if (subjectId) {
      const decodedSubjectId = decodeURIComponent(subjectId);
      const subjectData = localStorage.getItem(decodedSubjectId);
      console.log('subjectData:', subjectData);
      if (subjectData) {
        setSubject(JSON.parse(subjectData));
      } else {
        console.error(`Aucune donnée trouvée dans localStorage pour subjectId: ${decodedSubjectId}`);
      }
    } else {
      console.error('subjectId est null ou undefined');
    }
  }, [subjectId]);

  const handleAccordionChange = (value: string) => {
    setOpenItem(value === openItem ? undefined : value);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold mb-8">
          👨‍🏫 Ok {name}! Voici votre feuille de route :
        </h1>
        {!subject ? (
          <div>Chargement de la feuille de route...</div>
        ) : (
          <div className="space-y-4">
            {subject.tasks.map((task, index) => (
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
                            Étape {task.priority}{' '}
                          </span>
                          : {task.name}
                        </h2>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 w-[60vw]">
                      <div className="relative">
                        <p className="text-gray-600 mb-4 max-w-[40vw]">
                          {task.description}
                        </p>
                        <h3 className="font-medium text-gray-800 mb-2">
                          Concepts clés :
                        </h3>
                        <ul className="space-y-1 list-disc list-inside text-gray-600 mb-4">
                          {task.key_concepts.map((concept, i) => (
                            <li key={i} className="leading-relaxed">
                              {concept.name}
                            </li>
                          ))}
                        </ul>
                        <h3 className="font-medium text-gray-800 mb-2">
                          Ressources :
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
                              Applications pratiques :
                            </span>{' '}
                            {task.practical_applications}
                          </p>
                        )}
                        <div className="w-[65%] flex items-center justify-end">
                          <Button
                            variant="default"
                            className="bg-black text-white hover:bg-gray-800 rounded-full px-8 z-10"
                            onClick={() => {
                              navigate(`/learning/${subjectId}/${task.priority}`);
                            }}
                          >
                            {task.progress ? 'Continuer' : 'Commencer'}
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
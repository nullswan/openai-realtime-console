import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../@/components/ui/accordion';
import { KeyConcepts } from '.';

export function ProjectLearned({ concept} : { concept: KeyConcepts }) {
  const [learned, setLearned] = useState(concept.isLearned);

  return (
    <Accordion
      key={`${concept.name}-`}
      type="single"
      collapsible
      style={{ backgroundColor: learned ? "xgba(7, 112, 0, 0.9)" : "rxgba(210, 34, 45, 0.9)", borderRadius: '10px' }}
    >
      <AccordionItem
        value={`item-`}
        className="border rounded-lg"
      >
        <AccordionTrigger className="px-4 py-2">
          {concept.name}
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
			<p>{concept.description}</p>
			<button 
			className="bg-blue-500 hover:bg-blue-100 text-white font-bold p-2 px-3 mt-2 rounded"
			onClick={() => setLearned(!learned)}>{learned ? "Unlearn" : "Learn"}</button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default ProjectLearned;

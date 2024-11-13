import React, { useState } from 'react';
import ProjectLearned from './ProjectLearned';

export interface KeyConcepts {
  name: string;
  isLearned: boolean;
  description: string;
}

export interface Task {
  priority: number;
  name: string;
  description: string;
  key_concepts: KeyConcepts[];
  resources: string[];
  practical_applications?: string;
  image?: string;
  progress: number;
}

export interface RoadmapResponse {
  subject: string;
  tasks: Task[];
}

const fakesRoadmap: RoadmapResponse[] = [
  {
    subject: 'Physics',
    tasks: [
      {
        priority: 1,
        name: 'Mechanics',
        description: 'Study of motion, forces, and energy.',
        key_concepts: [
          {
            name: 'Kinematics',
            isLearned: true,
            description: 'Study of motion without considering forces.',
          },
          {
            name: 'Dynamics',
            isLearned: false,
            description: 'Study of the forces and their effects on motion.',
          },
          {
            name: 'Work, Energy, and Power',
            isLearned: true,
            description: 'Analysis of energy transfer and force exertion.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/physics',
          'https://www.physicsclassroom.com/',
        ],
        progress: 30,
      },
      {
        priority: 2,
        name: 'Thermodynamics',
        description:
          'Study of heat, work, and temperature, and their relation to energy.',
        key_concepts: [
          {
            name: 'Laws of Thermodynamics',
            isLearned: true,
            description: 'Fundamental principles governing heat and energy.',
          },
          {
            name: 'Heat Transfer',
            isLearned: true,
            description:
              'Methods by which heat is transferred between objects.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/physics/thermodynamics',
          'https://www.thermopedia.com/',
        ],
        progress: 20,
      },
      {
        priority: 3,
        name: 'Electromagnetism',
        description: 'Study of electric and magnetic fields.',
        key_concepts: [
          {
            name: 'Electric Fields',
            isLearned: false,
            description:
              'Region around a charged particle where force is exerted.',
          },
          {
            name: 'Magnetic Fields',
            isLearned: false,
            description:
              'Field around a magnetic material or moving electric charge.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/physics/electricity-and-magnetism',
          'https://www.physicsclassroom.com/class/estatics',
        ],
        progress: 15,
      },
      {
        priority: 4,
        name: 'Waves and Optics',
        description: 'Study of wave properties and light behavior.',
        key_concepts: [
          {
            name: 'Wave Properties',
            isLearned: false,
            description:
              'Characteristics of waves, including frequency and amplitude.',
          },
          {
            name: 'Light and Optics',
            isLearned: false,
            description: 'Study of light and its interactions with matter.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/physics/light-waves',
          'https://www.physicsclassroom.com/class/light',
        ],
        progress: 25,
      },
      {
        priority: 5,
        name: 'Quantum Mechanics',
        description: 'Study of particles at atomic and subatomic scales.',
        key_concepts: [
          {
            name: 'Wave-Particle Duality',
            isLearned: false,
            description:
              'Particles exhibit properties of both waves and particles.',
          },
          {
            name: 'Uncertainty Principle',
            isLearned: true,
            description:
              'The exact position and momentum of a particle cannot be simultaneously known.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/physics/quantum-physics',
          'https://www.quantumphysicslady.org/',
        ],
        progress: 10,
      },
    ],
  },
  {
    subject: 'Chemistry',
    tasks: [
      {
        priority: 1,
        name: 'Atomic Structure',
        description: 'Study of atoms and their components.',
        key_concepts: [
          {
            name: 'Electrons, Protons, and Neutrons',
            isLearned: true,
            description: 'The fundamental particles that make up an atom.',
          },
          {
            name: 'Electron Configurations',
            isLearned: true,
            description: "Distribution of electrons in an atom's orbitals.",
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/chemistry',
          'https://chem.libretexts.org/',
        ],
        progress: 35,
      },
      {
        priority: 2,
        name: 'Periodic Table',
        description:
          'Understanding the arrangement and properties of elements.',
        key_concepts: [
          {
            name: 'Groups and Periods',
            isLearned: false,
            description: 'Vertical columns and horizontal rows of elements.',
          },
          {
            name: 'Element Properties',
            isLearned: true,
            description: 'Chemical and physical properties of elements.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/chemistry/periodic-table',
          'https://www.ptable.com/',
        ],
        progress: 50,
      },
      {
        priority: 3,
        name: 'Chemical Bonds',
        description: 'Study of forces holding atoms together.',
        key_concepts: [
          {
            name: 'Ionic Bonds',
            isLearned: false,
            description: 'Attraction between oppositely charged ions.',
          },
          {
            name: 'Covalent Bonds',
            isLearned: false,
            description: 'Sharing of electron pairs between atoms.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/chemistry/chemical-bonds',
          'https://chem.libretexts.org/Chemical_Bonding',
        ],
        progress: 25,
      },
      {
        priority: 4,
        name: 'Chemical Reactions',
        description:
          'Study of processes in which substances change into new substances.',
        key_concepts: [
          {
            name: 'Reaction Types',
            isLearned: false,
            description: 'Different categories of chemical reactions.',
          },
          {
            name: 'Balancing Equations',
            isLearned: false,
            description: 'Ensuring equal atoms on both sides of a reaction.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/chemistry/chemical-reactions',
          'https://chem.libretexts.org/Equations',
        ],
        progress: 45,
      },
      {
        priority: 5,
        name: 'Thermochemistry',
        description: 'Study of energy changes in chemical reactions.',
        key_concepts: [
          {
            name: 'Enthalpy',
            isLearned: false,
            description: 'Measure of total energy in a thermodynamic system.',
          },
          {
            name: 'Endothermic and Exothermic Reactions',
            isLearned: false,
            description: 'Reactions that absorb or release heat.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/chemistry/thermochemistry',
          'https://chem.libretexts.org/Thermochemistry',
        ],
        progress: 20,
      },
    ],
  },
  {
    subject: 'Biology',
    tasks: [
      {
        priority: 1,
        name: 'Cell Biology',
        description: 'Study of cells and their structures and functions.',
        key_concepts: [
          {
            name: 'Cell Organelles',
            isLearned: false,
            description: 'Specialized structures within a cell.',
          },
          {
            name: 'Cell Membrane',
            isLearned: false,
            description: 'Barrier controlling movement in and out of the cell.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/biology',
          'https://www.cellsalive.com/',
        ],
        progress: 40,
      },
      {
        priority: 2,
        name: 'Genetics',
        description: 'Study of genes, genetic variation, and heredity.',
        key_concepts: [
          {
            name: 'DNA Structure',
            isLearned: false,
            description: 'The double-helix structure of DNA molecules.',
          },
          {
            name: 'Mendelian Genetics',
            isLearned: false,
            description: "Patterns of inheritance based on Mendel's laws.",
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/biology/genetics',
          'https://learn.genetics.utah.edu/',
        ],
        progress: 30,
      },
      {
        priority: 3,
        name: 'Evolution',
        description: 'Study of the processes driving biological diversity.',
        key_concepts: [
          {
            name: 'Natural Selection',
            isLearned: true,
            description:
              'Mechanism of evolution based on survival and reproduction.',
          },
          {
            name: 'Speciation',
            isLearned: false,
            description: 'Formation of new and distinct species.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/biology/evolution',
          'https://www.nature.com/subjects/evolutionary-biology',
        ],
        progress: 20,
      },
      {
        priority: 4,
        name: 'Ecology',
        description:
          'Study of interactions between organisms and their environment.',
        key_concepts: [
          {
            name: 'Ecosystems',
            isLearned: false,
            description:
              'Communities of organisms and their physical environment.',
          },
          {
            name: 'Food Webs',
            isLearned: true,
            description: 'Complex network of food chains in an ecosystem.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/biology/ecology',
          'https://www.ecologycenter.org/',
        ],
        progress: 50,
      },
      {
        priority: 5,
        name: 'Human Physiology',
        description: 'Study of the human body and its systems.',
        key_concepts: [
          {
            name: 'Circulatory System',
            isLearned: false,
            description: 'System that circulates blood and nutrients.',
          },
          {
            name: 'Nervous System',
            isLearned: false,
            description:
              'System responsible for control and communication in the body.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/science/biology/human-biology',
          'https://www.physiology.org/',
        ],
        progress: 15,
      },
    ],
  },
  {
    subject: 'Computer Science',
    tasks: [
      {
        priority: 1,
        name: 'Programming Fundamentals',
        description: 'Basics of programming and problem-solving.',
        key_concepts: [
          {
            name: 'Variables and Data Types',
            isLearned: false,
            description: 'Basic units for storing information in programs.',
          },
          {
            name: 'Control Structures',
            isLearned: false,
            description:
              'Conditional and looping structures to control program flow.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/computing/computer-programming',
          'https://www.codecademy.com/',
        ],
        progress: 50,
      },
      {
        priority: 2,
        name: 'Data Structures',
        description: 'Organizing and storing data efficiently.',
        key_concepts: [
          {
            name: 'Arrays and Lists',
            isLearned: false,
            description: 'Collection of elements stored sequentially.',
          },
          {
            name: 'Trees',
            isLearned: false,
            description:
              'Hierarchical structure to store data in parent-child relationships.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/computing/computer-science/algorithms',
          'https://www.geeksforgeeks.org/',
        ],
        progress: 25,
      },
      {
        priority: 3,
        name: 'Algorithms',
        description: 'Efficiently solving problems and optimizing tasks.',
        key_concepts: [
          {
            name: 'Sorting Algorithms',
            isLearned: false,
            description: 'Methods to arrange data in a particular order.',
          },
          {
            name: 'Search Algorithms',
            isLearned: false,
            description: 'Methods to find data within a structure.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/computing/computer-science/algorithms',
          'https://www.algorithms-book.com/',
        ],
        progress: 35,
      },
      {
        priority: 4,
        name: 'Databases',
        description: 'Systems for managing large volumes of data.',
        key_concepts: [
          {
            name: 'Relational Databases',
            isLearned: false,
            description: 'Data organized in tables with relationships.',
          },
          {
            name: 'SQL',
            isLearned: true,
            description:
              'Structured Query Language for managing relational databases.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/computing/computer-science/sql',
          'https://www.sqlbolt.com/',
        ],
        progress: 20,
      },
      {
        priority: 5,
        name: 'Machine Learning',
        description: 'Building systems that learn and improve from data.',
        key_concepts: [
          {
            name: 'Supervised Learning',
            isLearned: false,
            description: 'Training a model using labeled data.',
          },
          {
            name: 'Neural Networks',
            isLearned: true,
            description: 'Layers of nodes that simulate human brain function.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/computing/computer-science/machine-learning',
          'https://www.fast.ai/',
        ],
        progress: 15,
      },
    ],
  },
  {
    subject: 'Economics',
    tasks: [
      {
        priority: 1,
        name: 'Microeconomics',
        description: 'Study of individual markets and consumer behavior.',
        key_concepts: [
          {
            name: 'Supply and Demand',
            isLearned: false,
            description: 'Determination of market prices and quantities.',
          },
          {
            name: 'Elasticity',
            isLearned: false,
            description:
              'Measure of sensitivity of demand to changes in price.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/economics-finance-domain/microeconomics',
          'https://www.investopedia.com/microeconomics-5183436',
        ],
        progress: 45,
      },
      {
        priority: 2,
        name: 'Macroeconomics',
        description: 'Study of the economy as a whole.',
        key_concepts: [
          {
            name: 'GDP',
            isLearned: false,
            description: 'Gross Domestic Product; measure of economic output.',
          },
          {
            name: 'Unemployment',
            isLearned: true,
            description: 'The rate of joblessness in an economy.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/economics-finance-domain/macroeconomics',
          'https://www.economicshelp.org/',
        ],
        progress: 30,
      },
      {
        priority: 3,
        name: 'International Trade',
        description:
          'Study of trade between nations and economic interactions.',
        key_concepts: [
          {
            name: 'Comparative Advantage',
            isLearned: false,
            description:
              'Ability of a country to produce goods at a lower opportunity cost.',
          },
          {
            name: 'Tariffs and Quotas',
            isLearned: true,
            description: 'Taxes and limits on imports/exports.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/economics-finance-domain/international-trade',
          'https://www.worldbank.org/en/topic/trade',
        ],
        progress: 25,
      },
      {
        priority: 4,
        name: 'Monetary Policy',
        description: 'Management of money supply and interest rates.',
        key_concepts: [
          {
            name: 'Interest Rates',
            isLearned: false,
            description: 'Cost of borrowing money, set by central banks.',
          },
          {
            name: 'Inflation',
            isLearned: false,
            description:
              'Rise in prices over time, decreasing purchasing power.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/economics-finance-domain/monetary-policy',
          'https://www.imf.org/en/Topics/monetary-policy',
        ],
        progress: 40,
      },
      {
        priority: 5,
        name: 'Behavioral Economics',
        description:
          'Study of psychological factors influencing economic decisions.',
        key_concepts: [
          {
            name: 'Nudging',
            isLearned: true,
            description: "Subtle ways to influence people's choices.",
          },
          {
            name: 'Cognitive Biases',
            isLearned: true,
            description: 'Systematic errors in decision-making.',
          },
        ],
        resources: [
          'https://www.khanacademy.org/economics-finance-domain/behavioral-economics',
          'https://www.behavioraleconomics.com/',
        ],
        progress: 10,
      },
    ],
  },
];

export function setConceptLearned(
  roadmap: RoadmapResponse[],
  subjectName: string,
  taskName: string,
  conceptName: string,
  status: boolean
) {
  // Find the subject
  const subject = roadmap.find((subject) => subject.subject === subjectName);
  if (!subject) return;

  // Find the task within the subject
  const task = subject.tasks.find((task) => task.name === taskName);
  if (!task) return;

  // Find the concept within the task's key concepts
  const concept = task.key_concepts.find(
    (concept) => concept.name === conceptName
  );
  if (!concept) return;

  // Set the isLearned property to the specified status
  concept.isLearned = status;
}
interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-4 bg-green-500 transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default function ProfilePage() {
  const [selectedSubject, setSelectedSubject] = useState<RoadmapResponse>(
    fakesRoadmap[0]
  );

  return (
    <div className="min-h-screen w-full bg-[#f9faef]-100 flex flex-col">
      {/* Subject Selection */}
      <div className="flex flex-row items-center justify-center p-4 bg-white shadow-md">
        {fakesRoadmap.map((roadmap) => (
          <button
            key={roadmap.subject}
            onClick={() => setSelectedSubject(roadmap)}
            className={`m-2 px-6 py-2 rounded-md transition-all duration-200 ${
              selectedSubject.subject === roadmap.subject
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            {roadmap.subject}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
          {selectedSubject.tasks.map((task, index) => (
            <div
              key={`${task.name}-${index}`}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {task.name}
                </h2>
                <p className="text-gray-600 mt-2">{task.description}</p>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Key Concepts</h3>
                <div className="space-y-2">
                  {task.key_concepts.map((concept, conceptIndex) => (
                    <div key={`${concept.name}-${conceptIndex}`}>
                      <ProjectLearned concept={concept} />
                    </div>
                    // <Accordion
                    //   key={`${concept.name}-${conceptIndex}`}
                    //   type="single"
                    //   collapsible
                    //   style={{ backgroundColor: 'red', borderRadius: '10px' }}
                    // >
                    //   <AccordionItem
                    //     value={`item-${conceptIndex}`}
                    //     className="border rounded-lg"
                    //   >
                    //     <AccordionTrigger className="px-4 py-2">
                    //       {concept.name}
                    //     </AccordionTrigger>
                    //     <AccordionContent className="px-4 pb-4">
                    //       <ProjectLearned desc={concept.description} />
                    //     </AccordionContent>
                    //   </AccordionItem>
                    // </Accordion>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Resources</h3>
                <ul className="space-y-2">
                  {task.resources.map((resource, resourceIndex) => (
                    <li key={`${resource}-${resourceIndex}`}>
                      <a
                        href={resource}
                        className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Progress</p>

                <ProgressBar
                  progress={
                    (task.key_concepts.filter((concept) => concept.isLearned)
                      .length /
                      task.key_concepts.length) *
                    100
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const learningRoadmapTemplate: string = `
Create a learning roadmap for the subject provided by the user, outlining structured tasks to achieve a deep understanding of their desired topic, ordered by priority.

Provide a learning plan divided into an array of tasks with explicit prioritization, each task including key information necessary for the user to progress effectively.
Ensure that tasks cover beginner to advanced levels if applicable, include key resources, and offer practical applications to assist in mastering the topic.
Generate 5 tasks. Be as concise as possible on the name, description and practical applications.

# Steps

1. **Understand the Subject**: Review the provided subject to grasp main areas and possible learning path structures.
2. **Identify Learning Tasks**: Create specific learning tasks that are incremental towards mastering the topic.
3. **Order by Priority**: Sequence the tasks in an order that maximizes benefit, with the fundamental tasks appearing first.
4. **Identify Learning Resources**: Suggest resources (e.g., books, courses, research papers) that match each task.
5. **Provide Application Opportunities**: Where possible, mention practical exercises or real-world examples to enhance learning.
6. **Establish Suggested Sequencing**: Present an approximate timeline or ordering to achieve each learning task effectively.

# Output Format

The response should be formulated as a JSON object with the following keys:

\`\`\`json
{
    "subject": "[User's Subject]",
    "tasks": [
        {
            "priority": 1,
            "name": "[Task name related to specific skill development]",
            "description": "[Description of the task]",
            "key_concepts": ["[List of important concepts for this task]"],
            "resources": ["[Recommended books, courses, online resources]"],
            "practical_applications": "[Exercises or real-world examples if applicable]"
        },
        {
            "priority": 2,
            "name": "[Task name related to another skill]",
            "description": "[Description of the task]",
            "key_concepts": ["[List of important concepts for this task]"],
            "resources": ["[Recommended books, courses, online resources]"],
            "practical_applications": "[Exercises or real-world examples if applicable]"
        }
        //... (additional tasks following the same structure ordered by priority)
    ]
}
\`\`\`

# Example

**User Input**: "I want to learn data analysis with Python."

**Output**:
\`\`\`json
{
    "subject": "Data Analysis with Python",
    "tasks": [
        {
            "priority": 1,
            "name": "Introduction to Python Programming",
            "description": "Learn the fundamentals of Python programming essential for data analysis.",
            "key_concepts": ["Python syntax", "Data types", "Control structures"],
            "resources": ["'Automate the Boring Stuff with Python' by Al Sweigart", "Online course: 'Python for Everybody' on Coursera"],
            "practical_applications": "Write simple Python scripts to automate basic calculations and tasks."
        },
        {
            "priority": 2,
            "name": "Introduction to Data Analysis Libraries",
            "description": "Get familiar with key libraries used for data analysis in Python.",
            "key_concepts": ["Pandas basics", "NumPy for numerical operations"],
            "resources": ["'Python for Data Analysis' by Wes McKinney", "Online tutorial: 'Pandas Documentation Guide'"],
            "practical_applications": "Practice using Pandas and NumPy to manipulate small datasets."
        },
        {
            "priority": 3,
            "name": "Exploratory Data Analysis",
            "description": "Explore data visualization and analysis techniques.",
            "key_concepts": ["Matplotlib", "Seaborn", "Descriptive statistics"],
            "resources": ["Online course: 'Data Analysis with Python' on edX", "'Python Data Science Handbook' by Jake VanderPlas"],
            "practical_applications": "Use visualizations to identify trends in datasets and interpret data using descriptive statistics."
        }
        //... additional advanced tasks ordered by increasing priority
    ]
}
\`\`\`

# Notes

- Ensure tasks progress logically from basic to advanced, always considering the proper sequencing for a learner without prior experience.
- Include diverse resources (e.g., books, interactive websites, videos) to accommodate different learning preferences.
- Maintain practical applications that grow in complexity along with user progress.
`;

// Define the Zod schema for the learning roadmap
const Task = z.object({
    priority: z.number(),
    name: z.string(),
    description: z.string(),
    key_concepts: z.array(z.string()),
    resources: z.array(z.string()),
    practical_applications: z.string().optional(),
  });
  
const LearningRoadmap = z.object({
    subject: z.string(),
    tasks: z.array(Task),
});

const TEMPERATURE = 1.0;
const TOP_P = 1.0;
let last_call = new Date();

interface Task {
  priority: number;
  name: string;
  description: string;
  key_concepts: string[];
  resources: string[];
  practical_applications?: string;
  image?: string;
  progress: boolean;
}

interface RoadmapResponse {
  subject: string;
  tasks: Task[];
}

export async function getRoadmap(apiKey: string, request: string, setResponse: (response: RoadmapResponse) => void): Promise<RoadmapResponse> {
  // Rate limiting check
  const perf = performance.now();
  if (new Date().getTime() - last_call.getTime() < 3000) {
    return { subject: "", tasks: [] };
  }
  last_call = new Date();

  const client = new OpenAI({ apiKey: apiKey, dangerouslyAllowBrowser: true });
  console.log("getRoadmap", request);

  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: learningRoadmapTemplate },
      { role: "user", content: request }
    ],
    response_format: zodResponseFormat(LearningRoadmap, "learning_roadmap"),
    temperature: TEMPERATURE,
    top_p: TOP_P,
    stream: true,
  });

  let fullContent = '';
  let currentResponse: Partial<RoadmapResponse> = { subject: '', tasks: [] };
  
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    fullContent += content;
    
    // Try to parse the accumulated content as JSON
    try {
      // Remove any trailing commas and complete the JSON structure if needed
      let parseableContent = fullContent;
      if (!parseableContent.endsWith('}')) {
        parseableContent = parseableContent.replace(/,\s*$/, '') + '}]}';
      }
      
      const partialResponse = JSON.parse(parseableContent) as RoadmapResponse;
      
      // Update the current response
      if (partialResponse.subject) {
        currentResponse.subject = partialResponse.subject;
      }
      if (partialResponse.tasks?.length > 0) {
        setResponse(partialResponse);
        currentResponse.tasks = partialResponse.tasks;
      }
    } catch (error) {
      // Continue accumulating if parsing fails
      continue;
    }
  }

  console.log("getRoadmap", performance.now() - perf, "ms taken");
  
  // Return the accumulated response if it has content, otherwise try parsing the full content
  if (currentResponse.subject && currentResponse.tasks && currentResponse.tasks.length > 0) {
    return currentResponse as RoadmapResponse;
  }

  try {
    return JSON.parse(fullContent) as RoadmapResponse;
  } catch (error) {
    return { subject: '', tasks: [] };
  }
}
export interface Task {
  priority: number;
  name: string;
  description: string;
  key_concepts: string[];
  resources: string[];
  practical_applications?: string;
  image?: string;
  progress: boolean;
}

export interface RoadmapResponse {
  subject: string;
  tasks: Task[];
}

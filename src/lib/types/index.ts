export interface RoadmapResponse {
  subject: string;
  tasks: Task[];
}

export interface KeyConcepts {
  name: string
  isLearned: boolean
  description: string
}

export interface Task {
  priority: number
  name: string
  description: string
  key_concepts: KeyConcepts[]
  resources: string[]
  practical_applications?: string
  image?: string
  progress: string
}

export interface Suggestion {
  subject: string
  description?: string
}
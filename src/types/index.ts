// Tipos básicos (primitivos)
export type ID = number | string;

export type Status = 'pending' | 'in_progress' | 'completed' | 'blocked';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Union Types
export type Theme = 'light' | 'dark' | 'system';

export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer';

export type ProcessStatus = 'draft' | 'active' | 'archived' | 'deprecated';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type StepType = 'action' | 'decision' | 'approval' | 'information';

export type ResourceType = 'video' | 'document' | 'link' | 'image';

// Intersection Types
export type ProcessWithStatus = Process & {
  status: ProcessStatus;
  lastModified: Date;
};

export type UserWithRole = User & {
  role: UserRole;
  permissions: string[];
};

export type StepWithResources = Step & {
  resources: Resource[];
  training: TrainingContent;
};

// Interfaces principais
export interface User {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface Process {
  id?: ID;
  codProcesso?: number;
  nome: string;
  title?: string; // Compatibilidade com código existente
  descricao?: string;
  description?: string; // Compatibilidade
  categoria?: string;
  category?: string; // Compatibilidade
  steps?: Step[];
  etapas?: Step[]; // Compatibilidade com backend
  tempoEstimado?: number;
  estimatedTime?: number; // Compatibilidade
  dificuldade?: Difficulty;
  difficulty?: Difficulty; // Compatibilidade
  status?: ProcessStatus;
}

export interface Step {
  id?: ID;
  codEtapa?: number;
  codProcesso: number;
  ordem: number;
  order?: number; // Compatibilidade
  titulo: string;
  title?: string; // Compatibilidade
  descricao?: string;
  description?: string; // Compatibilidade
  tipo?: StepType;
  type?: StepType; // Compatibilidade
  dependencias?: ID[];
  dependencies?: ID[]; // Compatibilidade
  resources?: Resource[];
  training?: TrainingContent;
}

export interface Resource {
  id: ID;
  type: ResourceType;
  title: string;
  url: string;
  duration?: number; // para vídeos, em minutos
}

export interface TrainingContent {
  videos?: Resource[];
  documents?: Resource[];
  tutorials?: Tutorial[];
  faq?: FAQItem[];
  tests?: Test[];
}

export interface Tutorial {
  id: ID;
  title: string;
  content: string;
  steps: string[];
}

export interface FAQItem {
  id: ID;
  question: string;
  answer: string;
  category?: string;
}

export interface Test {
  id: ID;
  title: string;
  questions: Question[];
  passingScore: number; // porcentagem
}

export interface Question {
  id: ID;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Execution {
  id?: ID;
  codExecucao?: number;
  codProcesso: number;
  processId?: ID; // Compatibilidade
  cpfOuUsuario?: string;
  userId?: ID; // Compatibilidade
  status: Status;
  etapaAtual?: number;
  currentStepId?: ID; // Compatibilidade
  etapasConcluidas?: number[];
  completedSteps?: ID[]; // Compatibilidade
  dataInicio?: string;
  startedAt?: Date | string; // Compatibilidade
  dataFim?: string;
  completedAt?: Date | string; // Compatibilidade
  observacoes?: string;
  notes?: string; // Compatibilidade
}

export interface ChatMessage {
  id: ID;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedStepId?: ID;
}

export interface DashboardStats {
  totalProcesses: number;
  activeExecutions: number;
  completedToday: number;
  averageCompletionTime: number;
  errorRate: number;
}


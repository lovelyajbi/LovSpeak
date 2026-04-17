
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Theme {
  id: string;
  name: string;
  isIslamic: boolean;
}

export interface ReadingContent {
  title: string;
  paragraphs: string[];
}

export interface ReadingProgress {
  level: Level;
  themeId: string;
  title: string;
  score: number;
  accuracy: number;
  date: string;
}

export interface ActivityLog {
  id: string;
  type: AppView;
  date: string;
  durationSeconds: number;
  score: number;
  accuracy: number;
  details?: string;
  metadata?: any;
}

export interface VocabItem {
  id: string;
  english: string;
  indonesian: string;
  category: string;
  isUserGenerated: boolean;
  sentence?: string;
}

export interface GrammarErrorDetail {
  mistake: string;
  correction: string;
  explanation: string;
}

export interface GrammarResult {
  correctedText: string;
  generalFeedback: string;
  errors: GrammarErrorDetail[];
  score: number;
  islamicInsight?: string;
}

// --- GRAMMAR LESSON TYPES ---
export interface GrammarExample {
  text: string;
  isCorrect: boolean;
  note?: string;
}

export interface GrammarTable {
  headers: string[];
  rows: string[][];
}

export interface GrammarSection {
  heading: string;
  content: string;
  table?: GrammarTable;
  examples: GrammarExample[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  type: 'root' | 'main' | 'sub' | 'formula' | 'example' | 'warning';
  detail?: string;
  children?: MindMapNode[];
  isInitiallyOpen?: boolean;
}

export interface GrammarLesson {
  id: string;
  title: string;
  level: string;
  icon: string;
  description: string;
  sections: GrammarSection[];
  mindmap?: MindMapNode;
  quiz?: QuizQuestion[];
}

// --- GUIDED CURRICULUM TYPES ---
export type CurriculumStepType = 'context_bridge' | 'grammar_lesson' | 'reading_task' | 'listening_task' | 'speaking_practice' | 'quiz';

export interface CurriculumStep {
  id: string;
  title: string;
  type: CurriculumStepType;
  moduleView: AppView;
  description: string;
  goal: string;
  // Specific data for the module to auto-start
  targetId?: string; // Grammar Lesson ID or Theme ID
  promptContext?: string; 
}

export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  title: string;
  level: Level;
  grammarFocus: string;
  vocabTheme: string;
  description: string;
  steps: CurriculumStep[];
}

export interface LevelCurriculum {
  level: Level;
  units: CurriculumUnit[];
}

export interface UserProfile {
  name: string;
  avatar: string;
  photoData?: string | null; // Base64 image data or null to clear
  level: Level;
  xp: number;
  weeklyInsight?: {
    text: string;
    lastGenerated: string; // ISO date
  };
}

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  color?: string; 
  unlockedDate?: string; 
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  moduleView: AppView;
  isCompleted: boolean;
  icon: string;
}

export interface LearningPlan {
  targetIds: string[]; 
  intensityId: string;
  currentLevel: Level;
  daysPerWeek: number;
  dailyTasks: DailyTask[];
  lastGeneratedDate: string;
}

export enum AppView {
  HOME = 'HOME',
  READING = 'READING',
  LISTENING = 'LISTENING',
  GRAMMAR = 'GRAMMAR',
  VOCAB = 'VOCAB',
  TRANSLATE = 'TRANSLATE',
  LIVE = 'LIVE',
  PROFILE = 'PROFILE',
  ASSESSMENT = 'ASSESSMENT',
  CHAT = 'CHAT',
  GAMES = 'GAMES',
  ROADMAP = 'ROADMAP',
  DIARY = 'DIARY',
  SHADOWING = 'SHADOWING',
  SETTINGS = 'SETTINGS'
}

export interface AssessmentQuestion {
  id: string;
  type: 'speaking' | 'grammar' | 'reading' | 'writing';
  prompt: string;
  context?: string;
  options?: string[];
  correctIndex?: number;
}

export interface AssessmentResult {
  detectedLevel: Level;
  overallScore: number;
  sections: {
    speaking: { score: number; feedback: string };
    grammar: { score: number; feedback: string };
    reading: { score: number; feedback: string };
    writing: { score: number; feedback: string };
  };
  recommendedFocus: string[];
  summary: string;
}

export interface ModuleContext {
    unitId: string;
    stepId: string;
    type: 'unit';
    autoStart: boolean;
    level: Level;
    title: string;
    desc: string;
    grammarFocus?: string;
    vocabTheme?: string;
    targetLessonId?: string;
    promptContext?: string;
}

export interface ModuleProps {
  onComplete?: () => void;
  onNavigate?: (view: AppView) => void;
  initialContext?: ModuleContext | null;
  onAssessmentResult?: (result: AssessmentResult) => void;
}

export interface ShadowingTask {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  text: string;
  translation: string;
}

export interface ThematicBridgeContent {
  id: string;
  unitTitle: string;
  level: Level;
  introduction: string;
  thematicInsight: string;
  grammarConnection: string;
  scenarioTitle: string;
  scenarioDialogue: { speaker: string; text: string }[];
  keyTakeaway: string;
  cefrFocus?: string;
  proTips?: string[];
  detailedExplanation?: string;
}

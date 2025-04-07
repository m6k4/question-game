
export interface NewPlayer {
  name: string;
  sessionId: string;
  isHost: boolean;
  avatarName: string;
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  avatarName: string;
}

export interface Session {
  id: string;
  name: string | null;
  createdAt: string | null; 
  playerCount: number | null;
  currentAnsweringPlayerRef: Player | null;
  currentQuestionRef: Question | null;
  timerStartedAt: string | null;
  level: number;
}

export interface SessionParamsToUpdate {
  id: string;
  name: string | null;
  createdAt: string | null; 
  playerCount: number | null;
  currentAnsweringPlayerId: string | null;
  currentQuestionId: string | null;
  timerStartedAt: string | null;
  level: number;
  startTimer: boolean;
}

export interface Question {
  id: string;
  description: string | null;
  level: string | null;
}


export interface NewPlayer {
  name: string;
  sessionId: string;
  isHost: boolean;
  avatarName: string;
}

export interface Player {
  id: string;
  name: string | null;
  isHost: boolean;
  avatarName: string;
}
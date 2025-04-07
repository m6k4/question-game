import { ref, type Ref, computed, onMounted } from "vue";
import { useQuestion } from "@/question/composables/useQuestion";
import { usePlayer } from "@/player/composables/usePlayer";
import { useSession } from "@/session/composables/useSession";
import { type Player, type Question } from "@/types/types";

export function useGame(sessionId: string, players: Array<Player>):
{
  startGame: () => void;
  getNextPlayer: () => Promise<void>;
  getNextQuestion: () => void;
  startTimer: () => void;
  currentQuestionFromSession: Ref<Question | null>;
  currentPlayer: Ref<Player | null>;
  answeringPlayerIndex: Ref<number>;
} {
  const { currentSessionDetails, updateSession } = useSession();
  const { drawQuestion, fetchQuestions, drawnQuestion } = useQuestion(
    currentSessionDetails.value!.level
  );
  const { getCurrentPlayer, currentPlayer } = usePlayer(sessionId);

  const answeringPlayerIndex = ref(0);
  const answeringPlayer: Ref<Player | null> = ref(null);

  const startGame = () => {
    drawQuestion();
    setAnsweringPlayer();
    localStorage.setItem("playerIndex", JSON.stringify(answeringPlayerIndex.value));
    updateSession({
      currentQuestionId: drawnQuestion.value!.id,
      currentAnsweringPlayerId: answeringPlayer.value!.id,
    });
    startTimer();
  };

  const setAnsweringPlayer = () => {
    const storedIndex = localStorage.getItem("playerIndex");
    if (!storedIndex) {
      answeringPlayerIndex.value = 0;
      localStorage.setItem("playerIndex", JSON.stringify(answeringPlayerIndex.value));
    }
    answeringPlayer.value = players[answeringPlayerIndex.value];
  };

  const getNextQuestion = () => {
    drawQuestion();
    updateSession({
      currentQuestionId: drawnQuestion.value!.id
    });
  };

  const getNextPlayer = async () => {
    answeringPlayerIndex.value = (answeringPlayerIndex.value + 1) % players.length;
    answeringPlayer.value = players[answeringPlayerIndex.value];
    updateSession({
      currentAnsweringPlayerId: answeringPlayer.value.id,
    });
    localStorage.setItem("playerIndex", JSON.stringify(answeringPlayerIndex.value));
  };

  const startTimer = () => {
    updateSession({startTimer: true});
  };

  const currentQuestionFromSession = computed(() => {
    return currentSessionDetails.value?.currentQuestionRef ?? null;
  });

  onMounted(() => {
    getCurrentPlayer();
    fetchQuestions();
  });

  return {
    startGame,
    getNextPlayer,
    getNextQuestion,
    startTimer,
    currentQuestionFromSession,
    currentPlayer,
    answeringPlayerIndex,
  };
}
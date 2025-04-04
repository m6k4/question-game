
  import { db } from "@/firebase";
import { useCollection } from "vuefire";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { computed, ref, type Ref } from "vue";
import { firestoreDefaultConverter } from 'vuefire'
import { useRoute } from "vue-router";
import dayjs from "dayjs";

interface Session {
  id: string;
  name: string | null;
  createdAt: string | null; 
  playerCount: number | null;
  currentAnsweringPlayerId: string | null;
  currentQuestionId: string | null;
  timerStartedAt: string | null;
  level: number;
}

export function useSession(): {
  sessionList: Ref<Array<Session>>;
  createSession: (name: string, playerCount: number, level: number) => Promise<void>;
  updateSession: (updatedFields: Partial<Session>, startTimer: boolean) => Promise<void>;
  createdSessionId: Ref<string>;
  isLoading: Ref<boolean>;
  currentSessionDetails: Ref<Session | null>;
} {

  const route = useRoute();
  const currentSessionId = route.params.sessionId as string;
 
  const createdSessionId = ref<string>("");
  const isLoading = ref<boolean>(false);
  const sessionRef = collection(db, "sessions");


  isLoading.value = true;
  const {data: sessions, promise } = useCollection(sessionRef.withConverter<Session>({
    fromFirestore: (snapshot) => {
      const data = firestoreDefaultConverter.fromFirestore(snapshot);
      if (!data) throw new Error("Invalid session data.");

      return {
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        playerCount: data.playerCount,
        currentAnsweringPlayerId: data.currentAnsweringPlayerId,
        currentQuestionId: data.currentQuestionId,
        timerStartedAt: data.timerStartedAt 
        ? dayjs.unix(data.timerStartedAt?.seconds).format("YYYY-MM-DDTHH:mm:ss") 
        : null,
        level: data.level,
      } as Session;
    },
    toFirestore: firestoreDefaultConverter.toFirestore,
  }))
  promise.value.then(() => {
    isLoading.value = false;
  })

  const createSession = async (name: string, playerCount: number, level: number) => {
    const newSessionDocRef = doc(sessionRef); 
    
    await setDoc(newSessionDocRef, {
      name,
      playerCount,
      level,
      createdAt: Timestamp.now(),
      currentAnsweringPlayerId: null,
      currentQuestionId: null,
      timerStartedAt: null,

    })
    
    createdSessionId.value = newSessionDocRef.id;
  }
  
  const updateSession = async (updatedFields: Partial<Session>, startTimer = false): Promise<void> => {
    let playerRef = null;
    let questionRef = null;
    const specificSessionRef = doc(sessionRef, currentSessionId); 

    if(updatedFields.currentAnsweringPlayerId) {
      playerRef = doc(db, "players", updatedFields.currentAnsweringPlayerId);
    }
    if(updatedFields.currentQuestionId) {
      questionRef = doc(db, "questions", updatedFields.currentQuestionId);
    }
    await setDoc(specificSessionRef, {
      ...updatedFields,
      ...startTimer && { timerStartedAt: Timestamp.now() },
      ...playerRef && { currentAnsweringPlayerId: playerRef },
      ...questionRef && { currentQuestionId: questionRef },
    }, { merge: true });
  };

  const sessionList = computed(() => sessions.value);

  const currentSessionDetails = computed(() => {
    return sessions.value.find((session) => session.id === currentSessionId) || null;
});


  return {
    sessionList,
    createSession,
    updateSession,
    createdSessionId,
    isLoading,
    currentSessionDetails,
  };
}

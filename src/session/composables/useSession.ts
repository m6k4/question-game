
  import { db } from "@/firebase";
import { useCollection } from "vuefire";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { computed, ref, type Ref } from "vue";
import { firestoreDefaultConverter } from 'vuefire'
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { type Session, type SessionParamsToUpdate } from "@/types/types";

export function useSession(): {
  sessionList: Ref<Array<Session>>;
  createSession: (name: string, playerCount: number, level: number) => Promise<void>;
  updateSession: (updatedFields: Partial<SessionParamsToUpdate>) => Promise<void>;
  createdSessionId: Ref<string>;
  isLoading: Ref<boolean>;
  currentSessionDetails: Ref<Session | null>;
  currentSessionId: string;
} {

  const route = useRoute();
  const sessionIdFromRoute = route.params.sessionId;
  const currentSessionId = Array.isArray(sessionIdFromRoute) ? sessionIdFromRoute[0] : sessionIdFromRoute;
 
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
        currentAnsweringPlayerRef: data.currentAnsweringPlayerRef,
        currentQuestionRef: data.currentQuestionRef,
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
      currentAnsweringPlayerRef: null,
      currentQuestionRef: null,
      timerStartedAt: null,
    })
    
    createdSessionId.value = newSessionDocRef.id;
  }
  
  const updateSession = async (updatedFields: Partial<SessionParamsToUpdate>): Promise<void> => {
    let playerRef = null;
    let questionRef = null;
    let timerStartedAt = null;
    const specificSessionRef = doc(sessionRef, currentSessionId); 

    if(updatedFields.currentAnsweringPlayerId) {
      playerRef = doc(db, "players", updatedFields.currentAnsweringPlayerId);
    }
    if(updatedFields.currentQuestionId) {
      questionRef = doc(db, "questions", updatedFields.currentQuestionId);
    }
    if(updatedFields.startTimer) {
      timerStartedAt = Timestamp.now();
    }
    await setDoc(specificSessionRef, {
      ...updatedFields,
      ...timerStartedAt && { timerStartedAt: Timestamp.now() },
      ...playerRef && { currentAnsweringPlayerRef: playerRef },
      ...questionRef && { currentQuestionRef: questionRef },
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
    currentSessionId,
  };
}


  import { db } from "@/firebase";
import { useCollection } from "vuefire";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { computed, ref, type Ref } from "vue";
import { firestoreDefaultConverter } from 'vuefire'
import { useRoute } from "vue-router";

interface Session {
  id: string;
  name: string | null;
  createdAt: string | null; 
  playerCount: number | null;
  currentAnsweringPlayerId: string | null;
  currentQuestionId: string | null;
}

export default function useSession(): {
  sessionList: Ref<Array<Session>>;
  createSession: (name: string, playerCount: number) => Promise<void>;
  updateSession: (updatedFields: Partial<Session>) => Promise<void>;
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

      
      console.log("Session data loaded successfully.", data.id);
      return {
        id: data.id,
        name: data.name,
        createdAt: data.createdAt,
        playerCount: data.playerCount,
        currentAnsweringPlayerId: data.currentAnsweringPlayerId,
        currentQuestionId: data.currentQuestionId,
      } as Session;
    },
    toFirestore: firestoreDefaultConverter.toFirestore,
  }))
  promise.value.then(() => {
    isLoading.value = false;
  })

  const createSession = async (name: string, playerCount: number) => {
    const newSessionDocRef = doc(sessionRef); 
    
    await setDoc(newSessionDocRef, {
      name,
      playerCount,
      createdAt: Timestamp.now(),
      currentAnsweringPlayerId: null,
      currentQuestionId: null,
    })
    
    createdSessionId.value = newSessionDocRef.id;
    console.log("Session created successfully.", newSessionDocRef.id);
  }
  
  const updateSession = async (updatedFields: Partial<Session>): Promise<void> => {
    let playerRef = null;
    let questionRef = null;
    const specificSessionRef = doc(sessionRef, currentSessionId); 

    console.log("updatedFields", updatedFields);
    if(updatedFields.currentAnsweringPlayerId) {
      playerRef = doc(db, "players", updatedFields.currentAnsweringPlayerId);
    }
    if(updatedFields.currentQuestionId) {
      questionRef = doc(db, "questions", updatedFields.currentQuestionId);
    }

    console.log("playerRef", playerRef);
    console.log("questionRef", questionRef);
    await setDoc(specificSessionRef, {
      ...updatedFields,
      ...playerRef && { currentAnsweringPlayerId: playerRef },
      ...questionRef && { currentQuestionId: questionRef },
    }, { merge: true });
    console.log("Session updated successfully:", currentSessionId);
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

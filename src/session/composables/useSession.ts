
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

// const currentSessionDetails = ref<Session | null>(null);

export default function useSession(): {
  sessionList: Ref<Array<Session>>;
  createSession: (name: string, playerCount: number) => Promise<void>;
  createdSessionId: Ref<string>;
  isLoading: Ref<boolean>;
  currentSessionDetails: Ref<Session | null>;
} {

  const route = useRoute();
  const currentSessionId = route.params.sessionId;
 
  const createdSessionId = ref<string>("");
  const isLoading = ref<boolean>(false);
//add loading state

  isLoading.value = true;
  const {data: sessions, promise } = useCollection(collection(db, "sessions").withConverter<Session>({
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
    const sessionRef = collection(db, "sessions");
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
  

  const sessionList = computed(() => sessions.value);
  const currentSessionDetails = computed(() => {
    return sessions.value.find((session) => session.id === currentSessionId) || null;
});


  return {
    sessionList,
    createSession,
    createdSessionId,
    isLoading,
    currentSessionDetails,
  };
}

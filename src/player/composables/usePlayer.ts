
import { db } from "@/firebase";
// import { ref } from "firebase/database";
import { collection, doc, getDoc, query, setDoc, where } from "firebase/firestore";
import { computed, type Ref, ref } from "vue";
import { useCollection } from "vuefire";
import { firestoreDefaultConverter } from 'vuefire'
import type { Player, NewPlayer } from "@/types/types";

export function usePlayer(sessionId: string): {
  playerList:  Ref<Array<Player>>;
  createPlayer: (newPlayer: NewPlayer) => Promise<void>;
  getCurrentPlayer: () => void;
  currentPlayer: Ref<Player | null>;
} {

    const currentSessionId = sessionId;

    const currentSessionRef = doc(db, "sessions", currentSessionId);
    const currentPlayer = ref<Player | null>(null);
    const playersRef = collection(db, "players");

    const playersFromCurrentSessionRef = query(playersRef, where("sessionId", "==", currentSessionRef));
    const players = useCollection(playersFromCurrentSessionRef.withConverter<Player>({
      fromFirestore: (snapshot) => {
        const data = firestoreDefaultConverter.fromFirestore(snapshot);
        if (!data) throw new Error("Invalid session data.");

        return {
          id: data.id,
          name: data.name,
          isHost: data.isHost,
          avatarName: data.avatarName,
        } as Player;
      },
      toFirestore: firestoreDefaultConverter.toFirestore,
    }))

  const createPlayer = async (newPlayer: NewPlayer) => {

    const playersRef = collection(db, "players");
    const newPlayerDocRef = doc(playersRef); 

    await setDoc(newPlayerDocRef, {
        name: newPlayer.name,
        sessionId: currentSessionRef,
        isHost: newPlayer.isHost,
        avatarName: newPlayer.avatarName,
      }).then(() => {
        const playerData = {
          id: newPlayerDocRef.id,
          name: newPlayer.name
        }
        localStorage.setItem('playerData', JSON.stringify(playerData));
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });
    }

    const getCurrentPlayer =  async () => {
      const playerDataDetails = localStorage.getItem('playerData');
      if (!playerDataDetails) {
        return;
      }
      const playerDataId = JSON.parse(playerDataDetails).id;

      const currentPlayerRef = doc(playersRef, playerDataId);

      try {
        const playerSnapshot = await getDoc(currentPlayerRef);
    
        if (playerSnapshot.exists()) {
          const data = playerSnapshot.data() as Player;
          currentPlayer.value = { 
            id: playerSnapshot.id,
            name: data.name,
            isHost: data.isHost,
            avatarName: data.avatarName,
          };
        } else {
          console.log("No such player!");
          currentPlayer.value = null;
        }
      } catch (error) {
        console.error("Error fetching player:", error);
        currentPlayer.value = null;
      }
    }

  return {
    playerList: computed(() => players.value as Player[]),
    createPlayer,
    getCurrentPlayer,
    currentPlayer,
  };
}

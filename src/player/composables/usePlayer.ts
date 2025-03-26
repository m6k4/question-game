
import { db } from "@/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

// interface Player {
//   id: string;
//   name: string | null;
//   isHost: boolean;
//   sessionId: string | null;
// }

interface NewPlayer {
  name: string;
  sessionId: string;
  isHost: boolean;
}

export default function usePlayer(): {
  createPlayer: (newPlayer: NewPlayer) => Promise<void>;
} {

 
 const createPlayer = async (newPlayer: NewPlayer) => {

  console.log()
  const playersRef = collection(db, "players");
  const newPlayerDocRef = doc(playersRef); 

  await setDoc(newPlayerDocRef, {
      name: newPlayer.name,
      sessionId: `/sessions/${newPlayer.sessionId}`,
      isHost: newPlayer.isHost,
    }).then(() => {
      const playerData = {
        id: newPlayerDocRef.id,
        name: newPlayer.name
      }
      localStorage.setItem('playerData', JSON.stringify(playerData));
      console.log("Document written with ID: ", newPlayerDocRef.id);
    }).catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  return {
    createPlayer
  };
}

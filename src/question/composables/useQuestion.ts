
import { db } from "@/firebase"; 
import { collection, getDocs, query, where  } from "firebase/firestore"; 
import { ref, type Ref } from "vue";
import { type Question } from "@/types/types";

const questionList = ref<Question[]>([]); 
const availableQuestionList = ref<Question[]>([]);
const drawnQuestion = ref<Question | null>(null);

export function useQuestion(level: number): {
  questionList:  Ref<Array<Question>>;
  fetchQuestions: () => void;
  drawQuestion: () => void;
  drawnQuestion: Ref<Question | null>;
  isLoading: Ref<boolean>;
} {

  const isLoading = ref<boolean>(false);

  const fetchQuestions = async () => {
    isLoading.value = true;
    const questionsRef = collection(db, "questions");
    const questionsWithSpecificLevelRef = query(questionsRef, where("level", "==", Number(level)));
    
    try {
        const querySnapshot = await getDocs(questionsWithSpecificLevelRef);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            questionList.value.push({
                id: doc.id,
                description: data.description || null,
                level: data.level || null,
            });
        });

        availableQuestionList.value = questionList.value;
        isLoading.value = false;
    } catch (error) {
        isLoading.value = false;
        console.error("Error fetching questions:", error);
    }
  };

  const drawQuestion = () => {
      if (availableQuestionList.value.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableQuestionList.value.length);
          drawnQuestion.value = availableQuestionList.value[randomIndex];
      }
    
      availableQuestionList.value = availableQuestionList.value.filter(
          (question) => question.id !== drawnQuestion.value?.id
      );

      if(availableQuestionList.value.length === 0) {
          availableQuestionList.value = questionList.value;
      }
  };

  return {
    questionList,
    fetchQuestions,
    drawQuestion,
    drawnQuestion,
    isLoading
  };
}

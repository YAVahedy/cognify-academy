import { useEffect, useState } from "react";

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch("/api/questions");
      const data = await response.json();
      setQuestions(data);
    };
    fetchQuestions();
  }, []);

  return (
    <div>
      <h1>All Questions</h1>
      <ul>
        {questions.map((question) => (
          <li key={question._id}>{question.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionsList;

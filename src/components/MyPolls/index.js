import { useState, useContext, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../App";
import QuestionCard from "./QuestionCard";

const MyPolls = () => {
  const history = useHistory();
  const [polls, setPolls] = useState(null);
  const { userToken } = useContext(AppContext);

  useEffect(() => {
    if (!userToken) {
      //redirect to home page if no auth
      history.push("/");
    }

    new Promise((r) => setTimeout(r, 2000)).then((res) => {
      setPolls([
        { id: 1, question: "What is the meaning of life?", deadline: new Date() },
        { id: 2, question: "What is the meaning of life?qqsdsd", deadline: new Date() },
        { id: 3, question: "What is the meaning of life?qqsdsddsdvddv", deadline: new Date() },
        { id: 4, question: "What is the meaning of life?qqsdsddsdvddvsefee", deadline: new Date() },
        { id: 5, question: "What is the meaning of life?qqsdsddsdvddvsefeesefefe", deadline: new Date() },
        { id: 6, question: "What is the meaning of life?qqsdsddsdvddvsefeesefefesdgedv", deadline: new Date() },
        { id: 7, question: "What is the meaning of life?qqsdsddsdvddvsefeesefefesdgedvdsvdv", deadline: new Date() },
        { id: 8, question: "What is the meaning of life?qqsdsddsdvddvsefeesefefesdgedvdsvdvws", deadline: new Date() },
        { id: 9, question: "What is the meaning of life?qqsdsddsdvddvsefeesefefesdgedvdsvdvwsdfdfd", deadline: new Date() },
      ]);
    });
  }, [userToken]);

  return (
    <div>
      <h1 className="text-white text-center mb-3">Your Polls</h1>
      <div className="d-flex flex-wrap justify-content-center" style={{ gap: "15px" }}>
        {polls ? (
          polls.map(({ id, question, deadline }) => {
            return <QuestionCard key={id} question={question} deadline={deadline} onClick={() => history.push(`/admin/polls/${id}`)} />;
          })
        ) : (
          <Spinner className="mt-5" animation="grow" variant="light" />
        )}
      </div>
    </div>
  );
};

export default MyPolls;

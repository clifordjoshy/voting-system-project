import { useState, useContext, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useHistory } from "react-router-dom";
import { AppContext } from "../../App";
import QuestionCard from "./QuestionCard";
import axios from "axios";

const MyPolls = () => {
  const history = useHistory();
  const [polls, setPolls] = useState(null);
  const { userToken } = useContext(AppContext);

  useEffect(() => {
    if (!userToken) {
      //redirect to home page if no auth
      history.push("/");
    }

    axios.get(process.env.REACT_APP_BACKEND_URL + "questions", { headers: { Authorization: `Bearer ${userToken}` } }).then((res) => {
      setPolls(res.data.questions);
    });
  }, [userToken, history]);

  return (
    <div>
      <h1 className="text-white text-center mb-3">Your Polls</h1>
      <div className="d-flex flex-wrap justify-content-center" style={{ gap: "15px" }}>
        {polls ? (
          polls.map(({ question_id, question_text, deadline }) => {
            return (
              <QuestionCard
                key={question_id}
                question={question_text}
                deadline={new Date(deadline)}
                onClick={() => history.push(`/admin/polls/${question_id}`)}
              />
            );
          })
        ) : (
          <Spinner className="mt-5" animation="grow" variant="light" />
        )}
      </div>
    </div>
  );
};

export default MyPolls;

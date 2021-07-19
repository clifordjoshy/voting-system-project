import { useHistory, useParams } from "react-router-dom";
import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../../App";
import PostEdited from "./PostEdited";
import PostForm from "./PostForm";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

const EditPoll = () => {
  const { pollId } = useParams();
  const { userToken } = useContext(AppContext);
  const [questionData, setQuestionData] = useState(null);

  //redirect to home page if no auth
  const history = useHistory();

  useEffect(() => {
    if (!userToken) {
      //redirect to home page if no auth
      history.push("/");
    }

    axios
      .get(process.env.REACT_APP_BACKEND_URL + pollId + "/admin", { headers: { Authorization: `Bearer ${userToken}` } })
      .then((res) => setQuestionData(res.data));
  }, [userToken, pollId, history]);

  const [postEdited, setPostEdited] = useState(false);

  const handleSubmit = useCallback(async (question, options, deadline) => {
    // axios
    //   .post(process.env.REACT_APP_BACKEND_URL + "create_question", {
    //     question_text: question,
    //     choices: options,
    //     deadline: deadline
    //   })
    await new Promise((r) => setTimeout(r, 2000));
    if (true) {
      setPostEdited(true);
    }
  }, []);

  let body;
  if (!questionData) {
    body = (
      <Card className="p-2">
        <Spinner animation="border" />;
      </Card>
    );
  } else if (postEdited) {
    body = <PostEdited pollId={postEdited} />;
  } else {
    body = <PostForm submitData={handleSubmit} questionData={questionData} />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ padding: "20px" }}>
      {body}
    </div>
  );
};

export default EditPoll;

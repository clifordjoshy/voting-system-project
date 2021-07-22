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

    axios.get(process.env.REACT_APP_BACKEND_URL + pollId).then((res) => setQuestionData(res.data));
  }, [pollId, history, userToken]);

  const [postEdited, setPostEdited] = useState(false);

  const handleSubmit = useCallback(
    async (question, deadline, preOptions, addedOptions) => {
      const body = {
        question_text: question,
        deadline: new Date(deadline).toISOString(),
        choices_created: addedOptions.map((opt) => ({ choice_text: opt })),
        choices_edited: preOptions,
      };

      let res;
      try {
        res = await axios.post(process.env.REACT_APP_BACKEND_URL + pollId + "/admin", body, { headers: { Authorization: `Bearer ${userToken}` } });
      } catch (error) {
        return JSON.stringify(error.response?.data || "request failed");
      }

      if (res?.data) {
        setPostEdited(true);
      }
    },
    [pollId, userToken]
  );

  let body;
  if (!questionData) {
    body = (
      <Card className="p-2">
        <Spinner animation="border" />;
      </Card>
    );
  } else if (postEdited) {
    body = <PostEdited pollId={pollId} />;
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

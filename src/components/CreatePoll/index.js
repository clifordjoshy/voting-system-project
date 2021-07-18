import { useContext, useState, useCallback } from "react";
import { AppContext } from "../../App";
import axios from "axios";
import PostCreated from "./PostCreated";
import PostForm from "./PostForm";

const CreatePoll = () => {
  const { userToken } = useContext(AppContext);

  const [postCreated, setPostCreated] = useState(null);

  const handleSubmit = useCallback(async (question, options, deadline) => {
    // axios
    //   .post(process.env.REACT_APP_BACKEND_URL + "create_question", {
    //     question_text: question,
    //     choices: options,
    //     deadline: deadline
    //   })
    await new Promise((r) => setTimeout(r, 2000));
    if (true) {
      setPostCreated("1");
      console.log("post dcreated");
    }
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ padding: "20px" }}>
      {postCreated ? <PostCreated pollId={postCreated} /> : <PostForm submitData={handleSubmit} />}
    </div>
  );
};
export default CreatePoll;

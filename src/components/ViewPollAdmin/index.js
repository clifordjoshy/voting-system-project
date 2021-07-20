import ResultGraph from "./ResultGraph";
import "./index.css";
import { Link, useHistory, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import QuestionInfo from "./QuestionInfo";
import { AppContext } from "../../App";
import Button from "react-bootstrap/Button";

const ViewPollAdmin = () => {
  const { pollId } = useParams();
  const { userToken } = useContext(AppContext);
  const [questionData, setQuestionData] = useState(null);

  const history = useHistory();

  useEffect(() => {
    if (!userToken) {
      history.push("/");
    }

    axios
      .get(process.env.REACT_APP_BACKEND_URL + pollId + "/admin", { headers: { Authorization: `Bearer ${userToken}` } })
      .then((res) => setQuestionData(res.data));
  }, [userToken, pollId, history]);

  return (
    <div className="collapse-question vh-100 vw-100 position-absolute top-0 ps-2 pe-2 pt-5 text-white" style={{ zIndex: "-1" }}>
      <div className="d-flex align-items-center p-5">
        <ResultGraph results={questionData?.choices} />
      </div>
      <div className="p-2 h-100 d-flex flex-column">
        <div className="d-flex justify-content-end pb-2" style={{ gap: "20px" }}>
          <Link to="/admin/polls">
            <Button variant="secondary">Return To Polls</Button>
          </Link>
          <Link to={`/admin/edit/${pollId}`}>
            <Button variant="warning">Edit</Button>
          </Link>
        </div>
        <div className="flex-grow-1 d-flex align-items-center">
          <QuestionInfo {...questionData} />
        </div>
      </div>
    </div>
  );
};

export default ViewPollAdmin;

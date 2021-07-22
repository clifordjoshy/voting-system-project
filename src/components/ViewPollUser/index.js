import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Alert from "react-bootstrap/Alert";

const ViewPollUser = () => {
  const { pollId } = useParams();
  const [questionData, setQuestionData] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isError, setIsError] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL + pollId).then((res) => setQuestionData(res.data));
  }, [pollId]);

  const handleSubmit = useCallback(() => {
    if (!selectedChoice) {
      setIsError(true);
      setTimeout(() => setIsError(false), 2000);
      return;
    }

    setLoading(true);
    axios.post(process.env.REACT_APP_BACKEND_URL + pollId, { choice_id: selectedChoice }).then(() => setAnswered(true));
  }, [selectedChoice, pollId, setIsError, setLoading, setAnswered]);

  let cardBody;
  if (!questionData) {
    cardBody = <Spinner animation="border" />;
  } else if (!questionData.question) {
    cardBody = <Card.Title>This question does not exist :(</Card.Title>;
  } else if (new Date(questionData.question.deadline) < new Date()) {
    cardBody = <Card.Title>This question's deadline has elapsed :(</Card.Title>;
  } else if (answered) {
    cardBody = <Card.Title>Your response has been recorded.</Card.Title>;
  } else {
    cardBody = (
      <>
        <Card.Title>{questionData.question.question_text}</Card.Title>
        <hr />
        <ListGroup variant="flush">
          {questionData.choices.map(({ choice_id, choice_text }) => {
            return (
              <ListGroup.Item action key={choice_id} active={selectedChoice === choice_id} onClick={() => setSelectedChoice(choice_id)}>
                {choice_text}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
        <br />
        {isError && <Alert variant="danger">Please select an option.</Alert>}
        <div className="d-flex justify-content-between">
          <Spinner animation="border" className={loading ? "visible" : "invisible"} />
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <Card body border="dark" style={{ padding: "10px" }}>
        {cardBody}
      </Card>
    </div>
  );
};

export default ViewPollUser;

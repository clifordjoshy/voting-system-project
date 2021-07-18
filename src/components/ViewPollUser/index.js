import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const ViewPollUser = () => {
  const { pollId } = useParams();
  const [questionData, setQuestionData] = useState(null);

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACKEND_URL + pollId).then((res) => setQuestionData(res.data));
  }, [pollId]);

  let cardBody;
  if (!questionData) {
    cardBody = <Spinner animation="border" />;
  } else if (!questionData.question.question_id) {
    cardBody = <Card.Title>This question does not exist :(</Card.Title>;
  } else {
    cardBody = (
      <>
        <Card.Title>What is the meaning of life?</Card.Title>
        <hr />
        <ListGroup variant="flush">
          <ListGroup.Item action>Cras justo odio</ListGroup.Item>
          <ListGroup.Item action>Dapibus ac facilisis in</ListGroup.Item>
          <ListGroup.Item action>Morbi leo risus</ListGroup.Item>
          <ListGroup.Item action>Porta ac consectetur ac</ListGroup.Item>
          <ListGroup.Item action>Vestibulum at eros</ListGroup.Item>
        </ListGroup>
        <br />
        <Button variant="primary" style={{ float: "right" }}>
          Submit
        </Button>
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

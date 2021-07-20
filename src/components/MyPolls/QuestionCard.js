import Card from "react-bootstrap/Card";

const QuestionCard = ({ question, deadline, onClick }) => {
  const isActive = new Date() < deadline;

  return (
    <Card onClick={onClick} style={{ flex: "0 0 300px", cursor: "pointer", background: isActive ? "#bbffbb" : "#bbbbff" }}>
      <Card.Body className="p-3">
        <Card.Title>{question}</Card.Title>
      </Card.Body>

      <div className="d-flex h-100 align-items-end">
        <Card.Footer className="w-100 text-center">
          {isActive ? "Closes" : "Closed"} {new Intl.DateTimeFormat([], { timeStyle: "short", dateStyle: "long" }).format(deadline)}
        </Card.Footer>
      </div>
    </Card>
  );
};

export default QuestionCard;

import Spinner from "react-bootstrap/Spinner";

const QuestionInfo = ({ question, choices }) => {
  if (!question) {
    return (
      <div className="d-flex justify-content-center w-100">
        <Spinner animation="grow" variant="light" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="pb-3">{question?.question_text}</h3>
      {choices?.map(({ choice_id, choice_text, votes }, i) => {
        return (
          <h5 key={choice_id} className="ps-3">
            Option {i + 1}:&nbsp; {choice_text} &nbsp; -{">"} &nbsp;{votes} votes
          </h5>
        );
      })}
    </div>
  );
};

export default QuestionInfo;

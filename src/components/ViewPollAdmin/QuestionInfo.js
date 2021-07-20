const QuestionInfo = ({ question, options }) => {
  return (
    <div>
      <h3 className="pb-3">{question}</h3>
      {options?.map((opt, i) => {
        return (
          <h5 key={i} className="ps-3">
            Option {i + 1}:&nbsp; {opt} &nbsp; -{">"} &nbsp;{i * 5} votes
          </h5>
        );
      })}
    </div>
  );
};

export default QuestionInfo;

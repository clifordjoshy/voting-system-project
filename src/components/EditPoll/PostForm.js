import { useState, useCallback } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

const PostForm = ({ submitData, questionData }) => {
  const [question, setQuestion] = useState(questionData.question);
  const [options, setOptions] = useState(questionData.choices);
  const [deadline, setDeadline] = useState(questionData.deadline);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const createOption = useCallback(
    (index, newVal) => {
      //reset option errors
      setErrors({ ...errors, optionCount: false });
      setOptions(options.concat(""));
    },
    [options, setOptions, errors, setErrors]
  );

  const updateOption = useCallback(
    (index, newVal) => {
      const optionsNew = [...options];
      optionsNew[index] = newVal;
      setOptions(optionsNew);
    },
    [options, setOptions]
  );

  const removeOption = useCallback(
    (index) => {
      const optionsNew = [...options];
      optionsNew.splice(index, 1);
      setOptions(optionsNew);

      //reset option errors
      setErrors({ ...errors, options: [] });
    },
    [options, setOptions, errors, setErrors]
  );

  const handleSubmit = useCallback(() => {
    const errorsNew = {
      question: !question.length,
      options: options.map((o) => !o.length),
      deadline: !deadline.length,
      optionCount: options.length < 2,
    };

    if (errorsNew.question || errorsNew.deadline || errorsNew.options.includes(true)) {
      setErrors(errorsNew);
      return;
    }

    setLoading(true);
    submitData(question, options, deadline).then(() => {
      setLoading(false);
    });
  }, [question, options, deadline, submitData]);

  return (
    <Card body className="p-2" style={{ minWidth: "50%" }}>
      <Card.Title>Create a Question</Card.Title>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Enter your question</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Your question here."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            isInvalid={errors.question}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Add your options</Form.Label>
          {options.map((opt, i) => {
            return (
              <div key={i} className="d-flex align-items-center mb-2 ">
                <Form.Control
                  placeholder="Option here."
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  isInvalid={errors.options?.[i]}
                />
                <button
                  className="btn-close ms-2"
                  onClick={(e) => {
                    e.preventDefault();
                    removeOption(i);
                  }}
                />
              </div>
            );
          })}
          <Button variant="outline-info" className="w-100" onClick={createOption}>
            Add New Option
          </Button>
          {errors.optionCount && <div class="alert alert-danger">Please add atleast two options</div>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Enter deadline</Form.Label>
          <Form.Control type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} isInvalid={errors.deadline} />
        </Form.Group>
        <div className="d-flex justify-content-end align-items-center">
          {loading && <Spinner animation="border" className="me-3" />}
          <Button variant="primary" onClick={handleSubmit}>
            Create
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default PostForm;

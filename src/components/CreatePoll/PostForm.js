import { useState, useCallback } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const PostForm = ({ submitData }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const createOption = useCallback(
    (index, newVal) => {
      //reset option errors
      setErrors({ ...errors, optionCount: false });
      setOptions(options.concat(""));
    },
    [options, errors]
  );

  const updateOption = useCallback(
    (index, newVal) => {
      const optionsNew = [...options];
      optionsNew[index] = newVal;
      setOptions(optionsNew);
    },
    [options]
  );

  const removeOption = useCallback(
    (index) => {
      const optionsNew = [...options];
      optionsNew.splice(index, 1);
      setOptions(optionsNew);

      //reset option errors
      setErrors({ ...errors, options: [] });
    },
    [options, errors]
  );

  const handleSubmit = useCallback(() => {
    const errorsNew = {
      question: !question.length,
      options: options.map((o) => !o.length),
      deadline: !deadline.length || new Date(deadline) < new Date(),
      optionCount: options.length < 2,
    };
    setErrors(errorsNew);

    if (errorsNew.question || errorsNew.deadline || errorsNew.optionCount || errorsNew.options.includes(true)) {
      return;
    }

    setLoading(true);
    submitData(question, options, new Date(deadline)).then((error) => {
      if (error) {
        setErrors({ request: error });
        setLoading(false);
      }
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
                  tabIndex="-1"
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
          {errors.optionCount && <div className="alert alert-danger">Please add atleast two options</div>}
        </Form.Group>
        <Row className="g-2 mb-3">
          <Col md>
            <Form.Group>
              <Form.Label>Enter deadline date</Form.Label>
              <Form.Control
                type="date"
                value={deadline.slice(0, 10)}
                onChange={(e) => setDeadline(e.target.value + "T" + deadline.slice(10))}
                isInvalid={errors.deadline}
              />
            </Form.Group>
          </Col>
          <Col md>
            <Form.Group>
              <Form.Label>Enter deadline time</Form.Label>
              <Form.Control
                type="time"
                value={deadline.slice(11)}
                onChange={(e) => setDeadline(deadline.slice(0, 10) + "T" + e.target.value)}
                isInvalid={errors.deadline}
              />
            </Form.Group>
          </Col>
        </Row>

        <div>{errors.request}</div>
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

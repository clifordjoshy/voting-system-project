import { useState, useCallback } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const PostForm = ({ submitData, questionData }) => {
  const [question, setQuestion] = useState(questionData.question.question_text);
  const [preOptions, setPreOptions] = useState(questionData.choices);
  const [addedOptions, setAddedOptions] = useState([]);
  const [deadline, setDeadline] = useState(questionData.question.deadline);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const createOption = useCallback(() => {
    //reset option errors
    setAddedOptions(addedOptions.concat(""));
  }, [addedOptions]);

  const updateOption = useCallback(
    (index, newVal, isNewOption) => {
      if (isNewOption) {
        const optionsNew = [...addedOptions];
        optionsNew[index] = newVal;
        setAddedOptions(optionsNew);
      } else {
        const optionsNew = [...preOptions];
        optionsNew[index].choice_text = newVal;
        setPreOptions(optionsNew);
      }
    },
    [addedOptions, preOptions]
  );

  const removeOption = useCallback(
    (index) => {
      const optionsNew = [...addedOptions];
      optionsNew.splice(index, 1);

      setAddedOptions(optionsNew);

      //reset option errors
      setErrors({ ...errors, options: { ...errors.options, added: [] } });
    },
    [addedOptions, errors]
  );

  const handleSubmit = useCallback(() => {
    const errorsNew = {
      question: !question.length,
      options: {
        pre: preOptions.map(({ choice_text }) => !choice_text.length),
        added: addedOptions.map((o) => !o.length),
      },
      deadline: !deadline.length || new Date(deadline) < new Date(),
    };

    setErrors(errorsNew);
    if (errorsNew.question || errorsNew.deadline || errorsNew.options.pre.includes(true) || errorsNew.options.added.includes(true)) {
      return;
    }

    setLoading(true);
    submitData(question, new Date(deadline), preOptions, addedOptions).then((err) => {
      if (err) {
        setErrors({ request: err });
        setLoading(false);
      }
    });
  }, [question, preOptions, addedOptions, deadline, submitData]);

  return (
    <Card body className="p-2" style={{ minWidth: "50%" }}>
      <Card.Title>Edit Question</Card.Title>
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
          {preOptions.map(({ choice_text: opt }, i) => {
            return (
              <div key={`pre ${i}`} className="d-flex align-items-center mb-2 ">
                <Form.Control
                  placeholder="Option here."
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value, false)}
                  isInvalid={errors.options?.pre?.[i]}
                />
              </div>
            );
          })}
          {addedOptions.map((opt, i) => {
            return (
              <div key={`added ${i}`} className="d-flex align-items-center mb-2 ">
                <Form.Control
                  placeholder="Option here."
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value, true)}
                  isInvalid={errors.options?.added?.[i]}
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
            Save
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default PostForm;

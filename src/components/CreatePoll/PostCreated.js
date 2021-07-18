import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

const PostCreated = ({ pollId }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const copyButton = useRef();

  const pollLink = `${window.location.origin}/polls/${pollId}`;

  return (
    <Card body className="p-2">
      <Card.Text>Your poll has been created successfully.</Card.Text>
      <ButtonGroup className="mb-3">
        <div className="btn" style={{ border: "1px solid #198754", borderRadius: "0.25rem 0 0 0.25rem", cursor: "auto", userSelect: "all" }}>
          {pollLink}
        </div>

        <Button
          ref={copyButton}
          variant="success"
          onClick={() => {
            navigator.clipboard.writeText(pollLink);
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 1000);
          }}
        >
          Copy
        </Button>
        <Overlay target={copyButton.current} show={showTooltip} placement="top">
          {(props) => <Tooltip {...props}>Copied!</Tooltip>}
        </Overlay>
      </ButtonGroup>
      <div className="d-flex justify-content-around">
        <Link to="/">
          <Button variant="warning">Return Home</Button>
        </Link>
        <Link to={"/admin/polls/" + pollId}>
          <Button variant="primary">Go To Poll</Button>
        </Link>
      </div>
    </Card>
  );
};

export default PostCreated;

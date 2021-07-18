import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const PostCreated = ({ pollId }) => {
  return (
    <Card body className="p-2">
      <Card.Text>Your poll has been created successfully.</Card.Text>
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

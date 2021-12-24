import React from "react";
import { Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";

export default function ToppingOption({ name, imagePath, updateItemCount }) {
  // const [toppingChecked, setToppingChecked] = React.useState(false);

  // React.useEffect(() => {
  //   const value = toppingChecked ? 1 : 0;
  //   updateItemCount(name, value);
  // }, [toppingChecked]);

  return (
    <Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: "center" }}>
      <img
        style={{ width: "75%" }}
        src={`http://localhost:3030/${imagePath}`}
        alt={`${name} topping`}
      />
      <Form>
        <Form.Group controlId={name}>
          <Form.Check
            type="checkbox"
            // checked={toppingChecked}
            // onChange={(e) => setToppingChecked(e.target.checked)}
            onChange={(e) => {
              updateItemCount(name, e.target.checked ? 1 : 0);
            }}
            label={name}
          />
        </Form.Group>
      </Form>
    </Col>
  );
}

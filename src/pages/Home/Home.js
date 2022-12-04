import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";

const Home = () => {
  const [newsletter, setNewsletter] = useState(false);

  // const onNewsletterChange = (checked) => {
  //   setNewsletter(checked);
  // };

  return (
    <>
      <Container>
        <Row>
          <Col lg={6}>Home</Col>
          <Col lg={6}>
            <ToggleSwitch
              id="newsletter"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
            />
            <label htmlFor="newsletter">Subscribe to our Newsletter</label>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;

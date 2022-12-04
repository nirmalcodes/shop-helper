import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { AiFillEdit, AiOutlineArrowLeft } from "react-icons/ai";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";

const KokoCalc = () => {
  const [discounted, setDiscounted] = useState(false);
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <Container className="pb-4">
        <Row>
          <div className="ml-auto px-3 mb-4">
            <Button onClick={(e) => setEditMode(!editMode)}>
              {editMode === false ? (
                <AiFillEdit size={24} style={{ marginRight: "8px" }} />
              ) : (
                <AiOutlineArrowLeft size={24} style={{ marginRight: "8px" }} />
              )}
              {editMode === false ? "Edit Mode" : "Normal Mode"}
            </Button>
          </div>
        </Row>
        <Row className="align_center content_cente">
          {!editMode && (
            <Col lg={6}>
              Koko Calc
              <Form>
                <Form.Group controlId="">
                  <Form.Label>Product Price</Form.Label>
                  <Form.Control type="text" placeholder="" />
                </Form.Group>

                {discounted && (
                  <Form.Group controlId="">
                    <Form.Label>Discount</Form.Label>
                    <Form.Control type="text" placeholder="" readOnly />
                  </Form.Group>
                )}
                {discounted && (
                  <Form.Group controlId="">
                    <Form.Label>Discounted Price</Form.Label>
                    <Form.Control type="text" placeholder="" readOnly />
                  </Form.Group>
                )}

                <Form.Group controlId="">
                  <Form.Label>Convenience Fee</Form.Label>
                  <Form.Control type="text" placeholder="" readOnly />
                </Form.Group>
                <Form.Group controlId="">
                  <Form.Label>Total with Convenience Fee</Form.Label>
                  <Form.Control type="text" placeholder="" readOnly />
                </Form.Group>
                <Form.Group controlId="">
                  <Form.Label>Per Installment</Form.Label>
                  <Form.Control type="text" placeholder="" readOnly />
                </Form.Group>
                <Button variant="primary" type="button" size="lg" block>
                  Calculate
                </Button>
              </Form>
            </Col>
          )}
          {editMode && (
            <Col lg={6}>
              <Row>
                <div className="ml-auto mb-4">
                  <label htmlFor="discounted">
                    Discount mode :{/* {discounted === false ? "OFF" : "ON"} */}
                  </label>
                  <ToggleSwitch
                    id="discounted"
                    checked={discounted}
                    optionLabels={["ON", "OFF"]}
                    onChange={(e) => setDiscounted(e.target.checked)}
                  />
                </div>
              </Row>
              <Form>
                <Form.Group controlId="">
                  <Form.Label>Convenience Fee Rate</Form.Label>
                  <Form.Control type="text" placeholder="" />
                </Form.Group>
                {discounted && (
                  <>
                    <Form.Group controlId="">
                      <Form.Label>Discount Rate</Form.Label>
                      <Form.Control type="text" placeholder="" />
                    </Form.Group>
                    <Form.Group controlId="">
                      <Form.Label>Max Cap for Discount</Form.Label>
                      <Form.Control type="text" placeholder="" />
                    </Form.Group>
                  </>
                )}

                <Button variant="primary" type="button" size="lg" block>
                  Save
                </Button>
              </Form>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default KokoCalc;

import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { AiFillEdit, AiOutlineArrowLeft } from "react-icons/ai";
import ToggleSwitch from "../../components/ToggleSwitch/ToggleSwitch";

const KokoCalc = () => {
  const [discounted, setDiscounted] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [convenienceFeeRate, setConvenienceFeeRate] = useState(6);

  const [productPrice, setProductPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [convenienceFee, setConvenienceFee] = useState(0);
  const [totWithCFee, setTotWithCFee] = useState(0);
  const [installmentPerMonth, setInstallmentPerMonth] = useState(0);

  const handleCalculation = (e) => {
    e.preventDefault();

    setTotWithCFee(
      (productPrice / ((100 - convenienceFeeRate) / 100)).toFixed(2)
    );

    setConvenienceFee((totWithCFee - productPrice).toFixed(2));

    setInstallmentPerMonth((totWithCFee / 3).toFixed(2));
  };

  const handleCalculationWithDiscount = (e) => {
    e.preventDefault();

    const disco = (productPrice * (2 / 100)).toFixed(2);
    setDiscount(disco);

    
  };

  return (
    <>
      {discounted === true ? "yes" : discounted === false ? "no" : ""}
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
              <Form autoComplete="off">
                <Form.Group controlId="productPrice">
                  <Form.Label>Product Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder=""
                    value={productPrice}
                    onChange={(e) => setProductPrice(parseInt(e.target.value))}
                  />
                </Form.Group>

                {discounted && (
                  <Form.Group controlId="Discount">
                    <Form.Label>Discount</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={discount}
                      readOnly
                    />
                  </Form.Group>
                )}
                {discounted && (
                  <Form.Group controlId="discountedPrice">
                    <Form.Label>Discounted Price</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={discountedPrice}
                      readOnly
                    />
                  </Form.Group>
                )}

                <Form.Group controlId="convenienceFee">
                  <Form.Label>Convenience Fee</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={convenienceFee}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="totWithConvenienceFee">
                  <Form.Label>Total with Convenience Fee</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={totWithCFee}
                    readOnly
                  />
                </Form.Group>
                <Form.Group controlId="installmentPerMonth">
                  <Form.Label>Installment Per Month</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={installmentPerMonth}
                    readOnly
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleCalculationWithDiscount}
                  size="lg"
                  block
                >
                  Calculate
                </Button>
              </Form>
            </Col>
          )}
          {editMode && (
            <Col lg={6}>
              <Row>
                <div className="ml-auto mb-4">
                  <label htmlFor="discounted" className="mr-2">
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

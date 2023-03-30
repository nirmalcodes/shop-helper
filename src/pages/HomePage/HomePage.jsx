import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { db } from '../../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
    const inputRef = useRef(null);
    const [convenienceFeeRate, setConvenienceFeeRate] = useState(3);
    const [discountMode, setDiscountMode] = useState(false);
    const [discountRate, setDiscountRate] = useState(0);
    const [discountMaxCap, setDiscountMaxCap] = useState(0);

    useEffect(() => {
        const input = inputRef.current;

        const handleWheel = (event) => {
            event.preventDefault();
        };

        input.addEventListener('wheel', handleWheel, { passive: false });

        const configDocRef = doc(db, 'config', 'config');

        const unsubscribe = onSnapshot(configDocRef, (doc) => {
            const { cFeeRate, isDiscounted, offerRate, offerMaxCap } =
                doc.data();
            console.log('Config data:', doc.data());

            setConvenienceFeeRate(cFeeRate);
            // {
            //     isDiscounted
            //         ? toast.success('Discount mode is ON now')
            //         : toast.warn('Discount mode is OFF now');
            // }
            setDiscountMode(isDiscounted);
            setDiscountRate(isDiscounted ? offerRate : 0);
            setDiscountMaxCap(isDiscounted ? offerMaxCap : 0);

            // toast.success('Config data updated!');
        });

        return () => {
            input.removeEventListener('wheel', handleWheel);
            unsubscribe();
        };
    }, []);

    const initialValues = {
        productPrice: '',
        discount: '',
        discountedPrice: '',
        convenienceFee: '',
        totalWithConvenienceFee: '',
        installmentPerMonth: '',
    };

    const validationSchema = Yup.object({
        productPrice: Yup.number().required('Product Price is required'),
    });

    const handleNormalCalculation = (values, { setFieldValue }) => {
        const productPrice = values.productPrice;
        let convenienceFee, totalWithConvenienceFee, installmentPerMonth;

        let convenienceFeePercentage = (100 - convenienceFeeRate) / 100;

        totalWithConvenienceFee = (
            productPrice / convenienceFeePercentage
        ).toFixed(2);

        convenienceFee = (totalWithConvenienceFee - productPrice).toFixed(2);

        installmentPerMonth = (totalWithConvenienceFee / 3).toFixed(2);

        setFieldValue('convenienceFee', convenienceFee);
        setFieldValue('totalWithConvenienceFee', totalWithConvenienceFee);
        setFieldValue('installmentPerMonth', installmentPerMonth);
    };

    const handleDiscountCalculation = (values, { setFieldValue }) => {
        const productPrice = values.productPrice;
        let discount,
            discountedPrice,
            convenienceFee,
            totalWithConvenienceFee,
            installmentPerMonth;

        let discountPercentage = discountRate / 100;

        discount = (productPrice * discountPercentage).toFixed(2);

        if (discount > discountMaxCap) {
            let balanceFromMaxCap = discount - discountMaxCap;

            let beforBalanceAdd = productPrice - discount;

            let AfterBalanceAdd = beforBalanceAdd + balanceFromMaxCap;

            discountedPrice = AfterBalanceAdd.toFixed(2);

            alert(
                `Discount Value Rs. ${discount} is above Max Cap of Rs. 3000.00\nExtra Rs. ${balanceFromMaxCap.toFixed(
                    2
                )} is added back to the Discounted Price`
            );
        } else {
            discountedPrice = (productPrice - discount).toFixed(2);
        }

        let convenienceFeePercentage = (100 - convenienceFeeRate) / 100;

        totalWithConvenienceFee = (
            discountedPrice / convenienceFeePercentage
        ).toFixed(2);

        convenienceFee = (totalWithConvenienceFee - discountedPrice).toFixed(2);

        installmentPerMonth = (totalWithConvenienceFee / 3).toFixed(2);

        setFieldValue('discount', discount);
        setFieldValue('discountedPrice', discountedPrice);
        setFieldValue('convenienceFee', convenienceFee);
        setFieldValue('totalWithConvenienceFee', totalWithConvenienceFee);
        setFieldValue('installmentPerMonth', installmentPerMonth);
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                className=""
            />
            <div className="mx-auto grid min-h-screen place-items-center xl:w-[70%]">
                <div className="w-full max-w-[420px] rounded-lg bg-white px-4 py-8 drop-shadow-md">
                    <div className="mb-4 flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="discount"
                            id="discount"
                            className=""
                            checked={discountMode}
                            disabled
                        />
                        <label htmlFor="discount">
                            Discount mode {discountMode ? 'ON' : 'OFF'}
                        </label>
                    </div>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={
                            discountMode
                                ? handleDiscountCalculation
                                : handleNormalCalculation
                        }
                    >
                        {() => (
                            <Form>
                                <h4 className="mb-4 text-center text-2xl font-medium text-gray-700">
                                    KOKO
                                </h4>
                                <div className="form-group">
                                    <label
                                        htmlFor="productPrice"
                                        className="form-label"
                                    >
                                        Product Price
                                    </label>
                                    <Field
                                        id="productPrice"
                                        name="productPrice"
                                        type="number"
                                        placeholder="1000.00"
                                        className="form-input"
                                        autoComplete="off"
                                        innerRef={inputRef}
                                    />
                                    <ErrorMessage
                                        name="productPrice"
                                        component="span"
                                        className="form-error-message"
                                    />
                                </div>

                                {discountMode && (
                                    <>
                                        <div className="form-group">
                                            <label
                                                htmlFor="discount"
                                                className="form-label"
                                            >
                                                Discount
                                            </label>
                                            <Field
                                                id="discount"
                                                name="discount"
                                                type="number"
                                                placeholder="00.00"
                                                className="form-input"
                                                autoComplete="off"
                                                disabled
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label
                                                htmlFor="discountedPrice"
                                                className="form-label"
                                            >
                                                Discounted Price
                                            </label>
                                            <Field
                                                id="discountedPrice"
                                                name="discountedPrice"
                                                type="number"
                                                placeholder="00.00"
                                                className="form-input"
                                                autoComplete="off"
                                                disabled
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="form-group">
                                    <label
                                        htmlFor="convenienceFee"
                                        className="form-label"
                                    >
                                        Convenience Fee
                                    </label>
                                    <Field
                                        id="convenienceFee"
                                        name="convenienceFee"
                                        type="number"
                                        placeholder="00.00"
                                        className="form-input"
                                        autoComplete="off"
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="totalWithConvenienceFee"
                                        className="form-label"
                                    >
                                        Total with Convenience Fee
                                    </label>
                                    <Field
                                        id="totalWithConvenienceFee"
                                        name="totalWithConvenienceFee"
                                        type="number"
                                        placeholder="00.00"
                                        className="form-input"
                                        autoComplete="off"
                                        disabled
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="installmentPerMonth"
                                        className="form-label"
                                    >
                                        Installment Per Month
                                    </label>
                                    <Field
                                        id="installmentPerMonth"
                                        name="installmentPerMonth"
                                        type="number"
                                        placeholder="00.00"
                                        className="form-input"
                                        autoComplete="off"
                                        disabled
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary mb-4"
                                >
                                    Calculate
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default HomePage;

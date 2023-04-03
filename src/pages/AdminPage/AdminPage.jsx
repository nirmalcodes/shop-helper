import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { db } from '../../firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Switch } from '@headlessui/react';

const AdminPage = () => {
    // const inputRef = useRef(null);
    const inputRefs = [useRef(null), useRef(null), useRef(null)];
    const [convenienceFeeRate, setConvenienceFeeRate] = useState(3);
    const [discountMode, setDiscountMode] = useState(false);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        // const input = inputRef.current;

        // const handleWheel = (event) => {
        //     event.preventDefault();
        // };

        // input.addEventListener('wheel', handleWheel, { passive: false });

        const handleWheel = (event) => {
            const input = event.target;
            if (input && input.type === 'number') {
                event.preventDefault();
            }
        };

        inputRefs.forEach((inputRef) => {
            const input = inputRef.current;
            if (input) {
                input.addEventListener('wheel', handleWheel, {
                    passive: false,
                });
            }
        });

        const configDocRef = doc(db, 'config', 'config');

        const unsubscribe = onSnapshot(configDocRef, (doc) => {
            const { cFeeRate, isDiscounted, offerRate, offerMaxCap } =
                doc.data();
            console.log('Config data:', doc.data());

            setDiscountMode(isDiscounted);
            // setDiscountRate(isDiscounted ? offerRate : 0);
            // setDiscountMaxCap(isDiscounted ? offerMaxCap : 0);
            setConvenienceFeeRate(cFeeRate);
        });

        // return () => {
        //     input.removeEventListener('wheel', handleWheel);
        //     unsubscribe();
        // };

        return () => {
            inputRefs.forEach((inputRef) => {
                const input = inputRef.current;
                if (input) {
                    input.removeEventListener('wheel', handleWheel);
                }
            });
            unsubscribe();
        };
    }, [discountMode]);

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

    return (
        <>
            <div className="mx-auto grid min-h-screen place-items-center xl:w-[70%]">
                <div className="w-full max-w-[420px] rounded-lg bg-white px-4 py-8 drop-shadow-md">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleNormalCalculation}
                    >
                        {() => (
                            <Form>
                                <h4 className="mb-4 text-center text-2xl font-medium text-gray-700">
                                    KOKO Configuration
                                </h4>
                                <div className="form-group">
                                    <label
                                        htmlFor="productPrice"
                                        className="form-label"
                                    >
                                        Convenience Fee
                                    </label>
                                    <Field
                                        id="productPrice"
                                        name="productPrice"
                                        type="number"
                                        placeholder="3"
                                        className="form-input"
                                        autoComplete="off"
                                        innerRef={inputRefs[0]}
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
                                                Discount Rate
                                            </label>
                                            <Field
                                                id="discount"
                                                name="discount"
                                                type="number"
                                                placeholder="00.00"
                                                className="form-input"
                                                autoComplete="off"
                                                innerRef={inputRefs[1]}
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
                                                innerRef={inputRefs[2]}
                                            />
                                        </div>
                                    </>
                                )}

                                <Switch
                                    checked={enabled}
                                    onChange={setEnabled}
                                    className={`${
                                        enabled ? 'bg-green-600' : 'bg-gray-300'
                                    } relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                                >
                                    <span className="sr-only">Use setting</span>
                                    <span
                                        aria-hidden="true"
                                        className={`${
                                            enabled
                                                ? 'translate-x-9'
                                                : 'translate-x-0'
                                        } pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                    />
                                </Switch>

                                <button
                                    type="submit"
                                    className="btn btn-primary mb-4"
                                >
                                    Save
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default AdminPage;

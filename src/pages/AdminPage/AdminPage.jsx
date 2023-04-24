import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Switch } from '@headlessui/react';
import { db } from '../../firebaseConfig';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserAuth } from '../../context/AuthContext';

const AdminPage = () => {
    const { user, logOut } = UserAuth();
    const inputRefs = [useRef(null), useRef(null), useRef(null)];

    const [convenienceFee, setConvenienceFee] = useState('');
    const [discountMode, setDiscountMode] = useState(false);
    const [discountRate, setDiscountRate] = useState('');
    const [discountMaxCap, setDiscountMaxCap] = useState('');

    const [formError, setFormError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
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

        return () => {
            inputRefs.forEach((inputRef) => {
                const input = inputRef.current;
                if (input) {
                    input.removeEventListener('wheel', handleWheel);
                }
            });
        };
    }, [discountMode]);

    useEffect(() => {
        const configDocRef = doc(db, 'configs', 'configData');

        const unsubscribe = onSnapshot(configDocRef, (doc) => {
            const { feeRate, discount, discountRate, discountMaxCap } =
                doc.data();

            // console.log('Config data:', doc.data());

            setConvenienceFee(feeRate);
            setDiscountMode(discount);
            setDiscountRate(discountRate);
            setDiscountMaxCap(discountMaxCap);
        });

        const configRef = doc(db, 'configs', 'configData');

        // const fetchData = async () => {
        //     const docSnap = await getDoc(configRef);

        //     try {
        //         if (docSnap.exists()) {
        //             // console.log('Document data:', docSnap.data());

        //             const data = docSnap.data();

        //             setConvenienceFee(data.feeRate);
        //             setDiscountMode(data.discount);
        //             setDiscountRate(data.discountRate);
        //             setDiscountMaxCap(data.discountMaxCap);
        //         } else {
        //             // console.warn('No such document!');
        //         }
        //     } catch (error) {
        //         // console.error('Error fetching data:', error);
        //     }
        // };

        return () => {
            // fetchData();
            unsubscribe();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormError(null);

        if (!convenienceFee) {
            setFormError('Convenience Fee is required.');
            return;
        }

        if (discountMode) {
            if (!discountRate) {
                setFormError('Discount Rate is required.');
                return;
            }

            if (!discountMaxCap) {
                setFormError('Discount Max Cap is required.');
                return;
            }
        }

        setIsLoading(true);

        try {
            await setDoc(doc(db, 'configs', 'configData'), {
                feeRate: parseFloat(convenienceFee),
                discount: discountMode,
                discountRate: discountMode ? parseFloat(discountRate) : '',
                discountMaxCap: discountMode ? parseFloat(discountMaxCap) : '',
            });

            setFormError(null);
            toast.success('Data saved successfully!');
        } catch (error) {
            // console.error('Error saving form data:', error);
            if (error.code === 'permission-denied') {
                // console.log('Write permission denied\n Only admins can write to this document');
                toast.error('Only admins can write to this document');
            } else {
                // console.log('Write failed: ', error);
            }
        }

        setIsLoading(false);
    };

    const handleSignOut = () => {
        logOut();
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
            />
            <div className="mx-4 grid min-h-screen place-items-center xl:mx-auto xl:w-[70%]">
                <div className="w-full max-w-[420px] rounded-lg bg-white px-4 py-8 drop-shadow-md">
                    <form onSubmit={handleSubmit}>
                        <h4 className="mb-8 text-center text-2xl font-medium text-gray-700">
                            KOKO Configuration
                        </h4>

                        <div className="form-group">
                            <label htmlFor="feeRate" className="form-label">
                                Convenience Fee Rate
                            </label>
                            <input
                                id="feeRate"
                                name="feeRate"
                                type="number"
                                placeholder="3"
                                className="form-input"
                                autoComplete="off"
                                ref={inputRefs[0]}
                                value={convenienceFee}
                                onChange={(e) =>
                                    setConvenienceFee(e.target.value)
                                }
                                // required
                            />
                        </div>

                        <div className="form-group">
                            <label
                                htmlFor="discountMode"
                                className="form-label"
                            >
                                Discount Mode
                            </label>

                            <Switch
                                id="discountMode"
                                name="discountMode"
                                checked={discountMode}
                                onChange={setDiscountMode}
                                className={`${
                                    discountMode
                                        ? 'bg-green-600'
                                        : 'bg-gray-300'
                                } relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                                <span className="sr-only">
                                    Discount mode ON/OFF
                                </span>
                                <span
                                    aria-hidden="true"
                                    className={`${
                                        discountMode
                                            ? 'translate-x-9'
                                            : 'translate-x-0'
                                    } pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                />
                            </Switch>
                        </div>

                        {discountMode && (
                            <>
                                <div className="form-group">
                                    <label
                                        htmlFor="discountRate"
                                        className="form-label"
                                    >
                                        Discount Rate
                                    </label>
                                    <input
                                        id="discountRate"
                                        name="discountRate"
                                        type="number"
                                        placeholder="10"
                                        className="form-input"
                                        autoComplete="off"
                                        ref={inputRefs[1]}
                                        value={discountRate}
                                        onChange={(e) =>
                                            setDiscountRate(e.target.value)
                                        }
                                        // required
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="discountMaxCap"
                                        className="form-label"
                                    >
                                        Discount Max Cap
                                    </label>
                                    <input
                                        id="discountMaxCap"
                                        name="discountMaxCap"
                                        type="number"
                                        placeholder="2000"
                                        className="form-input"
                                        autoComplete="off"
                                        ref={inputRefs[2]}
                                        value={discountMaxCap}
                                        onChange={(e) =>
                                            setDiscountMaxCap(e.target.value)
                                        }
                                        // required
                                    />
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary mb-4"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        {formError && (
                            <p className="form-error-message">{formError}</p>
                        )}
                    </form>
                </div>
            </div>

            {user != null && (
                <button
                    className="btn btn-primary absolute top-4 right-4 z-[4] w-max"
                    type="submit"
                    onClick={handleSignOut}
                >
                    Log Out
                </button>
            )}
        </>
    );
};

export default AdminPage;

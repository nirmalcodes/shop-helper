import React, { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginPage = () => {
    const [passwordToggled, setPasswordToggled] = useState(false);

    const initialValues = {
        username: '',
        password: '',
    };

    const validationSchema = Yup.object({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });

    const onSubmit = (values) => {
        console.log('onSubmit', values);
    };

    return (
        <>
            <div className="mx-auto grid min-h-screen place-items-center px-4 xl:w-[70%]">
                <div className="w-full max-w-[320px] rounded-lg bg-white px-4 py-8 drop-shadow-md">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {() => (
                            <Form>
                                <h4 className="mb-4 text-center text-2xl font-medium text-gray-700">
                                    Log in
                                </h4>
                                <div className="form-group">
                                    <label
                                        htmlFor="username"
                                        className="form-label"
                                    >
                                        Username
                                    </label>
                                    <Field
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="jone"
                                        className="form-input"
                                    />
                                    <ErrorMessage
                                        name="username"
                                        component="span"
                                        className="form-error-message"
                                    />
                                </div>
                                <div className="form-group">
                                    <label
                                        htmlFor="password"
                                        className="form-label"
                                    >
                                        Password
                                    </label>
                                    <div className="form-password-group">
                                        <Field
                                            id="password"
                                            name="password"
                                            type={
                                                passwordToggled
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="******"
                                            className="form-input"
                                        />
                                        <div
                                            className="password-toggler"
                                            onClick={() =>
                                                setPasswordToggled(
                                                    !passwordToggled
                                                )
                                            }
                                        >
                                            {passwordToggled ? (
                                                <BsEyeSlash className="text-gray-700" />
                                            ) : (
                                                <BsEye className="text-gray-700" />
                                            )}
                                        </div>
                                    </div>
                                    <ErrorMessage
                                        name="password"
                                        component="span"
                                        className="form-error-message"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary mb-4"
                                >
                                    Log in
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default LoginPage;

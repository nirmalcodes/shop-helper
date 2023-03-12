import React, { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginPage = () => {
    const [passwordToggled, setPasswordToggled] = useState(false);

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        onSubmit: (values) => {
            console.log('onSubmit', values);
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required'),
        }),
        // validate: (values) => {
        //     const errors = {};
        //     if (!values.username) {
        //         errors.username = 'Username is required';
        //     }
        //     if (!values.password) {
        //         errors.password = 'Password is required';
        //     }
        //     return errors;
        // },
    });

    return (
        <>
            <div className="mx-auto grid min-h-screen place-items-center px-4 xl:w-[70%]">
                <div className="w-full max-w-[320px] rounded-lg bg-teal-200/20 px-4 py-8">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-3">
                            <label
                                htmlFor="username"
                                className="mb-1 block text-lg"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                placeholder="jhone"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500"
                            />
                            <div className="text-sm text-red-600">
                                {formik.errors.username &&
                                    formik.touched.username &&
                                    formik.errors.username}
                                {/* Invalide Username */}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="password"
                                className="mb-1 block text-lg"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={passwordToggled ? 'text' : 'password'}
                                    name="password"
                                    placeholder="********"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="block w-full rounded-md"
                                />
                                <div
                                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1 transition-all duration-150 hover:bg-slate-400/40"
                                    onClick={() =>
                                        setPasswordToggled(!passwordToggled)
                                    }
                                >
                                    {passwordToggled ? (
                                        <BsEyeSlash className="" />
                                    ) : (
                                        <BsEye className="" />
                                    )}
                                </div>
                            </div>
                            <div className="text-sm text-red-600">
                                {formik.errors.password &&
                                    formik.touched.password &&
                                    formik.errors.password}
                                {/* Invalide Password */}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="block w-full border-gray-300 shadow-sm focus:ring-blue-500"
                        >
                            sign in
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginPage;

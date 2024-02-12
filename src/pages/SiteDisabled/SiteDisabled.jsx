import React from 'react'
import { Helmet } from 'react-helmet-async'

const SiteDisabled = () => {
    return (
        <>
            <Helmet>
                <title>Site Temporarily Inactive</title>
            </Helmet>
            <main className="flex min-h-[100dvh] items-center justify-center">
                <section className="container flex flex-row flex-wrap-reverse items-center gap-8 p-4">
                    <div className="md:flex-1">
                        <h1 className="mb-2 pr-20 text-2xl font-semibold text-slate-800 md:text-[34px] lg:mb-5 lg:text-[48px]">
                            This Site Temporarily Inactive
                        </h1>
                        <p className="pr-10 text-gray-500 lg:pr-[320px] lg:text-lg">
                            Uh-oh! It seems like our site is currently inactive.
                            This may be due to a temporary disruption in
                            service. If you are experiencing issues or have
                            questions, please reach out to our support team to
                            get things sorted out. We appreciate your
                            understanding and look forward to welcoming you back
                            soon!
                        </p>
                    </div>
                    <div className="">
                        <img
                            src="/shop-helper-logo.png"
                            alt="Shop Helper"
                            loading="eager"
                            width={128}
                            className="grayscale lg:w-[256px]"
                        />
                    </div>
                </section>
            </main>
        </>
    )
}

export default SiteDisabled

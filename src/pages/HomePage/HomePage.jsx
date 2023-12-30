import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { FaCalculator } from 'react-icons/fa6'
import { StatCard } from '../../components'

const HomePage = () => {
    const { user, logOut } = useContext(AuthContext)

    const handleLogOut = async () => {
        await logOut()
    }

    const statCard = {
        id: 1,
        name: 'KOKO Calc Mode',
        value: 'Default',
        icon: FaCalculator,
    }

    return (
        <>
            <section className="container">
                <div className="mb-5 flex flex-row flex-wrap items-center">
                    <StatCard data={statCard} />
                </div>
                <div className="mb-5 flex flex-row flex-wrap items-center">
                    <div className="w-full rounded-lg bg-white p-4 shadow-md">
                        <h3 className="mb-4 text-xl font-bold text-indigo-600">
                            Recent Updates
                        </h3>
                        <hr />
                        <div className="flex flex-col gap-y-4 py-5">
                            <div className="rounded-md bg-white p-4 shadow-md">
                                <h5 className="mb-2 text-lg font-semibold text-slate-700">
                                    Test
                                </h5>
                                <p className="w-full md:w-[85%] lg:w-[80%] xl:w-[65%]">
                                    Lorem ipsum dolor, sit amet consectetur
                                    adipisicing elit. Exercitationem minima
                                    veritatis maxime laboriosam. Tenetur
                                    assumenda architecto est perferendis
                                    deleniti, veritatis ipsa rerum laboriosam
                                    magnam laudantium ratione aliquam culpa
                                    dicta quam!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomePage

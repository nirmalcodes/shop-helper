import React from 'react'

const StatCard = ({ data }) => {
    return (
        <>
            <div className="flex min-h-[100px] w-full max-w-[350px] items-center gap-x-3 rounded-lg border-l-4 border-[#021EA3] bg-white p-4 shadow-md">
                <div className="flex-1">
                    <h5 className="mb-1 text-sm font-bold text-[#021EA3]">
                        {data?.name}
                    </h5>
                    <p className="text-xl font-medium">{data?.value}</p>
                </div>
                {data?.icon && (
                    <div className="grid h-[62px] w-[62px] shrink-0 place-items-center p-1 text-4xl text-slate-500/50">
                        <data.icon />
                    </div>
                )}
            </div>
        </>
    )
}

export default StatCard

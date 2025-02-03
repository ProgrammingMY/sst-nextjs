import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-screen bg-slate-50">
            <div className="flex items-center justify-center py-12">
                <main className="mx-auto bg-white grid w-[320px] md:w-[400px] gap-6 border rounded-md p-6 shadow-md">
                    {children}
                </main>
            </div>
        </div>
    )
}

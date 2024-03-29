import { useRouter } from 'next/router';
import React from 'react'
import { Home } from 'lucide-react';

const Custom404Error = () => {
    const router = useRouter();
    return (
        <div className="py-10 bg-white dark:bg-black min-h-screen">
            <div className="text-center">
                <p className="text-9xl font-serif font-semibold text-black dark:text-white">404</p>
                <h1 className="mt-2 text-3xl font-serif font-bold tracking-tight text-black dark:text-white sm:text-4xl">
                    Page not found
                </h1>
                <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for.
                </p>
                <div className="mt-8 flex items-center justify-center gap-x-3">
                    <button
                        type="button"
                        onClick={() => { router.push('/') }}
                        className="inline-flex items-center rounded-md border border-black dark:border-white px-3 py-2 text-sm font-semibold text-black dark:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <Home size={16} className="mr-2" />
                        Back to home
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Custom404Error;
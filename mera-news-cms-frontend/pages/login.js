import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import ANC_Full from "@/img/MNC_Logo.png";
import Image from 'next/image';
import { Lock } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem('AlinaNewsCMSToken')) {
            router.push('/');
        }
    }, [])



    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { email, password };
        let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        let result = await res.json();

        if (result.success) {
            localStorage.setItem('AlinaNewsCMSToken', result.token);
            toast.success("You\'re Logged In Successfully")
            setTimeout(() => {
                router.push('/');
            }, 1500)
        }
        else {
            toast.error((result.message).toString())
            setEmail('');
            setPassword('');
        }
    }

    return (
        <div>
            <Image src={ANC_Full} width={100} height={100} alt='Alina News CMS' className='mx-auto mt-10 rounded-full' />
            <h2 className="mt-6 text-center text-3xl tracking-tight text-white">Sign in to your account</h2>
            <p className="mt-2 text-center text-sm text-gray-400">
                Or
                <Link href={'/register'} className="font-medium text-blue-700 hover:text-blue-600"> Create Account</Link>
            </p>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <input value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="user@example.com" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <input value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <Link className='block text-blue-700 hover:text-blue-600 text-sm font-medium -mt-4 mb-5 text-right px-4' href={'/forgotPassword'}>Forgot Password?</Link>
                <button type="submit" className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-800 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><Lock size={16} /> Sign In </button>
            </form>
        </div>
    )
}

export default Login;
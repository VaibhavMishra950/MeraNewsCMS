import React, { useEffect, useState } from 'react'
import ANC_Full from "@/img/MNC_Logo2.png";
import Link from 'next/link';
import Image from 'next/image';
import { Check, ChevronRight, LoaderCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const ForgotPassword = () => {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("unsent");
    const [isEmailDisabled, setIsEmailDisabled] = useState(false);
    const [OTP, setOTP] = useState("");
    const [newPass, setNewPass] = useState("");

    useEffect(() => {
        if (localStorage.getItem('MeraNewsCMSToken')) {
            router.push('/');
        }
    }, [])


    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (email != "" && status == "unsent") {
            setStatus("sending")
            let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/otp/sendOTP`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            let result = await res.json();
            if (result.success) {
                setStatus("sent");
                setIsEmailDisabled(true);
                toast.success("OTP sent successfully.")
                setTimeout(() => {
                    setStatus("verifyOTP")
                }, 500);
            } else {
                setEmail("");
                setStatus("unsent");
                toast.error(result.message)
            }
        }
    }

    const handleSubmitOTP = async (e) => {
        e.preventDefault();
        if (OTP.length == 6 && newPass != "") {
            let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/otp/verifyOTP`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, OTP, newPass })
            });
            let result = await res.json();
            if (result.success) {
                toast.success("Password updated successfully.");
                router.push('/login');
            } else {
                toast.error(result.message)
            }
        }
    }
    return (
        <div className='bg-gray-100 dark:bg-gray-950 py-10 min-h-screen'>
            <Image src={ANC_Full} width={100} height={100} alt='Mera News CMS' className='mx-auto' />
            <h2 className="mt-6 text-center text-3xl tracking-tight text-black dark:text-white">Forgot your password?</h2>
            <p className="mt-2 text-center text-sm text-gray-400">
                Or
                <Link href={'/login'} className="font-medium text-blue-700 hover:text-blue-600"> Sign in</Link>
            </p>
            <form className="max-w-sm mx-auto my-10">
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <input
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        disabled={isEmailDisabled}
                        type="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="user@example.com"
                        required
                    />
                </div>
                {status == "verifyOTP" && <div>
                    <div className="mb-5">
                        <label htmlFor="OTP" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter OTP</label>
                        <input
                            value={OTP}
                            onChange={(e) => { setOTP(e.target.value) }}
                            type="text"
                            maxLength={6}
                            id="OTP"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="000000"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="newPass" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter new password</label>
                        <input
                            value={newPass}
                            onChange={(e) => { setNewPass(e.target.value) }}
                            type="password"
                            id="newPass"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
                    </div>
                </div>}
                <button
                    onClick={status == "verifyOTP" ? handleSubmitOTP : handleSendOTP}
                    type="submit"
                    className="text-white disabled:bg-blue-500 bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-800 dark:disabled:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    disabled={!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))}
                >
                    {status == "unsent" ? <span className='flex items-center'>Send OTP <ChevronRight size={20} /></span> : (status == "sending" ? <LoaderCircle size={20} className='animate-spin' /> : (status == "sent" ? <Check size={20} /> : (status == "verifyOTP" ? "Update Password" : "")))}
                </button>
            </form>
        </div>
    )
}

export default ForgotPassword;
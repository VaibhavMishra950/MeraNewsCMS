"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import ANC_Full from "@/img/ALINA.png";
import { CircleCheck, CircleX } from 'lucide-react';


const Login = () => {
    useEffect(() => {
        if (localStorage.getItem('AlinaNewsCMSToken')) {
            router.push('/');
            return;
        }
        fetch("https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json")
            .then(res => res.json())
            .then(data => setCountries(data));
        setCurCountry("IN")
        // let API_KEY = "at_1zGdVIyB8LpVAmWasyiGB0w1C2K8y";
        // fetch(`https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}`)
        //     .then(res => res.json())
        //     .then(data => setCurCountry(data.location.country))
    }, [])

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [countries, setCountries] = useState([]);
    const [curCountry, setCurCountry] = useState(undefined);
    const [userAvail, setUserAvail] = useState(null);

    const router = useRouter();



    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { firstName, lastName, username, mobile: `${countries.find(x => x.code == curCountry).dial_code}${mobile}`, email, password };
        if (userAvail.available) {
            let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            let result = await res.json();
            setFirstName('');
            setLastName('');
            setUsername('');
            setMobile('');
            setEmail('');
            setPassword('');
            setUserAvail(null);

            if (result.success) {
                toast.success("Account Created. Sign In Now")
                setTimeout(() => {
                    router.push('/login');
                }, 1500)
            }
            else {
                toast.error("Some Error Occoured!")

            }
        } else {
            toast.error("This username is unavailable!");
        }
    }

    const checkUsername = async (e) => {
        e.preventDefault();
        if (username.length > 0) {
            let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/isUsernameAvailable?uname=${username}`);
            let data = await res.json();
            setUserAvail(data)
        } else {
            setUserAvail(null);
        }
    }

    return (
        <div className='mb-5'>
            <Image src={ANC_Full} width={100} height={100} alt='Alina News CMS' className='mx-auto mt-10 rounded-full' />
            <h2 className="mt-6 text-center text-3xl tracking-tight text-white">Create your account</h2>
            <p className="mt-2 text-center text-sm text-gray-400">
                Or
                <Link href={'/login'} className="font-medium text-blue-700 hover:text-blue-600"> Sign In</Link>
            </p>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
                <div className="mb-5">
                    <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                    <input value={firstName} onChange={(e) => { setFirstName(e.target.value) }} name='firstname' type="text" id="firstname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                    <input value={lastName} onChange={(e) => { setLastName(e.target.value) }} name='lastname' type="text" id="lastname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input value={username} onBlur={checkUsername} onChange={(e) => { setUsername(e.target.value) }} name='username' type="text" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    {userAvail && (userAvail.available ? <label className="mb-2 ml-1 mt-1 text-sm font-medium text-green-400 flex items-center gap-1"><CircleCheck size={16} /> Available</label> : <label className="mb-2 mt-1 ml-1 text-sm font-medium text-red-400 flex items-center gap-1"><CircleX size={16} /> Unavailable</label>)}
                </div>
                <div className="mb-5">
                    <label htmlFor="mobile" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mobile Number</label>
                    <div className='flex rounded-lg overflow-hidden outline-none'>
                        <select name="country" id="country" value={curCountry} onChange={(e) => { setCurCountry(e.target.value); }} className='bg-gray-800'>
                            {countries.map(country => {
                                return <option key={country.code} value={country.code}>{country.code} ({country.dial_code})</option>
                            })}
                        </select>
                        <input value={mobile} onChange={(e) => { setMobile(e.target.value) }} name='mobile' type="text" id="mobile" maxLength={10} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                </div>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <input value={email} onChange={(e) => { setEmail(e.target.value) }} name='email' type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="user@example.com" required />
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <input value={password} onChange={(e) => { setPassword(e.target.value) }} name='password' type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-800 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign Up</button>
            </form>
        </div>
    )
}

export default Login;
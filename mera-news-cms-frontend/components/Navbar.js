'use client'

import Image from 'next/image';
import React from 'react';
import Logo from '@/img/MNC_Header.png';
import Link from 'next/link';
import { MoonStar, Shield, Sun, UserRound } from 'lucide-react';
import { useTheme } from 'next-themes';
import LightLogo from '@/img/MNCHeaderLight.png'

const Navbar = ({ user = { value: null }, logout = () => { } }) => {
    let { theme, setTheme } = useTheme();
    return (
        <nav className='flex p-2 bg-gray-200 dark:bg-gray-900'>
            <div className="ml-2 sm:ml-6 flex items-center">
                <Link href={"/"} className='flex items-center gap-2'>
                    <Image src={theme === "dark" ? Logo : LightLogo} alt='Alina News CMS Logo' height={60} width={190} draggable={false} ></Image>
                </Link>
            </div>
            <div className='text-black ml-auto my-auto mr-2 sm:mr-12 flex items-center'>
                {user.value && <p className='mx-3 text-gray-900 dark:text-white'>Hello, {user.firstname}</p>}
                {!user.value && <div className='flex gap-4'>
                    <Link href={'/login'} className='bg-blue-700 text-white py-2 px-5 rounded-full hover:bg-blue-600'>
                        Login
                    </Link>
                    <Link href={'/register'} className='bg-blue-700/10 text-blue-600 py-2 px-5 rounded-full hover:bg-blue-700/20'>
                        Register
                    </Link>
                </div>}
                {user.value && <button onClick={logout} className='bg-blue-700/10 text-blue-600 py-2 px-5 rounded-full hover:bg-blue-700/20'>
                    Logout
                </button>}

                {(user.value && user.roleId < 2) && <Link href={'/admin'} title='Admin Panel' className='mx-2 p-3 rounded-full text-blue-600 bg-blue-700/10 hover:bg-blue-700/20'>
                    <Shield size={20} />
                </Link>}

                {(user.value && user.roleId == 2) && <Link href={'/myaccount'} title='My Account' className='mx-2 p-3 rounded-full text-blue-600 bg-blue-700/10 hover:bg-blue-700/20'>
                    <UserRound size={20} />
                </Link>}
                <button
                    className={`ml-3 transition-all`}
                    onClick={() => { console.log(theme === 'dark' ? setTheme('light') : setTheme('dark')); }}
                >
                    {theme === "dark" ?
                        <Sun className='text-amber-600' />
                        :
                        <MoonStar className='text-sky-700' />}
                </button>
            </div>
        </nav>
    )
}

export default Navbar;
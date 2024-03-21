import React, { useState } from 'react'
import { Home, Users, Newspaper, SquarePen } from 'lucide-react';
import sample_user from "@/img/sample_user.jpg";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function AdminSidebar({ user }) {
    const [userProfile, setUserProfile] = useState(sample_user);
    const router = useRouter();

    return (
        <aside className="flex h-[calc(100vh-76px)] w-16 flex-col items-center overflow-y-auto bg-gray-950 py-8 mx-0">
            <nav className="flex flex-1 flex-col items-center space-y-3">
                <Link
                    href="/admin"
                    title='Dashboard'
                    className={`rounded-lg p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${router.asPath == "/admin" ? 'bg-blue-900 text-white' : 'hover:bg-gray-900'}`}
                >
                    <Home size={24} />
                </Link>

                <Link
                    href="/admin/write"
                    title='Write News'
                    className={`rounded-lg p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${router.asPath == "/admin/write" ? 'bg-blue-900 text-white' : 'hover:bg-gray-900'}`}
                >
                    <SquarePen size={24} />
                </Link>

                <Link
                    href="/admin/news"
                    title='Manage News'
                    className={`rounded-lg p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${router.asPath == "/admin/news" ? 'bg-blue-900 text-white' : 'hover:bg-gray-900'}`}
                >
                    <Newspaper size={24} />
                </Link>

                {user?.roleId == 0 && <Link
                    href="/admin/users"
                    title='Manage Editors'
                    className={`rounded-lg p-2 text-gray-400 transition-colors duration-200 focus:outline-none ${router.asPath == "/admin/users" ? 'bg-blue-900 text-white' : 'hover:bg-gray-900'}`}
                >
                    <Users size={24} />
                </Link>}
            </nav>

            <div className="flex flex-col items-center space-y-6">
                <Link href="/myaccount">
                    <Image
                        className="h-8 w-8 rounded-full object-cover"
                        src={userProfile}
                        alt="User avatar"
                    />
                </Link>
            </div>
        </aside>
    )
}

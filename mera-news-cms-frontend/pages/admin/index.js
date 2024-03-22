import React, { useEffect, useState } from 'react'
import AdminApp from '@/pages/admin/adminContainer';
import { Eye, Newspaper, PencilLine, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const AdminPanelComponent = ({ user }) => {
    const [pageData, setPageData] = useState({});
    const router = useRouter();

    const getDataForAdminDashboard = async () => {
        let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/admin/getDataForAdminDashboard`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: user.value })
        });
        let result = await res.json();
        if (result.success) {
            setPageData(result.data);
        } else{
            toast.error(result.message);
        }
    }
    useEffect(() => {
        getDataForAdminDashboard();
    }, []);

    return <div className='p-5 bg-gray-950/80 min-h-[calc(100vh-76px)] font-display'>
        <h1 className='text-4xl text-center'>Admin Panel</h1>
        <div className='mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6'>

            <div className='w-[310px] mx-auto h-[190px] bg-blue-950/50 shadow-xl hover:shadow-black hover:-mt-1 hover:bg-blue-950/40 transition-all duration-200 rounded-xl items-center cursor-pointer overflow-hidden'>
                <div className='flex items-center justify-center p-2 gap-2 bg-blue-950'>
                    <Eye />
                    <span>Views</span>
                </div>
                <span className='text-5xl h-[150px] flex justify-center items-center'>{pageData?.totalViews}</span>
            </div>
            <div className='w-[310px] mx-auto h-[190px] bg-blue-950/50 shadow-xl hover:shadow-black hover:-mt-1 hover:bg-blue-950/40 transition-all duration-200 rounded-xl items-center cursor-pointer overflow-hidden'>
                <div className='flex items-center justify-center p-2 gap-2 bg-blue-950'>
                    <Users />
                    <span>Users</span>
                </div>
                <span className='text-5xl h-[150px] flex justify-center items-center'>{pageData?.userCount}</span>
            </div>
            <div onClick={()=>{router.push('/admin/users')}} className='w-[310px] mx-auto h-[190px] bg-blue-950/50 shadow-xl hover:shadow-black hover:-mt-1 hover:bg-blue-950/40 transition-all duration-200 rounded-xl items-center cursor-pointer overflow-hidden'>
                <div className='flex items-center justify-center p-2 gap-2 bg-blue-950'>
                    <PencilLine />
                    <span>Editors</span>
                </div>
                <span className='text-5xl h-[150px] flex justify-center items-center'>{pageData?.editorCount}</span>
            </div>
            <div onClick={()=>{router.push('/admin/news')}} className='w-[310px] mx-auto h-[190px] bg-blue-950/50 shadow-xl hover:shadow-black hover:-mt-1 hover:bg-blue-950/40 transition-all duration-200 rounded-xl items-center cursor-pointer overflow-hidden'>
                <div className='flex items-center justify-center p-2 gap-2 bg-blue-950'>
                    <Newspaper />
                    <span>News Articles</span>
                </div>
                <span className='text-5xl h-[150px] flex justify-center items-center'>{pageData?.newsCount}</span>
            </div>
        </div>
    </div>
}

const AdminPanel = ({ user }) => <AdminApp Component={AdminPanelComponent} user={user} pageProps={{ user }} />

export default AdminPanel;
import { AdminSidebar } from "@/components/AdminSidebar";
import { useEffect, useState } from "react";
import Custom404Error from "@/pages/404";

export default function AdminApp({ Component, pageProps, user }) {
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        if (user?.roleId < 2) {
            setAllowed(prev => true);
        } else {
            setAllowed(prev => false);
        }
        return () => {
        }
    }, [user.value])

    return <>
        {!allowed && <Custom404Error />}
        {allowed && <div className='flex'>
            <AdminSidebar user={user} />
            <div className='w-[calc(100vw-64px)] h-[calc(100vh-76px)] overflow-y-scroll bg-gray-50 dark:bg-gray-950/50'>
                <Component {...pageProps} />
            </div>
        </div>}
    </>;
}

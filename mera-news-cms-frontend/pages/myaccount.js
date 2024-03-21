import { MoveLeft, SwitchCamera } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import sample_user from "@/img/sample_user.jpg";
import toast from 'react-hot-toast';

const MyAccount = ({ user }) => {
    const router = useRouter();

    const [editFirstname, setEditFirstname] = useState("");
    const [editLastname, setEditLastname] = useState("");
    const [userInfo, setUserInfo] = useState({});

    const getAndSetUserDetails = async () => {
        let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/getUserAccountDetails`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: user.value })
        });
        let result = await res.json();
        if (result.success) {
            setUserInfo(result.data);
            console.log(result.data);
            setEditFirstname(result.data.firstname);
            setEditLastname(result.data.lastname);
        } else {
            toast.error(result.message);
            router.back();
        }
    }

    useEffect(() => {
        if (!(localStorage.getItem('AlinaNewsCMSToken'))) {
            router.push('/');
            return;
        }
        getAndSetUserDetails();
    }, [user.value]);

    const handleSaveDetailsButtonClick = async () => {
        let data = { token: user.value, editUsername: userInfo.username, editFirstname, editLastname }
        let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/updateUser`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let result = await res.json();
        if (result.success) {
            toast.success("Details saved successfully.");
            getAndSetUserDetails();
        } else {
            toast.error(result.message);
        }
    }
    const handleResetButtonClick = () => {
        setEditFirstname(userInfo.firstname);
        setEditLastname(userInfo.lastname);
    }

    const handlePicChange = async (e) => {
        e.preventDefault();
        if (e.target.files.length > 0) {
            let file = e.target.files[0];
            if (!(/^image\/.*/.test(file.type))) {
                toast.error("Only Images are allowed!");
                return;
            }
            let data = new FormData();
            data.append('token', user.value);
            data.append('userProfilePic', file);
            let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/changeProfilePicture`, {
                method: "POST",
                body: data
            });
            let result = await res.json();
            console.log(result);
            if (result.success) {
                toast.success("Profile Picture Changed Successfully.");
                getAndSetUserDetails();
            }
            else {
                toast.error(result.message);
            }
        }
    }

    return (<div className='bg-gray-950 min-h-[calc(100vh-76px)]'>
        <div className='py-5 px-14'>
            <button
                onClick={router.back}
                className='flex w-fit px-3 rounded-full text-blue-600 bg-blue-600/10 hover:bg-blue-600/20'
            >
                <MoveLeft size={36} strokeWidth={1} />
            </button>
            <h1 className='text-center text-3xl font-display'>My Account</h1>
            <div className="flex items-center justify-evenly font-display my-5">
                <div>
                    <div>
                        <p className='text-xl my-1'>
                            Email: <span className='text-gray-400'>{userInfo?.email}</span>
                        </p>
                        <p className='text-xl my-1'>
                            Username: <span className='text-gray-400'>@{userInfo?.username}</span>
                        </p>
                        <p className='text-xl my-1'>
                            Mobile: <span className='text-gray-400'> {userInfo?.mobile}</span>
                        </p>
                    </div>
                    <div className='mt-10'>
                        <div className="mb-5">
                            <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                            <input value={editFirstname} onChange={(e) => { setEditFirstname(e.target.value) }} name='firstname' type="text" id="firstname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                            <input value={editLastname} onChange={(e) => { setEditLastname(e.target.value) }} name='lastname' type="text" id="lastname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <button onClick={handleSaveDetailsButtonClick} className="text-white mr-3 bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-950">Save Details</button>
                        <button onClick={handleResetButtonClick} className="text-blue-600  focus:ring-2 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600/10 dark:hover:bg-blue-600/20 dark:focus:ring-blue-950">Reset</button>
                    </div>

                </div>
                <div>
                    <img
                        src={userInfo.image ? `${process.env.NEXT_PUBLIC_SERVER_HOST}/userProfiles/${userInfo.image}` : sample_user.src}
                        className='w-60 rounded-full'
                    />
                    <label
                        htmlFor='picInput'
                        onDrag={(e) => {e.preventDefault()}}
                        className='flex gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-lg w-fit px-3 py-2 mx-auto mt-10'
                    >
                        <SwitchCamera /> Change
                    </label>
                    <input onChange={handlePicChange} type="file" id="picInput" className='hidden' accept='image/*' />
                </div>
            </div>
        </div>
    </div>)
}

export default MyAccount;
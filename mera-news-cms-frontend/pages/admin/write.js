import AdminApp from '@/pages/admin/adminContainer';
import 'quill/dist/quill.snow.css'
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { CircleCheck, CircleX, Clock3 } from 'lucide-react';
import dynamic from 'next/dynamic';

const AdminWriteNewsComponent = ({ user }) => {
    const router = useRouter();
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }, { 'font': [] }],
            [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    }
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysList = []

    // Form States
    const [newsTitle, setNewsTitle] = useState("");
    const [newsSlug, setNewsSlug] = useState("");
    const [newsDesc, setNewsDesc] = useState("");
    const [newsCoverImg, setNewsCoverImg] = useState(null);
    const [newsContent, setNewsContent] = useState("");
    const [newsAuthor, setNewsAuthor] = useState(`${user.firstname} ${user.lastname}`);
    const [newsCategory, setNewsCategory] = useState("general");
    const [slugAvail, setSlugAvail] = useState(null);

    // Scheduling states
    const curYear = new Date().getFullYear();
    const [showScheduleBox, setShowScheduleBox] = useState(true);
    const [scheduleDate, setScheduleDate] = useState(new Date().getDate());
    const [scheduleMonth, setScheduleMonth] = useState(new Date().getMonth());
    const [scheduleHour, setScheduleHour] = useState(new Date().getHours());
    const [scheduleMinute, setScheduleMinute] = useState(new Date().getMinutes());



    const handleScheduleDivClick = (e) => {
        setShowScheduleBox(e.target != e.currentTarget);
    }

    const handleNewsPublishBtnClick = async (e) => {
        e.preventDefault();
        if (newsTitle != "" && newsSlug != "" && newsDesc != "" && newsCoverImg != null && newsContent != "") {
            let data = new FormData();
            data.append('token', user.value);
            data.append('newsTitle', newsTitle);
            data.append('newsSlug', newsSlug);
            data.append('newsDesc', newsDesc);
            data.append('newsCoverImg', newsCoverImg);
            data.append('newsContent', newsContent);
            data.append('newsAuthor', newsAuthor);
            data.append('newsCategory', newsCategory);
            data.append('scheduling', false);

            if (slugAvail?.available) {
                let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news/publishNews`, {
                    method: "POST",
                    body: data
                });
                let result = await res.json();
                console.log(result);
                if (result.success) {
                    toast.success("News Published Successfuly.")
                    setTimeout(() => {
                        router.push('/admin/news');
                    }, 1000);
                } else {
                    toast.error(result.message);
                    return;
                }
            } else {
                toast.error("The slug must be unique!");
                return;
            }
        } else {
            toast.error("Please fill out all the information!");
            return;
        }
    }

    const checkSlugAvailability = async (e) => {
        e.preventDefault();
        if (newsSlug.length > 0) {
            let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news/isSlugAvailable?slg=${newsSlug}`);
            let data = await res.json();
            setSlugAvail(data)
        } else {
            setSlugAvail(null);
        }
    }

    const handleShowScheduler = (e) => {
        if (newsTitle != "" && newsSlug != "" && newsDesc != "" && newsCoverImg != null && newsContent != "") {
            setShowScheduleBox(true);
        } else {
            toast.error("Please fill out all the fields to schedule the news.");
        }
    }

    const handleNewsScheduleBtnClick = async (e) => {
        e.preventDefault();
        if (newsTitle != "" && newsSlug != "" && newsDesc != "" && newsCoverImg != null && newsContent != "") {
            let data = new FormData();
            data.append('token', user.value);
            data.append('newsTitle', newsTitle);
            data.append('newsSlug', newsSlug);
            data.append('newsDesc', newsDesc);
            data.append('newsCoverImg', newsCoverImg);
            data.append('newsContent', newsContent);
            data.append('newsAuthor', newsAuthor);
            data.append('newsCategory', newsCategory);
            data.append('scheduling', true);
            data.append('scheduledAt', new Date(new Date().getFullYear(), scheduleMonth, scheduleDate, scheduleHour, scheduleMinute));
            console.log(new Date(new Date().getFullYear(), scheduleMonth, scheduleDate, scheduleHour, scheduleMinute));

            if (slugAvail?.available) {
                let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news/publishNews`, {
                    method: "POST",
                    body: data
                });
                let result = await res.json();
                console.log(result);
                if (result.success) {
                    toast.success("News Scheduled Successfuly.")
                    setTimeout(() => {
                        router.push('/admin/news');
                    }, 1000);
                } else {
                    toast.error(result.message);
                    return;
                }
            } else {
                toast.error("The slug must be unique!");
                return;
            }
        } else {
            toast.error("Please fill out all the information!");
            return;
        }
    }

    return <>
        {/* Modal for Scheduling the news */}
        {showScheduleBox && <div onClick={handleScheduleDivClick} className='fixed top-0 left-0 z-50 flex items-center justify-center bg-gray-900/25 backdrop-blur-sm w-screen h-screen'>
            <div className='bg-gray-50 dark:bg-gray-950 border border-gray-400 dark:border-gray-700 rounded-2xl p-3 w-[440px] h-[calc(100vh-20%)]'>
                <p className="text-black dark:text-white text-xl text-center"> Schedule this news </p>
                <form onSubmit={handleNewsScheduleBtnClick} className="max-w-sm mx-auto mt-10">
                    <div className="flex gap-3">
                        <div className="mb-5 w-1/2">
                            <label htmlFor="scheduleMonth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Month</label>
                            <select value={scheduleMonth} onChange={(e) => { setScheduleMonth(e.target.value) }} name='scheduleMonth' id="scheduleMonth" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required >
                                {monthList.map((monthName, index) => {
                                    return <option key={monthName} value={index} >{monthName}</option>
                                })}
                            </select>
                        </div>
                        <div className="mb-5 w-1/2">
                            <label htmlFor="scheduleDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                            <input value={scheduleDate} onChange={(e) => { setScheduleDate(e.target.value) }} min={1} name='scheduleDate' type="number" id="scheduleDate" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="mb-5 w-1/2">
                            <label htmlFor="scheduleHour" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hours</label>
                            <input value={scheduleHour} onChange={(e) => { setScheduleHour(e.target.value) }} min={0} max={23} name='scheduleHour' type="number" id="scheduleHour" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div className="mb-5 w-1/2">
                            <label htmlFor="scheduleMinute" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Minutes</label>
                            <input value={scheduleMinute} onChange={(e) => { setScheduleMinute(e.target.value) }} min={0} max={59} name='scheduleMinute' type="number" id="scheduleMinute" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-800 dark:hover:bg-blue-800/90 dark:focus:ring-blue-800 flex items-center gap-1"><Clock3 size={18} /> Schedule News</button>
                </form>
            </div>
        </div>}

        {/* Main Div */}
        <div className='p-5 bg-gray-50 dark:bg-gray-950/50'>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl text-center font-semibold text-black dark:text-white">Write News</h2>
                <div className='flex gap-2'>
                    <button
                        type="button"
                        className="mt-5 rounded-md bg-blue-800 px-3 py-2 text-white shadow-sm hover:bg-blue-800/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        onClick={handleNewsPublishBtnClick}
                    >
                        Publish
                    </button>

                    <button
                        type="button"
                        className="mt-5 rounded-md bg-blue-700/20 px-3 py-2 text-blue-700 shadow-sm hover:bg-blue-700/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        onClick={handleShowScheduler}
                    >
                        Schedule
                    </button>
                </div>
            </div>
            <div className="mt-6 gap-6 space-y-4 md:grid md:grid-cols-2 md:space-y-0 max-w-4xl mx-auto">
                <div className="col-span-2 grid">
                    <div className="flex gap-3">
                        <div className="w-full my-2">
                            <label
                                className="text-sm text-black dark:text-white mb-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="email"
                            >
                                News Title
                            </label>
                            <input
                                className="flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 text-black dark:text-white border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-offset-blue-500"
                                type="text"
                                placeholder="Enter news title"
                                id="email"
                                maxLength={255}
                                value={newsTitle}
                                onChange={(e) => { setNewsTitle(e.target.value) }}
                            ></input>
                        </div>
                        <div className="w-full my-2">
                            <label
                                className="text-sm text-black dark:text-white mb-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="email"
                            >
                                News Slug (Unique)
                            </label>
                            <input
                                className="flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 border border-gray-300 dark:border-gray-600 text-black dark:text-white dark:bg-gray-700 focus:ring-offset-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                type="text"
                                placeholder="Enter news slug"
                                id="email"
                                maxLength={255}
                                onBlur={checkSlugAvailability}
                                value={newsSlug}
                                onChange={(e) => { setNewsSlug(e.target.value) }}
                            ></input>
                            {slugAvail && (slugAvail.available ? <label className="mb-2 ml-1 mt-1 text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1"><CircleCheck size={16} /> Available</label> : <label className="mb-2 mt-1 ml-1 text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1"><CircleX size={16} /> Unavailable</label>)}
                        </div>
                    </div>
                    <div className="w-full my-2">
                        <label
                            className="text-sm text-black dark:text-white mb-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="email"
                        >
                            Description
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 border border-gray-300 dark:border-gray-600 text-black dark:text-white dark:bg-gray-700 focus:ring-offset-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            type="text"
                            placeholder="Enter description"
                            id="email"
                            maxLength={255}
                            value={newsDesc}
                            onChange={(e) => { setNewsDesc(e.target.value) }}
                        ></input>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <div className="w-full my-2">
                            <label
                                className="text-sm text-black dark:text-white mb-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="category"
                            >
                                Category
                            </label>
                            <select
                                id="category"
                                className="text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-600 dark:placeholder-gray-400 text-black dark:text-white focus:ring-1 focus:ring-blue-500"
                                value={newsCategory}
                                onChange={(e) => { setNewsCategory(e.target.value) }}
                            >
                                <option value="general">General</option>
                                <option value="business">Business</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="health">Health</option>
                                <option value="science">Science</option>
                                <option value="sports">Sports</option>
                                <option value="technology">Technology</option>
                                <option value="politics">Politics</option>
                            </select>
                        </div>
                        <div className="w-full my-2">
                            <label
                                className="block text-black dark:text-white mb-1 text-sm font-medium"
                                htmlFor="file_input"
                            >
                                Cover image
                            </label>
                            <input
                                className="block w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg cursor-pointer text-gray-500 focus:outline-none placeholder-gray-600 dark:placeholder-gray-400"
                                id="file_input"
                                type="file"
                                accept='image/*'
                                onChange={(e) => {
                                    if (e.target.files.length == 1) setNewsCoverImg(e.target.files[0])
                                }}
                            />

                        </div>
                    </div>
                    <div className='text-black dark:text-white flex flex-col h-96 max-h-96 max-w-4xl my-10' >
                        <p className="text-lg my-2">News Content</p>
                        <ReactQuill className='h-72' modules={quillModules} value={newsContent} onChange={(value) => { setNewsContent(value) }} />
                    </div>
                </div>
            </div>
        </div>
    </>
}

const Write = ({ user }) => <AdminApp user={user} Component={AdminWriteNewsComponent} pageProps={{ user }} />
export default Write;
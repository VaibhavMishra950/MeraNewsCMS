import React, { useEffect, useMemo, useState } from 'react'
import AdminApp from '@/pages/admin/adminContainer';
import { Check, CircleCheck, CircleX, Eye, MoveUpRight, PencilLine, Save, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import "quill/dist/quill.snow.css";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const AdminNewsComponent = ({ user }) => {
    const router = useRouter();

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, false] }, { 'font': [] }],
            [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    }


    const [allNews, setAllNews] = useState([]);
    const [currentNews, setCurrentNews] = useState([]);

    // News Editing States
    const [showEditNewsBox, setShowEditNewsBox] = useState(false);
    const [newsEditTitle, setNewsEditTitle] = useState("");
    const [newsEditId, setNewsEditId] = useState(null);
    const [newsEditSlug, setNewsEditSlug] = useState("");
    const [newsEditDesc, setNewsEditDesc] = useState("");
    const [newsEditContent, setNewsEditContent] = useState("");
    const [newsEditCategory, setNewsEditCategory] = useState("");
    const [newsEditLive, setNewsEditLive] = useState(true);
    const [editSlugAvail, setEditSlugAvail] = useState({ available: true });

    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

    const getAndSetNews = async () => {
        let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news/getNewsListAdmin`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: user.value })
        });
        let result = await res.json();
        if (result.success) {
            setAllNews(result.data);
            setCurrentNews(result.data);
        } else {
            toast.error(result.message);
        }
    }

    useEffect(() => {
        getAndSetNews();
    }, [])

    const handleNewsSearchInputChange = (e) => {
        let val = e.target.value;
        if (val.trim().toLowerCase().length > 0) {
            setCurrentNews(allNews.filter(news => {
                return (news.title.toLowerCase().includes(val.trim().toLowerCase()) || news.description.toLowerCase().includes(val.trim().toLowerCase()));
            }))
        } else {
            setCurrentNews(allNews)
        }
    }

    const checkSlugAvailability = async (e) => {
        e.preventDefault();
        if (newsEditSlug.length > 0) {
            let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news/isSlugAvailable?slg=${newsEditSlug}`);
            let data = await res.json();
            setEditSlugAvail(data)
        } else {
            setEditSlugAvail(null);
        }
    }

    const handleEditNewsDivClick = (e) => {
        setShowEditNewsBox(e.target != e.currentTarget)
    }
    const handleEditNewsButtonClick = (news) => {
        setShowEditNewsBox(true);
        setNewsEditId(news.id);
        setNewsEditTitle(news.title);
        setNewsEditDesc(news.description);
        setNewsEditSlug(news.slug);
        setNewsEditCategory(news.category);
        setNewsEditLive(news.live);
        setNewsEditContent(news.content);
    }
    const handleEditNewsSaveClick = async (e) => {
        e.preventDefault();
        let data = { token: user.value, newsEditId, newsEditTitle, newsEditDesc, newsEditSlug, newsEditContent, newsEditCategory, newsEditLive };
        if (newsEditTitle != "" && newsEditDesc != "" && newsEditSlug != "" && newsEditContent != "") {
            if (editSlugAvail?.available) {
                let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news/updateNews`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                let result = await res.json();
                console.log(result);
                if (result.success) {
                    toast.success("News Updated Successfully.");
                    getAndSetNews();
                    setShowEditNewsBox(false);
                } else {
                    toast.error(result.message);
                }
            }
        } else {
            toast.error("All fields are required!");
        }
    }

    const handleDeleteNewsButtonClick = async (id) => {
        if (confirm("Do you really want to delete that news?")) {
            let data = { token: user.value, id };
            let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news/deleteNews`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            let result = await res.json();
            if (result.success) {
                toast.success("News Deleted Successfully.");
                getAndSetNews();
            } else {
                toast.error(result.message);
            }
        }
    }


    return (<>
        {/* Modal for editing the news */}
        {showEditNewsBox && <div onClick={handleEditNewsDivClick} className='fixed top-0 left-0 flex items-center justify-center bg-gray-900/25 backdrop-blur-sm w-screen h-screen'>
            <div className='bg-gray-50 dark:bg-gray-950 border border-gray-400 dark:border-gray-700 rounded-2xl p-5 px-7 pb-16 h-[calc(100vh-20%)] overflow-y-scroll'>
                <div className="flex items-center justify-between">
                    <p className="text-black dark:text-white text-xl text-center"> Edit News </p>
                    <button
                        type="button"
                        className="my-5 flex items-center gap-2 rounded-md bg-blue-800 px-3 py-2 text-white shadow-sm hover:bg-blue-800/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        onClick={handleEditNewsSaveClick}
                    >
                        <Save size={20} /> Save News
                    </button>
                </div>
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
                                className="flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400 dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-offset-1 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-offset-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                type="text"
                                placeholder="Enter news title"
                                id="email"
                                maxLength={255}
                                value={newsEditTitle}
                                onChange={(e) => { setNewsEditTitle(e.target.value) }}
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
                                className="flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 bg-gray-300 text-black dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-offset-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                type="text"
                                placeholder="Enter news slug"
                                id="email"
                                maxLength={255}
                                value={newsEditSlug}
                                onChange={(e) => { setNewsEditSlug(e.target.value) }}
                                onBlur={checkSlugAvailability}
                            ></input>
                            {editSlugAvail && (editSlugAvail.available ? <label className="mb-2 ml-1 mt-1 text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1"><CircleCheck size={16} /> Available</label> : <label className="mb-2 mt-1 ml-1 text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1"><CircleX size={16} /> Unavailable</label>)}
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
                            className="flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 text-black dark:text-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-offset-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                            type="text"
                            placeholder="Enter description"
                            id="email"
                            maxLength={255}
                            value={newsEditDesc}
                            onChange={(e) => { setNewsEditDesc(e.target.value) }}
                        ></input>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <div className="w-1/2 my-2">
                            <label
                                className="text-sm text-black dark:text-white mb-1 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="category"
                            >
                                Category
                            </label>
                            <select
                                id="category"
                                className="text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 bg-transparent dark:bg-gray-700 text-black placeholder-gray-600 dark:placeholder-gray-600 dark:text-white border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-blue-500"
                                value={newsEditCategory}
                                onChange={(e) => { setNewsEditCategory(e.target.value) }}
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

                        <div className="w-1/2 my-2 mt-8 items-center">
                            <label className='flex cursor-pointer select-none items-center gap-2 w-fit'>
                                <span className='block text-lg text-gray-900 dark:text-white'>Live Status: </span>
                                <div className='relative'>
                                    <input
                                        type='checkbox'
                                        checked={newsEditLive}
                                        onChange={() => { setNewsEditLive(!newsEditLive) }}
                                        className='sr-only'
                                    />
                                    <div className='block h-8 w-14 rounded-full bg-transparent border border-gray-400 dark:border-gray-600 dark:bg-gray-700'></div>
                                    <div className={`dot absolute ${newsEditLive ? 'left-7' : 'left-1'} top-1 h-6 w-6 rounded-full ${newsEditLive ? 'bg-blue-700 dark:bg-blue-600' : 'bg-gray-400 dark:bg-white'} transition-all duration-100`}></div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className='text-black dark:text-white flex flex-col w-[56rem] max-w-4xl my-10' >
                        <p className="text-lg my-2">News Content</p>
                        <ReactQuill className='h-72' modules={quillModules} value={newsEditContent} onChange={(val) => { setNewsEditContent(val) }} />
                    </div>
                </div>
            </div>
        </div>}

        {/* Main Box */}
        <div className='p-5 bg-gray-50 dark:bg-gray-950/50 w-full h-full'>
            <div className='flex items-center flex-col sm:flex-row justify-between gap-3'>
                <h2 className="text-2xl text-black dark:text-white text-center font-semibold">Manage News</h2>
                <div className="w-full md:w-1/3">
                    <input
                        className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-transparent dark:bg-gray-700 px-3 py-2 text-sm placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-blue-500 focus:dark:ring-offset-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        placeholder="Search for News"
                        onChange={handleNewsSearchInputChange}
                    ></input>
                </div>
            </div>
            <div className="mt-6 flex flex-col">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full py-2 align-middle">
                        <div className="overflow-hidden border border-gray-50 dark:border-gray-950 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-50 dark:divide-gray-950">
                                <thead className="bg-gray-300 dark:bg-gray-900">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="w-1/2 px-4 py-3.5 text-left text-sm font-normal text-gray-700 dark:text-gray-400"
                                        >
                                            <span>News</span>
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-12 py-3.5 text-left text-sm font-normal text-gray-700 dark:text-gray-400"
                                        >
                                            Author
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-12 py-3.5 text-left text-sm font-normal text-gray-700 dark:text-gray-400"
                                        >
                                            Category
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700 dark:text-gray-400"
                                        >
                                            Live
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-left text-sm font-normal text-gray-700 dark:text-gray-400"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-950 bg-gray-300/50 dark:bg-gray-900/60">
                                    {currentNews.map((news) => (
                                        <tr key={news.slug}>
                                            <td className="w-2/5 px-4 py-4">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{news.title}</div>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">{news.description.substring(0, 140) + (news.description.length > 140 ? '...' : '')}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-12 py-4">
                                                <div className="text-sm text-gray-900 dark:text-gray-200 ">{news.author}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-12 py-4">
                                                <div className="text-sm text-gray-900 dark:text-gray-200 ">{news.category}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                {news.live ? <span className="inline-flex rounded-full bg-green-700/20 dark:bg-green-400/20 px-2 py-1 text-xs font-semibold leading-5 text-green-700 dark:text-green-400">
                                                    <Check width={16} strokeWidth={3} />
                                                </span> :
                                                    <span className="inline-flex rounded-full bg-red-700/20 dark:bg-red-400/20 px-2 py-1 text-xs font-semibold leading-5 text-red-700 dark:text-red-400">
                                                        <X width={16} strokeWidth={3} />
                                                    </span>}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-4">
                                                <button onClick={() => { handleEditNewsButtonClick(news) }} title='Edit News' className="rounded-full bg-blue-600/80 dark:bg-blue-500/80 mx-[3px] px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600/70 dark:hover:bg-blue-500/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                                    <PencilLine size={16} />
                                                </button>
                                                <button onClick={() => { router.push(`/articles/${news.category}/${news.slug}`) }} title='Delete News' className="rounded-full bg-violet-600 dark:bg-violet-500/80 mx-[3px] px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-600/70 dark:hover:bg-violet-500/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => { handleDeleteNewsButtonClick(news.id) }} title='Delete News' className="rounded-full bg-red-600 dark:bg-red-500/80 mx-[3px] px-2 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600/70 dark:hover:bg-red-500/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

const News = ({ user }) => <AdminApp user={user} Component={AdminNewsComponent} pageProps={{ user }} />

export default News;
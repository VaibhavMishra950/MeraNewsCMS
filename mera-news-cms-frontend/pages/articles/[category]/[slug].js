import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Custom404Error from '@/pages/404';
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';

const NewsArticle = () => {
    const router = useRouter();

    const [news, setNews] = useState(null);
    const [slugValidity, setSlugValidity] = useState(true);

    const getAndSetNews = async (slug) => {
        let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/getOneNewsUser`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ slug })
        });
        let result = await res.json();
        if (result.success) {
            setNews(result.news);
        } else {
            setSlugValidity(false);
        }
    }
    useEffect(() => {
        if (router.isReady) {
            const { slug } = router.query;
            getAndSetNews(slug);
        }
    }, [router.isReady])

    const getNewsDate = (dt) => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let d = new Date(dt);
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    }

    return (
        <>
            {slugValidity && <div className='bg-gray-950/80 min-h-[calc(100vh-76px)]'>
                <div className='py-5 px-14'>
                    <button
                        onClick={router.back}
                        className='flex w-fit px-3 rounded-full text-blue-600 bg-blue-600/10 hover:bg-blue-600/20'
                    >
                        <MoveLeft size={36} strokeWidth={1} />
                    </button>
                </div>
                <div className='max-w-full md:max-w-3xl lg:max-w-4xl mx-auto'>
                    <h1
                        className='text-4xl py-4 font-serif'
                    >
                        {news?.title}
                    </h1>

                    <p
                        className='text-gray-200/90 -mt-2 text-lg font-body'
                    >
                        {news?.description}
                    </p>
                    <p
                        className='text-gray-400 text-sm py-2 font-display'
                    >
                        {news && getNewsDate(news.createdAt)}. By&nbsp;
                        <Link
                            className='text-blue-500 hover:text-blue-400'
                            href={`/editor/${news?.authorUsername}`}
                        >
                            {news?.author}.
                        </Link>
                    </p>

                    <img
                        className='mx-auto h-[400px] my-2 rounded-2xl'
                        draggable={false}
                        src={`${process.env.NEXT_PUBLIC_SERVER_HOST}/newsCoverImages/${news?.coverimg}`}
                        alt="Cover Image"
                    />
                    <div className='font-display text-justify' dangerouslySetInnerHTML={{ __html: news?.content }}></div>
                </div>
            </div>}
            {!slugValidity && <Custom404Error />}
        </>

    )
}

export default NewsArticle;
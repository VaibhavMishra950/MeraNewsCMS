import Custom404Error from '@/pages/404';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const CategoryPage = () => {
    const router = useRouter();

    const [categoryValidity, setCategoryValidity] = useState(true);
    const [curCategory, setCurCategory] = useState("");
    const [newsList, setNewsList] = useState([]);

    const getAndSetNewsList = async (category) => {
        let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/getCategoryNewsListUser`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category })
        });
        let result = await res.json();
        if (result.success) {
            setNewsList(result.newsList);
        } else {
            setCategoryValidity(false);
        }
    }
    useEffect(() => {
        if (router.isReady) {
            const { category } = router.query;
            getAndSetNewsList(category);
            setCurCategory(category.charAt(0).toUpperCase() + category.substr(1))
        }
    }, [router.isReady]);
    return (<>
        {categoryValidity && <div className='bg-gray-950/80 min-h-[calc(100vh-76px)]'>
            <div className='py-5 px-14'>
                <Link
                    href={'/'}
                    className='flex w-fit px-3 rounded-full text-blue-600 bg-blue-600/10 hover:bg-blue-600/20'
                >
                    <MoveLeft size={36} strokeWidth={1} />
                </Link>
                <p className='text-center text-4xl font-serif'>{curCategory} News</p>
            </div>
            <div className='grid w-full max-w-7xl mx-auto md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-4'>

                {newsList.map(newsItem => (<div key={newsItem.slug} className="rounded-md border border-gray-700 relative">
                    <img
                        src={`${process.env.NEXT_PUBLIC_SERVER_HOST}/newsCoverImages/${newsItem.coverimg}`}
                        alt="Cover Image"
                        draggable={false}
                        className="aspect-[16/9] w-full rounded-md md:aspect-auto md:h-[300px] lg:h-[200px]"
                    />
                    <div className="p-4">
                        <h1 className="inline-flex items-center text-lg font-semibold ">{newsItem.title.substring(0, 50) + (newsItem.title.length > 50 ? '...' : '')}</h1>
                        <p className="mt-3 text-sm text-gray-600">
                            {newsItem.description.substring(0, 69) + (newsItem.description.length > 75 ? '...' : '')}
                        </p>
                        <Link
                            type="button"
                            href={`/articles/${newsItem.category}/${newsItem.slug}`}
                            className="mt-4 text-center w-full rounded-sm bg-white px-2 py-1 font-semibold text-black shadow-md shadow-white/20 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Read More
                        </Link>
                    </div>
                </div>))}
            </div>
        </div>}
        {!categoryValidity && <Custom404Error />}
    </>)
}

export default CategoryPage;
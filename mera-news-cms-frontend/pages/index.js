import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function Home() {

  const router = useRouter();
  const [allNews, setAllNews] = useState([]);

  const getAndSetNews = async () => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news/getAllNewsListViewer`);
    let result = await res.json();
    if (result.success) {
      setAllNews(result.data)
    } else {
      toast.error("Error fetching data, Reloading...");
      setTimeout(() => {
        router.push('/');
      }, 250);
    }
  }

  useEffect(() => {
    getAndSetNews();
  }, [])


  return (
    <div className="bg-gray-950/80">
      <div className="mx-auto grid w-full max-w-7xl items-center space-y-4 px-2 py-10 md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-4">


        {allNews.map((news, index) => {
          if (index === 0) {
            return <div key={news.slug} className="rounded-md border border-gray-700/40 relative col-span-2 h-[390px]">
              <div className="absolute -top-1 -right-2 z-50">
                <Link href={`/articles/${news.category}`} className="inline-block rounded-full bg-blue-950 hover:bg-blue-900 px-3 py-1 text-[12px] font-semibold text-gray-100 underline decoration-transparent hover:decoration-white transition-all duration-100">
                  #{news.category.charAt(0).toUpperCase() + news.category.substr(1)}
                </Link>
              </div>
              <div className="relative h-full">
                <img
                  src={`${process.env.NEXT_PUBLIC_SERVER_HOST}/newsCoverImages/${news.coverimg}`}
                  alt="Cover Image"
                  draggable={false}
                  className="h-full w-full rounded-md md:aspect-auto"
                />
                <div className="absolute bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16 w-full">
                  <Link href={`/articles/${news.category}/${news.slug}`} className="inline-flex items-center text-xl [text-shadow:_0_1px_2px_var(--tw-shadow-color)] shadow-black font-semibold hover:underline underline-offset-2">
                    {news.title.substring(0, 110) + (news.title.length > 110 ? '...' : '')}
                  </Link>
                  <p className="mt-3 text-sm text-gray-300">
                    {news.description.substring(0, 140) + (news.description.length > 140 ? '...' : '')}
                  </p>
                </div>
              </div>
            </div>
          } else {
            return <div key={news.slug} className="rounded-md border border-gray-700/40 relative h-[390px]">
              <div className="absolute -top-1 -right-2">
                <Link href={`/articles/${news.category}`} className="inline-block rounded-full bg-blue-950 hover:bg-blue-900 px-3 py-1 text-[12px] font-semibold text-gray-100 underline decoration-transparent hover:decoration-white transition-all duration-100">
                  #{news.category.charAt(0).toUpperCase() + news.category.substr(1)}
                </Link>
              </div>
              <img
                src={`${process.env.NEXT_PUBLIC_SERVER_HOST}/newsCoverImages/${news.coverimg}`}
                alt="Cover Image"
                draggable={false}
                className="aspect-[16/9] w-full rounded-md md:aspect-auto md:h-[300px] lg:h-[200px]"
              />
              <div className="p-4">
                <h1 className="inline-flex items-center text-lg">{news.title.substring(0, 45) + (news.title.length > 50 ? '...' : '')}</h1>
                <p className="mt-3 text-sm text-gray-500">
                  {news.description.substring(0, 60) + (news.description.length > 60 ? '...' : '')}
                </p>
                <Link
                  type="button"
                  href={`/articles/${news.category}/${news.slug}`}
                  className="mt-4 text-center w-full rounded-sm bg-white px-2 py-1 font-semibold text-black shadow-md shadow-white/20 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Read More
                </Link>
              </div>
            </div>
          }
        })}
      </div>
    </div>
  );
}

import { useState, useEffect, Suspense } from "react";
import {Link} from "react-router-dom";
import fetchData from "../utils/fetchData";

const limit = 9;

export default function ArticleList() {
    const [articles, setArticles] = useState([]);
    const [skip, setSkip] = useState(0);
    // 사용자에게 loading 화면을 보여주기 위한 state
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
 
    // articles 가져오기 요청
    useEffect(() => {
        setIsLoaded(false);
        setError(null);

        fetchData(`${process.env.REACT_APP_SERVER}/articles/?limit=${limit}&skip=${skip}`)
        .then(data => {
            setArticles([...articles, ...data])
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => setIsLoaded(true))
    }, [skip])

    return (
        <>
            {/* 검색창 (Link button) */}
            <div className="px-2 mb-4">
                <div className="">
                    <Link to={`/Search`}>
                        <input type="text" className="border px-2 py-1 w-full" placeholder="Search" />
                    </Link>
                </div>
            </div>

            {/* article_list */}
            <ul className="grid grid-cols-3 gap-1">
                {articles.map(article => (
                    <li key={article._id} className="h-40">
                        <Link to={`/articles/${article._id}`}>
                            <img
                                src={`${process.env.REACT_APP_SERVER}/data/articles/${article.photos[0]}`}
                                className="w-full h-full obfect-cover"
                            />
                        </Link>
                    </li>
                ))}
            </ul>

            {/* 더보기 버튼 */}
            <div className="flex justify-center my-2">
                <button className="p-1 text-blue-500" onClick={() => setSkip(skip + limit)}>More</button>
            </div>

            {/* loading 구현 (spinner) */}
            {!isLoaded && <p>fetching articles...</p>}
            
            {/* error message 출력 */}
            {error && <p>failed to fetch articles</p>}
        </>
    )
}


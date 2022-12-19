import { useState, useContext } from "react";
import {Link} from "react-router-dom";
import AuthContext from "./AuthContext";
import Carousel from "./Carousel";
import Modal from "./Modal";
import Avatar from "./Avatar";

export default function ArticleTemplate({article, favorite, unfavorite, deleteArticle}) {

    const auth = useContext(AuthContext);
    const isMaster = auth.user.username === article.user.username;
    const created = new Date(article.created).toLocaleDateString();

    function toggleFavorite() {
        if (article.isFavorite) {
            unfavorite(article._id)
        } else {
            favorite(article._id)
        }
    }

    return (
        <>
            <div className="px-2 mb-2 flex justify-between items-center">
                {/* Avatar */}
                <Avatar user={article.user} />

                {/* Modal */}
                {isMaster && (
                    <Modal>
                        <li className="border-b">
                            <button className="w-full p-1" onClick={() => deleteArticle(article._id)}>Delete</button>
                        </li>
                    </Modal>
                )}
            </div>

            {/* Carousel */}
            <div className="mb-4">
                <Carousel images={article.photos} />
            </div>
        
            <div className="px-2">
                <div className="flex">
                    <button
                        type="button"
                        onClick={toggleFavorite}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={"w-6" + (article.isFavorite ? "fill-red-500" : "fill-gray-200")}><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                    </button>
                    <div className="ml-1">{article.favoriteCount}likes</div>
                </div>

                <p className="mb-2">
                    <span className="font-bold">{article.user.username}</span>
                    {" "}
                    {article.description}
                </p>

                <div className="text-gray-400">
                    <Link to={`/article/${article._id}/comments`}>Comments</Link>
                </div>

                <small className="text-gray-400 text-xs">{created}</small>
            </div>
        </>
    )
}
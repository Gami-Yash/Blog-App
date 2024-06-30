import React from "react";

const Post = ({ title, summary, cover, content }) => {
    return (
        <article className="bg-white shadow-md rounded-lg p-6 mb-7">
            <a href=""><img className="w-full rounded-lg mb-4"  src={'http://localhost:8000/'+cover} alt={title} /></a>
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-gray-700 mb-4">{summary}</p>
            <div className="content">{content}</div>
            <a href="#" className="text-blue-500 hover:underline">Read more</a>
        </article>
    );
}

export default Post;

import React, { useEffect, useState } from "react";
import Navbar from "../src/components/navbar";
import Post from "../src/components/post";

const Homepage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/post')
            .then(response => response.json())
            .then(data => {
                setPosts(data);
            });
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Navbar />
            {posts.length > 0 && posts.map(post => (
                <Post key={post.id} {...post} />
            ))}
        </div>
    );
}

export default Homepage;

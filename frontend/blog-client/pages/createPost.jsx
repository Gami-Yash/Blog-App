import React, { useState, useRef, useEffect } from "react";
import Navbar from "../src/components/navbar";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];

const CreatePage = () => {
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        file: null
    });
    const navigate = useNavigate();

    const quillRef = useRef(null);

    useEffect(() => {
        // Ensure the quillRef and its editor are properly initialized
        if (quillRef.current) {
            quillRef.current.focus();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleContentChange = (value) => {
        setFormData(prevState => ({
            ...prevState,
            content: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            file: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('summary', formData.summary);
        data.append('content', formData.content);
        data.append('file', formData.file);

        const response = await fetch('http://localhost:8000/create', {
            method: 'POST',
            credentials: 'include',
            body: data
        });

        if(response.ok){
            navigate('/')
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Navbar />
            <form className="bg-white shadow-md rounded-lg p-6" onSubmit={handleSubmit}>
                <h2 className="text-3xl font-bold mb-6 text-center">Create Post</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="summary">Summary</label>
                    <input
                        type="text"
                        id="summary"
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        placeholder="Summary"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">Upload File</label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={handleFileChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Content</label>
                    <ReactQuill
                        onChange={handleContentChange}
                        value={formData.content}
                        modules={modules}
                        formats={formats}
                        ref={quillRef}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePage;

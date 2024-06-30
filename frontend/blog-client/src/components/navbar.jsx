import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { userContext } from "./userContext";

const Navbar = () => {
    const navigate = useNavigate();
    const {setUserInfo,userInfo} = useContext(userContext)

    useEffect(() => {
        fetch('http://localhost:8000/profile', {
            credentials: 'include',
            method : 'GET'
        })
        .then(response => response.json())
        .then(userInfo => {
            setUserInfo(userInfo)
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
        });
    }, []);

    const logout = async () => {
        try {
            const response = await fetch('http://localhost:8000/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setUserInfo(null)
                navigate('/login'); 
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    const username = userInfo?.username;

    return (
        <header className="flex justify-between items-center mb-8">
            <a href="/" className="text-xl font-bold">Home</a>
            <nav>
                {username ? (
                    <>
                        <a href='/create'>Create new post</a>
                        <a className="pl-5 cursor-pointer" onClick={logout}>Logout</a>
                    </>
                ) : (
                    <>
                        <a href="/login" className="mr-4">Login</a>
                        <a href="/signup">Register</a>
                    </>
                )}
            </nav>
        </header>
    );
};
export default Navbar;

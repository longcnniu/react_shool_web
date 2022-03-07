import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const CreatePosts = () => {

    const [Loading, setLoading] = useState(false)
    const navigate = useNavigate()

    //kiểm tra token and đẵ đăng nhập hay chưa
    useEffect(() => {
        const checklogin = () => {
            if (document.cookie.split(';').some((item) => item.trim().startsWith('accessToken='))) {
                //đoc cookie
                const cookieValue = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('accessToken='))
                    .split('=')[1];
                //Gửi req token lên server xác thực
                var myHeaders = new Headers();
                myHeaders.append("token", cookieValue);

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                return fetch("http://localhost:5000/post", requestOptions)
                    .then(res => res.json())
                    .then(data => {
                        if (!data.success) {
                            setLoading(true)
                            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            navigate("/login")
                        } else {
                            setLoading(true)
                        }
                    })
                    .catch(error => console.log('error', error))
            } else {
                navigate("/login")
            };
        }
        checklogin()
    }, [navigate])

    //html
    let body

    if (Loading) {
        body = (
            <div>createPosts</div>
        )
    } else {
        body = (
            <div>Loading...</div>
        )
    }

    return (body)
}

export default CreatePosts
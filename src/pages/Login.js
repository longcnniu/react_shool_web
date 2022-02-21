import { React, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";


const Login = () => {
    let navigate = useNavigate();
    const [UserName, setUserName] = useState('')
    const [Password, setPassword] = useState('')

    //kiểm tra token and đẵ đăng nhập hay chưa
    useEffect(() => {
        const checklogin = () => {
            //kiểm tra có cookie nào tồn tại hay không
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

                return fetch("http://localhost:5000/login", requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        if (data.success) {
                            navigate('/')
                        }
                    })
                    .catch(error => console.log('error', error));
            }
        }
        checklogin()
    }, [navigate])


    //gủi req Email vs Password lên server
    const login = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("email", UserName);
        urlencoded.append("password", Password);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://localhost:5000/login", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.cookie = `accessToken= Bearer ${data.accessToken}`;
                    navigate("/");
                    //console.log(data.accessToken)
                }
            })
            .catch(error => console.log('error', error));
    }

    return (
        <div className='body-bg min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0'>
            <div>
                <h1 className="text-4xl font-bold text-white text-center">Startup</h1>
            </div>
            <div className='bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl'>
                <div>
                    <h3 className='font-bold text-2xl'>Welcome</h3>
                    <p className='text-gray-600 pt-2'>Sign in to your account.</p>
                </div>

                <div className='mt-10'>
                    <div className='flex flex-col'>
                        <div className='mb-6 pt-3 rounded bg-gray-200'>
                            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" name="email">Email</label>
                            <input className='bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 transition duration-500 px-3 pb-3' type="email" name='username' onChange={e => setUserName(e.target.value)} />
                        </div>
                        <div className='mb-6 pt-3 rounded bg-gray-200'>
                            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" name="password">Password</label>
                            <input className='bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 transition duration-500 px-3 pb-3' type="password" name='password' onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div className="flex justify-end">
                            <div className="text-sm text-blue-600 hover:text-blue-700 hover:underline mb-6">Forgot your password?</div>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200" type="submit" onClick={login}>Sign In</button>
                    </div>
                </div>
            </div>

            <footer className="max-w-lg mx-auto flex justify-center text-white">
                <div className="hover:underline">Team 21</div>
            </footer>
        </div>
    )
}

export default Login
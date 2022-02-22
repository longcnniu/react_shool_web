import '../css/login.css'
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

                return fetch("https://salty-brook-05753.herokuapp.com/login", requestOptions)
                    .then(response => response.json())
                    .then(data => {
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

        fetch("https://salty-brook-05753.herokuapp.com/login", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.cookie = `accessToken= Bearer ${data.accessToken}`;
                    navigate("/");
                }
            })
            .catch(error => console.log('error', error));
    }

    return (
        <div className='body'>
            <div className="center">
                <h1>Login</h1>
                <div className='form'>
                    <div className="txt_field">
                        <input type="text" required onChange={e => setUserName(e.target.value)}/>
                        <span></span>
                        <label>Email</label>
                    </div>
                    <div className="txt_field">
                        <input type="password" required onChange={e => setPassword(e.target.value)}/>
                        <span></span>
                        <label>Password</label>
                    </div>
                    <div className="pass">Forgot Password?</div>
                    <button className='btn' onClick={login}>Login</button>
                </div>
            </div>
        </div>
    )
}

export default Login
import '../css/registration.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const Registration = () => {

    const navigate = useNavigate()
    const [Loading, setLoading] = useState(false)
    const [UserName, setUserName] = useState('')
    const [Password, setPassword] = useState('')
    const [Role, setRole] = useState('staff')
    const [FirstName, setFirstName] = useState('')
    const [LastName, setLastName] = useState('')
    const [RoleAuth, setRoleAuth] = useState('')
    const [Department, setDepartment] = useState('IT')

    //kiểm tra token and đẵ đăng nhập hay chưa vs cos phải là Admin
    useEffect(() => {
        const checkAuth = () => {
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

                fetch(`${apiUrl}/registration`, requestOptions)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            if (data.role === 'admin') {
                                setLoading(true)
                                setRoleAuth('admin')
                            } else {
                                setLoading(true)
                                setRoleAuth('qa-manager')
                            }
                        } else {
                            navigate('/')
                        }
                    })
                    .catch(error => console.log('error', error))
            } else {
                navigate('/login')
            }
        }
        checkAuth()
    }, [navigate])

    //tạo tài khoản mới
    const registration = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("email", UserName);
        urlencoded.append("password", Password);
        urlencoded.append("role", Role);
        urlencoded.append("firstName", FirstName);
        urlencoded.append("lastName", LastName);
        urlencoded.append("Department", Department);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`${apiUrl}/registration`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(data.message)
                } else {
                    alert(data.message)
                }
            })
            .catch(error => console.log('error', error))
    }

    //html
    let body

    if (Loading) {
        if (RoleAuth === 'admin') {
            body = (
                <div className='Registration__Main'>
                    <div className='Registration__Container'>
                        <div>
                            <div className='Registration__lable-div'>
                                <label className='Registration__lable'>Email</label>
                            </div>
                            <input type="email" name='email' onChange={e => setUserName(e.target.value)} />
                        </div>
                        <div>
                            <div className='Registration__lable-div'>
                                <label className='Registration__lable' name="password">Password</label>
                            </div>
                            <input type="password" name='password' onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div>
                            <div className='Registration__lable-div'>
                                <label className='Registration__lable' name="firstName">First Name</label>
                            </div>
                            <input type="text" name='firstName' onChange={e => setFirstName(e.target.value)} />
                        </div>
                        <div>
                            <div className='Registration__lable-div'>
                                <label className='Registration__lable' name="lastName">Last Name</label>
                            </div>
                            <input type="text" name='lastName' onChange={e => setLastName(e.target.value)} />
                        </div>
                        <div>
                            <div className='Registration__lable-div'>
                                <label className='Registration__lable'>Role User:</label>
                            </div>
                            <select value={Role} onChange={e => setRole(e.target.value)}>
                                <option value='staff'>Staff</option>
                                <option value='qa-manager'>QA Manager</option>
                                <option value='admin'>Admin</option>
                            </select>
                        </div>
                        <div>
                            <div className='Registration__lable-div'>
                                <label>Department:</label>
                            </div>
                            <select value={Department} onChange={e => setDepartment(e.target.value)}>
                                <option value='IT'>IT</option>
                                <option value='Business'>Business</option>
                                <option value='Design'>Design</option>
                                <option value='Marketing'>Marketing</option>
                            </select>
                        </div>
                        <button className='Registration__btn' type="submit" onClick={registration}>Confirm</button>
                    </div>
                </div>
            )
        } else {
            body = (
                <div className='Registration__Main'>
                    <div className='Registration__Container'>
                        <div>
                            <div className='Registration__lable-div'>
                                <label className='Registration__lable'>Email</label>
                            </div>
                            <input type="email" name='email' onChange={e => setUserName(e.target.value)} />
                        </div>
                        <div>
                            <div className='Registration__lable-div'>
                                <label className='Registration__lable' name="password">Password</label>
                            </div>
                            <input type="password" name='password' onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div>
                            <div className='Registration__lable-div'>
                                <label className='Registration__lable' name="firstName">First Name</label>
                            </div>
                            <input type="text" name='firstName' onChange={e => setFirstName(e.target.value)} />
                        </div>
                        <div>
                            <div className='Registration__lable-div'>
                                <label className='Registration__lable' name="lastName">Last Name</label>
                            </div>
                            <input type="text" name='lastName' onChange={e => setLastName(e.target.value)} />
                        </div>
                        <div>
                            <div className='Registration__lable-div'>
                                <label className='Registration__lable'>Role User:</label>
                            </div>
                            <select value={Role} onChange={e => setRole(e.target.value)}>
                                <option value='staff'>Staff</option>
                            </select>
                        </div>
                        <div>
                            <div className='Registration__lable-div'>
                                <label>Department:</label>
                            </div>
                            <select value={Department} onChange={e => setDepartment(e.target.value)}>
                                <option value='IT'>IT</option>
                                <option value='Business'>Business</option>
                                <option value='Design'>Design</option>
                                <option value='Marketing'>Marketing</option>
                            </select>
                        </div>
                        <button className='Registration__btn' type="submit" onClick={registration}>Confirm</button>
                    </div>
                </div>
            )
        }
    } else {
        body = (
            <div>loading...</div>
        )
    }

    return (body)
}

export default Registration
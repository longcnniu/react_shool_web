import '../css/editUser.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const EditUser = () => {

    const navigate = useNavigate()
    const [Email, setEmail] = useState('')
    const [Role, setRole] = useState('staff')
    const [Department, setDepartment] = useState('IT')
    const [RoleAuth, setRoleAuth] = useState('')
    const [FirstName, setFirstName] = useState('')
    const [LastName, setLastName] = useState('')
    const [Password, setPassword] = useState('')
    const [Loading, setLoading] = useState(false)

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
                }

                fetch(`${apiUrl}` + window.location.pathname, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            setEmail(result.data.email)
                            setRole(result.data.role)
                            setFirstName(result.data.firstName)
                            setLastName(result.data.lastName)
                            setDepartment(result.data.Department)
                            setRoleAuth(result.roleAuth);
                            setLoading(true)
                        } else {
                            setLoading(true)
                            navigate('/')
                        }
                    })
                    .catch(error => console.log('error', error));
            } else {
                navigate('/login')
            }
        }
        checkAuth()
    }, [navigate])

    const updateUser = () => {
        //đoc cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            .split('=')[1];
        //FUn Del
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("email", Email);
        urlencoded.append("role", Role);
        urlencoded.append("firstName", FirstName);
        urlencoded.append("lastName", LastName);
        urlencoded.append("Department", Department);
        urlencoded.append("password", Password);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`${apiUrl}` + window.location.pathname, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert(result.message)
                } else {
                    alert(result.message)
                }
            })
            .catch(error => console.log('error', error));
    }

    //html
    let body

    if (Loading) {
        if (RoleAuth === 'admin') {
            body = (
                <div className='EditUser__Main'>
                    <div className='EditUser__Container'>
                        <div>
                            <div className='EditUser__lable-div'>
                                <label name="email">Email</label>
                            </div>
                            <input type='email' onChange={e => setEmail(e.target.value)} value={Email} />
                        </div>
                        <div>
                            <div className='EditUser__lable-div'>
                                <label>Password</label>
                            </div>
                            <input type='password' onChange={e => setPassword(e.target.value)} />
                        </div>
                        <div>
                            <div className='EditUser__lable-div'>
                                <label name="firstName">First Name</label>
                            </div>
                            <input type="text" name='firstName' onChange={e => setFirstName(e.target.value)} value={FirstName} />
                        </div>
                        <div>
                            <div className='EditUser__lable-div'>
                                <label>Last Name</label>
                            </div>
                            <input type="text" name='lastName' onChange={e => setLastName(e.target.value)} value={LastName} />
                        </div>
                        <div>
                            <div className='EditUser__lable-div'>
                                <label>Role User:</label>
                            </div>
                            <select value={Role} onChange={e => setRole(e.target.value)}>
                                <option value='staff'>Staff</option>
                                <option value='qa-manager'>QA Manager</option>
                                <option value='admin'>Admin</option>
                            </select>
                        </div>
                        <div>
                            <div className='EditUser__lable-div'>
                                <label>Department:</label>
                            </div>
                            <select value={Department} onChange={e => setDepartment(e.target.value)}>
                                <option value='IT'>IT</option>
                                <option value='Business'>Business</option>
                                <option value='Design'>Design</option>
                                <option value='Marketing'>Marketing</option>
                            </select>
                        </div>
                        <button className='EditUser__btn' onClick={updateUser}>Confirm</button>
                    </div>
                </div>
            )
        } else {
            body = (
                <div className='EditUser__Main'>
                    <div className='EditUser__Container'>
                        <div>
                            <div className='EditUser__lable-div'>
                                <label name="email">Email</label>
                            </div>
                            <input type='email' onChange={e => setEmail(e.target.value)} value={Email} />
                        </div>
                        <div>
                            <div className='EditUser__lable-div'>
                                <label>Role User:</label>
                            </div>
                            <select value={Role} onChange={e => setRole(e.target.value)}>
                                <option value='staff'>Staff</option>
                            </select>
                        </div>
                        <button className='EditUser__btn' onClick={updateUser}>Confirm</button>
                    </div>
                </div>
            )
        }
    } else {
        body = (
            <div>Loading...</div>
        )
    }

    return (body)
}

export default EditUser
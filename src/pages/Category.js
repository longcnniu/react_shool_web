
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';
import Popup from "reactjs-popup";

const Category = () => {

    const navigate = useNavigate()
    const [Loading, setLoading] = useState(false)
    const [LoadingViewUser, setLoadingViewUser] = useState(false)
    const [ViewCategorys, setViewCategorys] = useState([])
    const [changedCategory, setchangedCategory] = useState(false)
    const [changedListCategory, setchangedListCategory] = useState(false)

    //kiểm tra token and đẵ đăng nhập hay chưa vs cos phải là Admin or QA
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

                return fetch(`${apiUrl}/category`, requestOptions)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            setLoading(true)
                            getView(cookieValue)
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
    }, [navigate, changedCategory, changedListCategory])

    //hiện danh sách user
    const getView = (cookieValue) => {
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch(`${apiUrl}/all-category`, requestOptions)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setViewCategorys(data.dataCategorys)
                    setLoadingViewUser(true)
                } else {
                    // setViewUser('Not User')
                    setLoadingViewUser(true)
                }
            })
            .catch(error => console.log('error', error));
    }

    //Chuyển trang sang tạo category
    const nextPageCreacteCategory = () => {
        navigate('/creacte-category')
    }

    function click(data) {
        return (event) => {
            //đoc cookie
            const cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                .split('=')[1];

            //Gửi req token lên server xác thực
            var myHeaders = new Headers();
            myHeaders.append("token", cookieValue);
            //fun req
            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`${apiUrl}/category/` + data._id, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        if (result.success) {
                            setchangedCategory(!changedCategory)
                        } else {
                            alert(result.message)
                        }
                    }
                })
                .catch(error => console.log('error', error));
        }
    }

    const clickRefrc = () => {
        setchangedListCategory(!changedListCategory)
    }

    //Next Page Edit Category
    const clickEdit = (data) => {
        return (event) => {
            navigate(`/category/${data._id}`)
        }
    }

    //html
    let body
    if (Loading) {
        if (LoadingViewUser) {
            if (ViewCategorys.length !== 0) {
                const listview = ViewCategorys.map(data => (
                    <tr key={data._id}>
                        <td>{data.title}</td>
                        <td>{new Date(data.createDate).toLocaleString()}</td>
                        <td>{new Date(data.endDate).toLocaleString()}</td>
                        <td>{new Date(data.lockDate).toLocaleString()}</td>
                        <td>
                            <button className='btn-edit' onClick={clickEdit(data)}>Edit</button>
                            <button className='btn-del' onClick={click(data)}>Delete</button>
                        </td>
                    </tr>
                ))
                body = (
                    <>
                        <button className='btn-edit btn-1' onClick={nextPageCreacteCategory}>Add Category</button>
                        <button className='btn-edit btn-2' onClick={clickRefrc}>Refresh list</button>
                        <div className='out_table'>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Title</th>
                                        <th>Date create</th>
                                        <th>Expiration date</th>
                                        <th>Lock date</th>
                                        <th>...</th>
                                    </tr>
                                    {listview}
                                </tbody>
                            </table>
                        </div>
                        <Popup modal trigger={<button>Click Me</button>}>
                            Modal Content
                        </Popup>
                    </>
                )
            } else {
                body = (
                    <>
                        <button className='btn-edit btn-1' onClick={nextPageCreacteCategory}>Add Category</button>
                        <button className='btn-edit btn-2' onClick={clickRefrc}>Refresh list</button>
                        <h1 className='loading'>No Category yet</h1>
                    </>
                )
            }
        } else {
            body = (
                <div>Loading categories...</div>
            )
        }
    } else {
        body = (
            <div>Loading...</div>
        )
    }


    return (body)
}

export default Category
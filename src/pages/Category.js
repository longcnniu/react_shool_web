import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Category = () => {

    const navigate = useNavigate()
    const [Loading, setLoading] = useState(false)
    const [LoadingViewUser, setLoadingViewUser] = useState(false)
    const [ViewCategorys, setViewCategorys] = useState([])

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

                return fetch("http://localhost:5000/category", requestOptions)
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
    }, [navigate])

    //hiện danh sách user
    const getView = (cookieValue) => {
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch("http://localhost:5000/all-category", requestOptions)
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

    //html
    let body
    if (Loading) {
        if (LoadingViewUser) {
            if (ViewCategorys.length !== 0) {
                const listview = ViewCategorys.map(data => (
                    <tr key={data._id}>
                        <td>{data.title}</td>
                        <td>
                            <button >Edit</button>
                            <button >Xoa</button>
                        </td>
                    </tr>
                ))
                body = (
                    <>
                        <button onClick={nextPageCreacteCategory}>Add Category</button>
                        {/* <button onClick={clickRefrc}>Lam moi list</button> */}
                        <div>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Title</th>                
                                        <th>...</th>
                                    </tr>
                                    {listview}
                                </tbody>
                            </table>
                        </div>
                    </>
                )
            } else {
                body = (
                    <>
                        <button onClick={nextPageCreacteCategory}>Add Category</button>
                        {/* <button onClick={clickRefrc}>Lam moi list</button> */}
                        <h1>Khong co category nao</h1>
                    </>
                )
            }
        } else {
            body = (
                <div>Loading categorys...</div>
            )
        }
    } else {
        body = (
            <div>Loadning...</div>
        )
    }


    return (body)
}

export default Category
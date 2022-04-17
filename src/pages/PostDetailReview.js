import '../css/PostDetail.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const PostDetailReview = () => {
    const navigate = useNavigate()
    const [Loading, setLoading] = useState(false)
    const [Post, setPost] = useState([])
    const [Img, setImg] = useState('null')
    const [NameImg, setNameImg] = useState('')
    const [FileOrImg, setFileOrImg] = useState(false)
    const [URLFile, setURLFile] = useState('')

    //kiểm tra token and đẵ đăng nhập hay chưa
    useEffect(() => {
        const checklogin = () => {
            if (document.cookie.split(';').some((item) => item.trim().startsWith('accessToken='))) {
                //đoc cookie
                const cookieValue = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('accessToken='))
                    .split('=')[1];
                var myHeaders = new Headers();
                myHeaders.append("token", cookieValue);

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                fetch(`${apiUrl}/`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.success) {
                            setLoading(true)
                        } else {
                            //Get Post
                            var myHeaders = new Headers();
                            myHeaders.append("token", cookieValue);

                            var requestOptions = {
                                method: 'GET',
                                headers: myHeaders,
                                redirect: 'follow'
                            };
                            const id = (window.location.pathname).split('/')
                            fetch(`${apiUrl}/post/` + id[2], requestOptions, requestOptions)
                                .then(response => response.json())
                                .then(result => {
                                    if (result.success) {
                                        setPost(result.dataPost)
                                        //kieem tra nhận về là ảnh hay file
                                        if (result.dataPost.TyFile === "image") {
                                            if (result.dataPost.NameImg !== 'null') {
                                                setNameImg(result.dataPost.NameImg)
                                                //Get Img
                                                var requestOptions = {
                                                    method: 'GET',
                                                    redirect: 'follow'
                                                };
                                                fetch(`${apiUrl}/get-img?nameImg=` + result.dataPost.NameImg, requestOptions)
                                                    .then(response => response.blob())
                                                    .then(result => {
                                                        const imageObjectURL = URL.createObjectURL(result);
                                                        setImg(imageObjectURL)
                                                    })
                                                    .catch(error => console.log('error', error));
                                            }
                                        } else {
                                            if (result.dataPost.NameImg !== 'null') {
                                                setFileOrImg(true)
                                                setNameImg(result.dataPost.NameImg)
                                                setURLFile(`${apiUrl}/get-img?nameImg=${result.dataPost.NameImg}`);
                                            }
                                        }
                                    }
                                })
                                .catch(error => console.log('error', error));
                            setLoading(true)
                        }
                    })
                    .catch(error => console.log('error', error));
            } else {
                navigate("/login")
            };
        }
        checklogin()
    }, [navigate, NameImg])

    //click Del
    const clickDel = () => {
        //đoc cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            .split('=')[1];
        //full
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };
        const id = (window.location.pathname).split('/')
        fetch(`${apiUrl}/post/` + id[2], requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    console.log("thanh cong");
                    navigate(-1)
                } else {
                    console.log(result);
                }
            })
            .catch(error => console.log('error', error));

        //Kiểm tra xem đây là File hay ảnh rồi xóa
        if (Img !== 'null') {
            //Del Img
            var myHeaderss = new Headers();
            myHeaderss.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("nameImg", NameImg);

            var requestOptionss = {
                method: 'DELETE',
                headers: myHeaderss,
                body: urlencoded,
                redirect: 'follow'
            };

            fetch(`${apiUrl}/del-img`, requestOptionss)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
    }

    //Approve
    const clickApprove = () => {
        //đoc cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            .split('=')[1];
        //full
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);

        var urlencoded = new URLSearchParams();

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };
        const id = (window.location.pathname).split('/')
        fetch(`${apiUrl}/posts-approve?id=${id[2]}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.success){
                    navigate(-1)
                }else{
                    alert(result.message)
                }
            })
            .catch(error => console.log('error', error));
    }

    //HTMl
    let body
    let body2
    let body4

    body2 = (
        <>
            <button className='PostDetail-btn-cc' onClick={clickDel}>Reject</button>
        </>
    )

    //Kiểm tra có ảnh không
    if (FileOrImg) {
        body4 = (
            <>
                <a href={URLFile}>Dowload File</a>
            </>
        )
    } else {
        body4 = (
            <>
                <img className='PostDetail_Img' src={Img} alt={''} />
            </>
        )
    }

    if (Loading) {
        body = (
            <>
                <div className='PostDetail-Main'>
                    <div className='PostDetail-Main-container'>
                        <div>Title: {Post.title}</div>
                        <div className='PostDetail-Main-infor'>
                            <div>Category: {Post.category}</div>
                            <div>Date: {new Date(Post.dateCreate).toLocaleString()}</div>
                        </div>
                        {body4}
                        <p>Content: {Post.content}</p>
                        <div className='PostDetail-view'>
                            <p>View: {Post.numberView}</p>
                            <p>Like: {Post.Like}</p>
                            <p>Dislike: {Post.DisLike}</p>
                        </div>
                        <div className='PostDetail-btn'>
                            <div className='PostDetail-btn-left'>
                                <button className='PostDetail-btn-cc-Like' onClick={clickApprove}>Approve</button>
                            </div>
                            <div className='PostDetail-btn-right'>
                                {body2}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        body = (
            <div>Loading...</div>
        )
    }

    return (
        body
    )
}

export default PostDetailReview
import '../css/PostDetail.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const PostDetail = () => {
    const navigate = useNavigate()
    const [Loading, setLoading] = useState(false)
    const [Post, setPost] = useState([])
    const [Comment, setComment] = useState([])
    const [inputComment, setinputComment] = useState('')
    const [Role, setRole] = useState('')
    const [UserId, setUserId] = useState('')
    const [PostUserId, setPostUserId] = useState('')
    const [Img, setImg] = useState('null')
    const [NameImg, setNameImg] = useState('')
    const [FileOrImg, setFileOrImg] = useState(false)
    const [URLFile, setURLFile] = useState('')
    //trang thai
    const [ChangeComment, setChangeComment] = useState(false)
    const [Change, setChange] = useState(false)

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
                            setUserId(data.UserId);
                            setRole(data.role)
                            getComment(cookieValue)
                            //Get Post
                            var myHeaders = new Headers();
                            myHeaders.append("token", cookieValue);

                            var requestOptions = {
                                method: 'GET',
                                headers: myHeaders,
                                redirect: 'follow'
                            };
                            fetch(`${apiUrl}` + window.location.pathname, requestOptions, requestOptions)
                                .then(response => response.json())
                                .then(result => {
                                    if (result.success) {
                                        setPost(result.dataPost)
                                        setPostUserId(result.dataPost.UserId);
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
    }, [navigate, ChangeComment, Change, NameImg])

    //Get Comment
    const getComment = (cookie) => {
        var myHeaders = new Headers();
        myHeaders.append("token", cookie);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const id = (window.location.pathname).split('/')

        fetch(`${apiUrl}/post-comment/` + id[2], requestOptions)
            .then(response => response.json())
            .then(result => {
                setComment(result.message)
            })
            .catch(error => console.log('error', error));
    }

    //Dang comment
    const uplaodComment = () => {
        //đoc cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            .split('=')[1];
        //fun
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("comment", inputComment);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        const id = (window.location.pathname).split('/')
        fetch(`${apiUrl}/post-comment/` + id[2], requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    setChangeComment(!ChangeComment)
                    setinputComment('')
                    console.log(result.message);
                } else {
                    console.log(result.message);
                }
            })
            .catch(error => console.log('error', error));
    }

    //Click Like
    const clickLike = () => {
        //đoc cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            .split('=')[1];
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };
        const id = (window.location.pathname).split('/')
        fetch(`${apiUrl}/post-Like/` + id[2], requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result) {
                    setChange(!Change)
                }
            })
            .catch(error => console.log('error', error));
    }

    //Click Dislick
    const clickDislick = () => {
        //đoc cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            .split('=')[1];
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
        };

        const id = (window.location.pathname).split('/')
        fetch(`${apiUrl}/post-DisLike/` + id[2], requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result) {
                    setChange(!Change)
                }
            })
            .catch(error => console.log('error', error));
    }

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
                    navigate('/')
                } else {
                    console.log(result);
                }
            })
            .catch(error => console.log('error', error));

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

    //Click updata
    const ClickUpdata = () => {

    }

    //HTMl
    let body
    let body2
    let body3
    let body4

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
                <img src={Img} alt={''} />
            </>
        )
    }

    if (Loading) {
        if (Post.endTime1 === false) {
            //Button Edit
            if (UserId === PostUserId || Role === 'admin' || Role === 'qa-manager') {
                body2 = (
                    <>
                        <button onClick={clickDel}>Xoa</button>
                    </>
                )
            }

            //Button Edit
            if (UserId === PostUserId) {
                body3 = (
                    <>
                        <button onClick={ClickUpdata}>Edit</button>
                    </>
                )
            }

            // Button Del Comment


            //Body Main
            const listComment = Comment.map(data => (
                <div key={data._id}>
                    {/* <div>Name: {data.name}</div> */}
                    <div>Date: {new Date(data.createDateComment).toLocaleString()}</div>
                    <div>Comment: {data.comment}</div>
                </div>
            ))

            //admin || qa-manager
            body = (
                <>
                    <div>
                        <div>Name: {Post.name}</div>
                        <div>Date: {new Date(Post.dateCreate).toLocaleString()}</div>
                        <div>Category: {Post.category}</div>
                        {body4}
                        <p>Content: {Post.content}</p>
                        <p>View: {Post.numberView}</p>
                        <p>Like: {Post.Like}</p>
                        <p>Dislike: {Post.DisLike}</p>
                        <button onClick={clickLike}>Like</button>
                        <button onClick={clickDislick}>Dislike</button>
                        {body2}
                        {body3}
                    </div>
                    <div>
                        <h2>Bình Luận</h2>
                        <label>Binh luan</label>
                        <input type='text' value={inputComment} onChange={e => setinputComment(e.target.value)} />
                        <button onClick={uplaodComment}>Xac nhan</button>
                        {listComment}
                    </div>
                </>
            )
        } else {
            if (Post.lockPost === false) {
                if (Role === 'admin' || Role === 'qa-manager') {
                    body2 = (
                        <>
                            <button onClick={clickDel}>Xoa</button>
                        </>
                    )
                }
                //Body Main
                const listComment = Comment.map(data => (
                    <div key={data._id}>
                        <div>Name: {data.name}</div>
                        <div>Date: {new Date(data.createDateComment).toLocaleString()}</div>
                        <div>Comment: {data.comment}</div>
                    </div>
                ))
                body = (
                    <>
                        <div>
                            <div>Name: {Post.name}</div>
                            <div>Date: {new Date(Post.dateCreate).toLocaleString()}</div>
                            <div>Category: {Post.category}</div>
                            {body4}
                            <p>Content: {Post.content}</p>
                            <p>View: {Post.numberView}</p>
                            <p>Like: {Post.Like}</p>
                            <p>Dislike: {Post.DisLike}</p>
                            <button onClick={clickLike}>Like</button>
                            <button onClick={clickDislick}>Dislike</button>
                            {body2}
                        </div>
                        <div>
                            <h2>Bình Luận</h2>
                            <label>Binh luan</label>
                            <input type='text' value={inputComment} onChange={e => setinputComment(e.target.value)} />
                            <button onClick={uplaodComment}>Xac nhan</button>
                            {listComment}
                        </div>
                    </>
                )
            } else {
                if (UserId === PostUserId || Role === 'admin' || Role === 'qa-manager') {
                    body2 = (
                        <>
                            <button onClick={clickDel}>Xoa</button>
                        </>
                    )
                }
                //Body Main
                const listComment = Comment.map(data => (
                    <div key={data._id}>
                        <div>Name: {data.name}</div>
                        <div>Date: {new Date(data.createDateComment).toLocaleString()}</div>
                        <div>Comment: {data.comment}</div>
                    </div>
                ))

                body = (
                    <>
                        <div>
                            <div>Name: {Post.name}</div>
                            <div>Date: {new Date(Post.dateCreate).toLocaleString()}</div>
                            <div>Category: {Post.category}</div>
                            {body4}
                            <p>Content: {Post.content}</p>
                            <p>View: {Post.numberView}</p>
                            <p>Like: {Post.Like}</p>
                            <p>Dislike: {Post.DisLike}</p>
                            {body2}
                        </div>
                        <div>
                            <h2>Bình Luận</h2>
                            {listComment}
                        </div>
                    </>
                )
            }
        }

    } else {
        body = (
            <div>Loading...</div>
        )
    }

    return (
        body
    )
}

export default PostDetail
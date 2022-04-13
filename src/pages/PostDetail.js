import '../css/PostDetail.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const PostDetail = () => {
    const navigate = useNavigate()
    const [Loading, setLoading] = useState(false)
    const [Post, setPost] = useState([])
    const [Comment, setComment] = useState([])
    const [ChangeCommentMy, setChangeCommentMy] = useState(false)
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
    }, [navigate, Change, NameImg])

    //Get Comment
    useEffect(() => {
        //đoc cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            .split('=')[1];
        const getComment = () => {
            var myHeaders = new Headers();
            myHeaders.append("token", cookieValue);

            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const id = (window.location.pathname).split('/')
            if (ChangeCommentMy) {
                fetch(`${apiUrl}/post-comment-my/` + id[2], requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        setComment(result.message)
                    })
                    .catch(error => console.log('error', error));
            } else {
                fetch(`${apiUrl}/post-comment/` + id[2], requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        setComment(result.message)
                    })
                    .catch(error => console.log('error', error));
            }
        }
        getComment()
    }, [ChangeCommentMy, ChangeComment])

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

    //Click updata
    const ClickUpdata = () => {
        const id = (window.location.pathname).split('/')
        navigate('/post-eidt/' + id[2])
    }

    //Change comment
    const ClickChangeMyComment = () => {
        setChangeCommentMy(!ChangeCommentMy)
    }

    //Updata Comment
    const UpDataComment = (data) => {
        return (event) => {
            navigate('/updata-comment/' + data._id)
        }
    }

    //Del Comment
    const DelComment = (data) => {
        return (event) => {
            //đoc cookie
            const cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                .split('=')[1];
            var myHeaders = new Headers();
            myHeaders.append("token", cookieValue);

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch(`${apiUrl}/del-comment/` + data._id, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        setChangeComment(!ChangeComment)
                    } else {
                        alert(result.message)
                    }
                })
                .catch(error => console.log('error', error));
        }
    }
    //Updata Comment

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
                        <button className='PostDetail-btn-cc' onClick={clickDel}>Xoa</button>
                    </>
                )
            }

            //Button Edit
            if (UserId === PostUserId) {

                body3 = (
                    <>
                        <button className='PostDetail-btn-ccc' onClick={ClickUpdata}>Edit</button>
                    </>
                )
            }

            // Button Del Comment

            let listComment
            //Body Main
            if (UserId === PostUserId) {
                if (ChangeCommentMy) {
                    listComment = Comment.map(data => (
                        <div key={data._id} className='PostDetail-main-comment'>
                            <div className='PostDetail-comment-container'>
                                {/* <div>Name: {data.name}</div> */}
                                <div className='PostDetail-comment-titleDay'>Date: {new Date(data.createDateComment).toLocaleString()}</div>
                                <div className='PostDetail-comment-titleDay_container'>
                                    <div>Comment: {data.comment}</div>
                                    <div>
                                        <svg onClick={UpDataComment(data)} className="w-6 h-6 PostDetail-comment-titleDay_container_Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        <svg onClick={DelComment(data)} className="w-6 h-6 PostDetail-comment-titleDay_container_Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                } else {
                    listComment = Comment.map(data => (
                        <div key={data._id} className='PostDetail-main-comment'>
                            <div className='PostDetail-comment-container'>
                                {/* <div>Name: {data.name}</div> */}
                                <div className='PostDetail-comment-titleDay'>Date: {new Date(data.createDateComment).toLocaleString()}</div>
                                <div className='PostDetail-comment-titleDay_container'>
                                    <div>Comment: {data.comment}</div>
                                    <div>
                                        <svg onClick={DelComment(data)} className="w-6 h-6 PostDetail-comment-titleDay_container_Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            } else {
                if (ChangeCommentMy) {
                    listComment = Comment.map(data => (
                        <div key={data._id} className='PostDetail-main-comment'>
                            <div className='PostDetail-comment-container'>
                                {/* <div>Name: {data.name}</div> */}
                                <div className='PostDetail-comment-titleDay'>Date: {new Date(data.createDateComment).toLocaleString()}</div>
                                <div className='PostDetail-comment-titleDay_container'>
                                    <div>Comment: {data.comment}</div>
                                    <div>
                                        <svg onClick={UpDataComment(data)} className="w-6 h-6 PostDetail-comment-titleDay_container_Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        <svg onClick={DelComment(data)} className="w-6 h-6 PostDetail-comment-titleDay_container_Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                } else {
                    listComment = Comment.map(data => (
                        <div key={data._id} className='PostDetail-main-comment'>
                            <div className='PostDetail-comment-container'>
                                {/* <div>Name: {data.name}</div> */}
                                <div className='PostDetail-comment-titleDay'>Date: {new Date(data.createDateComment).toLocaleString()}</div>
                                <div className='PostDetail-comment-titleDay_container'>
                                    <div>Comment: {data.comment}</div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            }


            //admin || qa-manager
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
                                    <button className='PostDetail-btn-cc-Like' onClick={clickLike}>Like</button>
                                    <button className='PostDetail-btn-cc-DisLike' onClick={clickDislick}>Dislike</button>
                                </div>
                                <div className='PostDetail-btn-right'>
                                    {body2}
                                    {body3}
                                </div>
                            </div>
                            <div>
                                <h2>Comment</h2>
                                <div className='PostDetail-Comment-Main'>
                                    <div>
                                        <label>Comment </label>
                                        <input type='text' value={inputComment} onChange={e => setinputComment(e.target.value)} />
                                        <button className='PostDetail-btn-cc-comment' onClick={uplaodComment}>Submit</button>
                                    </div>
                                    <div>
                                        <button className='PostDetail-btn-cc-comment' onClick={ClickChangeMyComment}>My Comment</button>
                                    </div>
                                </div>
                                {listComment}
                            </div>
                        </div>
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
                                        <button className='PostDetail-btn-cc-Like' onClick={clickLike}>Like</button>
                                        <button className='PostDetail-btn-cc-DisLike' onClick={clickDislick}>Dislike</button>
                                    </div>
                                    <div className='PostDetail-btn-right'>
                                        {body2}
                                    </div>
                                </div>
                                <div>
                                    <h2>Comment</h2>
                                    <div className='PostDetail-Comment-Main'>
                                        <div>
                                            <label>Comment </label>
                                            <input type='text' value={inputComment} onChange={e => setinputComment(e.target.value)} />
                                            <button className='PostDetail-btn-cc-comment' onClick={uplaodComment}>Submit</button>
                                        </div>
                                        <div>
                                            <button className='PostDetail-btn-cc-comment' onClick={ClickChangeMyComment}>My Comment</button>
                                        </div>
                                    </div>
                                    {listComment}
                                </div>
                            </div>
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
                        <div className='PostDetail-Main'>
                            <div className='PostDetail-Main-container'>
                                <div>Name: {Post.name}</div>
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
                                    <div>
                                        {body2}
                                    </div>
                                </div>
                                <div>
                                    <h2>Comment</h2>
                                    {listComment}
                                </div>
                            </div>
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
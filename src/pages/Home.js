import '../css/home.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const Home = () => {
    const [Loading, setLoading] = useState(false)
    const [LoadingPost, setLoadingPost] = useState(false)
    const navigate = useNavigate()
    const [RoleAuth, setRoleAuth] = useState('')
    const [Posts, setPosts] = useState([])
    const [NumberPost, setNumberPost] = useState('')
    const [Time, setTime] = useState('')
    const [SortNumber, setSortNumber] = useState('0')
    const [ChangePage, setChangePage] = useState(false)
    const [PageNumber, setPageNumber] = useState(1)
    if (NumberPost === '') {
        setNumberPost('5')
    }

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
                    method: 'GET', headers: myHeaders, redirect: 'follow'
                };

                fetch(`${apiUrl}/`, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.success) {
                            setLoading(true)
                        } else {
                            setRoleAuth(data.role)
                            setLoading(true)
                        }
                    })
                    .catch(error => console.log('error', error));
            } else {
                navigate("/login")
            }
        }
        checklogin()
    }, [navigate])

    //Get POST
    useEffect(() => {
        const GetAllPost = () => {
            if (document.cookie.split(';').some((item) => item.trim().startsWith('accessToken='))) {
                //đoc cookie
                const cookieValue = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('accessToken='))
                    .split('=')[1];
                //fun

                var myHeaders = new Headers();
                myHeaders.append("token", cookieValue);

                var requestOptions = {
                    method: 'GET', headers: myHeaders, redirect: 'follow'
                };
                const urlSearchParams = new URLSearchParams(window.location.search);
                const params = Object.fromEntries(urlSearchParams.entries());

                //tao mang chu sort
                const sort = ['dateCreate', 'dateCreate', 'Like', 'Like', 'DisLike', 'DisLike', 'numberView', 'numberView']
                const sortty = ['-1', '1', '-1', '1', '-1', '1', '-1', '1']

                return fetch(`${apiUrl}/posts?page=${params.page}&page_size=${NumberPost}&sort=${sort[SortNumber]}&sortty=${sortty[SortNumber]}`, requestOptions)
                    .then(res => res.json())
                    .then(data => {
                        setPosts(data.dataPost)
                        setLoadingPost(true)
                    })
                    .catch(error => console.log('error', error));

            } else {
                navigate("/login")
            }
        }
        GetAllPost()
    }, [navigate, NumberPost, SortNumber, ChangePage])

    //click creact new Post
    const CreactPost = () => {
        navigate('/new-post')
    }

    //click creact new Category
    const CreactCategory = () => {
        navigate('/Category')
    }

    //click chuyển sang xem bài viết chi tiết
    const clickPostDetail = (data) => {
        return (event) => {
            //check Post co bi lock chua
            if (data.endTime1 === false) {
                //đoc cookie
                const cookieValue = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('accessToken='))
                    .split('=')[1];
                //fun
                var myHeaders = new Headers();
                myHeaders.append("token", cookieValue);

                var requestOptions = {
                    method: 'POST', headers: myHeaders, redirect: 'follow'
                };

                fetch(`${apiUrl}/post-view/${data._id}`, requestOptions)
                    .then(response => response.text())
                    .then(result => {
                        if (result) {
                            navigate('/post/' + data._id)
                        }
                    })
                    .catch(error => console.log('error', error));
            } else {
                if (data.lockPost === false) {
                    //đoc cookie
                    const cookieValue = document.cookie
                        .split('; ')
                        .find(row => row.startsWith('accessToken='))
                        .split('=')[1];
                    //fun
                    var myHeaderss = new Headers();
                    myHeaderss.append("token", cookieValue);

                    var requestOptionss = {
                        method: 'POST', headers: myHeaderss, redirect: 'follow'
                    };

                    fetch(`${apiUrl}/post-view/${data._id}`, requestOptionss)
                        .then(response => response.text())
                        .then(result => {
                            if (result) {
                                navigate('/post/' + data._id)
                            }
                        })
                        .catch(error => console.log('error', error));
                } else {
                    navigate('/post/' + data._id)
                }
            }
        }
    }

    //click logout
    const logout = () => {
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.reload();
    }

    //Time
    useEffect(() => {
        const d = new Date()
        const time = setInterval(() => {
            setTime(`${("0" + (d.getHours())).slice(-2)}:${("0" + (d.getMinutes())).slice(-2)}:${("0" + (d.getSeconds())).slice(-2)}`)
        }, 1000);

        return () => {
            clearInterval(time)
        }
    }, [Time])


    //clickPageQA
    const clickPageMa = () => {
        navigate('/manager')
    }

    //clickPageQA
    const clickPageAdmin = () => {
        navigate('/admin')
    }

    //clickPage Statistical
    const clickPageStatistical = () => {
        navigate('/statistical')
    }

    //ClickPage Export
    const clickPageExport = () => {
        navigate('/export')
    }

    //ClickPage Revie
    const clickPageReview = () => {
        navigate('/review')
    }

    const ClickNextPage = () => {
        const id = (window.location.search).split('=')
        const Page = Number(id[1]) + 1
        navigate(`/?page=${Page}`)
        setChangePage(!ChangePage)
        setPageNumber(PageNumber + 1)
    }

    const ClickBackPage = () => {
        const id = (window.location.search).split('=')
        const Page = Number(id[1]) - 1
        navigate(`/?page=${Page}`)
        setChangePage(!ChangePage)
        setPageNumber(PageNumber - 1)
    }

    //html 4
    //kiểm tra Admin or Qa xuất hiện đường dẫn tới nơi quản lý
    let PageMagAccount
    if (RoleAuth === 'admin') {
        PageMagAccount = (
            <>
                <button className='Home-btn-PageMa' onClick={clickPageAdmin}>Page Admin</button>
                <button className='Home-btn-PageMa' onClick={clickPageStatistical}>Page Statistical</button>
                <button className='Home-btn-PageMa' onClick={clickPageExport}>Page Export</button>
                <button className='Home-btn-PageMa' onClick={clickPageReview}>Page Review</button>
            </>

        )
    } else if (RoleAuth === 'qa-manager') {
        PageMagAccount = (
            <>
                <button className='Home-btn-PageMa' onClick={clickPageMa}>Page QA Manager</button>
                <button className='Home-btn-PageMa' onClick={clickPageStatistical}>Page Statistical</button>
                <button className='Home-btn-PageMa' onClick={clickPageExport}>Page Export</button>
                <button className='Home-btn-PageMa' onClick={clickPageReview}>Page Review</button>
            </>
        )
    }

    //html 4
    //Bộ lọc
    let sort
    sort = (
        <>
            <select onChange={e => setSortNumber(e.target.value)}>
                <option value='0'>Latest Posts</option>
                <option value='1'>Oldest post</option>
                <option value='2'>Post Likes Most</option>
                <option value='3'>Lowest Post Likes</option>
                <option value='4'>Most Post Disliked</option>
                <option value='5'>Lowest Post Dislike</option>
                <option value='6'>Post with high views</option>
                <option value='7'>Post with Low View</option>
            </select>
        </>
    )


    //html 3
    let changeNumberPost
    changeNumberPost = (
        <>
            <select onChange={e => setNumberPost(e.target.value)} value={NumberPost}>
                <option value='5'>5</option>
                <option value='10'>10</option>
                <option value='15'>15</option>
                <option value='20'>20</option>
                <option value='25'>25</option>
                <option value='30'>30</option>
                <option value='35'>35</option>
                <option value='40'>40</option>
            </select>
        </>
    )

    //HTML 2
    let bodyPost
    if (LoadingPost) {
        if (Posts.length !== 0) {
            const listPost = Posts.map(data => (
                <div className='post' key={data._id} onClick={clickPostDetail(data)}>
                    <div>
                        {/* <h4>Name: {data.name}</h4> */}
                    </div>
                    {/* <div>
                        <h4>User</h4>
                    </div> */}
                     <div>
                        <h4>Title: {data.title}</h4>
                    </div>
                    <div>
                        <p>Date Submitted: {new Date(data.dateCreate).toLocaleString()}</p>
                    </div>
                    <div>
                        <p>Category: {data.category}</p>
                    </div>
                    <div className='Home-bottom-card'>
                        <div className='Home-view-number1'>
                            <p>Like: {data.Like}</p>
                        </div>
                        <div className='Home-view-number2'>
                            <p>DisLike: {data.DisLike}</p>
                        </div>
                        <div className='Home-view-number3'>
                            <p>View: {data.numberView}</p>
                        </div>
                    </div>
                </div>))

            bodyPost = (<div>
                {listPost}
            </div>)
        } else {
            bodyPost = (<>
                <h1 className='loading'>There are no posts yet</h1>
            </>)
        }

    } else {
        bodyPost = (<div className='loading'>Loading Posts...</div>)
    }

    //HTML 1
    let body
    //GET today
    const d = new Date()
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = `${weekday[d.getDay()]}, ${d.getDate()} ${month[d.getMonth()]} ${d.getFullYear()}`

    //HTMl
    if (Loading) {
        if (RoleAuth === 'admin' || RoleAuth === 'qa-manager') {
            body = (<div className='Home-body'>
                <header className='Home-header'>
                    <div>
                        <p className='Home-Logo'>GreenWich</p>
                    </div>
                    <div className='Home-header__btn'>
                        {PageMagAccount}
                        <button className='Home-btn-logout' onClick={logout}>Log out</button>
                    </div>
                </header>
                <div className='top'>
                    <div>
                        <h1>Hello, </h1>
                        <p>Today is {today}</p>
                        <p>Time: {Time}</p>
                    </div>
                    <div>
                        <button className='Home-btn-body' onClick={CreactPost}>Create new Post</button>
                        <button className='Home-btn-body' onClick={CreactCategory}>View Category</button>
                        {sort}
                        {changeNumberPost}
                    </div>
                </div>
                <div className='All-Posts'>
                    {bodyPost}
                </div>
                <div className='Home__NextPage_Main'>
                    <svg onClick={ClickBackPage} className="w-6 h-6 Home__NextPage_Main_Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                    <h2>{PageNumber}</h2>
                    <svg onClick={ClickNextPage} className="w-6 h-6 Home__NextPage_Main_Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                </div>
            </div>)
        } else {
            body = (
                <div className='Home-body'>
                    <header className='Home-header'>
                        <div>
                            <p className='Home-Logo'>Logo</p>
                        </div>
                        <div className='Home-header__btn'>
                            <div>
                                <button className='Home-btn-logout' onClick={logout}>Log out</button>
                            </div>
                        </div>
                    </header>
                    <div className='top'>
                        <div>
                            <h1>Hello, </h1>
                            <p>Today is {today}</p>
                            <p>Time: {Time}</p>
                        </div>
                        <div>
                            <button className='Home-btn-body' onClick={CreactPost}>Create new Post</button>
                            {sort}
                            {changeNumberPost}
                        </div>
                    </div>
                    <div className='All-Posts'>
                        {bodyPost}
                    </div>
                    <div className='Home__NextPage_Main'>
                        <svg onClick={ClickBackPage} className="w-6 h-6 Home__NextPage_Main_Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                        <h2>{PageNumber}</h2>
                        <svg onClick={ClickNextPage} className="w-6 h-6 Home__NextPage_Main_Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    </div>
                </div>)
        }
    } else {
        body = (<>
            <div className='loading'>loading...</div>
        </>)
    }

    return (body)
}

export default Home
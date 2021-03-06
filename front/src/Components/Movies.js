import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom'
import '../Styles/Movies.css'
import Menu from "./Menu";
import { Layout, Carousel, } from "antd";

const { Footer, Content } = Layout;

const Movies = props => {
    const [initialized, setInitialized] = useState(false);
    const [movies, setMovies] = useState([]);
    const [showInfo, setShowInfo] = useState({
        show: false,
        name: "",
        description: "",
        img: "",
    });
    const [profile, setProfile] = useState({
        likedMovies: []
    });
    const [data, setData] = useState(null);
    const [likes, setLikes] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [q, setQuery] = useState('batman');


    const loadMovies = () => {
        fetch("/get/Movies")
            .then(res => res.json())
            .then((result) => {
                console.log("Movieeeeeees ", result);
                setMovies(result);
            });
    };

    const loadProfile = () => {
        fetch("/getProfile")
            .then(res => res.json())
            .then((result) => {
                if (!result.likedMovies)
                    result.likedMovies = [];
                setProfile(result);
            });
    };

    const changeInfo = (id,name, img, description) => {
        setShowInfo({_id: id, show: true, name: name,description:description,img:img});
        console.log(showInfo);
    };

    const likeMovie = async (id, _id, name) => {
        console.log("puuuuuuuuuut movieeeee ", id, " movie id ", _id);
        const data = {
            "movie":{
                "id": _id,
                "name": name
            }
        };
        console.log(data);
        const response = await fetch(`/users/${id}/likedMovies`,{
            method: "PUT",
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        //convert response to Json format
        const myJson = await response.json();
        console.log(myJson);
        setShowInfo({show: false});
        setLikes({_id: 1});
        console.log(likes);
    };

    let flag = false;
    const ShowSideMenu = () => {

        var element = document.getElementById('menu');
        if(flag){
            element.style.transform = 'translate(18vw)';
        }else{
            element.style.transform = 'translate(-18vw)';
        }
        element.style.zIndex = '25';
        element.style.transition = 'transform 500ms';
        flag = !flag;
    };

    useEffect(() => {
        if (!initialized) {
            loadMovies();
            loadProfile();
            setInitialized(true);
        }
        setLoading(true);
        setError(null);
        setData(null);

        fetch(`//www.omdbapi.com/?s=${q}&apikey=${process.env.REACT_APP_OMDB_APIKEY}`)
            .then(resp => resp)
            .then(resp => resp.json())
            .then(response => {
                console.log(response);
                console.log(process.env.REACT_APP_OMDB_APIKEY);
                console.log(process.env.REACT_APP_APIKEY);
                console.log(`//www.omdbapi.com/?s=${q}&apikey=${[process.env.REACT_APP_OMDB_APIKEY]}`);
                if (response.Response === 'False') {
                    setError(response.Error);
                }
                else {
                    setData(response.Search);
                }

                setLoading(false);
            })
            .catch(({message}) => {
                setError(message);
                setLoading(false);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q]);

    const info = () => {
       console.log(likes);
    };

    return (
        <Layout className="movie-container">

            <div className="movie-header">
                <div className="movie-header-navbar space">
                    <img className = "movie-header-navbar-logo" src={require("../Assets/dasure-01.png")} alt="Series" onClick={() => props.history.push('/')} />
                    <img className = "movie-header-hamburger" src={require("../Assets/menu-button.svg")} alt="Notificaciones" onClick={ShowSideMenu}/>
                    <div className="movie-home-menu-collapse" id="menu">
                        <Menu/>
                    </div>
                </div>
                <img className = "movie-logo" src={require("../Assets/Movies-white.svg")} alt="Movies" onClick={() => props.history.push('/')} />
                <div className="movie-header-title">
                    <h1 className="movie-header-title-text">
                        Películas
                    </h1>
                </div>
            </div>
            <Content className="content-movie">
                <div className=" container-movies">
                    <Carousel className="carousel-general" autoplay autoplaySpeed="100" dotPosition="top">
                        <div>
                            <div className="movie-general">
                                <div className="movie-specific">
                                    {movies.map((m, id) => {
                                        let bg = m.image;
                                        return (
                                            <div className="movie-wrapper">
                                                <div className="movie-cols">
                                                    <div className="movie-col" onTouchStart="this.classList.toggle('hover');">
                                                        <div className="movie-poster-container" onClick={() => changeInfo(m._id, m.name, m.image, m.description)}>
                                                            <div className="movie-front"
                                                                 style={{ backgroundImage: `url(${bg}` }}>
                                                                <div className="movie-inner">
                                                                </div>
                                                            </div>
                                                            <div className="movie-back">
                                                                <div className="movie-inner">
                                                                    <p className="title-inner">{m.name}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="movie-specific">
                                    {data !== null && data.length > 0 && data.map((result, index) => {
                                        let bg = result.Poster;
                                        return (
                                            <div className="movie-wrapper">
                                                <div className="movie-cols">
                                                    <div className="movie-col" onTouchStart="this.classList.toggle('hover');">
                                                        <div className="movie-poster-container" onClick={() => changeInfo(result.imdbID, result.Title, result.Poster, result.Plot)}>
                                                            <div className="movie-front"
                                                                 style={{ backgroundImage: `url(${bg}` }}>
                                                                <div className="movie-inner">
                                                                </div>
                                                            </div>
                                                            <div className="movie-back">
                                                                <div className="movie-inner">
                                                                    <p className="title-inner">{result.Title}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </Carousel>
                </div>
                {showInfo.show ?
                    (<div className="movie-white-container">
                            <div><button className={"movie-button-close"} onClick={()=>setShowInfo({show: false})}>X</button></div>
                            <div className="container-single-movie" id="person">
                                <div className="container-single-poster-movie">
                                    <div className="container-photo-single-movie">
                                        <img src={showInfo.img} alt={showInfo.name} className="img-single-movie" />
                                    </div>
                                </div>
                                <div className="container-info-single-movie">
                                    <p className="name-single-movie" onClick={() => info()}>{showInfo.name}</p>
                                    <p className="description-single-movie">{showInfo.description}</p>
                                </div>
                            </div>
                            {
                                profile._id === undefined ?
                                    <div />
                                    :
                                    <div className="movie-like-container">
                                        {
                                           profile.likedMovies !== undefined && profile.likedMovies.filter(data => (data.id == showInfo._id)).length > 0 ?
                                                <div>
                                                    <img className="movie-like-logo" src={require("../Assets/like.svg")} alt="Series" />
                                                    <p className="movie-like-count">1</p>
                                                </div>
                                                :
                                                <div>
                                                    <img className = "movie-like-logo" src={require("../Assets/like.svg")} alt="Series" onClick={() => likeMovie(profile._id,showInfo._id,showInfo.name)} />
                                                </div>
                                        }
                                    </div>
                            }

                        </div>
                    )
                    :
                    <div />}
            </Content>
            <Footer className="movies-footer">
            </Footer>
        </Layout>
    )

};

export default withRouter(Movies);
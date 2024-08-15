const API_KEY = `api_key=6f7e55953e37384f7e16a2e60c6a1700`;
const HOME_PAGE_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const IMG_URL = `https://image.tmdb.org/t/p/w500/`
const MAIN_SEARCH_URL = `https://api.themoviedb.org/3/search/movie?query=`
let SEARCH_URL = ``;


const main = document.querySelector(".main")
const form = document.querySelector("#form")
const search = document.querySelector(".search")
const prev = document.querySelector("#prev")
const next = document.querySelector("#next")
const current = document.querySelector(".current")


let currentPage = 1;
let nextPages = 2;
let previousPages = 3;
let lastPage = 100;


getMovies(HOME_PAGE_URL)


prev.addEventListener("click", prevPage)
next.addEventListener("click", nextPage)


form.addEventListener("submit", (e)=>{
    e.preventDefault();

    console.log(search.value)
    if(search.value){
        SEARCH_URL = `${MAIN_SEARCH_URL}${search.value}&`+API_KEY;
        getMovies(SEARCH_URL)
    }else{
        getMovies(HOME_PAGE_URL)
    }
})


function getMovies(url){
    main.innerHTML = "";
    fetch(url).then(res => res.json()).then(data=>{
        getMovie(data.results)


        currentPage = data.page;
        lastPage = data.total_pages;

        current.innerHTML = currentPage

        pagination(currentPage, data)

    })

}

function getMovie(data){
    data.forEach((movie)=>{
        const {title, overview, poster_path, vote_average} = movie

        let movieDiv = document.createElement("div")
        movieDiv.classList.add("movie")

        movieDiv.innerHTML = `
        <div class="movieCard">
            <div class="movieImg-wrapper"><img class="movieImg" src="${IMG_URL+poster_path}" alt=""></div>

            <div class="movieInfo">
                <div class="movieTitle-wrapper"><p class="movieTitle text">${title}</p></div>
                <div class="movieScore-wrapper text"><p class="movieScore text ${voteColor(vote_average)}">${vote_average.toFixed(1)}</p></div>
            </div>
        </div>

        <div class="overview"><p class="overview-text text"><strong class="strong">Overview</strong> <br><br>${overview}</p></div>
        `

        main.appendChild(movieDiv)

    })
}

function voteColor(vote){
    if(vote.toFixed(1) >= 8){
        return `green`;
    }
    else if(vote.toFixed(1) < 8 && vote.toFixed(1) >= 5){
        return `orange`;
    }else{
        return `red`;
    }
}


function nextPage(e){
    if(search.value.length == 0){
        let nextPageUrl = `${HOME_PAGE_URL}&page=${nextPages}`

        if(currentPage == lastPage){
            e.preventDefault()
        }else{
            getMovies(nextPageUrl)
    
        }
    }else{
        let nextPageUrl = `${SEARCH_URL}&page=${nextPages}`

        if(currentPage == lastPage){
            e.preventDefault()
        }else{
            getMovies(nextPageUrl)
    
        }
    }
}

function prevPage(e){
    if(search.value.length == 0){
        let prevPageUrl = `${HOME_PAGE_URL}&page=${previousPages}`

        if(currentPage == 1){
            e.preventDefault()
        }else{
            getMovies(prevPageUrl)
    
        }
    }else{
        let prevPageUrl = `${SEARCH_URL}&page=${previousPages}`

        if(currentPage == 1){
            e.preventDefault()
        }else{
            getMovies(prevPageUrl)
    
        }
    }

}



function pagination(currentPage, data){
    nextPages = currentPage+1;
    previousPages = currentPage-1;

    if(currentPage == 1){
        prev.classList.add(`disabled`)
        next.classList.remove(`disabled`)

    }else if(currentPage == data.total_pages){
        next.classList.add(`disabled`)
        prev.classList.remove(`disabled`)

    }else if(currentPage != 1 && currentPage != data.total_pages){
        prev.classList.remove(`disabled`)
        next.classList.remove(`disabled`)
    }
}

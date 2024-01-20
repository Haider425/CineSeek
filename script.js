const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const rated = document.querySelector('.rated');
let scrollConatiner = document.querySelector('.gallery');
let backbtn = document.getElementById('backbtn');
let nextbtn = document.getElementById('nextbtn');

const API_key = 'api_key=35df28cb33a332d4a275855e6ebd739d';
const base_url = 'https://api.themoviedb.org/3';
const api_url = base_url + '/discover/movie?sort_by=popularity.desc&' + API_key;

const img_url = 'https://image.tmdb.org/t/p/w500';
const main = document.getElementById('main');

getMovies(api_url);

function getMovies(url){
    fetch(url)
        .then(res => res.json())
        .then(data => {
            showMovies(data.results);
        });
}

function showMovies(data) {
    main.innerHTML = '';

    for (let index = 0; index < 15; index++) {
        const { title, poster_path } = data[index];
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <span class="movie-${index + 1}">
                <img src="${img_url + poster_path}" alt="${title}" class="poster" id="poster-${index + 1}" 
                style="width: 250px; height: auto;">
                <h3 class="movie-title">${title}</h3>
            </span>
        `;
        main.appendChild(movieEl);
        movieEl.addEventListener('click', () => {
              searchList.classList.add('hide-search-list');
                const result = fetch(`https://www.omdbapi.com/?t=${title}&apikey=9ed72d41`);
                result.then(res => res.json())
                    .then(data => {
                        displayMovieDetails(data);
                        window.scrollTo(0, 0);
                
                    });

        });
    }
}


async function loadMovies(searchTerm){
    const URL = `https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=9ed72d41`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
  
}

function findMovies(){
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
       
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies){
    console.log(movies);

    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; 
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "Images/image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>

        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=9ed72d41`);
            
            const movieDetails = await result.json();
         
            displayMovieDetails(movieDetails);

            
        });
    });
}

function displayMovieDetails(details){
    console.log(details);
    resultGrid.innerHTML = `
   
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "Images/image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
    <ul class = "movie-misc-info">  
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class="imbdb-rating"><b><i class="fas fa-star"></i></b> ${details.imdbRating}</p>
      </ul>
        
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
    </div>
    <div class = "spacing"></div>
    `;


    switch(details.Rated) {
        case 'G':
          document.querySelector('.rated').style.backgroundColor = '#2ecc71';
          break;
        case 'PG':
          document.querySelector('.rated').style.backgroundColor = '#f1c40f';
          break;
        case 'PG-13':
          document.querySelector('.rated').style.backgroundColor = '#e67e22';
          break;
        case 'R':
          document.querySelector('.rated').style.backgroundColor = '#740006ca';
          break;
        default:
          document.querySelector('.rated').style.backgroundColor = '#3498db';
      }
}




window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
    }
});

scrollConatiner.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    scrollConatiner.scrollLeft += evt.deltaY;
    scrollConatiner.style.scrollBehavior = "auto";
});

nextbtn.addEventListener('click', () => {
    scrollConatiner.style.scrollBehavior = "smooth";
    scrollConatiner.scrollLeft += 600;
});

backbtn.addEventListener('click', () => {
    scrollConatiner.style.scrollBehavior = "smooth";
    scrollConatiner.scrollLeft -= 600;
});

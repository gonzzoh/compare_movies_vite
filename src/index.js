import Chart from 'chart.js/auto'
import defaultMovies from '../movie-data.json'
import './style.css'

/* ------------------------------ Keys & Values ----------------------------- */
const setLocalStorageKey = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

const getLocalStorageValue = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key))
    } catch (err) {
        console.log(err)
    }
}
// setLocalStorageKey('movie', movies)
// const localMovies = getLocalStorageValue("movies")
// console.log("localMovies:", localMovies);

/* ----------------------------- Movie Functions ---------------------------- */
export const getMovies = () => {
    return getLocalStorageValue('movies') || [];                     // short circuting 
}

export const setmovies = (movies) => {
    setLocalStorageKey('movies', movies)
}

export const addmovies = (newMovie) => {
    setmovies([newMovie, ...getMovies()])
}

export const initmoviesIfEmpty = () => {
    if (!getMovies.length) setmovies(defaultMovies)
}

// const localMovies = getMovies().forEach(console.log)
const movies = getMovies();
console.log("localMovies:", movies);

/* ------------------------------ Dom Functions ----------------------------- */
let display = document.getElementById("movieDisplay");
let newMovie = false;

const loadMovies = () => {
    let load;
    newMovie === true ? load = getMovies() : load = defaultMovies;
    display.innerHTML = ""

    load.forEach(movie => {
        let movieCard = document.createElement("div");
        let movieTitle = document.createElement("h3");
        let movieInfo = document.createElement("p");

        movieCard.classList.add("movieCard")
        movieTitle.textContent = movie.title
        movieInfo.innerHTML = `
        Critic Score: ${movie.criticScore}
        Audience Score: ${movie.audienceScore}
        Domestic Gross Sales: ${movie.domestic}
        Genre: ${movie.genre}
    `
        movieCard.append(movieTitle, movieInfo)
        display.append(movieCard)
    })
}

const createMovie = (criteria) => {
    const customMovie = {}

    customMovie.criticScore = Number(criteria[1])
    customMovie.audienceScore = Number(criteria[2])
    customMovie.genre = criteria[4]
    customMovie.title = criteria[0]
    customMovie.domestic = Number(criteria[3])

    return customMovie;
}

const handleSubmit = (e) => {
    e.preventDefault();
    display.innerHTML = ""
    const form = e.target;
    const formData = new FormData(e.target);
    const { title, criticScore, audienceScore, domesticGrossSales, genre } = Object.fromEntries(formData);

    let movieInfo = [title, criticScore, audienceScore, domesticGrossSales, genre]

    let created = createMovie(movieInfo)
    addmovies(created);

    newMovie = true
    loadMovies(newMovie)
    form.reset();
};

const reset = () => {
    newMovie = false
    loadMovies(newMovie)
}

/* -------------------------------- Chart.js -------------------------------- */
const domesticPerGenre = document.getElementById('domesticChart');
const genreQuantity = document.getElementById('genreQuantityChart');


const domesticByGenre = () => {
    const genresDomestic = {};
    movies.forEach(movie => genresDomestic[movie.genre] = 0);
    for (let i = 0; i < movies.length; i++) {
        genresDomestic[movies[i].genre] += movies[i].domestic;
    }
    console.log("genresDomestic:", genresDomestic);
    return genresDomestic;
};

const genresData = Object.entries(domesticByGenre()).map(([genre, totalSales]) => ({ genre, totalSales }));
genresData.sort((a, b) => b.totalSales - a.totalSales);

new Chart(domesticPerGenre, {
    type: 'bar',
    data: {
        labels: genresData.map(data => data.genre),
        datasets: [{
            label: 'Total Domestic Sales by Genre',
            data: genresData.map(data => data.totalSales),
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


new Chart(genreQuantity, {
    type: 'pie',
    data: {
        labels: movies.map(movie => movie.genre),
        datasets: [{
            label: 'Quantity of Movies by Genre',
            data: movies.map(movie => movie.genre),
            borderWidth: 1
        }]
    }
})

/* ---------------------------------- MAIN ---------------------------------- */
const main = () => {
    initmoviesIfEmpty();

    let form = document.getElementById("new-movie-form");
    form.addEventListener("submit", handleSubmit);

    let resetBtn = document.getElementById("reset");
    resetBtn.addEventListener("click", reset)

    domesticByGenre()

    loadMovies()
}

main();
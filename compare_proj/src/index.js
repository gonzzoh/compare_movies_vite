import './style.css'


let defaultMovies = [
    { "criticScore": 88, "audienceScore": 83, "domestic": 635763484, "genre": "comedy", "title": "Barbie" },
    { "criticScore": 59, "audienceScore": 95, "domestic": 574934330, "genre": "action", "title": "Mario Bros" },
    { "criticScore": 96, "audienceScore": 94, "domestic": 381311319, "genre": "adventure", "title": "Spiderverse" },
    { "criticScore": 82, "audienceScore": 94, "domestic": 358995815, "genre": "action", "title": "GOTG Vol. 3" },
    { "criticScore": 93, "audienceScore": 91, "domestic": 324130510, "genre": "drama", "title": "Oppenheimer" },
    { "criticScore": 67, "audienceScore": 94, "domestic": 298172056, "genre": "adventure", "title": "The Little Mermaid" },
    { "criticScore": 76, "audienceScore": 92, "domestic": 283067859, "genre": "action", "title": "Avatar 2" },
    { "criticScore": 46, "audienceScore": 82, "domestic": 214506909, "genre": "action", "title": "Ant-Man" },
    { "criticScore": 94, "audienceScore": 93, "domestic": 187131806, "genre": "action", "title": "John Wick 4" },
    { "criticScore": 69, "audienceScore": 88, "domestic": 174480468, "genre": "adventure", "title": "Indiana Jones 5" },
    { "criticScore": 96, "audienceScore": 94, "domestic": 172135383, "genre": "action", "title": "Mission Impossible 7" },
    { "criticScore": 52, "audienceScore": 91, "domestic": 157066392, "genre": "action", "title": "Transformers Beast" },
    { "criticScore": 88, "audienceScore": 96, "domestic": 156248615, "genre": "drama", "title": "Creed 3" },
    { "criticScore": 74, "audienceScore": 93, "domestic": 154426697, "genre": "adventure", "title": "Elemental" },
    { "criticScore": 56, "audienceScore": 84, "domestic": 145960660, "genre": "action", "title": "Fast X" },
    { "criticScore": 99, "audienceScore": 98, "domestic": 131997540, "genre": "concert", "title": "Taylor Swift Eras" },
    { "criticScore": 95, "audienceScore": 94, "domestic": 124312675, "genre": "adventure", "title": "Puss In Boots 2" },
    { "criticScore": 96, "audienceScore": 90, "domestic": 118610556, "genre": "adventure", "title": "TMNT" },
    { "criticScore": 76, "audienceScore": 91, "domestic": 108161389, "genre": "horror", "title": "Scream 6" },
    { "criticScore": 93, "audienceScore": 78, "domestic": 95043350, "genre": "horror", "title": "M3gan" },
    { "criticScore": 91, "audienceScore": 93, "domestic": 93277026, "genre": "adventure", "title": "D&D" },
    { "criticScore": 75, "audienceScore": 94, "domestic": 91746064, "genre": "action", "title": "The Equalizer 3" },
    { "criticScore": 52, "audienceScore": 73, "domestic": 85588302, "genre": "horror", "title": "The Nun 2" },
    { "criticScore": 28, "audienceScore": 73, "domestic": 82600317, "genre": "action", "title": "Meg 2" },
    { "criticScore": 38, "audienceScore": 70, "domestic": 82156962, "genre": "horror", "title": "Insidious" },
    { "criticScore": 78, "audienceScore": 92, "domestic": 72432543, "genre": "action", "title": "Blue Beetle" },
    { "criticScore": 37, "audienceScore": 84, "domestic": 67625828, "genre": "comedy", "title": "Haunted Mansion" },
    { "criticScore": 84, "audienceScore": 76, "domestic": 67233054, "genre": "horror", "title": "Evil Dead Rise" },
    { "criticScore": 66, "audienceScore": 71, "domestic": 64388510, "genre": "comedy", "title": "Cocaine Bear" },
    { "criticScore": 70, "audienceScore": 97, "domestic": 64267657, "genre": "comedy", "title": "A Man Called Otto" }
]

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

const loadMovies = () => {
    display.innerHTML = ""
    getMovies().forEach(movie => {
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

    loadMovies()
    form.reset();
};


/* ---------------------------------- MAIN ---------------------------------- */
const main = () => {
    initmoviesIfEmpty();

    let form = document.getElementById("new-movie-form");
    form.addEventListener("submit", handleSubmit);

    loadMovies()
}

main();
const API_KEY = 'cc31d08b0d4b5b3539a406e5af2aec1f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w342';
const moviesContainer = document.getElementById('moviesContainer');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const toggleThemeButton = document.getElementById('toggleThemeButton');
const genreSelect = document.getElementById('genreSelect');
const spinner = document.getElementById('spinner');

// Toggle between light and dark themes
toggleThemeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    toggleThemeButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
});

// Fetch movies based on query or top-rated
async function fetchMovies(query = '', genreId = '') {
    spinner.style.display = 'block'; // Show spinner
    const endpoint = query
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${query}`
        : genreId
        ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
        : `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`;

    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    } finally {
        spinner.style.display = 'none'; // Hide spinner
    }
}

// Display movies in the DOM
function displayMovies(movies) {
    moviesContainer.innerHTML = ''; // Clear previous results
    movies.forEach((movie, index) => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';

        const fullImageUrl = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : 'https://via.placeholder.com/280x400';
        movieCard.innerHTML = `
            <img src="${fullImageUrl}" alt="${movie.title}">
            <div class="movie-details">
                <h3>${movie.title}</h3>
                <p>${movie.overview.slice(0, 100)}...</p>
                <p><strong>Rating:</strong> ${movie.vote_average}</p>
                <p><strong>Release:</strong> ${movie.release_date}</p>
            </div>
        `;

        movieCard.addEventListener('click', () => {
            window.location.href = `https://www.themoviedb.org/movie/${movie.id}`;
        });

        moviesContainer.appendChild(movieCard);

        setTimeout(() => {
            movieCard.classList.add('animate');
        }, index * 100);
    });
}

// Event listener for search
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    fetchMovies(query);
});

// Event listener for genre selection
genreSelect.addEventListener('change', () => {
    const selectedGenre = genreSelect.value;
    fetchMovies('', selectedGenre);
});

// Fetch top-rated movies on page load
fetchMovies();

class Song {
    constructor(name, artist, genre, format, rating, hasVideo) {
        this.name = name;
        this.artist = artist;
        this.genre = genre;
        this.format = format;
        this.rating = rating;
        this.hasVideo = hasVideo;
        this.id = Date.now();
        this.dateAdded = new Date();
    }

    toHTML() {
        const stars = '★'.repeat(this.rating) + '☆'.repeat(10 - this.rating);
        const ratingClass = this.rating <= 3 ? 'low' : (this.rating <= 7 ? 'medium' : 'high');
        
        return `
            <div class="song-item" data-id="${this.id}">
                <div class="song-title">🎵 ${this.name}</div>
                <div class="song-details">
                    <span>👤 ${this.artist}</span>
                    <span>🎸 ${this.genre}</span>
                    <span>💿 ${this.format}</span>
                    <span class="rating-stars">${stars}</span>
                    <span class="rating-badge ${ratingClass}">${this.rating}/10</span>
                    ${this.hasVideo ? '<span class="video-badge">🎥 Video</span>' : ''}
                </div>
            </div>
        `;
    }

    toString() {
        const videoText = this.hasVideo ? ' | With video' : '';
        return `${this.name} | ${this.artist} | ${this.genre} | ${this.format} | Rating: ${this.rating}/10${videoText}`;
    }

    formatDate() {
        const date = this.dateAdded;
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }
}

let songs = [];

const DOM = {
    songName: null,
    artist: null,
    genre: null,
    rating: null,
    hasVideo: null,
    formatRadios: null,
    playlistContainer: null,
    addBtn: null,
    songForm: null,
    saveBtn: null,
    sortBtn: null
};

function getSelectedFormat() {
    for (let radio of DOM.formatRadios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return 'Single';
}

function updateRatingDisplay() {
    const ratingSlider = document.getElementById('rating');
    let ratingDisplay = document.getElementById('ratingDisplay');
    
    if (!ratingDisplay && ratingSlider) {
        ratingDisplay = document.createElement('span');
        ratingDisplay.id = 'ratingDisplay';
        ratingDisplay.className = 'rating-value';
        ratingSlider.parentNode.appendChild(ratingDisplay);
    }
    
    if (ratingSlider && ratingDisplay) {
        const value = ratingSlider.value;
        const percent = (value - 1) / 9 * 100;
        ratingDisplay.textContent = `Rating: ${value}`;
        ratingDisplay.style.left = `calc(${percent}% - 30px)`;
        
        ratingDisplay.classList.remove('low', 'medium', 'high');
        if (value <= 3) {
            ratingDisplay.classList.add('low');
        } else if (value <= 7) {
            ratingDisplay.classList.add('medium');
        } else {
            ratingDisplay.classList.add('high');
        }
    }
}

function displayPlaylist() {
    if (!DOM.playlistContainer) return;
    
    if (songs.length === 0) {
        DOM.playlistContainer.innerHTML = '<div class="empty-playlist">🎵 No songs added yet</div>';
        return;
    }

    let html = '';
    songs.forEach(song => {
        html += song.toHTML();
    });

    DOM.playlistContainer.innerHTML = html;
}

function addSong(event) {
    if (event) {
        event.preventDefault();
    }

    const name = DOM.songName.value.trim();
    const artist = DOM.artist.value.trim();
    const genre = DOM.genre.value;
    const rating = parseInt(DOM.rating.value);
    const hasVideo = DOM.hasVideo.checked;
    const format = getSelectedFormat();

    if (!name) {
        alert('Please enter song name!');
        DOM.songName.focus();
        return;
    }

    if (!artist) {
        alert('Please enter artist name!');
        DOM.artist.focus();
        return;
    }

    const newSong = new Song(name, artist, genre, format, rating, hasVideo);
    songs.push(newSong);
    
    alert(`"${name}" added successfully!`);
    
    DOM.songName.value = '';
    DOM.artist.value = '';
    DOM.rating.value = 5;
    DOM.hasVideo.checked = false;
    
    if (DOM.formatRadios && DOM.formatRadios[0]) {
        DOM.formatRadios[0].checked = true;
    }
    
    DOM.songName.focus();
    displayPlaylist();
    
    console.log('Song added:', newSong);
    console.log('Total songs:', songs.length);
}

document.addEventListener('DOMContentLoaded', function() {
    DOM.songName = document.getElementById('songName');
    DOM.artist = document.getElementById('artist');
    DOM.genre = document.getElementById('genre');
    DOM.rating = document.getElementById('rating');
    DOM.hasVideo = document.getElementById('hasVideo');
    DOM.formatRadios = document.getElementsByName('format');
    DOM.playlistContainer = document.getElementById('playlistContainer');
    DOM.addBtn = document.getElementById('addBtn');
    DOM.songForm = document.getElementById('songForm');
    DOM.saveBtn = document.getElementById('saveBtn');
    DOM.sortBtn = document.getElementById('sortBtn');
    
    if (DOM.songForm) {
        DOM.songForm.addEventListener('submit', addSong);
    }
    
    if (DOM.addBtn) {
        DOM.addBtn.addEventListener('click', addSong);
    }
    
    if (DOM.rating) {
        DOM.rating.addEventListener('input', updateRatingDisplay);
        updateRatingDisplay();
    }
    
    displayPlaylist();
    
    console.log('Song Management initialized');
});
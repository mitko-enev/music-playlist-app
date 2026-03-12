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

function showNotification(message, type = 'success') {
    const existing = document.querySelectorAll('.notification').length;
    if (existing > 3) {
        const oldest = document.querySelector('.notification');
        if (oldest) oldest.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    let icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'info') icon = 'ℹ️';
    
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
        <span class="notification-close">✕</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
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

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    const count = songs.length;
    const percentage = Math.min(count * 10, 100);
    
    progressBar.style.width = percentage + '%';
    
    if (count === 0) {
        progressBar.textContent = '0 songs';
    } else if (count === 1) {
        progressBar.textContent = '1 song';
    } else {
        progressBar.textContent = `${count} songs`;
    }
}

function updateSongCount() {
    const songCountSpan = document.getElementById('songCount');
    if (!songCountSpan) return;
    
    songCountSpan.textContent = songs.length;
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

function initTooltips() {
    const buttons = {
        'addBtn': 'Add new song',
        'saveBtn': 'Save playlist to file',
        'sortBtn': 'Sort by rating'
    };
    
    for (const [btnId, text] of Object.entries(buttons)) {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.setAttribute('title', text);
        }
    }
    
    const fields = {
        'songName': 'Enter song name',
        'artist': 'Enter artist name',
        'genre': 'Select genre',
        'rating': 'Rate the song 1-10'
    };
    
    for (const [fieldId, text] of Object.entries(fields)) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.setAttribute('title', text);
        }
    }
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
        showNotification('Please enter song name!', 'error');
        DOM.songName.focus();
        return;
    }

    if (!artist) {
        showNotification('Please enter artist name!', 'error');
        DOM.artist.focus();
        return;
    }

    const newSong = new Song(name, artist, genre, format, rating, hasVideo);
    songs.push(newSong);
    
    showNotification(`"${name}" added successfully!`, 'success');
    
    DOM.songName.value = '';
    DOM.artist.value = '';
    DOM.rating.value = 5;
    DOM.hasVideo.checked = false;
    
    if (DOM.formatRadios && DOM.formatRadios[0]) {
        DOM.formatRadios[0].checked = true;
    }
    
    DOM.songName.focus();
    displayPlaylist();
    updateProgressBar();
    updateSongCount();
    
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
    
    initTooltips();
    displayPlaylist();
    updateProgressBar();
    updateSongCount();
    
    console.log('Song Management initialized');
});
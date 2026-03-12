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
}

console.log('Song class with toHTML method');
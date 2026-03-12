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
}

console.log('Song class created');
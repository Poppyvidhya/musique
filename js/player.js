class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.currentSong = null;
        this.currentPlaylist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffle = false;
        this.repeatMode = 'off'; // 'off', 'all', 'one'
        this.volume = 0.7;
        this.userData = musicData.getUserData();
        
        this.initializeElements();
        this.bindEvents();
        this.loadUserSettings();
    }

    initializeElements() {
        // Player controls
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.repeatBtn = document.getElementById('repeatBtn');
        this.favoriteBtn = document.getElementById('favoriteBtn');
        
        // Progress and volume
        this.progressSlider = document.getElementById('progressSlider');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        
        // Song info
        this.currentArtwork = document.getElementById('currentArtwork');
        this.currentTitle = document.getElementById('currentTitle');
        this.currentArtist = document.getElementById('currentArtist');
        
        // Queue
        this.queueBtn = document.getElementById('queueBtn');
        this.queueSidebar = document.getElementById('queueSidebar');
        this.closeQueue = document.getElementById('closeQueue');
        this.queueContent = document.getElementById('queueContent');
        
        // Visualizer
        this.visualizer = document.getElementById('visualizer');
        
        // Volume control
        this.muteBtn = document.getElementById('muteBtn');
        this.volumeBtn = document.getElementById('volumeBtn');
    }

    bindEvents() {
        // Play/Pause
        this.playBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Navigation
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        
        // Shuffle and Repeat
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        // Favorite
        this.favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        
        // Progress
        this.progressSlider.addEventListener('input', () => this.seekTo());
        
        // Volume
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        
        // Queue
        this.queueBtn.addEventListener('click', () => this.toggleQueue());
        this.closeQueue.addEventListener('click', () => this.toggleQueue());
        
        // Audio events
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());
        this.audio.addEventListener('error', (e) => this.handleError(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    loadUserSettings() {
        this.volume = this.userData.settings.volume / 100;
        this.isShuffle = this.userData.settings.shuffle;
        this.repeatMode = this.userData.settings.repeat;
        
        this.audio.volume = this.volume;
        this.volumeSlider.value = this.userData.settings.volume;
        
        this.updateShuffleButton();
        this.updateRepeatButton();
    }

    playSong(song, playlist = []) {
        if (!song) return;
        
        this.currentSong = song;
        this.currentPlaylist = playlist.length > 0 ? playlist : [song];
        this.currentIndex = this.currentPlaylist.findIndex(s => s.id === song.id);
        
        // Update UI
        this.updateSongInfo();
        this.updateFavoriteButton();
        
        // Load and play audio
        this.audio.src = song.url;
        this.audio.load();
        
        // Add to recently played
        this.addToRecentlyPlayed(song);
        
        // Update queue
        this.updateQueue();
        
        // Play the song
        this.audio.play().catch(error => {
            console.error('Error playing audio:', error);
            this.showError('Unable to play this song');
        });
    }

    togglePlayPause() {
        if (!this.currentSong) {
            // Play first song from popular songs if none selected
            const firstSong = musicData.songs[musicData.popularSongs[0]];
            this.playSong(firstSong, musicData.popularSongs.map(id => musicData.songs[id]));
            return;
        }
        
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play().catch(error => {
                console.error('Error playing audio:', error);
                this.showError('Unable to play this song');
            });
        }
    }

    previousSong() {
        if (this.currentPlaylist.length === 0) return;
        
        if (this.isShuffle) {
            this.currentIndex = Math.floor(Math.random() * this.currentPlaylist.length);
        } else {
            this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.currentPlaylist.length - 1;
        }
        
        this.playSong(this.currentPlaylist[this.currentIndex], this.currentPlaylist);
    }

    nextSong() {
        if (this.currentPlaylist.length === 0) return;
        
        if (this.isShuffle) {
            this.currentIndex = Math.floor(Math.random() * this.currentPlaylist.length);
        } else {
            this.currentIndex = this.currentIndex < this.currentPlaylist.length - 1 ? this.currentIndex + 1 : 0;
        }
        
        this.playSong(this.currentPlaylist[this.currentIndex], this.currentPlaylist);
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.updateShuffleButton();
        this.saveUserSettings();
    }

    toggleRepeat() {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];
        this.updateRepeatButton();
        this.saveUserSettings();
    }

    toggleFavorite() {
        if (!this.currentSong) return;
        
        const favorites = this.userData.favorites;
        const index = favorites.indexOf(this.currentSong.id);
        
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(this.currentSong.id);
        }
        
        this.updateFavoriteButton();
        this.saveUserData();
        
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    }

    seekTo() {
        if (!this.audio.duration) return;
        
        const seekTime = (this.progressSlider.value / 100) * this.audio.duration;
        this.audio.currentTime = seekTime;
    }

    setVolume() {
        this.volume = this.volumeSlider.value / 100;
        this.audio.volume = this.volume;
        this.updateVolumeIcon();
        this.saveUserSettings();
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.audio.volume = 0;
            this.volumeSlider.value = 0;
        } else {
            this.audio.volume = this.volume;
            this.volumeSlider.value = this.volume * 100;
        }
        this.updateVolumeIcon();
    }

    toggleQueue() {
        this.queueSidebar.classList.toggle('open');
    }

    updateSongInfo() {
        if (!this.currentSong) return;
        
        this.currentArtwork.src = this.currentSong.artwork;
        this.currentTitle.textContent = this.currentSong.title;
        this.currentArtist.textContent = this.currentSong.artist;
        
        // Update document title
        document.title = `${this.currentSong.title} - ${this.currentSong.artist} | MusiQue`;
    }

    updateDuration() {
        if (this.audio.duration) {
            this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
        }
    }

    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressSlider.value = progress;
            
            // Update progress fill
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${progress}%`;
            }
            
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    updateShuffleButton() {
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
    }

    updateRepeatButton() {
        this.repeatBtn.classList.remove('active', 'repeat-one');
        
        if (this.repeatMode === 'all') {
            this.repeatBtn.classList.add('active');
            this.repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        } else if (this.repeatMode === 'one') {
            this.repeatBtn.classList.add('active', 'repeat-one');
            this.repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
        } else {
            this.repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        }
    }

    updateFavoriteButton() {
        if (!this.currentSong) return;
        
        const isFavorite = this.userData.favorites.includes(this.currentSong.id);
        this.favoriteBtn.classList.toggle('active', isFavorite);
        
        const icon = this.favoriteBtn.querySelector('i');
        icon.className = isFavorite ? 'fas fa-heart' : 'far fa-heart';
    }

    updateVolumeIcon() {
        const icon = this.muteBtn.querySelector('i');
        const volume = this.audio.volume;
        
        if (volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    updateQueue() {
        if (!this.queueContent) return;
        
        this.queueContent.innerHTML = '';
        
        this.currentPlaylist.forEach((song, index) => {
            const queueItem = document.createElement('div');
            queueItem.className = `queue-item ${index === this.currentIndex ? 'active' : ''}`;
            queueItem.innerHTML = `
                <img src="${song.artwork}" alt="${song.title}">
                <div class="queue-song-info">
                    <div class="queue-song-title">${song.title}</div>
                    <div class="queue-song-artist">${song.artist}</div>
                </div>
                <div class="queue-song-duration">${song.duration}</div>
            `;
            
            queueItem.addEventListener('click', () => {
                this.currentIndex = index;
                this.playSong(song, this.currentPlaylist);
            });
            
            this.queueContent.appendChild(queueItem);
        });
    }

    onPlay() {
        this.isPlaying = true;
        this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.visualizer.classList.add('active');
        
        // Update all play buttons in the UI
        document.querySelectorAll('.song-item').forEach(item => {
            const songId = item.dataset.songId;
            if (songId === this.currentSong?.id) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }

    onPause() {
        this.isPlaying = false;
        this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.visualizer.classList.remove('active');
    }

    handleSongEnd() {
        if (this.repeatMode === 'one') {
            this.audio.currentTime = 0;
            this.audio.play();
        } else if (this.repeatMode === 'all' || this.currentIndex < this.currentPlaylist.length - 1) {
            this.nextSong();
        } else {
            this.onPause();
        }
    }

    handleError(error) {
        console.error('Audio error:', error);
        this.showError('Error playing audio. Trying next song...');
        
        // Try next song after a delay
        setTimeout(() => {
            this.nextSong();
        }, 2000);
    }

    handleKeyboard(event) {
        // Prevent shortcuts when typing in input fields
        if (event.target.tagName === 'INPUT') return;
        
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.previousSong();
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.nextSong();
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.volumeSlider.value = Math.min(100, parseInt(this.volumeSlider.value) + 5);
                this.setVolume();
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.volumeSlider.value = Math.max(0, parseInt(this.volumeSlider.value) - 5);
                this.setVolume();
                break;
        }
    }

    addToRecentlyPlayed(song) {
        const recent = this.userData.recentlyPlayed;
        const existingIndex = recent.findIndex(id => id === song.id);
        
        if (existingIndex > -1) {
            recent.splice(existingIndex, 1);
        }
        
        recent.unshift(song.id);
        
        // Keep only last 50 songs
        if (recent.length > 50) {
            recent.splice(50);
        }
        
        this.saveUserData();
    }

    saveUserSettings() {
        this.userData.settings.volume = Math.round(this.volume * 100);
        this.userData.settings.shuffle = this.isShuffle;
        this.userData.settings.repeat = this.repeatMode;
        this.saveUserData();
    }

    saveUserData() {
        musicData.saveUserData(this.userData);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showError(message) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize player when DOM is loaded
let musicPlayer;
document.addEventListener('DOMContentLoaded', () => {
    musicPlayer = new MusicPlayer();
});
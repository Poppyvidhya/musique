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
        this.isLoading = false;
        this.isSeekingProgress = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadUserSettings();
        this.setupAudioContext();
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
        this.progressSlider.addEventListener('mousedown', () => this.isSeekingProgress = true);
        this.progressSlider.addEventListener('mouseup', () => this.isSeekingProgress = false);
        
        // Volume
        this.volumeSlider.addEventListener('input', () => this.setVolume());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        
        // Queue
        this.queueBtn.addEventListener('click', () => this.toggleQueue());
        this.closeQueue.addEventListener('click', () => this.toggleQueue());
        
        // Audio events
        this.audio.addEventListener('loadstart', () => this.onLoadStart());
        this.audio.addEventListener('loadeddata', () => this.onLoadedData());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('canplay', () => this.onCanPlay());
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleSongEnd());
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());
        this.audio.addEventListener('error', (e) => this.handleError(e));
        this.audio.addEventListener('waiting', () => this.onWaiting());
        this.audio.addEventListener('playing', () => this.onPlaying());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    setupAudioContext() {
        // Set audio properties for better streaming
        this.audio.preload = 'metadata';
        this.audio.crossOrigin = 'anonymous';
        
        // Add retry mechanism for failed loads
        this.maxRetries = 3;
        this.currentRetries = 0;
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

    async playSong(song, playlist = []) {
        if (!song) return;
        
        try {
            // Stop current song
            this.audio.pause();
            this.audio.currentTime = 0;
            
            this.currentSong = song;
            this.currentPlaylist = playlist.length > 0 ? playlist : [song];
            this.currentIndex = this.currentPlaylist.findIndex(s => s.id === song.id);
            this.currentRetries = 0;
            
            // Update UI immediately
            this.updateSongInfo();
            this.updateFavoriteButton();
            this.showLoadingState();
            
            // Load audio
            await this.loadAudio(song.url);
            
            // Add to recently played
            this.addToRecentlyPlayed(song);
            
            // Update queue
            this.updateQueue();
            
            // Update media session
            this.updateMediaSession();
            
        } catch (error) {
            console.error('Error playing song:', error);
            this.handlePlaybackError();
        }
    }

    async loadAudio(url) {
        return new Promise((resolve, reject) => {
            console.log('Loading audio from:', url);
            
            // Clear any existing source
            this.audio.src = '';
            this.audio.load();
            
            // Set new source
            this.audio.src = url;
            
            // Set audio properties for better compatibility
            this.audio.crossOrigin = 'anonymous';
            this.audio.preload = 'auto';
            
            const onCanPlay = () => {
                this.audio.removeEventListener('canplay', onCanPlay);
                this.audio.removeEventListener('error', onError);
                this.audio.removeEventListener('abort', onError);
                this.hideLoadingState();
                
                console.log('Audio can play, attempting to start playback');
                
                // Auto-play the song
                const playPromise = this.audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        resolve();
                    }).catch(error => {
                        console.error('Playback failed:', error);
                        // Don't call handlePlaybackError here, just reject
                        reject(error);
                    });
                } else {
                    resolve();
                }
            };
            
            const onError = (error) => {
                this.audio.removeEventListener('canplay', onCanPlay);
                this.audio.removeEventListener('error', onError);
                this.audio.removeEventListener('abort', onError);
                this.hideLoadingState();
                console.error('Audio loading error:', error, 'URL:', url);
                reject(error);
            };
            
            this.audio.addEventListener('canplay', onCanPlay);
            this.audio.addEventListener('error', onError);
            this.audio.addEventListener('abort', onError);
            
            // Add additional event listeners for debugging
            this.audio.addEventListener('loadstart', () => console.log('Load start'));
            this.audio.addEventListener('loadeddata', () => console.log('Data loaded'));
            this.audio.addEventListener('loadedmetadata', () => console.log('Metadata loaded'));
            
            // Start loading
            this.audio.load();
            
            // Timeout after 10 seconds
            setTimeout(() => {
                if (this.isLoading) {
                    console.log('Audio loading timeout');
                    onError(new Error('Loading timeout'));
                }
            }, 10000);
        });
    }

    togglePlayPause() {
        if (!this.currentSong) {
            // Play first song from popular songs if none selected
            const firstSong = musicData.songs[musicData.popularSongs[0]];
            const playlist = musicData.popularSongs.map(id => musicData.songs[id]);
            this.playSong(firstSong, playlist);
            return;
        }
        
        if (this.isPlaying) {
            this.audio.pause();
        } else {
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error('Error playing audio:', error);
                    this.handlePlaybackError();
                });
            }
        }
    }

    previousSong() {
        if (this.currentPlaylist.length === 0) return;
        
        // If we're more than 3 seconds into the song, restart it
        if (this.audio.currentTime > 3) {
            this.audio.currentTime = 0;
            return;
        }
        
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
        
        // Show feedback
        this.showToast(this.isShuffle ? 'Shuffle enabled' : 'Shuffle disabled', 'info');
    }

    toggleRepeat() {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];
        this.updateRepeatButton();
        this.saveUserSettings();
        
        // Show feedback
        const messages = {
            'off': 'Repeat disabled',
            'all': 'Repeat all enabled',
            'one': 'Repeat one enabled'
        };
        this.showToast(messages[this.repeatMode], 'info');
    }

    toggleFavorite() {
        if (!this.currentSong) return;
        
        const favorites = this.userData.favorites;
        const index = favorites.indexOf(this.currentSong.id);
        
        if (index > -1) {
            favorites.splice(index, 1);
            this.showToast('Removed from favorites', 'info');
        } else {
            favorites.push(this.currentSong.id);
            this.showToast('Added to favorites', 'success');
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
            this.previousVolume = this.audio.volume;
            this.audio.volume = 0;
            this.volumeSlider.value = 0;
        } else {
            this.audio.volume = this.previousVolume || this.volume;
            this.volumeSlider.value = (this.previousVolume || this.volume) * 100;
        }
        this.updateVolumeIcon();
    }

    toggleQueue() {
        this.queueSidebar.classList.toggle('open');
    }

    // Audio event handlers
    onLoadStart() {
        this.isLoading = true;
        this.showLoadingState();
        console.log('Audio loading started');
    }

    onLoadedData() {
        console.log('Audio data loaded');
    }

    onCanPlay() {
        this.isLoading = false;
        this.hideLoadingState();
        console.log('Audio can play');
    }

    onWaiting() {
        this.showLoadingState();
        console.log('Audio waiting for data');
    }

    onPlaying() {
        this.hideLoadingState();
        console.log('Audio playing');
    }

    showLoadingState() {
        if (this.playBtn) {
            this.playBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            this.playBtn.disabled = true;
        }
    }

    hideLoadingState() {
        if (this.playBtn) {
            this.playBtn.disabled = false;
            if (this.isPlaying) {
                this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
    }

    updateSongInfo() {
        if (!this.currentSong) return;
        
        this.currentArtwork.src = this.currentSong.artwork;
        this.currentTitle.textContent = this.currentSong.title;
        this.currentArtist.textContent = this.currentSong.artist;
        
        // Update document title
        document.title = `${this.currentSong.title} - ${this.currentSong.artist} | MusiQue`;
        
        // Update all song items to show current playing
        this.updatePlayingIndicators();
    }

    updatePlayingIndicators() {
        // Remove all playing indicators
        document.querySelectorAll('.song-item').forEach(item => {
            item.classList.remove('playing');
            const playIcon = item.querySelector('.play-indicator');
            if (playIcon) {
                const songNumber = item.querySelector('.song-number');
                if (songNumber) {
                    const index = Array.from(item.parentNode.children).indexOf(item) + 1;
                    songNumber.innerHTML = index;
                }
            }
        });
        
        // Add playing indicator to current song
        if (this.currentSong) {
            const currentSongElement = document.querySelector(`[data-song-id="${this.currentSong.id}"]`);
            if (currentSongElement) {
                currentSongElement.classList.add('playing');
                
                // Add play indicator
                const songNumber = currentSongElement.querySelector('.song-number');
                if (songNumber) {
                    songNumber.innerHTML = '<i class="fas fa-volume-up play-indicator"></i>';
                }
            }
        }
    }

    updateDuration() {
        if (this.audio.duration && !isNaN(this.audio.duration) && this.audio.duration !== Infinity) {
            this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
        }
    }

    updateProgress() {
        if (this.audio.duration && !this.isSeekingProgress && !isNaN(this.audio.duration) && this.audio.duration !== Infinity) {
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
        this.shuffleBtn.style.color = this.isShuffle ? 'var(--primary-color)' : '';
    }

    updateRepeatButton() {
        this.repeatBtn.classList.remove('active', 'repeat-one');
        this.repeatBtn.style.color = '';
        
        if (this.repeatMode === 'all') {
            this.repeatBtn.classList.add('active');
            this.repeatBtn.style.color = 'var(--primary-color)';
            this.repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        } else if (this.repeatMode === 'one') {
            this.repeatBtn.classList.add('active', 'repeat-one');
            this.repeatBtn.style.color = 'var(--primary-color)';
            this.repeatBtn.innerHTML = '<i class="fas fa-redo-alt"></i>';
        } else {
            this.repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        }
    }

    updateFavoriteButton() {
        if (!this.currentSong) return;
        
        const isFavorite = this.userData.favorites.includes(this.currentSong.id);
        this.favoriteBtn.classList.toggle('active', isFavorite);
        this.favoriteBtn.style.color = isFavorite ? 'var(--primary-color)' : '';
        
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
        
        if (this.currentPlaylist.length === 0) {
            this.queueContent.innerHTML = `
                <div class="empty-queue">
                    <i class="fas fa-music fa-2x"></i>
                    <p>No songs in queue</p>
                </div>
            `;
            return;
        }
        
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
                ${index === this.currentIndex ? '<i class="fas fa-volume-up queue-playing"></i>' : ''}
            `;
            
            queueItem.addEventListener('click', () => {
                this.currentIndex = index;
                this.playSong(song, this.currentPlaylist);
            });
            
            this.queueContent.appendChild(queueItem);
        });
    }

    updateMediaSession() {
        if ('mediaSession' in navigator && this.currentSong) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: this.currentSong.title,
                artist: this.currentSong.artist,
                album: this.currentSong.album,
                artwork: [
                    { src: this.currentSong.artwork, sizes: '96x96', type: 'image/jpeg' },
                    { src: this.currentSong.artwork, sizes: '128x128', type: 'image/jpeg' },
                    { src: this.currentSong.artwork, sizes: '192x192', type: 'image/jpeg' },
                    { src: this.currentSong.artwork, sizes: '256x256', type: 'image/jpeg' },
                    { src: this.currentSong.artwork, sizes: '384x384', type: 'image/jpeg' },
                    { src: this.currentSong.artwork, sizes: '512x512', type: 'image/jpeg' },
                ]
            });
        }
    }

    onPlay() {
        this.isPlaying = true;
        this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.visualizer.classList.add('active');
        this.updatePlayingIndicators();
        
        // Update media session
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'playing';
        }
    }

    onPause() {
        this.isPlaying = false;
        this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.visualizer.classList.remove('active');
        
        // Update media session
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = 'paused';
        }
    }

    handleSongEnd() {
        if (this.repeatMode === 'one') {
            this.audio.currentTime = 0;
            this.audio.play();
        } else if (this.repeatMode === 'all' || this.currentIndex < this.currentPlaylist.length - 1) {
            this.nextSong();
        } else {
            this.onPause();
            // Reset to beginning of playlist if repeat all is off
            this.currentIndex = 0;
        }
    }

    handleError(error) {
        console.error('Audio error:', error);
        this.hideLoadingState();
        
        // Retry loading if we haven't exceeded max retries
        if (this.currentRetries < this.maxRetries) {
            this.currentRetries++;
            this.showToast(`Loading failed, retrying... (${this.currentRetries}/${this.maxRetries})`, 'warning');
            
            setTimeout(() => {
                if (this.currentSong) {
                    this.loadAudio(this.currentSong.url);
                }
            }, 2000);
        } else {
            this.handlePlaybackError();
        }
    }

    handlePlaybackError() {
        this.showToast('Unable to play this song. Trying next song...', 'error');
        
        // Try next song after a delay
        setTimeout(() => {
            if (this.currentPlaylist.length > 1) {
                this.nextSong();
            }
        }, 2000);
    }

    handleKeyboard(event) {
        // Prevent shortcuts when typing in input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
        
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (event.shiftKey) {
                    // Seek backward 10 seconds
                    this.audio.currentTime = Math.max(0, this.audio.currentTime - 10);
                } else {
                    this.previousSong();
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (event.shiftKey) {
                    // Seek forward 10 seconds
                    this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + 10);
                } else {
                    this.nextSong();
                }
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
            case 'KeyM':
                event.preventDefault();
                this.toggleMute();
                break;
            case 'KeyL':
                event.preventDefault();
                this.toggleFavorite();
                break;
            case 'KeyS':
                event.preventDefault();
                this.toggleShuffle();
                break;
            case 'KeyR':
                event.preventDefault();
                this.toggleRepeat();
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
        if (isNaN(seconds) || seconds === Infinity) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    showToast(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        const colors = {
            success: '#1db954',
            warning: '#ffa500',
            error: '#e22134',
            info: '#1db954'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            font-weight: 500;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Public methods for external control
    play() {
        if (this.currentSong) {
            this.audio.play();
        }
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    setCurrentTime(time) {
        this.audio.currentTime = time;
    }

    getCurrentTime() {
        return this.audio.currentTime;
    }

    getDuration() {
        return this.audio.duration;
    }

    getVolume() {
        return this.audio.volume;
    }

    setVolumeLevel(volume) {
        this.audio.volume = Math.max(0, Math.min(1, volume));
        this.volumeSlider.value = this.audio.volume * 100;
        this.updateVolumeIcon();
    }
}

// Initialize player when DOM is loaded
let musicPlayer;
document.addEventListener('DOMContentLoaded', () => {
    musicPlayer = new MusicPlayer();
    
    // Setup media session handlers
    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', () => musicPlayer.play());
        navigator.mediaSession.setActionHandler('pause', () => musicPlayer.pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => musicPlayer.previousSong());
        navigator.mediaSession.setActionHandler('nexttrack', () => musicPlayer.nextSong());
        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
            musicPlayer.setCurrentTime(Math.max(0, musicPlayer.getCurrentTime() - (details.seekOffset || 10)));
        });
        navigator.mediaSession.setActionHandler('seekforward', (details) => {
            musicPlayer.setCurrentTime(Math.min(musicPlayer.getDuration(), musicPlayer.getCurrentTime() + (details.seekOffset || 10)));
        });
    }
});
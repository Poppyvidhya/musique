class UIManager {
    constructor() {
        this.currentSection = 'home';
        this.searchTimeout = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadInitialContent();
    }

    initializeElements() {
        // Navigation
        this.navItems = document.querySelectorAll('.nav-item');
        this.contentSections = document.querySelectorAll('.content-section');
        
        // Search
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        
        // Content containers
        this.featuredPlaylists = document.getElementById('featuredPlaylists');
        this.popularSongs = document.getElementById('popularSongs');
        this.libraryContent = document.getElementById('libraryContent');
        this.userPlaylists = document.getElementById('userPlaylists');
        this.favoritesList = document.getElementById('favoritesList');
        
        // Theme toggle
        this.themeToggle = document.getElementById('themeToggle');
        
        // Library tabs
        this.libraryTabs = document.querySelectorAll('.tab-btn');
    }

    bindEvents() {
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });

        // Search with improved functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            // Clear search when switching away from search section
            this.searchInput.addEventListener('focus', () => {
                this.switchSection('search');
            });
        }

        // Theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Library tabs
        this.libraryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchLibraryTab(tabName);
            });
        });

        // Listen for favorites updates
        window.addEventListener('favoritesUpdated', () => {
            this.updateFavoritesList();
        });

        // Create playlist button
        const createPlaylistBtn = document.getElementById('createPlaylist');
        if (createPlaylistBtn) {
            createPlaylistBtn.addEventListener('click', () => {
                this.createPlaylist();
            });
        }
    }

    loadInitialContent() {
        this.loadFeaturedPlaylists();
        this.loadPopularSongs();
        this.loadUserPlaylists();
        this.updateFavoritesList();
        this.loadLibraryContent('recent');
        this.loadTheme();
    }

    switchSection(sectionName) {
        // Update navigation
        this.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionName);
        });

        // Update content sections
        this.contentSections.forEach(section => {
            section.classList.toggle('active', section.id === sectionName);
        });

        this.currentSection = sectionName;

        // Load section-specific content
        switch (sectionName) {
            case 'search':
                // Focus search input when switching to search
                if (this.searchInput) {
                    setTimeout(() => this.searchInput.focus(), 100);
                }
                break;
            case 'library':
                this.loadLibraryContent('recent');
                break;
            case 'favorites':
                this.updateFavoritesList();
                break;
            case 'playlists':
                this.loadUserPlaylists();
                break;
        }
    }

    handleSearch(query) {
        clearTimeout(this.searchTimeout);
        
        if (!this.searchResults) return;

        if (!query || query.length < 2) {
            this.searchResults.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-search fa-3x"></i>
                    <h3>Search for Tamil music</h3>
                    <p>Find your favorite Tamil songs, artists, and albums</p>
                </div>
            `;
            return;
        }

        // Show loading state
        this.searchResults.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Searching...</p>
            </div>
        `;

        this.searchTimeout = setTimeout(() => {
            const results = musicData.searchSongs(query);
            this.displaySearchResults(results, query);
        }, 300);
    }

    displaySearchResults(results, query) {
        if (!this.searchResults) return;

        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-music fa-3x"></i>
                    <h3>No results found</h3>
                    <p>No Tamil songs found for "${query}". Try searching for:</p>
                    <ul class="search-suggestions">
                        <li>A.R. Rahman</li>
                        <li>Ilayaraja</li>
                        <li>Anirudh</li>
                        <li>Yuvan Shankar Raja</li>
                        <li>Roja</li>
                        <li>Ponniyin Selvan</li>
                    </ul>
                </div>
            `;
            return;
        }

        const resultsHTML = `
            <div class="search-results-header">
                <h3>Search Results for "${query}" (${results.length} songs)</h3>
            </div>
            <div class="song-list">
                ${results.map((song, index) => this.createSongItemHTML(song, index + 1)).join('')}
            </div>
        `;

        this.searchResults.innerHTML = resultsHTML;
        
        // Bind click events for search results
        this.bindSongEvents(this.searchResults);
    }

    loadFeaturedPlaylists() {
        if (!this.featuredPlaylists) return;

        const playlistsHTML = musicData.featuredPlaylists.map(playlist => `
            <div class="playlist-card" data-playlist-id="${playlist.id}">
                <div class="playlist-image">
                    <img src="${playlist.image}" alt="${playlist.name}">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="playlist-info">
                    <h3>${playlist.name}</h3>
                    <p>${playlist.description}</p>
                    <span class="song-count">${playlist.songs.length} songs</span>
                </div>
            </div>
        `).join('');

        this.featuredPlaylists.innerHTML = playlistsHTML;

        // Bind playlist events
        this.featuredPlaylists.querySelectorAll('.playlist-card').forEach(card => {
            card.addEventListener('click', () => {
                const playlistId = card.dataset.playlistId;
                this.playPlaylist(playlistId);
            });
        });
    }

    loadPopularSongs() {
        if (!this.popularSongs) return;

        const songsHTML = musicData.popularSongs.map((songId, index) => {
            const song = musicData.songs[songId];
            if (!song) return '';
            return this.createSongItemHTML(song, index + 1);
        }).join('');

        this.popularSongs.innerHTML = songsHTML;
        this.bindSongEvents(this.popularSongs);
    }

    createSongItemHTML(song, number = '') {
        if (!song) return '';
        
        const userData = musicData.getUserData();
        const isFavorite = userData.favorites.includes(song.id);
        
        return `
            <div class="song-item" data-song-id="${song.id}">
                <div class="song-number">${number}</div>
                <div class="song-info">
                    <img src="${song.artwork}" alt="${song.title}" class="song-artwork">
                    <div class="song-details">
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                    </div>
                </div>
                <div class="song-album">${song.album}</div>
                <div class="song-duration">${song.duration}</div>
                <div class="song-actions">
                    <button class="btn-icon favorite-song ${isFavorite ? 'active' : ''}" data-song-id="${song.id}">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="btn-icon add-to-playlist" data-song-id="${song.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
    }

    bindSongEvents(container) {
        if (!container) return;

        // Play song on click
        container.querySelectorAll('.song-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Don't play if clicking on action buttons
                if (e.target.closest('.song-actions')) return;
                
                const songId = item.dataset.songId;
                const song = musicData.songs[songId];
                const playlist = this.getCurrentPlaylist();
                
                if (musicPlayer && song) {
                    musicPlayer.playSong(song, playlist);
                }
            });
        });

        // Favorite buttons
        container.querySelectorAll('.favorite-song').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleSongFavorite(btn.dataset.songId);
            });
        });

        // Add to playlist buttons
        container.querySelectorAll('.add-to-playlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showAddToPlaylistModal(btn.dataset.songId);
            });
        });
    }

    getCurrentPlaylist() {
        switch (this.currentSection) {
            case 'home':
                return musicData.popularSongs.map(id => musicData.songs[id]).filter(Boolean);
            case 'search':
                const searchQuery = this.searchInput ? this.searchInput.value : '';
                return musicData.searchSongs(searchQuery);
            case 'favorites':
                const userData = musicData.getUserData();
                return userData.favorites.map(id => musicData.songs[id]).filter(Boolean);
            default:
                return Object.values(musicData.songs);
        }
    }

    playPlaylist(playlistId) {
        const songs = musicData.getPlaylistSongs(playlistId);
        if (songs.length > 0 && musicPlayer) {
            musicPlayer.playSong(songs[0], songs);
        }
    }

    toggleSongFavorite(songId) {
        const userData = musicData.getUserData();
        const index = userData.favorites.indexOf(songId);
        
        if (index > -1) {
            userData.favorites.splice(index, 1);
        } else {
            userData.favorites.push(songId);
        }
        
        musicData.saveUserData(userData);
        
        // Update UI
        this.updateFavoriteButtons(songId);
        this.updateFavoritesList();
        
        // Update player favorite button if this is the current song
        if (musicPlayer && musicPlayer.currentSong && musicPlayer.currentSong.id === songId) {
            musicPlayer.updateFavoriteButton();
        }
    }

    updateFavoriteButtons(songId) {
        const userData = musicData.getUserData();
        const isFavorite = userData.favorites.includes(songId);
        
        document.querySelectorAll(`[data-song-id="${songId}"] .favorite-song`).forEach(btn => {
            btn.classList.toggle('active', isFavorite);
            const icon = btn.querySelector('i');
            icon.className = isFavorite ? 'fas fa-heart' : 'far fa-heart';
        });
    }

    updateFavoritesList() {
        if (!this.favoritesList) return;

        const userData = musicData.getUserData();
        const favoriteSongs = userData.favorites.map(id => musicData.songs[id]).filter(Boolean);
        
        if (favoriteSongs.length === 0) {
            this.favoritesList.innerHTML = `
                <div class="empty-favorites">
                    <i class="fas fa-heart fa-3x"></i>
                    <h3>No favorite songs yet</h3>
                    <p>Songs you like will appear here</p>
                </div>
            `;
            return;
        }

        const songsHTML = favoriteSongs.map((song, index) => 
            this.createSongItemHTML(song, index + 1)
        ).join('');

        this.favoritesList.innerHTML = `<div class="song-list">${songsHTML}</div>`;
        this.bindSongEvents(this.favoritesList);
    }

    loadLibraryContent(tabName) {
        if (!this.libraryContent) return;

        // Update tab buttons
        this.libraryTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        const userData = musicData.getUserData();
        let content = '';

        switch (tabName) {
            case 'recent':
                const recentSongs = userData.recentlyPlayed.map(id => musicData.songs[id]).filter(Boolean);
                if (recentSongs.length === 0) {
                    content = `
                        <div class="empty-recent">
                            <i class="fas fa-clock fa-3x"></i>
                            <h3>No recently played songs</h3>
                            <p>Start listening to see your recent tracks here</p>
                        </div>
                    `;
                } else {
                    const songsHTML = recentSongs.slice(0, 20).map((song, index) => 
                        this.createSongItemHTML(song, index + 1)
                    ).join('');
                    content = `<div class="song-list">${songsHTML}</div>`;
                }
                break;
            
            case 'artists':
                const artists = this.getUniqueArtists();
                content = this.createArtistsGrid(artists);
                break;
            
            case 'albums':
                const albums = this.getUniqueAlbums();
                content = this.createAlbumsGrid(albums);
                break;
        }

        this.libraryContent.innerHTML = content;
        
        if (tabName === 'recent') {
            this.bindSongEvents(this.libraryContent);
        }
    }

    switchLibraryTab(tabName) {
        this.loadLibraryContent(tabName);
    }

    getUniqueArtists() {
        const artists = new Map();
        Object.values(musicData.songs).forEach(song => {
            // Extract main artist name (before comma)
            const mainArtist = song.artist.split(',')[0].trim();
            if (!artists.has(mainArtist)) {
                artists.set(mainArtist, {
                    name: mainArtist,
                    image: song.artwork,
                    songs: []
                });
            }
            artists.get(mainArtist).songs.push(song);
        });
        return Array.from(artists.values());
    }

    getUniqueAlbums() {
        const albums = new Map();
        Object.values(musicData.songs).forEach(song => {
            const key = `${song.album}-${song.artist.split(',')[0].trim()}`;
            if (!albums.has(key)) {
                albums.set(key, {
                    name: song.album,
                    artist: song.artist.split(',')[0].trim(),
                    image: song.artwork,
                    songs: []
                });
            }
            albums.get(key).songs.push(song);
        });
        return Array.from(albums.values());
    }

    createArtistsGrid(artists) {
        const artistsHTML = artists.map(artist => `
            <div class="artist-card" data-artist="${artist.name}">
                <img src="${artist.image}" alt="${artist.name}">
                <h3>${artist.name}</h3>
                <p>${artist.songs.length} song${artist.songs.length !== 1 ? 's' : ''}</p>
            </div>
        `).join('');

        return `<div class="artists-grid">${artistsHTML}</div>`;
    }

    createAlbumsGrid(albums) {
        const albumsHTML = albums.map(album => `
            <div class="album-card" data-album="${album.name}" data-artist="${album.artist}">
                <img src="${album.image}" alt="${album.name}">
                <h3>${album.name}</h3>
                <p>${album.artist}</p>
                <span class="song-count">${album.songs.length} tracks</span>
            </div>
        `).join('');

        return `<div class="albums-grid">${albumsHTML}</div>`;
    }

    loadUserPlaylists() {
        if (!this.userPlaylists) return;

        const userData = musicData.getUserData();
        
        if (userData.playlists.length === 0) {
            this.userPlaylists.innerHTML = `
                <div class="empty-playlists">
                    <i class="fas fa-music fa-3x"></i>
                    <h3>No playlists yet</h3>
                    <p>Create your first playlist to organize your favorite Tamil songs</p>
                    <button class="btn-primary" id="createFirstPlaylist">
                        <i class="fas fa-plus"></i>
                        Create Your First Playlist
                    </button>
                </div>
            `;
            
            const createFirstBtn = document.getElementById('createFirstPlaylist');
            if (createFirstBtn) {
                createFirstBtn.addEventListener('click', () => {
                    this.createPlaylist();
                });
            }
            return;
        }

        const playlistsHTML = userData.playlists.map(playlist => `
            <div class="playlist-card user-playlist" data-playlist-id="${playlist.id}">
                <div class="playlist-image">
                    <img src="${playlist.image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'}" alt="${playlist.name}">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <div class="playlist-info">
                    <h3>${playlist.name}</h3>
                    <p>${playlist.songs.length} songs</p>
                    <div class="playlist-actions">
                        <button class="btn-icon edit-playlist" data-playlist-id="${playlist.id}" title="Edit playlist">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-playlist" data-playlist-id="${playlist.id}" title="Delete playlist">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.userPlaylists.innerHTML = playlistsHTML;
        this.bindPlaylistEvents();
    }

    bindPlaylistEvents() {
        if (!this.userPlaylists) return;

        // Play playlist
        this.userPlaylists.querySelectorAll('.user-playlist').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.playlist-actions')) return;
                
                const playlistId = card.dataset.playlistId;
                this.playUserPlaylist(playlistId);
            });
        });

        // Edit playlist
        this.userPlaylists.querySelectorAll('.edit-playlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editPlaylist(btn.dataset.playlistId);
            });
        });

        // Delete playlist
        this.userPlaylists.querySelectorAll('.delete-playlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deletePlaylist(btn.dataset.playlistId);
            });
        });
    }

    createPlaylist() {
        const name = prompt('Enter playlist name:');
        if (!name || name.trim() === '') return;

        const userData = musicData.getUserData();
        const newPlaylist = {
            id: 'playlist_' + Date.now(),
            name: name.trim(),
            songs: [],
            createdAt: new Date().toISOString(),
            image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
        };

        userData.playlists.push(newPlaylist);
        musicData.saveUserData(userData);
        
        this.loadUserPlaylists();
        
        // Show success message
        this.showToast('Playlist created successfully!', 'success');
    }

    editPlaylist(playlistId) {
        const userData = musicData.getUserData();
        const playlist = userData.playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        const newName = prompt('Enter new playlist name:', playlist.name);
        if (!newName || newName.trim() === '') return;

        playlist.name = newName.trim();
        musicData.saveUserData(userData);
        
        this.loadUserPlaylists();
        this.showToast('Playlist updated successfully!', 'success');
    }

    deletePlaylist(playlistId) {
        if (!confirm('Are you sure you want to delete this playlist?')) return;

        const userData = musicData.getUserData();
        userData.playlists = userData.playlists.filter(p => p.id !== playlistId);
        musicData.saveUserData(userData);
        
        this.loadUserPlaylists();
        this.showToast('Playlist deleted successfully!', 'success');
    }

    playUserPlaylist(playlistId) {
        const userData = musicData.getUserData();
        const playlist = userData.playlists.find(p => p.id === playlistId);
        if (!playlist || playlist.songs.length === 0) {
            this.showToast('This playlist is empty!', 'warning');
            return;
        }

        const songs = playlist.songs.map(id => musicData.songs[id]).filter(Boolean);
        if (songs.length > 0 && musicPlayer) {
            musicPlayer.playSong(songs[0], songs);
        }
    }

    showAddToPlaylistModal(songId) {
        const userData = musicData.getUserData();
        
        if (userData.playlists.length === 0) {
            if (confirm('You need to create a playlist first. Would you like to create one now?')) {
                this.createPlaylist();
            }
            return;
        }

        // Simple implementation - in a real app, you'd show a proper modal
        const playlistNames = userData.playlists.map((p, i) => `${i + 1}. ${p.name}`);
        const message = `Add to playlist:\n\n${playlistNames.join('\n')}\n\nEnter playlist number:`;
        const selectedPlaylist = prompt(message);
        
        if (!selectedPlaylist) return;
        
        const playlistIndex = parseInt(selectedPlaylist) - 1;
        if (playlistIndex >= 0 && playlistIndex < userData.playlists.length) {
            const playlist = userData.playlists[playlistIndex];
            if (!playlist.songs.includes(songId)) {
                playlist.songs.push(songId);
                musicData.saveUserData(userData);
                this.showToast('Song added to playlist!', 'success');
            } else {
                this.showToast('Song is already in this playlist!', 'warning');
            }
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update icon
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('i');
            icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Save preference
        const userData = musicData.getUserData();
        userData.settings.theme = newTheme;
        musicData.saveUserData(userData);
    }

    loadTheme() {
        const userData = musicData.getUserData();
        const theme = userData.settings.theme || 'dark';
        
        document.documentElement.setAttribute('data-theme', theme);
        
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('i');
            icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    showToast(message, type = 'info') {
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
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize UI when DOM is loaded
let uiManager;
document.addEventListener('DOMContentLoaded', () => {
    uiManager = new UIManager();
});
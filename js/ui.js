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

        // Search
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

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
        
        if (!query || query.length < 2) {
            this.searchResults.innerHTML = '<p class="no-results">Start typing to search for music...</p>';
            return;
        }

        this.searchTimeout = setTimeout(() => {
            const results = musicData.searchSongs(query);
            this.displaySearchResults(results);
        }, 300);
    }

    displaySearchResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = '<p class="no-results">No songs found matching your search.</p>';
            return;
        }

        const resultsHTML = results.map(song => this.createSongItemHTML(song)).join('');
        this.searchResults.innerHTML = `<div class="song-list">${resultsHTML}</div>`;
        
        // Bind click events for search results
        this.bindSongEvents(this.searchResults);
    }

    loadFeaturedPlaylists() {
        const playlistsHTML = musicData.featuredPlaylists.map(playlist => `
            <div class="playlist-card" data-playlist-id="${playlist.id}">
                <img src="${playlist.image}" alt="${playlist.name}">
                <h3>${playlist.name}</h3>
                <p>${playlist.description}</p>
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
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
        const songsHTML = musicData.popularSongs.map((songId, index) => {
            const song = musicData.songs[songId];
            return this.createSongItemHTML(song, index + 1);
        }).join('');

        this.popularSongs.innerHTML = songsHTML;
        this.bindSongEvents(this.popularSongs);
    }

    createSongItemHTML(song, number = '') {
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
        // Play song on click
        container.querySelectorAll('.song-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Don't play if clicking on action buttons
                if (e.target.closest('.song-actions')) return;
                
                const songId = item.dataset.songId;
                const song = musicData.songs[songId];
                const playlist = this.getCurrentPlaylist();
                
                if (musicPlayer) {
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
                return musicData.popularSongs.map(id => musicData.songs[id]);
            case 'search':
                const searchQuery = this.searchInput.value;
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
        const userData = musicData.getUserData();
        const favoriteSongs = userData.favorites.map(id => musicData.songs[id]).filter(Boolean);
        
        if (favoriteSongs.length === 0) {
            this.favoritesList.innerHTML = '<p class="no-results">No favorite songs yet. Start adding some!</p>';
            return;
        }

        const songsHTML = favoriteSongs.map((song, index) => 
            this.createSongItemHTML(song, index + 1)
        ).join('');

        this.favoritesList.innerHTML = `<div class="song-list">${songsHTML}</div>`;
        this.bindSongEvents(this.favoritesList);
    }

    loadLibraryContent(tabName) {
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
                    content = '<p class="no-results">No recently played songs.</p>';
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
            if (!artists.has(song.artist)) {
                artists.set(song.artist, {
                    name: song.artist,
                    image: song.artwork,
                    songs: []
                });
            }
            artists.get(song.artist).songs.push(song);
        });
        return Array.from(artists.values());
    }

    getUniqueAlbums() {
        const albums = new Map();
        Object.values(musicData.songs).forEach(song => {
            const key = `${song.album}-${song.artist}`;
            if (!albums.has(key)) {
                albums.set(key, {
                    name: song.album,
                    artist: song.artist,
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
        const userData = musicData.getUserData();
        
        if (userData.playlists.length === 0) {
            this.userPlaylists.innerHTML = `
                <div class="empty-playlists">
                    <i class="fas fa-music fa-3x"></i>
                    <h3>No playlists yet</h3>
                    <p>Create your first playlist to organize your favorite songs</p>
                    <button class="btn-primary" id="createFirstPlaylist">
                        <i class="fas fa-plus"></i>
                        Create Your First Playlist
                    </button>
                </div>
            `;
            
            document.getElementById('createFirstPlaylist')?.addEventListener('click', () => {
                this.createPlaylist();
            });
            return;
        }

        const playlistsHTML = userData.playlists.map(playlist => `
            <div class="playlist-card user-playlist" data-playlist-id="${playlist.id}">
                <img src="${playlist.image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'}" alt="${playlist.name}">
                <h3>${playlist.name}</h3>
                <p>${playlist.songs.length} songs</p>
                <div class="playlist-actions">
                    <button class="btn-icon edit-playlist" data-playlist-id="${playlist.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-playlist" data-playlist-id="${playlist.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        this.userPlaylists.innerHTML = playlistsHTML;
        this.bindPlaylistEvents();
    }

    bindPlaylistEvents() {
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
        if (!name) return;

        const userData = musicData.getUserData();
        const newPlaylist = {
            id: 'playlist_' + Date.now(),
            name: name,
            songs: [],
            createdAt: new Date().toISOString()
        };

        userData.playlists.push(newPlaylist);
        musicData.saveUserData(userData);
        
        this.loadUserPlaylists();
    }

    editPlaylist(playlistId) {
        const userData = musicData.getUserData();
        const playlist = userData.playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        const newName = prompt('Enter new playlist name:', playlist.name);
        if (!newName) return;

        playlist.name = newName;
        musicData.saveUserData(userData);
        
        this.loadUserPlaylists();
    }

    deletePlaylist(playlistId) {
        if (!confirm('Are you sure you want to delete this playlist?')) return;

        const userData = musicData.getUserData();
        userData.playlists = userData.playlists.filter(p => p.id !== playlistId);
        musicData.saveUserData(userData);
        
        this.loadUserPlaylists();
    }

    playUserPlaylist(playlistId) {
        const userData = musicData.getUserData();
        const playlist = userData.playlists.find(p => p.id === playlistId);
        if (!playlist || playlist.songs.length === 0) return;

        const songs = playlist.songs.map(id => musicData.songs[id]).filter(Boolean);
        if (songs.length > 0 && musicPlayer) {
            musicPlayer.playSong(songs[0], songs);
        }
    }

    showAddToPlaylistModal(songId) {
        const userData = musicData.getUserData();
        
        if (userData.playlists.length === 0) {
            alert('Create a playlist first!');
            return;
        }

        // Simple implementation - in a real app, you'd show a proper modal
        const playlistNames = userData.playlists.map(p => p.name);
        const selectedPlaylist = prompt(`Add to playlist:\n${playlistNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}\n\nEnter playlist number:`);
        
        if (!selectedPlaylist) return;
        
        const playlistIndex = parseInt(selectedPlaylist) - 1;
        if (playlistIndex >= 0 && playlistIndex < userData.playlists.length) {
            const playlist = userData.playlists[playlistIndex];
            if (!playlist.songs.includes(songId)) {
                playlist.songs.push(songId);
                musicData.saveUserData(userData);
                alert('Song added to playlist!');
            } else {
                alert('Song is already in this playlist!');
            }
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update icon
        const icon = this.themeToggle.querySelector('i');
        icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Save preference
        const userData = musicData.getUserData();
        userData.settings.theme = newTheme;
        musicData.saveUserData(userData);
    }

    loadTheme() {
        const userData = musicData.getUserData();
        const theme = userData.settings.theme || 'dark';
        
        document.documentElement.setAttribute('data-theme', theme);
        
        const icon = this.themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Initialize UI when DOM is loaded
let uiManager;
document.addEventListener('DOMContentLoaded', () => {
    uiManager = new UIManager();
});
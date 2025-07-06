// Modal System for Interactive Popups
class ModalManager {
    constructor() {
        this.activeModal = null;
        this.createModalContainer();
        this.bindEvents();
    }

    createModalContainer() {
        // Create modal overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease-out;
        `;
        document.body.appendChild(this.overlay);
    }

    bindEvents() {
        // Close modal when clicking overlay
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal();
            }
        });
    }

    showModal(content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            background: var(--surface-color);
            border-radius: 12px;
            padding: 0;
            max-width: ${options.maxWidth || '500px'};
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease-out;
            border: 1px solid var(--border-color);
        `;

        modal.innerHTML = content;
        this.overlay.appendChild(modal);
        this.overlay.style.display = 'flex';
        this.activeModal = modal;

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        return modal;
    }

    closeModal() {
        if (this.activeModal) {
            this.activeModal.style.animation = 'modalSlideOut 0.3s ease-out';
            setTimeout(() => {
                this.overlay.style.display = 'none';
                this.overlay.innerHTML = '';
                this.activeModal = null;
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // Playlist Creation Modal
    showCreatePlaylistModal() {
        const content = `
            <div class="modal-header">
                <h2>Create New Playlist</h2>
                <button class="modal-close" onclick="modalManager.closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="createPlaylistForm">
                    <div class="form-group">
                        <label for="playlistName">Playlist Name</label>
                        <input type="text" id="playlistName" placeholder="Enter playlist name" required>
                    </div>
                    <div class="form-group">
                        <label for="playlistDescription">Description (Optional)</label>
                        <textarea id="playlistDescription" placeholder="Describe your playlist" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Choose Cover Image</label>
                        <div class="image-options">
                            <div class="image-option active" data-image="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300">
                                <img src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Option 1">
                            </div>
                            <div class="image-option" data-image="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300">
                                <img src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Option 2">
                            </div>
                            <div class="image-option" data-image="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300">
                                <img src="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Option 3">
                            </div>
                            <div class="image-option" data-image="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300">
                                <img src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Option 4">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="modalManager.closeModal()">Cancel</button>
                <button type="submit" class="btn-primary" onclick="modalManager.handleCreatePlaylist()">Create Playlist</button>
            </div>
        `;

        const modal = this.showModal(content);
        
        // Handle image selection
        modal.querySelectorAll('.image-option').forEach(option => {
            option.addEventListener('click', () => {
                modal.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });

        // Focus on name input
        setTimeout(() => {
            const nameInput = modal.querySelector('#playlistName');
            if (nameInput) nameInput.focus();
        }, 100);
    }

    handleCreatePlaylist() {
        const form = document.getElementById('createPlaylistForm');
        const name = form.querySelector('#playlistName').value.trim();
        const description = form.querySelector('#playlistDescription').value.trim();
        const selectedImage = form.querySelector('.image-option.active').dataset.image;

        if (!name) {
            this.showToast('Please enter a playlist name', 'error');
            return;
        }

        const userData = musicData.getUserData();
        const newPlaylist = {
            id: 'playlist_' + Date.now(),
            name: name,
            description: description,
            songs: [],
            image: selectedImage,
            createdAt: new Date().toISOString()
        };

        userData.playlists.push(newPlaylist);
        musicData.saveUserData(userData);
        
        this.closeModal();
        this.showToast('Playlist created successfully!', 'success');
        
        // Refresh playlists if UI manager exists
        if (window.uiManager) {
            uiManager.loadUserPlaylists();
        }
    }

    // Add to Playlist Modal
    showAddToPlaylistModal(songId) {
        const userData = musicData.getUserData();
        const song = musicData.songs[songId];
        
        if (!song) return;

        if (userData.playlists.length === 0) {
            this.showConfirmModal(
                'No Playlists Found',
                'You need to create a playlist first. Would you like to create one now?',
                () => this.showCreatePlaylistModal()
            );
            return;
        }

        const content = `
            <div class="modal-header">
                <h2>Add to Playlist</h2>
                <button class="modal-close" onclick="modalManager.closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="song-preview">
                    <img src="${song.artwork}" alt="${song.title}">
                    <div class="song-info">
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                    </div>
                </div>
                <div class="playlist-list">
                    ${userData.playlists.map(playlist => `
                        <div class="playlist-item ${playlist.songs.includes(songId) ? 'added' : ''}" 
                             data-playlist-id="${playlist.id}" 
                             onclick="modalManager.toggleSongInPlaylist('${songId}', '${playlist.id}')">
                            <img src="${playlist.image}" alt="${playlist.name}">
                            <div class="playlist-info">
                                <h4>${playlist.name}</h4>
                                <p>${playlist.songs.length} songs</p>
                            </div>
                            <div class="playlist-status">
                                <i class="fas ${playlist.songs.includes(songId) ? 'fa-check' : 'fa-plus'}"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-primary" onclick="modalManager.closeModal()">Done</button>
            </div>
        `;

        this.showModal(content, { maxWidth: '400px' });
    }

    toggleSongInPlaylist(songId, playlistId) {
        const userData = musicData.getUserData();
        const playlist = userData.playlists.find(p => p.id === playlistId);
        
        if (!playlist) return;

        const songIndex = playlist.songs.indexOf(songId);
        const playlistItem = document.querySelector(`[data-playlist-id="${playlistId}"]`);
        const statusIcon = playlistItem.querySelector('.playlist-status i');

        if (songIndex > -1) {
            // Remove song from playlist
            playlist.songs.splice(songIndex, 1);
            playlistItem.classList.remove('added');
            statusIcon.className = 'fas fa-plus';
            this.showToast('Song removed from playlist', 'info');
        } else {
            // Add song to playlist
            playlist.songs.push(songId);
            playlistItem.classList.add('added');
            statusIcon.className = 'fas fa-check';
            this.showToast('Song added to playlist', 'success');
        }

        // Update song count
        const songCountEl = playlistItem.querySelector('.playlist-info p');
        songCountEl.textContent = `${playlist.songs.length} songs`;

        musicData.saveUserData(userData);
    }

    // Confirmation Modal
    showConfirmModal(title, message, onConfirm, onCancel = null) {
        const content = `
            <div class="modal-header">
                <h2>${title}</h2>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="modalManager.closeModal()">Cancel</button>
                <button type="button" class="btn-primary" onclick="modalManager.handleConfirm()">Confirm</button>
            </div>
        `;

        this.showModal(content, { maxWidth: '400px' });
        this.confirmCallback = onConfirm;
        this.cancelCallback = onCancel;
    }

    handleConfirm() {
        if (this.confirmCallback) {
            this.confirmCallback();
        }
        this.closeModal();
    }

    // Edit Playlist Modal
    showEditPlaylistModal(playlistId) {
        const userData = musicData.getUserData();
        const playlist = userData.playlists.find(p => p.id === playlistId);
        
        if (!playlist) return;

        const content = `
            <div class="modal-header">
                <h2>Edit Playlist</h2>
                <button class="modal-close" onclick="modalManager.closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="editPlaylistForm">
                    <div class="form-group">
                        <label for="editPlaylistName">Playlist Name</label>
                        <input type="text" id="editPlaylistName" value="${playlist.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="editPlaylistDescription">Description</label>
                        <textarea id="editPlaylistDescription" rows="3">${playlist.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Cover Image</label>
                        <div class="image-options">
                            <div class="image-option ${playlist.image === 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300' ? 'active' : ''}" data-image="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300">
                                <img src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Option 1">
                            </div>
                            <div class="image-option ${playlist.image === 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300' ? 'active' : ''}" data-image="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300">
                                <img src="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Option 2">
                            </div>
                            <div class="image-option ${playlist.image === 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300' ? 'active' : ''}" data-image="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300">
                                <img src="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Option 3">
                            </div>
                            <div class="image-option ${playlist.image === 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300' ? 'active' : ''}" data-image="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300">
                                <img src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Option 4">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-secondary" onclick="modalManager.closeModal()">Cancel</button>
                <button type="button" class="btn-primary" onclick="modalManager.handleEditPlaylist('${playlistId}')">Save Changes</button>
            </div>
        `;

        const modal = this.showModal(content);
        
        // Handle image selection
        modal.querySelectorAll('.image-option').forEach(option => {
            option.addEventListener('click', () => {
                modal.querySelectorAll('.image-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }

    handleEditPlaylist(playlistId) {
        const form = document.getElementById('editPlaylistForm');
        const name = form.querySelector('#editPlaylistName').value.trim();
        const description = form.querySelector('#editPlaylistDescription').value.trim();
        const selectedImage = form.querySelector('.image-option.active').dataset.image;

        if (!name) {
            this.showToast('Please enter a playlist name', 'error');
            return;
        }

        const userData = musicData.getUserData();
        const playlist = userData.playlists.find(p => p.id === playlistId);
        
        if (playlist) {
            playlist.name = name;
            playlist.description = description;
            playlist.image = selectedImage;
            
            musicData.saveUserData(userData);
            this.closeModal();
            this.showToast('Playlist updated successfully!', 'success');
            
            // Refresh playlists if UI manager exists
            if (window.uiManager) {
                uiManager.loadUserPlaylists();
            }
        }
    }

    // Toast notifications
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
            z-index: 10001;
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
}

// Initialize modal manager
const modalManager = new ModalManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalManager;
}
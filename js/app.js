// Main application initialization and global functionality
class MusicApp {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initialize());
            } else {
                this.initialize();
            }
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Failed to initialize the application');
        }
    }

    initialize() {
        if (this.isInitialized) return;

        // Initialize service worker for offline functionality
        this.initServiceWorker();

        // Initialize keyboard shortcuts
        this.initKeyboardShortcuts();

        // Initialize media session API for system media controls
        this.initMediaSession();

        // Initialize notification system
        this.initNotifications();

        // Initialize analytics (if needed)
        this.initAnalytics();

        // Set up error handling
        this.setupErrorHandling();

        // Initialize PWA features
        this.initPWA();

        this.isInitialized = true;
        console.log('MusicApp initialized successfully');
    }

    initServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    initKeyboardShortcuts() {
        const shortcuts = {
            'KeyM': () => this.toggleMute(),
            'KeyF': () => this.toggleFullscreen(),
            'KeyL': () => this.toggleLike(),
            'KeyQ': () => this.toggleQueue(),
            'KeyS': () => this.focusSearch(),
            'Digit1': () => this.switchToSection('home'),
            'Digit2': () => this.switchToSection('search'),
            'Digit3': () => this.switchToSection('library'),
            'Digit4': () => this.switchToSection('playlists'),
            'Digit5': () => this.switchToSection('favorites'),
        };

        document.addEventListener('keydown', (event) => {
            // Don't trigger shortcuts when typing in input fields
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            // Check for Ctrl/Cmd + key combinations
            if (event.ctrlKey || event.metaKey) {
                const shortcut = shortcuts[event.code];
                if (shortcut) {
                    event.preventDefault();
                    shortcut();
                }
            }
        });
    }

    initMediaSession() {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', () => {
                if (musicPlayer) musicPlayer.togglePlayPause();
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                if (musicPlayer) musicPlayer.togglePlayPause();
            });

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                if (musicPlayer) musicPlayer.previousSong();
            });

            navigator.mediaSession.setActionHandler('nexttrack', () => {
                if (musicPlayer) musicPlayer.nextSong();
            });

            navigator.mediaSession.setActionHandler('seekbackward', (details) => {
                if (musicPlayer && musicPlayer.audio) {
                    musicPlayer.audio.currentTime = Math.max(0, musicPlayer.audio.currentTime - (details.seekOffset || 10));
                }
            });

            navigator.mediaSession.setActionHandler('seekforward', (details) => {
                if (musicPlayer && musicPlayer.audio) {
                    musicPlayer.audio.currentTime = Math.min(musicPlayer.audio.duration, musicPlayer.audio.currentTime + (details.seekOffset || 10));
                }
            });
        }
    }

    updateMediaSession(song) {
        if ('mediaSession' in navigator && song) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: song.title,
                artist: song.artist,
                album: song.album,
                artwork: [
                    { src: song.artwork, sizes: '96x96', type: 'image/jpeg' },
                    { src: song.artwork, sizes: '128x128', type: 'image/jpeg' },
                    { src: song.artwork, sizes: '192x192', type: 'image/jpeg' },
                    { src: song.artwork, sizes: '256x256', type: 'image/jpeg' },
                    { src: song.artwork, sizes: '384x384', type: 'image/jpeg' },
                    { src: song.artwork, sizes: '512x512', type: 'image/jpeg' },
                ]
            });
        }
    }

    initNotifications() {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    showNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });
        }
    }

    initAnalytics() {
        // Placeholder for analytics initialization
        // In a real app, you might initialize Google Analytics, Mixpanel, etc.
        console.log('Analytics initialized');
    }

    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showError('An unexpected error occurred');
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showError('An unexpected error occurred');
        });
    }

    initPWA() {
        // Handle install prompt
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton();
        });

        // Handle app installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallButton();
        });
    }

    showInstallButton() {
        // Create install button if it doesn't exist
        if (!document.getElementById('installButton')) {
            const installButton = document.createElement('button');
            installButton.id = 'installButton';
            installButton.className = 'btn-primary install-btn';
            installButton.innerHTML = '<i class="fas fa-download"></i> Install App';
            installButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            `;

            installButton.addEventListener('click', () => {
                this.installApp();
            });

            document.body.appendChild(installButton);
        }
    }

    hideInstallButton() {
        const installButton = document.getElementById('installButton');
        if (installButton) {
            installButton.remove();
        }
    }

    async installApp() {
        const installButton = document.getElementById('installButton');
        if (installButton) {
            installButton.style.display = 'none';
        }

        // Show the install prompt
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            window.deferredPrompt = null;
        }
    }

    // Utility methods for keyboard shortcuts
    toggleMute() {
        if (musicPlayer) {
            musicPlayer.toggleMute();
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    toggleLike() {
        if (musicPlayer) {
            musicPlayer.toggleFavorite();
        }
    }

    toggleQueue() {
        if (musicPlayer) {
            musicPlayer.toggleQueue();
        }
    }

    focusSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }

    switchToSection(sectionName) {
        if (uiManager) {
            uiManager.switchSection(sectionName);
        }
    }

    showError(message) {
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
        }, 5000);
    }

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
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

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);
            });
        }
    }

    // Memory usage monitoring
    monitorMemory() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                console.log('Memory usage:', {
                    used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
                    total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
                });
            }, 30000); // Check every 30 seconds
        }
    }
}

// Initialize the app
const musicApp = new MusicApp();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MusicApp;
}

// Global utility functions
window.formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

window.debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

window.throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Listen for song changes to update media session
document.addEventListener('DOMContentLoaded', () => {
    // Update media session when song changes
    const originalPlaySong = MusicPlayer.prototype.playSong;
    MusicPlayer.prototype.playSong = function(song, playlist) {
        originalPlaySong.call(this, song, playlist);
        if (musicApp) {
            musicApp.updateMediaSession(song);
        }
    };
});
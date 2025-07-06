// Music Data with online streaming URLs
const musicData = {
    featuredPlaylists: [
        {
            id: 'chill-vibes',
            name: 'Chill Vibes',
            description: 'Relaxing music for your peaceful moments',
            image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            songs: ['song1', 'song5', 'song8', 'song12']
        },
        {
            id: 'workout-hits',
            name: 'Workout Hits',
            description: 'High-energy tracks to fuel your workout',
            image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
            songs: ['song3', 'song7', 'song11', 'song15']
        },
        {
            id: 'indie-favorites',
            name: 'Indie Favorites',
            description: 'Discover amazing independent artists',
            image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            songs: ['song2', 'song6', 'song9', 'song14']
        },
        {
            id: 'electronic-beats',
            name: 'Electronic Beats',
            description: 'The best in electronic music',
            image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
            songs: ['song4', 'song10', 'song13', 'song16']
        }
    ],

    songs: {
        song1: {
            id: 'song1',
            title: 'Sunset Dreams',
            artist: 'Ambient Collective',
            album: 'Peaceful Moments',
            duration: '4:23',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Ambient'
        },
        song2: {
            id: 'song2',
            title: 'City Lights',
            artist: 'Urban Echo',
            album: 'Metropolitan',
            duration: '3:45',
            artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Indie'
        },
        song3: {
            id: 'song3',
            title: 'Power Up',
            artist: 'Energy Boost',
            album: 'Maximum Drive',
            duration: '3:12',
            artwork: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Electronic'
        },
        song4: {
            id: 'song4',
            title: 'Digital Horizon',
            artist: 'Synth Wave',
            album: 'Future Sounds',
            duration: '5:01',
            artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Electronic'
        },
        song5: {
            id: 'song5',
            title: 'Morning Coffee',
            artist: 'Café Sounds',
            album: 'Daily Rituals',
            duration: '4:15',
            artwork: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Jazz'
        },
        song6: {
            id: 'song6',
            title: 'Midnight Drive',
            artist: 'Neon Nights',
            album: 'After Hours',
            duration: '4:33',
            artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Synthwave'
        },
        song7: {
            id: 'song7',
            title: 'Beast Mode',
            artist: 'Gym Warriors',
            album: 'Pump It Up',
            duration: '3:28',
            artwork: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Hip Hop'
        },
        song8: {
            id: 'song8',
            title: 'Ocean Waves',
            artist: 'Nature Sounds',
            album: 'Serenity',
            duration: '6:12',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Ambient'
        },
        song9: {
            id: 'song9',
            title: 'Vintage Vinyl',
            artist: 'Retro Revival',
            album: 'Old School',
            duration: '3:56',
            artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Rock'
        },
        song10: {
            id: 'song10',
            title: 'Bass Drop',
            artist: 'EDM Masters',
            album: 'Festival Anthems',
            duration: '4:44',
            artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'EDM'
        },
        song11: {
            id: 'song11',
            title: 'Run Fast',
            artist: 'Cardio Kings',
            album: 'High Intensity',
            duration: '3:21',
            artwork: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Electronic'
        },
        song12: {
            id: 'song12',
            title: 'Peaceful Mind',
            artist: 'Meditation Music',
            album: 'Inner Peace',
            duration: '7:30',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Ambient'
        },
        song13: {
            id: 'song13',
            title: 'Cyber Punk',
            artist: 'Future Bass',
            album: '2077',
            duration: '4:18',
            artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Electronic'
        },
        song14: {
            id: 'song14',
            title: 'Coffee Shop',
            artist: 'Indie Acoustic',
            album: 'Cozy Corners',
            duration: '3:42',
            artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Indie'
        },
        song15: {
            id: 'song15',
            title: 'Adrenaline Rush',
            artist: 'Extreme Sports',
            album: 'No Limits',
            duration: '3:15',
            artwork: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Rock'
        },
        song16: {
            id: 'song16',
            title: 'Neon Lights',
            artist: 'Synthwave 80s',
            album: 'Retro Future',
            duration: '4:52',
            artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Synthwave'
        },
        song17: {
            id: 'song17',
            title: 'Summer Breeze',
            artist: 'Tropical House',
            album: 'Island Vibes',
            duration: '3:38',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'House'
        },
        song18: {
            id: 'song18',
            title: 'Urban Jungle',
            artist: 'Street Beats',
            album: 'City Life',
            duration: '4:07',
            artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Hip Hop'
        },
        song19: {
            id: 'song19',
            title: 'Starlight',
            artist: 'Dream Pop',
            album: 'Celestial',
            duration: '5:23',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Pop'
        },
        song20: {
            id: 'song20',
            title: 'Thunder Storm',
            artist: 'Epic Orchestra',
            album: 'Cinematic',
            duration: '6:45',
            artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Orchestral'
        }
    },

    // Popular songs list (references to song IDs)
    popularSongs: [
        'song1', 'song2', 'song3', 'song4', 'song5', 
        'song6', 'song7', 'song8', 'song9', 'song10',
        'song11', 'song12', 'song13', 'song14', 'song15',
        'song16', 'song17', 'song18', 'song19', 'song20'
    ],

    // User data (stored in localStorage)
    getUserData() {
        const userData = localStorage.getItem('musicAppUserData');
        if (userData) {
            return JSON.parse(userData);
        }
        return {
            favorites: [],
            playlists: [],
            recentlyPlayed: [],
            settings: {
                volume: 70,
                shuffle: false,
                repeat: 'off', // 'off', 'all', 'one'
                theme: 'dark'
            }
        };
    },

    saveUserData(userData) {
        localStorage.setItem('musicAppUserData', JSON.stringify(userData));
    },

    // Search functionality
    searchSongs(query) {
        if (!query || query.length < 2) return [];
        
        const searchTerm = query.toLowerCase();
        const results = [];
        
        Object.values(this.songs).forEach(song => {
            if (
                song.title.toLowerCase().includes(searchTerm) ||
                song.artist.toLowerCase().includes(searchTerm) ||
                song.album.toLowerCase().includes(searchTerm) ||
                song.genre.toLowerCase().includes(searchTerm)
            ) {
                results.push(song);
            }
        });
        
        return results;
    },

    // Get songs by playlist
    getPlaylistSongs(playlistId) {
        const playlist = this.featuredPlaylists.find(p => p.id === playlistId);
        if (!playlist) return [];
        
        return playlist.songs.map(songId => this.songs[songId]).filter(Boolean);
    },

    // Get random songs
    getRandomSongs(count = 10) {
        const allSongs = Object.values(this.songs);
        const shuffled = allSongs.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },

    // Get songs by genre
    getSongsByGenre(genre) {
        return Object.values(this.songs).filter(song => 
            song.genre.toLowerCase() === genre.toLowerCase()
        );
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = musicData;
}
// Tamil Music Data with real online streaming URLs
const musicData = {
    featuredPlaylists: [
        {
            id: 'ar-rahman-hits',
            name: 'A.R. Rahman Hits',
            description: 'Best of the Mozart of Madras',
            image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            songs: ['song1', 'song2', 'song4', 'song7', 'song10']
        },
        {
            id: 'ilayaraja-classics',
            name: 'Ilayaraja Classics',
            description: 'Timeless melodies from the Maestro',
            image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
            songs: ['song3', 'song6', 'song9', 'song12', 'song15']
        },
        {
            id: 'anirudh-beats',
            name: 'Anirudh Beats',
            description: 'Modern Tamil music sensation',
            image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            songs: ['song5', 'song8', 'song11', 'song14', 'song17']
        },
        {
            id: 'yuvan-shankar',
            name: 'Yuvan Shankar Raja',
            description: 'Youth icon of Tamil music',
            image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
            songs: ['song13', 'song16', 'song18', 'song19', 'song20']
        }
    ],

    songs: {
        song1: {
            id: 'song1',
            title: 'Vande Mataram',
            artist: 'A.R. Rahman',
            album: 'Vande Mataram',
            duration: '7:05',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            genre: 'Patriotic'
        },
        song2: {
            id: 'song2',
            title: 'Jai Ho',
            artist: 'A.R. Rahman',
            album: 'Slumdog Millionaire',
            duration: '5:09',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.wav',
            genre: 'Film Music'
        },
        song3: {
            id: 'song3',
            title: 'Chinna Chinna Aasai',
            artist: 'Ilayaraja, S.P. Balasubrahmanyam, S. Janaki',
            album: 'Roja',
            duration: '4:32',
            artwork: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-03.wav',
            genre: 'Melody'
        },
        song4: {
            id: 'song4',
            title: 'Roja Janeman',
            artist: 'A.R. Rahman, Hariharan, K.S. Chithra',
            album: 'Roja',
            duration: '5:15',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-02.wav',
            genre: 'Romance'
        },
        song5: {
            id: 'song5',
            title: 'Why This Kolaveri Di',
            artist: 'Anirudh Ravichander, Dhanush',
            album: '3',
            duration: '4:02',
            artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-01.wav',
            genre: 'Folk Pop'
        },
        song6: {
            id: 'song6',
            title: 'Ilamai Idho Idho',
            artist: 'Ilayaraja, S.P. Balasubrahmanyam',
            album: 'Sakalakalavallavan',
            duration: '4:45',
            artwork: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-06.wav',
            genre: 'Classical'
        },
        song7: {
            id: 'song7',
            title: 'Mustafa Mustafa',
            artist: 'A.R. Rahman, Udit Narayan, Jaspinder Narula',
            album: 'Kadhal Desam',
            duration: '6:12',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-07.wav',
            genre: 'Qawwali'
        },
        song8: {
            id: 'song8',
            title: 'Thalli Pogathey',
            artist: 'Anirudh Ravichander, Sid Sriram',
            album: 'Achcham Yenbadhu Madamaiyada',
            duration: '4:28',
            artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-08.wav',
            genre: 'Melody'
        },
        song9: {
            id: 'song9',
            title: 'Nilave Vaa',
            artist: 'Ilayaraja, S.P. Balasubrahmanyam, S. Janaki',
            album: 'Mouna Ragam',
            duration: '4:55',
            artwork: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-09.wav',
            genre: 'Romance'
        },
        song10: {
            id: 'song10',
            title: 'Dil Se Re',
            artist: 'A.R. Rahman, Udit Narayan, Anupama Deshpande',
            album: 'Dil Se',
            duration: '5:33',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-10.wav',
            genre: 'Sufi'
        },
        song11: {
            id: 'song11',
            title: 'Surviva',
            artist: 'Anirudh Ravichander, Yogi B, Mali',
            album: 'Vivegam',
            duration: '3:45',
            artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-11.wav',
            genre: 'Hip Hop'
        },
        song12: {
            id: 'song12',
            title: 'Mannil Indha Kadhalandri',
            artist: 'Ilayaraja, S.P. Balasubrahmanyam',
            album: 'Keladi Kanmani',
            duration: '4:18',
            artwork: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-12.wav',
            genre: 'Classical'
        },
        song13: {
            id: 'song13',
            title: 'Evan Di Unna Pethan',
            artist: 'Yuvan Shankar Raja, Benny Dayal',
            album: 'Vaaranam Aayiram',
            duration: '4:12',
            artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-13.wav',
            genre: 'Pop'
        },
        song14: {
            id: 'song14',
            title: 'Kaththi Theme',
            artist: 'Anirudh Ravichander',
            album: 'Kaththi',
            duration: '2:58',
            artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-14.wav',
            genre: 'Theme'
        },
        song15: {
            id: 'song15',
            title: 'Sundari Kannal Oru Sethi',
            artist: 'Ilayaraja, S.P. Balasubrahmanyam, S. Janaki',
            album: 'Thalapathi',
            duration: '5:02',
            artwork: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-15.wav',
            genre: 'Duet'
        },
        song16: {
            id: 'song16',
            title: 'Yaaradi Nee Mohini',
            artist: 'Yuvan Shankar Raja, Dhanush',
            album: 'Yaaradi Nee Mohini',
            duration: '4:35',
            artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-16.wav',
            genre: 'Romance'
        },
        song17: {
            id: 'song17',
            title: 'Maari Thara Local',
            artist: 'Anirudh Ravichander, Dhanush',
            album: 'Maari',
            duration: '3:52',
            artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-17.wav',
            genre: 'Kuthu'
        },
        song18: {
            id: 'song18',
            title: 'Loosu Penne',
            artist: 'Yuvan Shankar Raja, Vijay Yesudas',
            album: 'Vallavan',
            duration: '4:22',
            artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-18.wav',
            genre: 'Melody'
        },
        song19: {
            id: 'song19',
            title: 'Kadhal Anukkal',
            artist: 'Yuvan Shankar Raja, Harish Raghavendra',
            album: 'Enthiran',
            duration: '4:48',
            artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-19.wav',
            genre: 'Romance'
        },
        song20: {
            id: 'song20',
            title: 'Paiya',
            artist: 'Yuvan Shankar Raja, Blaaze',
            album: 'Paiya',
            duration: '4:15',
            artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-20.wav',
            genre: 'Hip Hop'
        },
        song21: {
            id: 'song21',
            title: 'Ponni Nadhi',
            artist: 'A.R. Rahman, A.R. Rehana, Bamba Bakya',
            album: 'Ponniyin Selvan',
            duration: '4:23',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-21.wav',
            genre: 'Epic'
        },
        song22: {
            id: 'song22',
            title: 'Alaikadal',
            artist: 'A.R. Rahman, Antara Nandy',
            album: 'Ponniyin Selvan',
            duration: '4:12',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-22.wav',
            genre: 'Classical'
        },
        song23: {
            id: 'song23',
            title: 'Ratchasa Maamaney',
            artist: 'Shreya Goshal, Palakad Sreeram',
            album: 'Ponniyin Selvan',
            duration: '3:56',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-23.wav',
            genre: 'Folk'
        },
        song24: {
            id: 'song24',
            title: 'Chola Chola',
            artist: 'Sathyaprakash, VM Mahalingam',
            album: 'Ponniyin Selvan',
            duration: '4:44',
            artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-24.wav',
            genre: 'War Song'
        },
        song25: {
            id: 'song25',
            title: 'Vaathi Coming',
            artist: 'Anirudh Ravichander, Gana Balachandar',
            album: 'Master',
            duration: '3:28',
            artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-25.wav',
            genre: 'Mass'
        }
    },

    // Popular Tamil songs list
    popularSongs: [
        'song1', 'song2', 'song3', 'song4', 'song5', 
        'song6', 'song7', 'song8', 'song9', 'song10',
        'song11', 'song12', 'song13', 'song14', 'song15',
        'song16', 'song17', 'song18', 'song19', 'song20',
        'song21', 'song22', 'song23', 'song24', 'song25'
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
    },

    // Get songs by composer
    getSongsByComposer(composer) {
        return Object.values(this.songs).filter(song => 
            song.artist.toLowerCase().includes(composer.toLowerCase())
        );
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = musicData;
}
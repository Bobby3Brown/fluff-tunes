// Simplified mood and activity data with YouTube links only
        const moodPlaylists = {
            happy: [
                {title: "Happy Vibes", artist: "Various Artists", id: "jfKfPfyJRdk", duration: "3:45"},
                {title: "Good Vibes Only", artist: "Positive Energy", id: "4NRXx6U8ABQ", duration: "4:20"},
                {title: "Feel Good", artist: "Summer Hits", id: "7NOSDKb0HlU", duration: "3:15"}
            ],
            sad: [
                {title: "Sad Songs", artist: "Emotional Mix", id: "5qap5aO4i9A", duration: "5:30"},
                {title: "Heartbreak", artist: "Melancholy", id: "MCkTebktHVc", duration: "4:10"}
            ],
            energetic: [
                {title: "Workout Mix", artist: "Energy Boost", id: "4xDzrJKXOOY", duration: "3:50"},
                {title: "Party Time", artist: "Dance Floor", id: "9xQ6oc2Z5y0", duration: "4:05"}
            ],
            relaxed: [
                {title: "Chill Vibes", artist: "Calm Mind", id: "5qap5aO4i9A", duration: "8:00"},
                {title: "Meditation", artist: "Peaceful", id: "H833zS8HfbQ", duration: "10:30"}
            ],
            focused: [
                {title: "Study Focus", artist: "Concentration", id: "4NRXx6U8ABQ", duration: "5:15"},
                {title: "Deep Work", artist: "Productivity", id: "jfKfPfyJRdk", duration: "4:40"}
            ],
            romantic: [
                {title: "Love Songs", artist: "Romantic", id: "MCkTebktHVc", duration: "4:30"},
                {title: "Date Night", artist: "Intimate", id: "9xQ6oc2Z5y0", duration: "3:55"}
            ]
        };

        const activityPlaylists = {
            cooking: [
                {title: "Cooking Jazz", artist: "Kitchen Vibes", id: "jfKfPfyJRdk", duration: "4:15"},
                {title: "Italian Cooking", artist: "Mediterranean", id: "4NRXx6U8ABQ", duration: "3:50"}
            ],
            working: [
                {title: "Focus Music", artist: "Productivity", id: "7NOSDKb0HlU", duration: "5:20"},
                {title: "Office Vibes", artist: "Work Mode", id: "5qap5aO4i9A", duration: "6:10"}
            ],
            exercising: [
                {title: "Workout Mix 2024", artist: "Gym Energy", id: "4xDzrJKXOOY", duration: "3:45"},
                {title: "Running Beats", artist: "Cardio", id: "L_jWHffIx5E", duration: "4:30"}
            ],
            studying: [
                {title: "Study Lofi", artist: "Focus", id: "jfKfPfyJRdk", duration: "8:00"},
                {title: "Concentration", artist: "Deep Work", id: "rUxyKA_-grg", duration: "7:15"}
            ]
        };

        let selectedMood = null;
        let selectedActivity = null;
        let currentPlaylist = [];
        let currentTrackIndex = 0;
        let isPlaying = false;

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            setupEventListeners();
        });

        function setupEventListeners() {
            // Mood selection
            document.querySelectorAll('.mood-card').forEach(card => {
                card.addEventListener('click', function() {
                    selectedMood = this.getAttribute('data-mood');
                    updateSelection();
                });
            });

            // Activity selection
            document.querySelectorAll('.activity-card').forEach(card => {
                card.addEventListener('click', function() {
                    selectedActivity = this.getAttribute('data-activity');
                    updateSelection();
                });
            });

            // Generate music button
            document.getElementById('generateMusicBtn').addEventListener('click', generateMusic);
        }

        function updateSelection() {
            const generateBtn = document.getElementById('generateMusicBtn');
            generateBtn.disabled = !(selectedMood && selectedActivity);
        }

        function generateMusic() {
            if (!selectedMood || !selectedActivity) {
                alert('Please select both a mood and an activity!');
                return;
            }

            // Combine mood and activity playlists
            currentPlaylist = [
                ...moodPlaylists[selectedMood],
                ...activityPlaylists[selectedActivity]
            ];

            // Shuffle the playlist
            shuffleArray(currentPlaylist);

            // Display reels
            displayReels();

            // Show reels section and controls
            document.getElementById('reelsSection').classList.remove('hidden');
            document.getElementById('controlButtons').classList.remove('hidden');

            // Scroll to reels
            document.getElementById('reelsSection').scrollIntoView({ behavior: 'smooth' });

            // Auto-play first track
            setTimeout(() => playTrack(0), 500);
        }

        function displayReels() {
            const reelContent = document.getElementById('reelContent');
            reelContent.innerHTML = '';

            currentPlaylist.forEach((track, index) => {
                const reelItem = document.createElement('div');
                reelItem.className = 'reel-video glass-effect p-3 md:p-4 mb-3 md:mb-4 rounded-lg md:rounded-xl cursor-pointer';
                reelItem.setAttribute('data-index', index);
                reelItem.onclick = () => playTrack(index);

                reelItem.innerHTML = `
                    <div class="flex items-center">
                        <div class="w-16 h-16 md:w-20 md:h-20 bg-purple-500 rounded-lg md:rounded-xl mr-3 md:mr-4 flex items-center justify-center">
                            <i class="fas fa-music text-white text-xl md:text-2xl"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="font-bold text-base md:text-lg truncate">${track.title}</h3>
                            <p class="text-gray-200 text-sm md:text-base truncate">${track.artist}</p>
                            <p class="text-xs md:text-sm text-gray-300">${track.duration} • YouTube</p>
                        </div>
                        <div class="play-icon ml-2">
                            <i class="fas fa-play text-green-400 text-lg md:text-2xl"></i>
                        </div>
                    </div>
                `;

                reelContent.appendChild(reelItem);
            });
        }

        function playTrack(index) {
            currentTrackIndex = index;
            const track = currentPlaylist[index];

            // Update UI to show playing track
            document.querySelectorAll('.reel-video').forEach((item, i) => {
                if (i === index) {
                    item.classList.add('playing');
                    item.querySelector('.play-icon i').className = 'fas fa-pause text-green-400 text-lg md:text-2xl';
                } else {
                    item.classList.remove('playing');
                    item.querySelector('.play-icon i').className = 'fas fa-play text-green-400 text-lg md:text-2xl';
                }
            });

            // Play the YouTube video
            playYouTubeVideo(track.id);

            // Update play/pause button
            document.getElementById('playPauseIcon').className = 'fas fa-pause';
            isPlaying = true;
        }

        function playYouTubeVideo(videoId) {
            const videoPlayer = document.getElementById('videoPlayer');
            const iframe = document.getElementById('youtubeIframe');
            
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
            videoPlayer.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeVideo() {
            const videoPlayer = document.getElementById('videoPlayer');
            const iframe = document.getElementById('youtubeIframe');
            
            iframe.src = '';
            videoPlayer.classList.add('hidden');
            document.body.style.overflow = 'auto';
            isPlaying = false;
            document.getElementById('playPauseIcon').className = 'fas fa-play';
        }

        function togglePlayPause() {
            // For simplicity, we'll just play the current track again
            // In a real app, you'd control YouTube player state
            if (!isPlaying) {
                playTrack(currentTrackIndex);
            } else {
                // Pause would require YouTube API, so we'll just close for now
                closeVideo();
            }
        }

        function playNext() {
            let nextIndex = currentTrackIndex + 1;
            if (nextIndex >= currentPlaylist.length) nextIndex = 0;
            playTrack(nextIndex);
        }

        function playPrevious() {
            let prevIndex = currentTrackIndex - 1;
            if (prevIndex < 0) prevIndex = currentPlaylist.length - 1;
            playTrack(prevIndex);
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
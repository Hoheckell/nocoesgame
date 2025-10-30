// Game Logic and Core Functions

// Initialize game
function initGame() {
    loadPlayerData();
    updateDashboard();
    updateProgressBars();
    updateBadges();
    updateLeaderboardPreview();
}

// Load player data from localStorage
function loadPlayerData() {
    const savedData = localStorage.getItem('techExplorerPlayerData');
    if (savedData) {
        const data = JSON.parse(savedData);
        gameData.player = { ...gameData.player, ...data };
    }
}

// Save player data to localStorage
function savePlayerData() {
    localStorage.setItem('techExplorerPlayerData', JSON.stringify(gameData.player));
}

// Update dashboard with current player data
function updateDashboard() {
    document.getElementById('playerName').textContent = gameData.player.name;
    document.getElementById('totalPoints').textContent = gameData.player.totalPoints;
    document.getElementById('completedChallenges').textContent = gameData.player.completedChallenges;
    document.getElementById('currentStreak').textContent = gameData.player.currentStreak;
    document.getElementById('badgesCount').textContent = gameData.player.badges.length;
}

// Update progress bars for each category
function updateProgressBars() {
    const categories = ['basics', 'organization', 'shortcuts', 'challenges'];
    const maxChallenges = [5, 6, 4, 5];
    
    categories.forEach((category, index) => {
        const progress = gameData.player.progress[category];
        const maxProgress = maxChallenges[index];
        const percentage = (progress / maxProgress) * 100;
        
        const progressBar = document.getElementById(`${category}Progress`);
        if (progressBar) {
            anime({
                targets: progressBar,
                width: `${percentage}%`,
                duration: 1000,
                easing: 'easeOutQuart'
            });
        }
    });
}

// Update badges display
function updateBadges() {
    const container = document.getElementById('badgesContainer');
    
    if (gameData.player.badges.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-400">
                <i class="fas fa-certificate text-4xl mb-2"></i>
                <p class="text-sm">Complete desafios para ganhar badges!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = gameData.player.badges.map(badgeId => {
        const badge = gameData.badges.find(b => b.id === badgeId);
        return `
            <div class="text-center badge-glow" style="animation-delay: ${Math.random() * 2}s">
                <div class="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-2">
                    <i class="${badge.icon} text-white text-2xl"></i>
                </div>
                <p class="text-xs font-medium text-gray-900">${badge.name}</p>
                <p class="text-xs text-gray-500">${badge.description}</p>
            </div>
        `;
    }).join('');
}

// Update leaderboard preview
function updateLeaderboardPreview() {
    const container = document.getElementById('leaderboardPreview');
    const topPlayers = gameData.leaderboard.individual.slice(0, 5);
    
    container.innerHTML = topPlayers.map((player, index) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 flex items-center justify-center rounded-full ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                }">
                    ${index + 1}
                </div>
                <div>
                    <p class="font-medium text-gray-900">${player.name}</p>
                    <p class="text-xs text-gray-500">${player.badges} badges</p>
                </div>
            </div>
            <div class="text-right">
                <p class="font-bold text-orange-500">${player.points}</p>
                <p class="text-xs text-gray-500">pontos</p>
            </div>
        </div>
    `).join('');
}

// Category selection
function selectCategory(categoryId) {
    const category = gameData.categories[categoryId];
    if (!category) return;

    // Find next uncompleted challenge
    const nextChallenge = category.challenges.find(challenge => 
        !isChallengeCompleted(challenge.id)
    );

    if (nextChallenge) {
        startChallenge(categoryId, nextChallenge.id);
    } else {
        showMessage('Parabéns!', 'Você completou todos os desafios desta categoria!', 'success');
    }
}

// Check if challenge is completed
function isChallengeCompleted(challengeId) {
    return localStorage.getItem(`challenge_${challengeId}`) === 'completed';
}

// Mark challenge as completed
function markChallengeCompleted(challengeId) {
    localStorage.setItem(`challenge_${challengeId}`, 'completed');
}

// Start a challenge
function startChallenge(categoryId, challengeId) {
    const category = gameData.categories[categoryId];
    const challenge = category.challenges.find(c => c.id === challengeId);
    
    if (!challenge) return;

    gameData.currentChallenge = { categoryId, challengeId, challenge };
    gameData.challengeStartTime = Date.now();

    // Hide dashboard, show challenge view
    document.getElementById('dashboardView').classList.add('hidden');
    document.getElementById('challengeView').classList.remove('hidden');

    // Reset timer
    document.getElementById('challengeTimer').textContent = '00:00';
    document.getElementById('challengePoints').textContent = '0';

    // Start timer
    startChallengeTimer();

    // Render challenge
    renderChallenge(challenge);
}

// Start challenge timer
function startChallengeTimer() {
    gameData.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameData.challengeStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        document.getElementById('challengeTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Stop challenge timer
function stopChallengeTimer() {
    if (gameData.timerInterval) {
        clearInterval(gameData.timerInterval);
        gameData.timerInterval = null;
    }
}

// Get challenge elapsed time
function getChallengeElapsedTime() {
    return Math.floor((Date.now() - gameData.challengeStartTime) / 1000);
}

// Calculate points with time bonus
function calculatePoints(basePoints, difficulty, timeElapsed) {
    let points = basePoints;
    
    // Difficulty multiplier
    const multipliers = { easy: 1, medium: 1.5, hard: 2 };
    points *= multipliers[difficulty] || 1;
    
    // Time bonus (faster = more points)
    const timeBonus = Math.max(0, 60 - timeElapsed); // Max 60 seconds bonus
    points += timeBonus;
    
    return Math.round(points);
}

// Award points and update player data
function awardPoints(points) {
    gameData.player.totalPoints += points;
    gameData.player.completedChallenges++;
    gameData.player.currentStreak++;
    
    // Update category progress
    if (gameData.currentChallenge) {
        const categoryId = gameData.currentChallenge.categoryId;
        gameData.player.progress[categoryId] = 
            (gameData.player.progress[categoryId] || 0) + 1;
    }
    
    // Check for new badges
    checkBadges();
    
    // Save data
    savePlayerData();
    
    // Update UI
    updateDashboard();
    updateProgressBars();
    updateBadges();
}

// Check and award badges
function checkBadges() {
    gameData.badges.forEach(badge => {
        if (!gameData.player.badges.includes(badge.id) && badge.condition(gameData.player)) {
            gameData.player.badges.push(badge.id);
            showBadgeNotification(badge);
        }
    });
}

// Show badge notification
function showBadgeNotification(badge) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 transform translate-x-full';
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <i class="${badge.icon} text-white text-xl"></i>
            </div>
            <div>
                <p class="font-bold text-gray-900">Badge Conquistado!</p>
                <p class="text-sm text-gray-600">${badge.name}</p>
                <p class="text-xs text-gray-500">${badge.description}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    anime({
        targets: notification,
        translateX: 0,
        duration: 500,
        easing: 'easeOutBack'
    });
    
    // Animate out after 4 seconds
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: '100%',
            duration: 300,
            easing: 'easeInBack',
            complete: () => notification.remove()
        });
    }, 4000);
}

// Show celebration animation
function showCelebration() {
    const canvas = document.getElementById('confettiCanvas');
    canvas.classList.remove('hidden');
    
    // Simple confetti effect
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#1e3a8a', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
    
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4
        });
    }
    
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((piece, index) => {
            piece.x += piece.vx;
            piece.y += piece.vy;
            piece.vy += 0.1; // gravity
            
            ctx.fillStyle = piece.color;
            ctx.fillRect(piece.x, piece.y, piece.size, piece.size);
            
            // Remove confetti that are off screen
            if (piece.y > canvas.height) {
                confetti.splice(index, 1);
            }
        });
        
        if (confetti.length > 0) {
            requestAnimationFrame(animateConfetti);
        } else {
            canvas.classList.add('hidden');
        }
    }
    
    animateConfetti();
}

// Show message modal
function showMessage(title, message, type = 'info') {
    const colors = {
        success: 'text-green-600',
        error: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600'
    };
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-md mx-4">
            <div class="text-center">
                <div class="w-16 h-16 ${colors[type]} bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas ${
                        type === 'success' ? 'fa-check' :
                        type === 'error' ? 'fa-times' :
                        type === 'warning' ? 'fa-exclamation' :
                        'fa-info'
                    } text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">${title}</h3>
                <p class="text-gray-600 mb-6">${message}</p>
                <button onclick="this.closest('.fixed').remove()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Entendi
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Navigation functions
function backToDashboard() {
    // Stop timer
    stopChallengeTimer();
    
    // Hide all views except dashboard
    document.getElementById('challengeView').classList.add('hidden');
    document.getElementById('leaderboardView').classList.add('hidden');
    document.getElementById('dashboardView').classList.remove('hidden');
    
    // Reset current challenge
    gameData.currentChallenge = null;
    
    // Update dashboard
    updateDashboard();
    updateProgressBars();
    updateBadges();
}

function showLeaderboard() {
    document.getElementById('dashboardView').classList.add('hidden');
    document.getElementById('leaderboardView').classList.remove('hidden');
    switchLeaderboardTab('individual');
}

function switchLeaderboardTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('border-blue-600', 'text-blue-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    
    const activeTab = document.getElementById(`${tab}Tab`);
    activeTab.classList.remove('border-transparent', 'text-gray-500');
    activeTab.classList.add('border-blue-600', 'text-blue-600');
    
    // Update content
    const content = document.getElementById('leaderboardContent');
    const data = gameData.leaderboard[tab];
    
    if (tab === 'individual') {
        content.innerHTML = data.map((player, index) => `
            <div class="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 flex items-center justify-center rounded-full ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' :
                        index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white' :
                        'bg-gray-100 text-gray-600'
                    }">
                        ${index + 1}
                    </div>
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">${player.avatar}</div>
                        <div>
                            <p class="font-medium text-gray-900">${player.name}</p>
                            <p class="text-sm text-gray-500">${player.badges} badges conquistados</p>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xl font-bold text-orange-500">${player.points}</p>
                    <p class="text-sm text-gray-500">pontos</p>
                </div>
            </div>
        `).join('');
    } else if (tab === 'class') {
        content.innerHTML = data.map((turma, index) => `
            <div class="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        ${index + 1}
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">${turma.name}</p>
                        <p class="text-sm text-gray-500">${turma.members} alunos • Média: ${turma.avgPoints} pts</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xl font-bold text-orange-500">${turma.points}</p>
                    <p class="text-sm text-gray-500">pontos totais</p>
                </div>
            </div>
        `).join('');
    } else if (tab === 'teams') {
        content.innerHTML = data.map((team, index) => `
            <div class="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                        ${index + 1}
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">${team.name}</p>
                        <p class="text-sm text-gray-500">${team.members.join(' & ')} • Sequência: ${team.streak}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xl font-bold text-orange-500">${team.points}</p>
                    <p class="text-sm text-gray-500">pontos</p>
                </div>
            </div>
        `).join('');
    }
}

function showProfile() {
    showMessage('Perfil do Jogador', 'Funcionalidade em desenvolvimento!', 'info');
}
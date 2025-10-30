// Main Game Initialization and Startup

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    addKeyboardShortcuts();
    addAccessibilityFeatures();
});

// Keyboard shortcuts
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // ESC to go back to dashboard
        if (e.key === 'Escape') {
            if (!document.getElementById('dashboardView').classList.contains('hidden')) {
                return;
            }
            backToDashboard();
        }
        
        // Enter to submit when button is focused
        if (e.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement && focusedElement.tagName === 'BUTTON') {
                focusedElement.click();
            }
        }
        
        // Number keys for quiz options
        if (e.key >= '1' && e.key <= '4') {
            const quizOptions = document.querySelectorAll('.quiz-option');
            const optionIndex = parseInt(e.key) - 1;
            if (quizOptions[optionIndex] && !quizOptions[optionIndex].disabled) {
                selectQuizOption(optionIndex, quizOptions[optionIndex]);
            }
        }
        
        // Space bar for true/false
        if (e.key === ' ') {
            const trueFalseOptions = document.querySelectorAll('.truefalse-option');
            if (trueFalseOptions.length === 2) {
                const selectedOption = document.querySelector('.truefalse-option.selected');
                if (selectedOption) {
                    // Toggle between true and false
                    const otherOption = selectedOption === trueFalseOptions[0] ? trueFalseOptions[1] : trueFalseOptions[0];
                    otherOption.click();
                } else {
                    trueFalseOptions[0].click();
                }
            }
        }
    });
}

// Accessibility features
function addAccessibilityFeatures() {
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && button.textContent.trim()) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });
    
    // Add focus indicators
    const style = document.createElement('style');
    style.textContent = `
        button:focus-visible,
        .quiz-option:focus-visible,
        .truefalse-option:focus-visible,
        .scenario-option:focus-visible {
            outline: 2px solid #1e3a8a;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
    
    // Add screen reader announcements
    const announcer = document.createElement('div');
    announcer.id = 'screenReaderAnnouncer';
    announcer.className = 'sr-only';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(announcer);
}

// Screen reader announcement
function announceToScreenReader(message) {
    const announcer = document.getElementById('screenReaderAnnouncer');
    if (announcer) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
}

// Responsive design adjustments
function handleResize() {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas && !canvas.classList.contains('hidden')) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

window.addEventListener('resize', handleResize);

// Prevent context menu on drag items for better UX
document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.drag-item')) {
        e.preventDefault();
    }
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Performance optimization: Debounce animations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced update functions
const debouncedUpdateProgressBars = debounce(updateProgressBars, 100);
const debouncedUpdateDashboard = debounce(updateDashboard, 100);

// Error handling
window.addEventListener('error', function(e) {
    console.error('Game Error:', e.error);
    showMessage('Erro', 'Ocorreu um erro no jogo. Por favor, recarregue a página.', 'error');
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    showMessage('Erro', 'Ocorreu um erro inesperado. Por favor, recarregue a página.', 'error');
});

// Game state persistence
function saveGameState() {
    const gameState = {
        player: gameData.player,
        timestamp: Date.now()
    };
    localStorage.setItem('techExplorerGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('techExplorerGameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        // Check if state is not too old (7 days)
        if (Date.now() - state.timestamp < 7 * 24 * 60 * 60 * 1000) {
            gameData.player = { ...gameData.player, ...state.player };
            return true;
        }
    }
    return false;
}

// Auto-save game state periodically
setInterval(saveGameState, 30000); // Save every 30 seconds

// Save state before page unload
window.addEventListener('beforeunload', function() {
    saveGameState();
});

// Tutorial system
function showTutorial() {
    const tutorialSteps = [
        {
            title: 'Bem-vindo ao Tech Explorer Academy!',
            content: 'Vamos aprender sobre organização de arquivos no Windows de forma divertida e interativa.',
            target: 'dashboardView'
        },
        {
            title: 'Sistema de Pontos',
            content: 'Complete desafios para ganhar pontos. Quanto mais rápido e preciso, mais pontos você ganha!',
            target: 'totalPoints'
        },
        {
            title: 'Badges e Conquistas',
            content: 'Conquiste badges especiais ao atingir marcos importantes. Mostre suas habilidades!',
            target: 'badgesContainer'
        },
        {
            title: 'Comece sua jornada',
            content: 'Clique em uma categoria para começar seus desafios. Boa sorte!',
            target: null
        }
    ];
    
    let currentStep = 0;
    
    function showStep() {
        if (currentStep >= tutorialSteps.length) {
            localStorage.setItem('techExplorerTutorialSeen', 'true');
            return;
        }
        
        const step = tutorialSteps[currentStep];
        showTutorialModal(step, () => {
            currentStep++;
            showStep();
        });
    }
    
    // Check if tutorial was already seen
    if (!localStorage.getItem('techExplorerTutorialSeen')) {
        setTimeout(showStep, 1000);
    }
}

function showTutorialModal(step, onNext) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 max-w-md mx-4">
            <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-graduation-cap text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">${step.title}</h3>
                <p class="text-gray-600 mb-6">${step.content}</p>
                <button onclick="this.closest('.fixed').remove(); onNext();" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    ${currentStep === tutorialSteps.length - 1 ? 'Começar!' : 'Próximo'}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Initialize tutorial after game loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(showTutorial, 2000);
});

// Export functions for global access
window.backToDashboard = backToDashboard;
window.selectCategory = selectCategory;
window.showLeaderboard = showLeaderboard;
window.switchLeaderboardTab = switchLeaderboardTab;
window.nextChallenge = nextChallenge;
window.showProfile = showProfile;
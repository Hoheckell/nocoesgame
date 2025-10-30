// ========================================================
// 🎮 Tech Explorer Game - Main Initialization and Handlers
// ========================================================

// ----------------------------
// 🧩 Initialization
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
  initGame();
  addKeyboardShortcuts();
  addAccessibilityFeatures();
  setTimeout(showTutorial, 2000);
});

// ----------------------------
// ⌨️ Keyboard Shortcuts
// ----------------------------
function addKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const { key, target } = e;

    // ESC → voltar ao dashboard
    if (key === 'Escape' && !document.getElementById('dashboardView').classList.contains('hidden')) {
      backToDashboard();
      return;
    }

    // Enter → clicar botão focado
    if (key === 'Enter' && target?.tagName === 'BUTTON') {
      target.click();
    }

    // Números (1–4) → opções do quiz
    if (key >= '1' && key <= '4') {
      const quizOptions = document.querySelectorAll('.quiz-option');
      const index = parseInt(key, 10) - 1;
      const option = quizOptions[index];
      if (option && !option.disabled) selectQuizOption(index, option);
    }

    // Espaço → alternar True/False
    if (key === ' ') {
      const options = document.querySelectorAll('.truefalse-option');
      if (options.length === 2) {
        const selected = document.querySelector('.truefalse-option.selected');
        const next = selected === options[0] ? options[1] : options[0];
        (selected ? next : options[0]).click();
      }
    }
  });
}

// ----------------------------
// ♿ Acessibilidade e UX
// ----------------------------
function addAccessibilityFeatures() {
  // Adiciona labels ARIA
  document.querySelectorAll('button').forEach((btn) => {
    if (!btn.getAttribute('aria-label') && btn.textContent.trim()) {
      btn.setAttribute('aria-label', btn.textContent.trim());
    }
  });

  // Destaque de foco
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

  // Elemento para leitores de tela
  const announcer = document.createElement('div');
  announcer.id = 'screenReaderAnnouncer';
  announcer.className = 'sr-only';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  document.body.appendChild(announcer);
}

function announceToScreenReader(message) {
  const announcer = document.getElementById('screenReaderAnnouncer');
  if (!announcer) return;
  announcer.textContent = message;
  setTimeout(() => (announcer.textContent = ''), 1000);
}

// ----------------------------
// 🖥️ Layout & UX
// ----------------------------
function handleResize() {
  const canvas = document.getElementById('confettiCanvas');
  if (canvas && !canvas.classList.contains('hidden')) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}
window.addEventListener('resize', handleResize);

// Previne menu de contexto em itens arrastáveis
document.addEventListener('contextmenu', (e) => {
  if (e.target.closest('.drag-item')) e.preventDefault();
});

// Rolagem suave
document.documentElement.style.scrollBehavior = 'smooth';

// ----------------------------
// ⚙️ Utilitários
// ----------------------------
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const debouncedUpdateProgressBars = debounce(updateProgressBars, 100);
const debouncedUpdateDashboard = debounce(updateDashboard, 100);

// ----------------------------
// 🧱 Persistência de Estado
// ----------------------------
function saveGameState() {
  const gameState = { player: gameData.player, timestamp: Date.now() };
  localStorage.setItem('techExplorerGameState', JSON.stringify(gameState));
}

function loadGameState() {
  const saved = localStorage.getItem('techExplorerGameState');
  if (!saved) return false;

  const state = JSON.parse(saved);
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  if (Date.now() - state.timestamp < oneWeek) {
    gameData.player = { ...gameData.player, ...state.player };
    return true;
  }
  return false;
}

setInterval(saveGameState, 30000);
window.addEventListener('beforeunload', saveGameState);

// ----------------------------
// ❗ Tratamento de Erros
// ----------------------------
window.addEventListener('error', (e) => {
  console.error('Game Error:', e.error);
  showMessage('Erro', 'Ocorreu um erro no jogo. Por favor, recarregue a página.', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
  showMessage('Erro', 'Ocorreu um erro inesperado. Por favor, recarregue a página.', 'error');
});

// ----------------------------
// 🧭 Sistema de Tutorial
// ----------------------------
function showTutorial() {
  const seen = localStorage.getItem('techExplorerTutorialSeen');
  if (seen) return;

  const steps = [
    {
      title: 'Bem-vindo ao Tech Explorer Academy!',
      content: 'Vamos aprender sobre organização de arquivos no Windows de forma divertida e interativa.',
      target: 'dashboardView',
    },
    {
      title: 'Sistema de Pontos',
      content: 'Complete desafios para ganhar pontos. Quanto mais rápido e preciso, mais pontos você ganha!',
      target: 'totalPoints',
    },
    {
      title: 'Badges e Conquistas',
      content: 'Conquiste badges especiais ao atingir marcos importantes. Mostre suas habilidades!',
      target: 'badgesContainer',
    },
    {
      title: 'Comece sua jornada',
      content: 'Clique em uma categoria para começar seus desafios. Boa sorte!',
      target: null,
    },
  ];

  let stepIndex = 0;

  const nextStep = () => {
    if (stepIndex >= steps.length) {
      localStorage.setItem('techExplorerTutorialSeen', 'true');
      return;
    }
    showTutorialModal(steps[stepIndex], () => {
      stepIndex++;
      nextStep();
    }, stepIndex, steps);
  };

  setTimeout(nextStep, 1000);
}

function showTutorialModal(step, onNext, currentStep, allSteps) {
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
        <button
          class="tutorial-next px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ${currentStep === allSteps.length - 1 ? 'Começar!' : 'Próximo'}
        </button>
      </div>
    </div>
  `;

  // adiciona à página
  document.body.appendChild(modal);

  // adiciona o event listener corretamente
  const button = modal.querySelector('.tutorial-next');
  button.addEventListener('click', () => {
    modal.remove();
    onNext();
  });
}

// ----------------------------
// 🌐 Exports Globais
// ----------------------------
window.backToDashboard = backToDashboard;
window.selectCategory = selectCategory;
window.showLeaderboard = showLeaderboard;
window.switchLeaderboardTab = switchLeaderboardTab;
window.nextChallenge = nextChallenge;
window.showProfile = showProfile;

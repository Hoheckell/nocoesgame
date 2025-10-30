// Challenge Types and Rendering Functions

// Render challenge based on type
function renderChallenge(challenge) {
    const container = document.getElementById('challengeContent');
    
    // Reset container
    container.innerHTML = '';
    
    // Add challenge header
    const header = document.createElement('div');
    header.className = 'mb-6';
    header.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-900 mb-2">${challenge.title}</h2>
        <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span class="px-2 py-1 bg-gray-100 rounded-full">
                ${challenge.difficulty === 'easy' ? 'Fácil' : 
                  challenge.difficulty === 'medium' ? 'Médio' : 'Difícil'}
            </span>
            <span>${challenge.points} pontos</span>
        </div>
    `;
    container.appendChild(header);
    
    // Render challenge type-specific content
    switch (challenge.type) {
        case 'quiz':
            renderQuizChallenge(challenge, container);
            break;
        case 'truefalse':
            renderTrueFalseChallenge(challenge, container);
            break;
        case 'dragdrop':
            renderDragDropChallenge(challenge, container);
            break;
        case 'scenario':
            renderScenarioChallenge(challenge, container);
            break;
        default:
            container.innerHTML = '<p class="text-gray-500">Tipo de desafio não reconhecido.</p>';
    }
}

// Quiz Challenge Renderer
function renderQuizChallenge(challenge, container) {
    const content = document.createElement('div');
    content.className = 'space-y-6';
    
    // Question
    const questionDiv = document.createElement('div');
    questionDiv.className = 'bg-blue-50 p-4 rounded-lg';
    questionDiv.innerHTML = `
        <p class="text-lg font-medium text-gray-900">${challenge.question}</p>
    `;
    content.appendChild(questionDiv);
    
    // Options
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'space-y-3';
    
    challenge.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'quiz-option w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all';
        optionButton.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                    <div class="w-3 h-3 bg-blue-600 rounded-full hidden option-selected"></div>
                </div>
                <span class="text-gray-900">${option}</span>
            </div>
        `;
        
        optionButton.addEventListener('click', () => selectQuizOption(index, optionButton));
        optionsDiv.appendChild(optionButton);
    });
    
    content.appendChild(optionsDiv);
    
    // Submit button
    const submitButton = document.createElement('button');
    submitButton.id = 'quizSubmit';
    submitButton.className = 'hidden w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium';
    submitButton.textContent = 'Confirmar Resposta';
    submitButton.addEventListener('click', submitQuizAnswer);
    content.appendChild(submitButton);
    
    container.appendChild(content);
}

// Quiz option selection
function selectQuizOption(index, button) {
    // Clear previous selections
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
        opt.querySelector('.option-selected').classList.add('hidden');
    });
    
    // Select current option
    button.classList.add('selected');
    button.querySelector('.option-selected').classList.remove('hidden');
    
    // Show submit button
    document.getElementById('quizSubmit').classList.remove('hidden');
    
    // Store selected answer
    window.selectedQuizAnswer = index;
}

// Submit quiz answer
function submitQuizAnswer() {
    const challenge = gameData.currentChallenge.challenge;
    const selectedAnswer = window.selectedQuizAnswer;
    const isCorrect = selectedAnswer === challenge.correct;
    
    // Disable all options
    document.querySelectorAll('.quiz-option').forEach((option, index) => {
        option.disabled = true;
        if (index === challenge.correct) {
            option.classList.add('correct');
        } else if (index === selectedAnswer && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // Hide submit button
    document.getElementById('quizSubmit').classList.add('hidden');
    
    // Process result
    processChallengeResult(isCorrect);
}

// True/False Challenge Renderer
function renderTrueFalseChallenge(challenge, container) {
    const content = document.createElement('div');
    content.className = 'space-y-6';
    
    // Question
    const questionDiv = document.createElement('div');
    questionDiv.className = 'bg-orange-50 p-4 rounded-lg';
    questionDiv.innerHTML = `
        <p class="text-lg font-medium text-gray-900">${challenge.question}</p>
    `;
    content.appendChild(questionDiv);
    
    // Options
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'grid grid-cols-2 gap-4';
    
    const options = [
        { value: true, label: 'Verdadeiro', icon: 'fa-check', color: 'green' },
        { value: false, label: 'Falso', icon: 'fa-times', color: 'red' }
    ];
    
    options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.className = 'truefalse-option p-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all text-center';
        optionButton.innerHTML = `
            <div class="text-4xl text-${option.color}-500 mb-2">
                <i class="fas ${option.icon}"></i>
            </div>
            <p class="text-lg font-medium text-gray-900">${option.label}</p>
        `;
        
        optionButton.addEventListener('click', () => selectTrueFalseOption(option.value, optionButton));
        optionsDiv.appendChild(optionButton);
    });
    
    content.appendChild(optionsDiv);
    
    container.appendChild(content);
}

// True/False option selection
function selectTrueFalseOption(value, button) {
    // Clear previous selections
    document.querySelectorAll('.truefalse-option').forEach(opt => {
        opt.classList.remove('selected', 'border-green-500', 'border-red-500');
    });
    
    // Select current option
    button.classList.add('selected', value ? 'border-green-500' : 'border-red-500');
    
    // Store selected answer
    window.selectedTrueFalseAnswer = value;
    
    // Auto-submit after a short delay for visual feedback
    setTimeout(() => submitTrueFalseAnswer(), 500);
}

// Submit true/false answer
function submitTrueFalseAnswer() {
    const challenge = gameData.currentChallenge.challenge;
    const selectedAnswer = window.selectedTrueFalseAnswer;
    const isCorrect = selectedAnswer === challenge.correct;
    
    // Show correct/incorrect styling
    document.querySelectorAll('.truefalse-option').forEach(option => {
        option.disabled = true;
    });
    
    // Process result
    processChallengeResult(isCorrect);
}

// Drag and Drop Challenge Renderer
function renderDragDropChallenge(challenge, container) {
    const content = document.createElement('div');
    content.className = 'space-y-6';
    
    // Question
    const questionDiv = document.createElement('div');
    questionDiv.className = 'bg-green-50 p-4 rounded-lg';
    questionDiv.innerHTML = `
        <p class="text-lg font-medium text-gray-900">${challenge.question}</p>
    `;
    content.appendChild(questionDiv);
    
    // Items to drag
    const itemsDiv = document.createElement('div');
    itemsDiv.className = 'bg-gray-50 p-4 rounded-lg';
    itemsDiv.innerHTML = '<p class="text-sm font-medium text-gray-700 mb-3">Arraste os itens:</p>';
    
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'flex flex-wrap gap-3';
    
    challenge.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'drag-item bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm cursor-grab';
        itemElement.draggable = true;
        itemElement.dataset.itemId = item.id;
        itemElement.dataset.itemType = item.type;
        itemElement.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-file text-blue-500"></i>
                <span class="text-sm font-medium">${item.name}</span>
            </div>
        `;
        
        // Add drag event listeners
        itemElement.addEventListener('dragstart', handleDragStart);
        itemElement.addEventListener('dragend', handleDragEnd);
        
        itemsContainer.appendChild(itemElement);
    });
    
    itemsDiv.appendChild(itemsContainer);
    content.appendChild(itemsDiv);
    
    // Drop zones
    const dropZonesDiv = document.createElement('div');
    dropZonesDiv.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4';
    
    challenge.categories.forEach(category => {
        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone p-6 rounded-lg min-h-24';
        dropZone.dataset.categoryId = category.id;
        dropZone.innerHTML = `
            <div class="text-center mb-4">
                <i class="fas fa-folder text-2xl text-gray-400 mb-2"></i>
                <p class="font-medium text-gray-700">${category.name}</p>
            </div>
            <div class="drop-items space-y-2 min-h-16"></div>
        `;
        
        // Add drop event listeners
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleDrop);
        dropZone.addEventListener('dragenter', handleDragEnter);
        dropZone.addEventListener('dragleave', handleDragLeave);
        
        dropZonesDiv.appendChild(dropZone);
    });
    
    content.appendChild(dropZonesDiv);
    
    // Submit button
    const submitButton = document.createElement('button');
    submitButton.id = 'dragDropSubmit';
    submitButton.className = 'hidden w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium';
    submitButton.textContent = 'Verificar Organização';
    submitButton.addEventListener('click', submitDragDropAnswer);
    content.appendChild(submitButton);
    
    container.appendChild(content);
    
    // Initialize drag drop state
    window.dragDropState = {
        placedItems: {},
        totalItems: challenge.items.length
    };
}

// Drag and Drop event handlers
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.itemId);
    e.dataTransfer.setData('itemType', e.target.dataset.itemType);
    e.target.style.opacity = '0.5';
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.closest('.drop-zone').classList.add('drag-over');
}

function handleDragLeave(e) {
    if (!e.target.closest('.drop-zone').contains(e.relatedTarget)) {
        e.target.closest('.drop-zone').classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = e.target.closest('.drop-zone');
    dropZone.classList.remove('drag-over');
    
    const itemId = e.dataTransfer.getData('text/plain');
    const itemType = e.dataTransfer.getData('itemType');
    const categoryId = dropZone.dataset.categoryId;
    const category = gameData.currentChallenge.challenge.categories.find(c => c.id === categoryId);
    
    // Check if item type is accepted
    if (category.accepts.includes(itemType)) {
        const draggedElement = document.querySelector(`[data-item-id="${itemId}"]`);
        const dropItems = dropZone.querySelector('.drop-items');
        
        // Remove from original location
        draggedElement.remove();
        
        // Add to drop zone
        dropItems.appendChild(draggedElement);
        draggedElement.draggable = false;
        draggedElement.classList.remove('cursor-grab');
        draggedElement.classList.add('opacity-75');
        
        // Update state
        window.dragDropState.placedItems[itemId] = categoryId;
        
        // Show submit button if all items are placed
        if (Object.keys(window.dragDropState.placedItems).length === window.dragDropState.totalItems) {
            document.getElementById('dragDropSubmit').classList.remove('hidden');
        }
    }
}

// Submit drag and drop answer
function submitDragDropAnswer() {
    const challenge = gameData.currentChallenge.challenge;
    const placedItems = window.dragDropState.placedItems;
    
    // Check if all items are correctly placed
    let correct = 0;
    challenge.items.forEach(item => {
        const placedCategory = placedItems[item.id];
        const category = challenge.categories.find(c => c.id === placedCategory);
        if (category && category.accepts.includes(item.type)) {
            correct++;
        }
    });
    
    const isCorrect = correct === challenge.items.length;
    
    // Visual feedback
    document.querySelectorAll('.drop-zone').forEach(zone => {
        const categoryId = zone.dataset.categoryId;
        const isCorrectZone = challenge.items.every(item => {
            const placedCategory = placedItems[item.id];
            const itemCategory = challenge.categories.find(c => c.id === placedCategory);
            return !itemCategory || !itemCategory.accepts.includes(item.type) || placedCategory === categoryId;
        });
        
        zone.classList.add(isCorrectZone ? 'border-green-500' : 'border-red-500');
        zone.style.borderStyle = 'solid';
    });
    
    // Process result
    processChallengeResult(isCorrect);
}

// Scenario Challenge Renderer
function renderScenarioChallenge(challenge, container) {
    const content = document.createElement('div');
    content.className = 'space-y-6';
    
    // Scenario context
    if (challenge.scenario) {
        const scenarioDiv = document.createElement('div');
        scenarioDiv.className = 'bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500';
        scenarioDiv.innerHTML = `
            <div class="flex items-start space-x-3">
                <i class="fas fa-info-circle text-purple-500 text-xl mt-1"></i>
                <div>
                    <p class="font-medium text-purple-900 mb-1">Situação:</p>
                    <p class="text-purple-800">${challenge.scenario}</p>
                </div>
            </div>
        `;
        content.appendChild(scenarioDiv);
    }
    
    // Question
    const questionDiv = document.createElement('div');
    questionDiv.className = 'bg-purple-50 p-4 rounded-lg';
    questionDiv.innerHTML = `
        <p class="text-lg font-medium text-gray-900">${challenge.question}</p>
    `;
    content.appendChild(questionDiv);
    
    // Options
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'space-y-3';
    
    challenge.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'scenario-option w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all';
        optionButton.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div class="w-3 h-3 bg-purple-600 rounded-full hidden option-selected"></div>
                </div>
                <span class="text-gray-900">${option}</span>
            </div>
        `;
        
        optionButton.addEventListener('click', () => selectScenarioOption(index, optionButton));
        optionsDiv.appendChild(optionButton);
    });
    
    content.appendChild(optionsDiv);
    
    // Submit button
    const submitButton = document.createElement('button');
    submitButton.id = 'scenarioSubmit';
    submitButton.className = 'hidden w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium';
    submitButton.textContent = 'Escolher Resposta';
    submitButton.addEventListener('click', submitScenarioAnswer);
    content.appendChild(submitButton);
    
    container.appendChild(content);
}

// Scenario option selection
function selectScenarioOption(index, button) {
    // Clear previous selections
    document.querySelectorAll('.scenario-option').forEach(opt => {
        opt.classList.remove('selected');
        opt.querySelector('.option-selected').classList.add('hidden');
    });
    
    // Select current option
    button.classList.add('selected');
    button.querySelector('.option-selected').classList.remove('hidden');
    
    // Show submit button
    document.getElementById('scenarioSubmit').classList.remove('hidden');
    
    // Store selected answer
    window.selectedScenarioAnswer = index;
}

// Submit scenario answer
function submitScenarioAnswer() {
    const challenge = gameData.currentChallenge.challenge;
    const selectedAnswer = window.selectedScenarioAnswer;
    const isCorrect = selectedAnswer === challenge.correct;
    
    // Disable all options
    document.querySelectorAll('.scenario-option').forEach((option, index) => {
        option.disabled = true;
        if (index === challenge.correct) {
            option.classList.add('correct');
        } else if (index === selectedAnswer && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // Hide submit button
    document.getElementById('scenarioSubmit').classList.add('hidden');
    
    // Process result
    processChallengeResult(isCorrect);
}

// Process challenge result
function processChallengeResult(isCorrect) {
    const challenge = gameData.currentChallenge.challenge;
    const elapsedTime = getChallengeElapsedTime();
    
    // Calculate points
    const points = isCorrect ? calculatePoints(challenge.points, challenge.difficulty, elapsedTime) : 0;
    
    // Show result feedback
    showChallengeResult(isCorrect, points, challenge.explanation);
    
    if (isCorrect) {
        // Award points
        awardPoints(points);
        
        // Mark challenge as completed
        markChallengeCompleted(challenge.id);
        
        // Show celebration
        showCelebration();
        
        // Update fastest time if applicable
        if (!gameData.player.fastestTime || elapsedTime < gameData.player.fastestTime) {
            gameData.player.fastestTime = elapsedTime;
        }
        
        // Check for perfect category
        checkPerfectCategory();
    } else {
        // Reset streak on wrong answer
        gameData.player.currentStreak = 0;
        savePlayerData();
        updateDashboard();
    }
    
    // Show next challenge button after delay
    setTimeout(() => {
        showNextChallengeButton(isCorrect);
    }, 3000);
}

// Show challenge result
function showChallengeResult(isCorrect, points, explanation) {
    const resultDiv = document.createElement('div');
    resultDiv.className = `mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`;
    resultDiv.innerHTML = `
        <div class="flex items-start space-x-3">
            <div class="text-2xl ${isCorrect ? 'text-green-500' : 'text-red-500'}">
                <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
            </div>
            <div class="flex-1">
                <h3 class="font-bold ${isCorrect ? 'text-green-900' : 'text-red-900'} mb-2">
                    ${isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta'}
                </h3>
                ${points > 0 ? `<p class="text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'} mb-2">Você ganhou ${points} pontos!</p>` : ''}
                <p class="text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}">${explanation}</p>
            </div>
        </div>
    `;
    
    document.getElementById('challengeContent').appendChild(resultDiv);
    
    // Animate in
    anime({
        targets: resultDiv,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutQuart'
    });
}

// Show next challenge button
function showNextChallengeButton(isCorrect) {
    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'mt-6 flex space-x-4';
    buttonDiv.innerHTML = `
        <button onclick="backToDashboard()" class="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Voltar ao Dashboard
        </button>
        <button onclick="nextChallenge()" class="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Próximo Desafio
        </button>
    `;
    
    document.getElementById('challengeContent').appendChild(buttonDiv);
}

// Go to next challenge
function nextChallenge() {
    const currentCategory = gameData.currentChallenge.categoryId;
    const category = gameData.categories[currentCategory];
    
    // Find next uncompleted challenge in same category
    const nextChallenge = category.challenges.find(challenge => 
        !isChallengeCompleted(challenge.id)
    );
    
    if (nextChallenge) {
        startChallenge(currentCategory, nextChallenge.id);
    } else {
        // Check other categories
        const categories = Object.keys(gameData.categories);
        const currentIndex = categories.indexOf(currentCategory);
        
        for (let i = 1; i < categories.length; i++) {
            const nextCategoryIndex = (currentIndex + i) % categories.length;
            const nextCategoryId = categories[nextCategoryIndex];
            const nextCategory = gameData.categories[nextCategoryId];
            
            const uncompletedChallenge = nextCategory.challenges.find(challenge => 
                !isChallengeCompleted(challenge.id)
            );
            
            if (uncompletedChallenge) {
                startChallenge(nextCategoryId, uncompletedChallenge.id);
                return;
            }
        }
        
        // All challenges completed
        showMessage('Parabéns!', 'Você completou todos os desafios disponíveis!', 'success');
        backToDashboard();
    }
}

// Check for perfect category
function checkPerfectCategory() {
    const categoryId = gameData.currentChallenge.categoryId;
    const category = gameData.categories[categoryId];
    const completedInCategory = gameData.player.progress[categoryId];
    
    if (completedInCategory === category.challenges.length) {
        gameData.player.perfectCategory = true;
        showMessage('Categoria Completa!', 'Você completou todos os desafios desta categoria com 100% de acertos!', 'success');
    }
}
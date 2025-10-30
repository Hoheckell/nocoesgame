// Game Data and Challenges
const gameData = {
    // Player data
    player: {
        name: 'Aluno',
        totalPoints: 0,
        completedChallenges: 0,
        currentStreak: 0,
        badges: [],
        progress: {
            basics: 0,
            organization: 0,
            shortcuts: 0,
            challenges: 0
        },
        leaderboard: {
            individual: 0,
            class: 0,
            team: 0
        }
    },

    // Badges system
    badges: [
        {
            id: 'first_steps',
            name: 'Primeiros Passos',
            description: 'Complete 3 desafios seguidos',
            icon: 'fas fa-seedling',
            color: 'text-green-500',
            condition: (player) => player.currentStreak >= 3
        },
        {
            id: 'organizer',
            name: 'Organizador',
            description: 'Complete todos os desafios de organização',
            icon: 'fas fa-folder-tree',
            color: 'text-blue-500',
            condition: (player) => player.progress.organization >= 6
        },
        {
            id: 'speed_demon',
            name: 'Velocidade',
            description: 'Complete um desafio em menos de 30 segundos',
            icon: 'fas fa-bolt',
            color: 'text-yellow-500',
            condition: (player) => player.fastestTime && player.fastestTime < 30
        },
        {
            id: 'perfectionist',
            name: 'Perfeccionista',
            description: 'Acerte 100% dos desafios de um tema',
            icon: 'fas fa-star',
            color: 'text-purple-500',
            condition: (player) => player.perfectCategory
        },
        {
            id: 'expert',
            name: 'Especialista',
            description: 'Complete todos os desafios avançados',
            icon: 'fas fa-crown',
            color: 'text-orange-500',
            condition: (player) => player.progress.challenges >= 5
        }
    ],

    // Leaderboard data
    leaderboard: {
        individual: [
            { name: 'Maria Silva', points: 1250, badges: 4, avatar: '👩‍💻' },
            { name: 'João Santos', points: 1180, badges: 3, avatar: '👨‍💻' },
            { name: 'Ana Costa', points: 1150, badges: 3, avatar: '👩‍🎓' },
            { name: 'Pedro Lima', points: 1100, badges: 2, avatar: '👨‍🎓' },
            { name: 'Carla Oliveira', points: 1050, badges: 2, avatar: '👩‍💼' },
            { name: 'Lucas Ferreira', points: 980, badges: 2, avatar: '👨‍💼' },
            { name: 'Julia Mendes', points: 920, badges: 1, avatar: '👩‍🔬' },
            { name: 'Marcos Souza', points: 850, badges: 1, avatar: '👨‍🔬' }
        ],
        class: [
            { name: 'Turma A - Manhã', points: 8750, members: 12, avgPoints: 729 },
            { name: 'Turma B - Tarde', points: 8250, members: 15, avgPoints: 550 },
            { name: 'Turma C - Noite', points: 7800, members: 18, avgPoints: 433 }
        ],
        teams: [
            { name: 'Code Warriors', points: 2150, members: ['Maria', 'João'], streak: 5 },
            { name: 'File Masters', points: 1950, members: ['Ana', 'Pedro'], streak: 3 },
            { name: 'Folder Ninjas', points: 1800, members: ['Carla', 'Lucas'], streak: 2 },
            { name: 'Data Wizards', points: 1650, members: ['Julia', 'Marcos'], streak: 1 }
        ]
    },

    // Challenge categories
    categories: {
        basics: {
            title: 'Conceitos Básicos',
            description: 'Aprenda os fundamentos sobre arquivos e pastas',
            icon: 'fas fa-file',
            color: 'blue',
            challenges: [
                {
                    id: 'basics_01',
                    type: 'quiz',
                    title: 'O que é um arquivo?',
                    question: 'Qual das alternativas melhor define o que é um arquivo em computação?',
                    options: [
                        'Uma pasta que contém outros arquivos',
                        'Uma unidade de armazenamento que contém dados, texto ou programas',
                        'Um atalho para acessar programas',
                        'Um tipo de vírus do computador'
                    ],
                    correct: 1,
                    explanation: 'Um arquivo é uma unidade básica de armazenamento que pode conter dados, textos, imagens, programas ou qualquer outro tipo de informação digital.',
                    points: 10,
                    difficulty: 'easy'
                },
                {
                    id: 'basics_02',
                    type: 'truefalse',
                    title: 'Pastas e Diretórios',
                    question: 'Pastas e diretórios são a mesma coisa no Windows.',
                    correct: true,
                    explanation: 'Sim! No Windows, os termos "pasta" e "diretório" são usados como sinônimos. Ambos se referem a contêineres usados para organizar arquivos.',
                    points: 10,
                    difficulty: 'easy'
                },
                {
                    id: 'basics_03',
                    type: 'quiz',
                    title: 'Extensões de Arquivo',
                    question: 'Qual extensão indica que o arquivo é uma imagem?',
                    options: ['.txt', '.docx', '.jpg', '.exe'],
                    correct: 2,
                    explanation: 'A extensão .jpg (ou .jpeg) indica que o arquivo é uma imagem comprimida. .txt é texto, .docx é documento Word, e .exe é executável.',
                    points: 15,
                    difficulty: 'medium'
                },
                {
                    id: 'basics_04',
                    type: 'dragdrop',
                    title: 'Organizando por Tipo',
                    question: 'Arraste os arquivos para as pastas corretas baseado em seus tipos:',
                    items: [
                        { id: 'foto.jpg', name: 'foto.jpg', type: 'imagem' },
                        { id: 'documento.pdf', name: 'documento.pdf', type: 'documento' },
                        { id: 'musica.mp3', name: 'musica.mp3', type: 'audio' },
                        { id: 'video.mp4', name: 'video.mp4', type: 'video' },
                        { id: 'planilha.xlsx', name: 'planilha.xlsx', type: 'documento' }
                    ],
                    categories: [
                        { id: 'imagens', name: 'Imagens', accepts: ['imagem'] },
                        { id: 'documentos', name: 'Documentos', accepts: ['documento'] },
                        { id: 'midia', name: 'Mídia', accepts: ['audio', 'video'] }
                    ],
                    explanation: 'Organizar arquivos por tipo ajuda a encontrá-los mais rapidamente. Imagens em uma pasta, documentos em outra, e mídias em uma terceira.',
                    points: 20,
                    difficulty: 'medium'
                },
                {
                    id: 'basics_05',
                    type: 'scenario',
                    title: 'Estrutura de Pastas',
                    question: 'Você está organizando seus documentos escolares. Qual estrutura de pastas seria mais eficiente?',
                    scenario: 'Você tem documentos de 3 matérias diferentes (Matemática, Português e História) e quer organizar por ano letivo (2023 e 2024).',
                    options: [
                        'Criar pastas apenas por matéria',
                        'Criar pastas apenas por ano',
                        'Criar pastas por ano e dentro delas por matéria',
                        'Deixar todos os documentos na mesma pasta'
                    ],
                    correct: 2,
                    explanation: 'A melhor organização é criar pastas por ano e dentro delas pastas por matéria. Isso permite encontrar documentos rapidamente por período e disciplina.',
                    points: 25,
                    difficulty: 'hard'
                }
            ]
        },
        organization: {
            title: 'Organização Prática',
            description: 'Aprenda a criar, mover e gerenciar arquivos eficientemente',
            icon: 'fas fa-folder-tree',
            color: 'orange',
            challenges: [
                {
                    id: 'org_01',
                    type: 'quiz',
                    title: 'Criando Novas Pastas',
                    question: 'Qual atalho do teclado cria uma nova pasta no Windows Explorer?',
                    options: ['Ctrl+N', 'Ctrl+Shift+N', 'Alt+N', 'F12'],
                    correct: 1,
                    explanation: 'Ctrl+Shift+N é o atalho para criar uma nova pasta no Windows Explorer. Ctrl+N geralmente abre uma nova janela.',
                    points: 15,
                    difficulty: 'medium'
                },
                {
                    id: 'org_02',
                    type: 'truefalse',
                    title: 'Mover vs Copiar',
                    question: 'Arrastar um arquivo com o botão esquerdo do mouse sempre move o arquivo para a nova localização.',
                    correct: false,
                    explanation: 'Não sempre! Se arrastar para a mesma unidade (ex: C: para C:), move. Mas se arrastar para outra unidade (ex: C: para D:), copia. Use Shift+arrastar para forçar mover.',
                    points: 20,
                    difficulty: 'medium'
                },
                {
                    id: 'org_03',
                    type: 'dragdrop',
                    title: 'Organizando Downloads',
                    question: 'Você baixou vários arquivos. Organize-os nas pastas apropriadas:',
                    items: [
                        { id: 'trabalho.docx', name: 'trabalho.docx', type: 'documento' },
                        { id: 'foto-familia.jpg', name: 'foto-familia.jpg', type: 'imagem' },
                        { id: 'setup-programa.exe', name: 'setup-programa.exe', type: 'programa' },
                        { id: 'apresentacao.pptx', name: 'apresentacao.pptx', type: 'apresentacao' },
                        { id: 'musica-favorita.mp3', name: 'musica-favorita.mp3', type: 'audio' }
                    ],
                    categories: [
                        { id: 'documentos', name: 'Documentos', accepts: ['documento', 'apresentacao'] },
                        { id: 'imagens', name: 'Imagens', accepts: ['imagem'] },
                        { id: 'programas', name: 'Programas', accepts: ['programa'] },
                        { id: 'musicas', name: 'Músicas', accepts: ['audio'] }
                    ],
                    explanation: 'Organizar downloads imediatamente evita acumulação de arquivos desorganizados. Crie pastas por tipo e mova os arquivos assim que baixados.',
                    points: 25,
                    difficulty: 'medium'
                },
                {
                    id: 'org_04',
                    type: 'scenario',
                    title: 'Limpeza de Arquivos',
                    question: 'Seu computador está com pouco espaço. O que fazer primeiro?',
                    scenario: 'Você tem 50GB livres em um disco de 500GB. A pasta Downloads tem 15GB, a pasta de fotos tem 100GB, e há 5GB de arquivos temporários.',
                    options: [
                        'Excluir todas as fotos antigas',
                        'Limpar arquivos temporários e Downloads',
                        'Comprimir todas as fotos',
                        'Formatar o computador'
                    ],
                    correct: 1,
                    explanation: 'Comece pelos arquivos temporários e Downloads. Arquivos temporários são seguros de remover, e Downloads geralmente acumula arquivos desnecessários. Fotos devem ser revisadas cuidadosamente.',
                    points: 30,
                    difficulty: 'hard'
                },
                {
                    id: 'org_05',
                    type: 'quiz',
                    title: 'Nomenclatura de Arquivos',
                    question: 'Qual nome de arquivo é mais descritivo e organizado?',
                    options: [
                        'documento1.pdf',
                        'trabalho_final_FINAL_v2.pdf',
                        '2024-03-15_Matematica_TrabFinal.pdf',
                        'arquivo.pdf'
                    ],
                    correct: 2,
                    explanation: '2024-03-15_Matematica_TrabFinal.pdf segue uma convenção clara: data, matéria e descrição. Isso facilita a busca e organização futura.',
                    points: 20,
                    difficulty: 'medium'
                },
                {
                    id: 'org_06',
                    type: 'truefalse',
                    title: 'Arquivos Duplicados',
                    question: 'É sempre seguro excluir arquivos duplicados para liberar espaço.',
                    correct: false,
                    explanation: 'Nem sempre! Alguns "duplicados" podem ser backups importantes ou arquivos de sistema. Verifique sempre antes de excluir, especialmente em pastas de programas.',
                    points: 25,
                    difficulty: 'medium'
                }
            ]
        },
        shortcuts: {
            title: 'Atalhos e Dicas',
            description: 'Domine os atalhos do teclado e funções avançadas',
            icon: 'fas fa-keyboard',
            color: 'green',
            challenges: [
                {
                    id: 'short_01',
                    type: 'quiz',
                    title: 'Atalho de Seleção',
                    question: 'Qual atalho seleciona todos os arquivos de uma pasta?',
                    options: ['Ctrl+A', 'Ctrl+S', 'Alt+A', 'Shift+A'],
                    correct: 0,
                    explanation: 'Ctrl+A seleciona todos os itens na janela atual. É um atalho universal usado em muitos programas.',
                    points: 10,
                    difficulty: 'easy'
                },
                {
                    id: 'short_02',
                    type: 'quiz',
                    title: 'Busca Rápida',
                    question: 'Qual atalho abre a busca no Windows Explorer?',
                    options: ['Ctrl+F', 'F3', 'Ctrl+E', 'Todas as anteriores'],
                    correct: 3,
                    explanation: 'No Windows Explorer, Ctrl+F, F3 e Ctrl+E todas abrem a função de busca. Use o que for mais conveniente!',
                    points: 15,
                    difficulty: 'medium'
                },
                {
                    id: 'short_03',
                    type: 'truefalse',
                    title: 'Renomear Arquivos',
                    question: 'A tecla F2 serve para renomear arquivos selecionados.',
                    correct: true,
                    explanation: 'Correto! F2 é o atalho para renomear arquivos e pastas no Windows. Também funciona em muitos outros programas.',
                    points: 10,
                    difficulty: 'easy'
                },
                {
                    id: 'short_04',
                    type: 'quiz',
                    title: 'Desfazer Ação',
                    question: 'Qual atalho desfaz a última ação (ex: mover um arquivo)?',
                    options: ['Ctrl+Z', 'Ctrl+U', 'Alt+Backspace', 'Ctrl+R'],
                    correct: 0,
                    explanation: 'Ctrl+Z é o atalho universal para desfazer a última ação. Funciona na maioria dos programas do Windows.',
                    points: 15,
                    difficulty: 'medium'
                }
            ]
        },
        challenges: {
            title: 'Desafios Finais',
            description: 'Aplique seus conhecimentos em situações reais',
            icon: 'fas fa-trophy',
            color: 'purple',
            challenges: [
                {
                    id: 'final_01',
                    type: 'scenario',
                    title: 'Organização de Projeto',
                    question: 'Como organizar melhor os arquivos de um projeto grande?',
                    scenario: 'Você está trabalhando em um projeto que envolve: documentos de pesquisa, imagens, planilhas de dados, apresentações e arquivos de código.',
                    options: [
                        'Jogar tudo em uma pasta só',
                        'Separar por tipo de arquivo em subpastas',
                        'Criar pastas por fase do projeto',
                        'Organizar por data de criação'
                    ],
                    correct: 2,
                    explanation: 'Para projetos grandes, organize por fase (Pesquisa, Desenvolvimento, Finalização) e dentro de cada fase, crie subpastas por tipo. Isso mantém tudo relacionado junto.',
                    points: 35,
                    difficulty: 'hard'
                },
                {
                    id: 'final_02',
                    type: 'dragdrop',
                    title: 'Recuperação de Arquivos',
                    question: 'Você excluiu arquivos importantes. Em que ordem tentar recuperá-los?',
                    items: [
                        { id: 'lixeira', name: 'Verificar Lixeira', type: 'passo1' },
                        { id: 'backup', name: 'Verificar Backups', type: 'passo2' },
                        { id: 'software', name: 'Usar software de recuperação', type: 'passo3' },
                        { id: 'profissional', name: 'Chamar profissional', type: 'passo4' }
                    ],
                    categories: [
                        { id: 'ordem', name: 'Ordem de Tentativa', accepts: ['passo1', 'passo2', 'passo3', 'passo4'] }
                    ],
                    explanation: 'Sempre verifique a Lixeira primeiro, depois backups, depois software de recuperação, e só então considere ajuda profissional (mais cara).',
                    points: 30,
                    difficulty: 'hard'
                },
                {
                    id: 'final_03',
                    type: 'scenario',
                    title: 'Backup Estratégico',
                    question: 'Qual estratégia de backup é mais eficiente?',
                    scenario: 'Você tem 500GB de arquivos importantes e quer garantir que nunca perca tudo.',
                    options: [
                        'Copiar tudo para um pen drive uma vez por mês',
                        'Usar apenas o OneDrive/Google Drive',
                        '3-2-1: 3 cópias, 2 tipos de mídia, 1 offsite',
                        'Enviar tudo por email'
                    ],
                    correct: 2,
                    explanation: 'A regra 3-2-1 é o padrão: 3 cópias dos dados, em 2 tipos de mídia diferentes, com 1 cópia offsite (nuvem ou local físico distante).',
                    points: 40,
                    difficulty: 'hard'
                }
            ]
        }
    },

    // Current challenge tracking
    currentChallenge: null,
    challengeStartTime: null,
    timerInterval: null
};
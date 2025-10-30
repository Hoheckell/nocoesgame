# Design Visual do Jogo Educativo

## Identidade Visual

### Conceito de Design
**"Tech Explorer Academy"** - Um design que combina a seriedade do aprendizado técnico com a diversão gamificada, criando uma experiência educacional moderna e envolvente.

### Paleta de Cores
- **Cor Primária**: Deep Teal (#1e3a8a) - Representa confiança e conhecimento técnico
- **Cor Secundária**: Warm Orange (#f59e0b) - Energia e conquista
- **Cor de Apoio**: Soft Gray (#6b7280) - Neutralidade e profissionalismo
- **Cor de Fundo**: Off-White (#fefefe) - Clareza e foco
- **Cor de Sucesso**: Emerald (#10b981) - Progresso e acertos
- **Cor de Aviso**: Amber (#f59e0b) - Atenção e desafios

### Tipografia
- **Fonte Principal**: Inter (sans-serif) - Moderna, legível e técnica
- **Fonte Secundária**: JetBrains Mono (monospace) - Para código e exemplos técnicos
- **Hierarquia Visual**: 
  - Títulos: Bold 32px
  - Subtítulos: Semibold 24px
  - Corpo: Regular 16px
  - Detalhes: Medium 14px

## Elementos Visuais

### Ícones e Ilustrações
- **Estilo**: Ícones minimalistas em estilo outline
- **Temática**: Elementos de computador, pastas, arquivos, conquistas
- **Consistência**: Espessura de linha uniforme (2px)
- **Cores**: Uso estratégico da paleta principal

### Animações e Transições
- **Tipo**: Transições suaves com easing curve
- **Duração**: 300-500ms para interações
- **Efeitos**: Hover scale, fade-in/out, progress bars animadas
- **Biblioteca**: Anime.js para animações fluidas

### Layout e Espaçamento
- **Grid**: Sistema de 12 colunas com gutters de 24px
- **Espaçamento**: Múltiplos de 8px (8, 16, 24, 32, 48px)
- **Bordas**: Border-radius de 12px para cards, 8px para botões
- **Sombras**: Sombra suave para dar profundidade (0 4px 12px rgba(0,0,0,0.1))

## Componentes de Interface

### Cards de Desafio
- **Design**: Fundo branco com borda sutil
- **Hover**: Elevação e sombra aumentada
- **Estados**: Visual diferenciado para concluído, em progresso e bloqueado

### Barra de Progresso
- **Estilo**: Progress bar horizontal com gradiente
- **Animação**: Fill suave ao completar desafios
- **Cores**: Verde para concluído, laranja para em progresso

### Badges e Conquistas
- **Formato**: Hexagonal ou circular
- **Cores**: Dourado para raras, prata para comuns
- **Animação**: Brilho sutil quando conquistadas

### Botões de Ação
- **Primário**: Fundo teal com texto branco
- **Secundário**: Borda teal com texto teal
- **Hover**: Scale 1.05 e sombra aumentada
- **Active**: Scale 0.98 para feedback tátil

### Leaderboard
- **Layout**: Lista vertical com destaque para top 3
- **Cores**: Medalhas dourada, prata, bronze para os primeiros
- **Informações**: Nome, pontuação, badges recentes

## Telas do Jogo

### Tela Inicial (Dashboard)
- **Hero Section**: Banner com progresso geral e próximo desafio
- **Cards de Missões**: Grid responsivo com todos os desafios disponíveis
- **Sidebar**: Perfil do jogador, estatísticas e badges

### Tela de Desafio
- **Layout Central**: Área principal com o desafio
- **Header**: Progresso da missão e tempo
- **Footer**: Botões de ação e ajuda

### Tela de Resultados
- **Celebration**: Animação para acertos
- **Feedback**: Explicação detalhada da resposta
- **Próximos Passos**: Sugestão de próximo desafio

### Tela de Leaderboard
- **Tabs**: Individual, Turma, Duplas
- **Filtros**: Semanal, Mensal, Geral
- **Modo Anônimo**: Opção de ocultar nomes

## Responsividade
- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado com menu hambúrguer
- **Mobile**: Design empilhado, foco no conteúdo principal

## Acessibilidade
- **Contraste**: Mínimo 4.5:1 para todos os textos
- **Tamanhos**: Botões mínimos 44px para touch
- **Navegação**: Suporte completo a teclado
- **Leitores de Tela**: Labels adequados para todos os elementos
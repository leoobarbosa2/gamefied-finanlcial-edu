# Gamified UI — Finlearn Mobile
**Date:** 2026-03-08
**Status:** Ready for planning

---

## What We're Building

Uma reformulação visual do app mobile no estilo Duolingo: design system gamificado aplicado primeiro nos componentes base, depois no Dashboard. O objetivo é que o app **sinta como um jogo**, não um app de fintech comum.

---

## Why This Approach

Começar pelo design system garante consistência e evita retrabalho. Ao aplicar no Dashboard imediatamente, o usuário (desenvolvedor) vê o resultado visual real e pode validar a direção antes de expandir para outras telas.

---

## Key Decisions

### Inspiração: Duolingo
- Feedback visual exagerado e positivo (confetes, partículas, bounce)
- Streaks com chama animada pulsando
- XP bar que "enche" com bounce ao ganhar pontos
- Tab bar com ícones animados ao trocar de aba e badges pulsando
- Cards com elevação forte, sombras coloridas, bordas rounded-3xl
- Tipografia display: peso 900, lettering apertado (-1 a -2px)
- Fundo com gradiente sutil (não branco puro)
- Cores: manter teal (#14b8a6) como primária + adicionar amarelo (#f59e0b) e verde (#22c55e) como cores de jogo

### Fase 1 — Design System (componentes base)
Refatorar / criar:
- **Tipografia:** fonte display bold, hierarquia clara (H1/H2/body/caption)
- **Button:** versão "game" com sombra colorida inferior (estilo 3D pressionável), estados bounce
- **Card:** elevação com sombra, borda esquerda colorida por categoria
- **XPBar:** animação bounce ao ganhar XP, label "NÍVEL X" em badge
- **StreakBadge:** chama pulsando com Reanimated, número grande
- **CoinsBadge:** moeda animada com leve wiggle
- **ConfettiOverlay:** componente reutilizável de partículas (react-native-confetti-cannon ou implementação manual leve)
- **LevelBadge:** estilo shield/escudo com gradiente

### Fase 2 — Dashboard Gamificado
Redesenho completo do `dashboard.tsx`:
- **Header:** fundo gradiente teal escuro, avatar com borda dourada, streak badge proeminente
- **Hero card:** "Missão do dia" com progress ring e call-to-action bold
- **Stats row:** XP / Coins / Streak em cards pequenos com ícones grandes e animados
- **XP Bar:** com nível atual e próximo, animação ao entrar na tela
- **Weekly Activity:** dias como hexágonos ou círculos grandes com check animado
- **Paths section:** cards com gradiente de cor por trilha, progress ring colorida
- **Continue card:** botão pulsando com animação de "chame para ação"

### Animações e Transições
- `react-native-reanimated` para tudo (já instalado)
- Entrada de tela: fade + slide-up leve (não abrupto)
- Tab bar: ícone selecionado faz bounce + scale 1.2
- Confetti ao completar lição (já existe parcialmente, reforçar)
- XP gain: número "+50 XP" flutua para cima e desaparece
- Streak: chama pisca/pulsa continuamente

### O que NÃO mudar
- Cores base (teal primário, dark surface #1c1c22)
- Estrutura de navegação (tabs, rotas)
- Lógica de negócio / API
- Mascote (será adicionado depois)

---

## Resolved Questions

- **Referência:** Duolingo
- **Escopo:** Pacote completo (feedback, tab bar, streak/XP, cards, tipografia)
- **Entrega:** Design system primeiro, depois Dashboard para validar na prática

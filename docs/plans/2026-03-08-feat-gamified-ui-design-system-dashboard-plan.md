---
title: "feat: Gamified UI — Design System + Dashboard (Duolingo Style)"
type: feat
status: active
date: 2026-03-08
brainstorm: docs/brainstorms/2026-03-08-gamified-ui-brainstorm.md
---

# feat: Gamified UI — Design System + Dashboard (Duolingo Style)

## Overview

Transformar o visual do app Finlearn para parecer um jogo, inspirado no Duolingo. A entrega está dividida em duas fases sequenciais: **Fase 1** refatora o design system (componentes base), **Fase 2** redesenha o Dashboard usando os novos componentes. As outras telas (paths, profile, lesson) serão atualizadas em iteração futura.

---

## Gaps Encontrados na Pesquisa

O codebase atual tem os seguintes pontos críticos:

| Componente | Estado atual | Gap |
|---|---|---|
| `Button` | `TouchableOpacity` + `activeOpacity` | Sem animação de press, sem haptics, sem sombra 3D |
| `StreakBadge` | View estática | Sem pulsação, sem animação de chama |
| `CoinsBadge` | Pill estático | Sem wiggle, sem animação |
| `LevelBadge` | Círculo estático | Sem gradiente, sem brilho |
| `XPBar` | `withTiming` básico | Sem glow, sem bounce, sem label de nível |
| `Card` | View com borda | Sem sombra, sem elevação, sem gradiente |
| `Tab bar` | Default RN Navigation | Sem bounce no ícone, sem animação |
| `ResultFeedback` | Slide-up/down | Sem shake no erro, sem bounce no acerto |
| `LessonComplete` | Ring + counters | Sem confetti, sem explosão visual |
| `useColors()` | Existe, não é usado | Todos os componentes usam hex hardcoded |
| Haptics | Inexistente | `expo-haptics` não importado em nada |
| Gradientes | Inexistente | `expo-linear-gradient` não instalado |
| Confetti | Inexistente | Nenhuma lib instalada |

---

## Fase 1 — Design System

### Step 1.1 — Instalar dependências

```bash
cd mobile
npx expo install expo-haptics expo-linear-gradient
npm install react-native-confetti-cannon --legacy-peer-deps
```

**Arquivos a modificar:** `mobile/package.json`

### Step 1.2 — Padronizar theme com `useColors()`

O hook `mobile/src/hooks/useColors.ts` já existe mas **não é usado por nenhum componente**. Todos os componentes usam `useColorScheme()` com hex hardcoded ou objetos locais. A meta é:

- Manter o hook como está
- Passar a usá-lo nos novos componentes (não refatorar os antigos — YAGNI)
- Adicionar novos tokens de cor gamificados em `mobile/src/constants/colors.ts`

**Novos tokens a adicionar em `colors.ts`:**
```ts
// Gamification tokens
game: {
  xpFill: '#14b8a6',        // teal — barra XP
  xpGlow: '#5eead4',        // teal claro — glow da barra
  streakFire: '#f97316',    // laranja — chama
  streakFireGlow: '#fed7aa', // pêssego — halo da chama
  coinGold: '#f59e0b',      // âmbar — moeda
  coinGoldLight: '#fef3c7', // âmbar claro — fundo moeda
  levelShield: '#6366f1',   // índigo — escudo de nível
  correct: '#22c55e',       // verde — acerto
  incorrect: '#ef4444',     // vermelho — erro
  shadowDark: 'rgba(0,0,0,0.25)',
  shadowTeal: 'rgba(20,184,166,0.35)',
}
```

**Arquivo:** `mobile/src/constants/colors.ts`

### Step 1.3 — Button gamificado (3D pressionável)

**Arquivo:** `mobile/src/components/ui/Button.tsx`

Mudar de `TouchableOpacity` para `Pressable` + `react-native-reanimated` para dar efeito "tecla 3D" estilo Duolingo.

Comportamento:
- Em repouso: sombra colorida embaixo (4px abaixo, sem blur, cor baseada na variante) — simula profundidade
- Ao pressionar: `scale: 1.0 → 0.96` via `withSpring` + sombra desaparece + `Haptics.impactAsync(light)`
- Ao soltar: spring de volta a 1.0
- Variante `primary`: sombra `#0d9488` (teal escuro), fundo `#14b8a6`
- Variante `secondary`: sombra `#d4d4d8` (cinza), fundo branco/transparente

```tsx
// Pseudo-código — mobile/src/components/ui/Button.tsx
import * as Haptics from 'expo-haptics'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Pressable } from 'react-native'

const scale = useSharedValue(1)
const shadowOffset = useSharedValue(4)

const animStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
  // sombra inferior via marginBottom negativo + paddingBottom trick ou View wrapper
}))

const onPressIn = () => {
  scale.value = withSpring(0.96, { damping: 20, stiffness: 400 })
  shadowOffset.value = withSpring(0)
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
}

const onPressOut = () => {
  scale.value = withSpring(1, { damping: 15, stiffness: 300 })
  shadowOffset.value = withSpring(4)
}
```

**Nota de implementação:** A sombra "3D" no React Native não é feita com `boxShadow`. O truque é um wrapper `View` com `borderRadius` igual ao botão, com `backgroundColor` na cor da sombra e altura `4px` extra na base, e o botão real por cima com `marginBottom: -4`. O press move o botão 4px para baixo via `translateY`.

### Step 1.4 — XPBar com glow e bounce

**Arquivo:** `mobile/src/components/ui/XPBar.tsx`

Melhorias:
1. **Glow:** adicionar um segundo `Animated.View` com `blur` simulado (opacidade + escala) atrás da barra
2. **Bounce no mount:** `width` começa em 0, vai para o valor real com `withSpring` em vez de `withTiming`
3. **Label de nível:** mostrar "Nível X" antes da barra e "Nível X+1" depois
4. **Altura:** aumentar de `h-2` (8px) para 12px para ser mais visível
5. **Borda arredondada:** já tem, manter
6. **Shimmer:** `withRepeat` em uma overlay branca semi-transparente (tipo Skeleton mas horizontal)

```tsx
// mobile/src/components/ui/XPBar.tsx
// Trocar withTiming por withSpring no fill
width.value = withSpring(pct * 100, { damping: 20, stiffness: 100 })

// Glow overlay
<Animated.View style={[{
  position: 'absolute',
  top: -4, bottom: -4, left: 0, right: 0,
  backgroundColor: '#5eead4',
  borderRadius: 999,
  opacity: 0.3,
}, glowStyle]} />
```

### Step 1.5 — StreakBadge pulsante

**Arquivo:** `mobile/src/components/progress/StreakBadge.tsx`

A chama deve pulsar continuamente quando o streak > 0.

```tsx
// mobile/src/components/progress/StreakBadge.tsx
import { withRepeat, withSequence, withTiming } from 'react-native-reanimated'

// Pulso: escala 1.0 → 1.2 → 1.0, infinito, 800ms por ciclo
const pulse = useSharedValue(1)
useEffect(() => {
  if (streak > 0) {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 400 }),
        withTiming(1.0, { duration: 400 })
      ),
      -1,  // infinito
      false // não reverter (sequência já tem ida e volta)
    )
  }
}, [streak])

// Aplicar em animatedStyle do ícone da chama
// Número do streak: fonte maior, peso 800, cor laranja
// Adicionar halo: View circular com bg laranja 15% opacidade ao redor da chama
```

### Step 1.6 — CoinsBadge com wiggle

**Arquivo:** `mobile/src/components/ui/CoinsBadge.tsx`

Wiggle leve (rotação ±8°) ao montar e quando `coins` muda.

```tsx
// mobile/src/components/ui/CoinsBadge.tsx
const rotate = useSharedValue(0)

const triggerWiggle = () => {
  rotate.value = withSequence(
    withTiming(8,  { duration: 80 }),
    withTiming(-8, { duration: 80 }),
    withTiming(6,  { duration: 60 }),
    withTiming(-6, { duration: 60 }),
    withTiming(0,  { duration: 60 })
  )
}

useEffect(() => { triggerWiggle() }, [coins])

const animStyle = useAnimatedStyle(() => ({
  transform: [{ rotate: `${rotate.value}deg` }]
}))
```

### Step 1.7 — LevelBadge com gradiente e escudo

**Arquivo:** `mobile/src/components/ui/LevelBadge.tsx`

Transformar de círculo simples para um "escudo" com gradiente. Usar `expo-linear-gradient`.

```tsx
// mobile/src/components/ui/LevelBadge.tsx
import { LinearGradient } from 'expo-linear-gradient'

// Shape: View com clip path não é suportado no RN.
// Usar um shield SVG simples via react-native-svg OU manter círculo mas com gradiente
// Recomendação: manter círculo por simplicidade, mas com gradiente + borda dourada

<LinearGradient
  colors={['#818cf8', '#6366f1']}  // índigo claro → escuro
  style={{ width: 36, height: 36, borderRadius: 18,
           alignItems: 'center', justifyContent: 'center',
           borderWidth: 2, borderColor: '#f59e0b' }}  // borda dourada
>
  <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>
    {level}
  </Text>
</LinearGradient>
```

### Step 1.8 — ConfettiOverlay (componente reutilizável)

**Arquivo novo:** `mobile/src/components/ui/ConfettiOverlay.tsx`

Usar `react-native-confetti-cannon`. O componente aceita uma ref para disparar programaticamente.

```tsx
// mobile/src/components/ui/ConfettiOverlay.tsx
import ConfettiCannon from 'react-native-confetti-cannon'
import { useRef, useImperativeHandle, forwardRef } from 'react'

export interface ConfettiRef {
  fire: () => void
}

export const ConfettiOverlay = forwardRef<ConfettiRef>((_, ref) => {
  const cannon = useRef<any>(null)

  useImperativeHandle(ref, () => ({
    fire: () => cannon.current?.start()
  }))

  return (
    <ConfettiCannon
      ref={cannon}
      count={120}
      origin={{ x: -10, y: 0 }}
      autoStart={false}
      fadeOut
      colors={['#14b8a6', '#f59e0b', '#6366f1', '#22c55e', '#f97316', '#fff']}
    />
  )
})
```

### Step 1.9 — Card com elevação e sombra

**Arquivo:** `mobile/src/components/ui/Card.tsx`

Adicionar suporte a variante `elevated` com sombra colorida sutil.

```tsx
// mobile/src/components/ui/Card.tsx
// Manter className padrão + aceitar prop elevation?: boolean

// Light mode: shadow via elevation (Android) + shadowColor/shadowOffset (iOS)
// Dark mode: sombra não funciona bem em dark — usar bordas mais fortes

style={{
  ...(elevated && {
    elevation: 6,             // Android
    shadowColor: '#000',      // iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  })
}}
```

---

## Fase 2 — Dashboard Gamificado

**Arquivo principal:** `mobile/app/(app)/dashboard.tsx`

O Dashboard será completamente redesenhado. A estrutura de dados não muda — apenas a apresentação.

### Step 2.1 — Header com gradiente

Substituir o header atual (View simples com `backgroundColor: c.surface`) por um `LinearGradient`.

```tsx
// Header component inline no dashboard
<LinearGradient
  colors={['#0d9488', '#14b8a6']}  // teal escuro → teal médio
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ paddingHorizontal: 16, paddingVertical: 14,
           flexDirection: 'row', alignItems: 'center' }}
>
  <Text style={{ flex: 1, fontSize: 22, fontWeight: '900',
                 color: '#fff', letterSpacing: -0.5 }}>
    Finlearn
  </Text>
  {/* CoinsBadge animado (branco/âmbar no teal) */}
  {/* LevelBadge com gradiente índigo */}
  {/* Avatar círculo com borda âmbar */}
</LinearGradient>
```

### Step 2.2 — Hero card "Missão do Dia"

Substituir o "stats card" genérico por um card de missão diária mais gamificado.

```tsx
// "Missão do Dia" card
<LinearGradient
  colors={isDark ? ['#1e2a3a', '#0f2027'] : ['#f0fdfa', '#ccfbf1']}
  style={{ borderRadius: 20, padding: 20, marginBottom: 20,
           borderWidth: 1, borderColor: isDark ? '#164e63' : '#99f6e4' }}
>
  {/* Linha 1: "Olá, {firstName}!" grande + streak badge */}
  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <Text style={{ fontSize: 24, fontWeight: '900', letterSpacing: -0.5, color: c.textPrimary }}>
      Olá, {firstName}! 👋
    </Text>
    <StreakBadge streak={data?.streak?.currentStreak ?? 0} />
  </View>

  {/* Linha 2: XP bar com labels de nível */}
  <Text style={{ fontSize: 12, color: c.textMuted, marginTop: 12, marginBottom: 6 }}>
    Progresso — Nível {user?.level}
  </Text>
  <XPBar xp={user?.xp ?? 0} level={user?.level ?? 1} />

  {/* Linha 3: Sessões como corações/chamas (free users) ou badge PRO */}
  {!isPro && (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 }}>
      <Text style={{ fontSize: 12, color: c.textMuted }}>Sessões hoje:</Text>
      {Array.from({ length: sessionsLimit }).map((_, i) => (
        <Text key={i} style={{ fontSize: 18 }}>
          {i < sessionsUsed ? '🔥' : '⚡'}
        </Text>
      ))}
    </View>
  )}
  {isPro && (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 }}>
      <ProBadge />
      <Text style={{ fontSize: 12, color: '#14b8a6' }}>Sessões ilimitadas</Text>
    </View>
  )}
</LinearGradient>
```

### Step 2.3 — Stats row (3 mini-cards animados)

Novo bloco com 3 cards lado a lado: XP Total, Moedas, Streak.

```tsx
// Stats row — entra com stagger animation
// Cada card:
//   - ícone grande (emoji ou lucide)
//   - número em fonte display
//   - label pequeno

<View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
  <StatCard icon="⚡" value={user?.xp ?? 0} label="XP Total" color="#14b8a6" delay={0} />
  <StatCard icon="🪙" value={data?.gamification?.coins ?? 0} label="Moedas" color="#f59e0b" delay={100} />
  <StatCard icon="🔥" value={data?.streak?.currentStreak ?? 0} label="Dias" color="#f97316" delay={200} />
</View>
```

`StatCard` é um componente local inline (não merece arquivo próprio pois é usado só aqui):

```tsx
// Componente interno ao dashboard.tsx
function StatCard({ icon, value, label, color, delay }) {
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(20)

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }))
    translateY.value = withDelay(delay, withSpring(0, { damping: 20 }))
  }, [])

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }]
  }))

  return (
    <Animated.View style={[{ flex: 1, ... }, animStyle]}>
      <Text style={{ fontSize: 22 }}>{icon}</Text>
      <Text style={{ fontSize: 24, fontWeight: '900', color }}>{value}</Text>
      <Text style={{ fontSize: 11, color: c.textMuted }}>{label}</Text>
    </Animated.View>
  )
}
```

### Step 2.4 — Weekly Activity redesenhada

**Arquivo:** `mobile/src/components/dashboard/WeeklyActivity.tsx`

Mudar de grid simples para círculos maiores com checkmark animado. Cada dia que foi completado: círculo teal com `✓` que aparece com `withSpring(scale: 0 → 1)`. Hoje: círculo com borda pulsante.

```tsx
// WeeklyActivity.tsx
// Para cada dia da semana:
// - Círculo 44x44, borderRadius 22
// - Completado: bg teal, check animado com withSpring
// - Hoje não completado: borda teal pulsante (withRepeat no borderWidth ou opacity da borda)
// - Passado vazio: bg cinza sem borda
// - Label: "S", "T", "Q", etc abaixo do círculo
```

### Step 2.5 — Continue card com CTA pulsante

**Arquivo:** `mobile/src/components/dashboard/ContinueCard.tsx`

O botão "Continuar" deve pulsar para chamar atenção (scale 1.0 → 1.04 → 1.0, withRepeat).

```tsx
// ContinueCard.tsx
// Fundo: LinearGradient teal
// Botão "Continuar lição": pulsating com withRepeat
const pulseScale = useSharedValue(1)
useEffect(() => {
  pulseScale.value = withRepeat(
    withSequence(
      withTiming(1.04, { duration: 600 }),
      withTiming(1.00, { duration: 600 })
    ),
    -1
  )
}, [])
```

### Step 2.6 — PathCard com gradiente

**Arquivo:** `mobile/src/components/dashboard/PathCard.tsx`

Mudar de card plano para card com gradiente sutil baseado na cor do path.

```tsx
// PathCard.tsx
// Usar LinearGradient com as cores do pathColors (já definidas em colors.ts)
// Left accent: borda esquerda 4px na cor do path (já parecido com Duolingo)
// Ícone: View com gradiente circular
// Progress: CompletionRing já existe — só aumentar o tamanho (52 → 64)
```

### Step 2.7 — Tab bar com ícones animados

**Arquivo:** `mobile/app/(app)/_layout.tsx`

Usar `tabBarButton` para customizar cada tab item. Quando selecionado, o ícone faz `scale: 1 → 1.3 → 1` via `withSpring` + haptic.

```tsx
// (app)/_layout.tsx
// Criar componente AnimatedTabButton:
function AnimatedTabButton({ children, onPress, accessibilityState }) {
  const scale = useSharedValue(1)
  const isSelected = accessibilityState?.selected

  useEffect(() => {
    if (isSelected) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 10 }),
        withSpring(1.0, { damping: 15 })
      )
      Haptics.selectionAsync()
    }
  }, [isSelected])

  return (
    <Pressable onPress={onPress} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))}>
        {children}
      </Animated.View>
    </Pressable>
  )
}
// Aplicar em cada Tabs.Screen via tabBarButton: (props) => <AnimatedTabButton {...props} />
```

### Step 2.8 — Animação de entrada da tela

O dashboard inteiro deve entrar com fade + slide-up leve ao montar.

```tsx
// dashboard.tsx — wrapping no SafeAreaView
const screenOpacity = useSharedValue(0)
const screenTranslateY = useSharedValue(16)

useEffect(() => {
  screenOpacity.value = withTiming(1, { duration: 350 })
  screenTranslateY.value = withSpring(0, { damping: 25 })
}, [])

// Aplicar no ScrollView wrapper via Animated.ScrollView (reanimated)
```

---

## Acceptance Criteria

### Fase 1 — Design System

- [ ] `expo-haptics`, `expo-linear-gradient`, `react-native-confetti-cannon` instalados e importando sem erro
- [ ] `colors.ts` tem tokens de jogo (`game.*`)
- [ ] `Button` tem efeito 3D ao pressionar (translateY + sombra), com haptic `Light` no `onPressIn`
- [ ] `XPBar` entra com `withSpring` ao montar, tem glow sutil na cor teal
- [ ] `StreakBadge` pulsa continuamente com `withRepeat` quando `streak > 0`
- [ ] `CoinsBadge` faz wiggle quando `coins` muda
- [ ] `LevelBadge` tem gradiente índigo com borda âmbar
- [ ] `ConfettiOverlay` exporta ref com método `.fire()`
- [ ] `Card` aceita prop `elevated` com sombra iOS/Android

### Fase 2 — Dashboard

- [ ] Header com `LinearGradient` teal
- [ ] Hero card exibe saudação bold, `XPBar` gamificado, sessões como emoji de fogo/raio
- [ ] Stats row com 3 mini-cards animados (XP, Moedas, Streak) entrando em stagger
- [ ] `WeeklyActivity` usa círculos grandes com checkmark animado
- [ ] `ContinueCard` tem botão pulsante (quando existe lição para continuar)
- [ ] `PathCard` tem gradiente lateral baseado na cor do path
- [ ] Tab bar tem `AnimatedTabButton` com bounce no ícone selecionado + haptic
- [ ] Tela inteira entra com fade + slide-up ao montar
- [ ] Dark mode funciona em todos os novos elementos

---

## Arquivos a Criar / Modificar

### Criar
- `mobile/src/components/ui/ConfettiOverlay.tsx`

### Modificar
- `mobile/package.json` — instalar 3 libs
- `mobile/src/constants/colors.ts` — adicionar tokens `game.*`
- `mobile/src/components/ui/Button.tsx` — Pressable + spring + haptic + sombra 3D
- `mobile/src/components/ui/XPBar.tsx` — withSpring + glow
- `mobile/src/components/ui/LevelBadge.tsx` — LinearGradient + borda âmbar
- `mobile/src/components/ui/CoinsBadge.tsx` — wiggle animation
- `mobile/src/components/progress/StreakBadge.tsx` — withRepeat pulse
- `mobile/src/components/ui/Card.tsx` — prop `elevated` com sombra
- `mobile/src/components/dashboard/WeeklyActivity.tsx` — círculos grandes + checkmark animado
- `mobile/src/components/dashboard/ContinueCard.tsx` — LinearGradient + botão pulsante
- `mobile/src/components/dashboard/PathCard.tsx` — LinearGradient lateral
- `mobile/app/(app)/_layout.tsx` — AnimatedTabButton com bounce + haptic
- `mobile/app/(app)/dashboard.tsx` — redesenho completo (header, hero, stats row, entrada animada)

---

## Dependencies & Risks

| Risco | Impacto | Mitigação |
|---|---|---|
| `react-native-confetti-cannon` pode ter conflito de peer deps | Médio | Usar `--legacy-peer-deps`; avaliar implementação manual se falhar |
| Sombra 3D no Button é complexa no RN | Médio | Usar `translateY` + wrapper View estático ao invés de `boxShadow` |
| `LinearGradient` em dark mode pode ficar feio | Baixo | Usar gradientes bem sutis no dark (quase monocromáticos) |
| Performance de animações com muitos `withRepeat` na mesma tela | Médio | Pausar animações quando a tela não está focada via `useFocusEffect` |
| `tabBarButton` pode quebrar acessibilidade | Baixo | Manter `accessibilityRole`, `accessibilityState`, `onPress` no Pressable |

---

## Ordem de Implementação Recomendada

1. Instalar libs
2. Atualizar `colors.ts` com tokens de jogo
3. Implementar `Button` gamificado (mais impacto imediato, usado em todo lugar)
4. Implementar `XPBar` melhorado
5. Implementar `StreakBadge` pulsante
6. Implementar `CoinsBadge` wiggle
7. Implementar `LevelBadge` com gradiente
8. Criar `ConfettiOverlay`
9. Atualizar `Card` com elevação
10. Atualizar `WeeklyActivity` (círculos)
11. Atualizar `ContinueCard` (gradiente + pulsante)
12. Atualizar `PathCard` (gradiente)
13. Atualizar `_layout.tsx` (AnimatedTabButton)
14. Redesenhar `dashboard.tsx` completo

---

## References

- Brainstorm: `docs/brainstorms/2026-03-08-gamified-ui-brainstorm.md`
- XPBar atual: `mobile/src/components/ui/XPBar.tsx`
- StreakBadge atual: `mobile/src/components/progress/StreakBadge.tsx`
- Colors: `mobile/src/constants/colors.ts`
- Tab layout: `mobile/app/(app)/_layout.tsx`
- Dashboard: `mobile/app/(app)/dashboard.tsx`
- LessonComplete (ref de animação): `mobile/src/components/lesson/LessonComplete.tsx`
- react-native-confetti-cannon: https://github.com/VincentCATILLON/react-native-confetti-cannon
- expo-haptics docs: https://docs.expo.dev/versions/latest/sdk/haptics/
- expo-linear-gradient docs: https://docs.expo.dev/versions/latest/sdk/linear-gradient/
- Reanimated withSequence: https://docs.swmansion.com/react-native-reanimated/docs/animations/withSequence/

import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TrendingUp, BookOpen, Flame, Award } from 'lucide-react-native'
import { Button } from '../src/components/ui/Button'

const features = [
  { icon: BookOpen, title: 'Micro-lições', desc: 'Aprenda em 5 minutos por dia com lições rápidas e eficazes.' },
  { icon: Flame, title: 'Sequência diária', desc: 'Mantenha sua sequência e construa o hábito de aprender.' },
  { icon: TrendingUp, title: 'Progresso visual', desc: 'Acompanhe sua evolução com gráficos e conquistas.' },
  { icon: Award, title: 'Gamificação', desc: 'Ganhe XP, moedas e suba de nível enquanto aprende.' },
]

export default function Landing() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#1c1c22]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="items-center px-6 pt-12 pb-8">
          <View className="w-20 h-20 rounded-3xl bg-accent-500 items-center justify-center mb-4">
            <TrendingUp size={40} color="#fff" />
          </View>
          <Text className="text-3xl font-bold text-[#09090b] dark:text-[#f4f4f5] text-center mb-2">
            Finlearn
          </Text>
          <Text className="text-base text-[#71717a] dark:text-[#8b8b98] text-center leading-relaxed">
            Educação financeira gamificada.{'\n'}Aprenda, evolua e conquiste sua independência.
          </Text>
        </View>

        {/* Features */}
        <View className="px-6 gap-3 mb-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <View
              key={title}
              className="flex-row items-start gap-4 bg-[#f9fafb] dark:bg-[#24242c] rounded-2xl p-4 border border-[#e4e4e7] dark:border-[#2a2a32]"
            >
              <View className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-900 items-center justify-center">
                <Icon size={20} color="#0d9488" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-[#09090b] dark:text-[#f4f4f5] mb-0.5">{title}</Text>
                <Text className="text-sm text-[#71717a] dark:text-[#8b8b98] leading-relaxed">{desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <View className="px-6 gap-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.push('/(auth)/register')}
          >
            Começar gratuitamente
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onPress={() => router.push('/(auth)/login')}
          >
            Já tenho uma conta
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

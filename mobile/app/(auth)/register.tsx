import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { Button } from '../../src/components/ui/Button'
import { authApi } from '../../src/api/auth'
import { useAuthStore } from '../../src/store/authStore'

export default function Register() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setError('')
    if (!name || !email || !password) {
      setError('Preencha todos os campos.')
      return
    }
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.')
      return
    }
    setLoading(true)
    try {
      const { data, refreshToken } = await authApi.register({
        displayName: name,
        email,
        password,
      })
      await setAuth(data.user, data.accessToken, refreshToken)
      router.replace('/(app)/dashboard')
    } catch (e: any) {
      const msg = e?.response?.data?.message
      setError(Array.isArray(msg) ? msg[0] : (msg ?? 'Erro ao cadastrar. Tente novamente.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-[#1c1c22]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-4">
            <TouchableOpacity onPress={() => router.back()} className="mb-8 self-start p-2 -ml-2">
              <ArrowLeft size={24} color="#71717a" />
            </TouchableOpacity>

            <Text className="text-2xl font-bold text-[#09090b] dark:text-[#f4f4f5] mb-1">
              Criar conta
            </Text>
            <Text className="text-sm text-[#71717a] dark:text-[#8b8b98] mb-8">
              Comece sua jornada financeira hoje
            </Text>

            <View className="gap-4">
              <View>
                <Text className="text-sm font-medium text-[#3f3f46] dark:text-[#d4d4d8] mb-1.5">
                  Nome
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Seu nome"
                  autoCapitalize="words"
                  autoComplete="name"
                  className="border border-[#e4e4e7] dark:border-[#2a2a32] rounded-xl px-4 py-3 text-base text-[#09090b] dark:text-[#f4f4f5] bg-white dark:bg-[#24242c]"
                  placeholderTextColor="#71717a"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-[#3f3f46] dark:text-[#d4d4d8] mb-1.5">
                  E-mail
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className="border border-[#e4e4e7] dark:border-[#2a2a32] rounded-xl px-4 py-3 text-base text-[#09090b] dark:text-[#f4f4f5] bg-white dark:bg-[#24242c]"
                  placeholderTextColor="#71717a"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-[#3f3f46] dark:text-[#d4d4d8] mb-1.5">
                  Senha
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  secureTextEntry
                  autoComplete="new-password"
                  className="border border-[#e4e4e7] dark:border-[#2a2a32] rounded-xl px-4 py-3 text-base text-[#09090b] dark:text-[#f4f4f5] bg-white dark:bg-[#24242c]"
                  placeholderTextColor="#71717a"
                />
                <Text className="text-xs text-[#71717a] dark:text-[#8b8b98] mt-1">
                  Mínimo de 8 caracteres
                </Text>
              </View>

              {error ? (
                <View className="bg-red-50 dark:bg-red-950 rounded-xl px-4 py-3">
                  <Text className="text-sm text-red-600 dark:text-red-400">{error}</Text>
                </View>
              ) : null}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onPress={handleRegister}
                className="mt-2"
              >
                Criar conta
              </Button>
            </View>

            <View className="flex-row justify-center mt-6">
              <Text className="text-sm text-[#71717a] dark:text-[#8b8b98]">
                Já tem conta?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                <Text className="text-sm font-semibold text-accent-500">Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

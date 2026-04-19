import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store/auth.store'

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => login(data.user, data.accessToken, data.refreshToken),
  })
}

export function useRegister() {
  const login = useAuthStore((s) => s.login)
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => login(data.user, data.accessToken, data.refreshToken),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const updateUser = useAuthStore((s) => s.updateUser)
  return useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (user) => {
      updateUser(user)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
  })
}

export function useUpdatePreferences() {
  return useMutation({
    mutationFn: authApi.updatePreferences,
  })
}

import api from './axios'

export type LoginRequest = { email: string; password: string }
export type LoginResponse = { token: string }
export type RegisterRequest = { fullName: string; email: string; password: string }
export type UserResponse = { id: number; fullName: string; email: string }

export async function login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/api/auth/login', payload)
    return data
}

export async function register(payload: RegisterRequest): Promise<UserResponse> {
    const { data } = await api.post<UserResponse>('/api/auth/register', payload)
    return data
}

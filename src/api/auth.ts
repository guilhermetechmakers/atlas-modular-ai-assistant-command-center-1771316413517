import { api } from '@/lib/api'
import type { LoginSignup } from '@/types/login-signup'

/** API base path for login/signup records. Backend may map to table "login_/_signup". */
const BASE = '/auth/login-signup'

export const authApi = {
  list: () => api.get<LoginSignup[]>(BASE),
  get: (id: string) => api.get<LoginSignup>(`${BASE}/${id}`),
  create: (data: Pick<LoginSignup, 'title' | 'description' | 'status'>) =>
    api.post<LoginSignup>(BASE, data),
  update: (
    id: string,
    data: Partial<Pick<LoginSignup, 'title' | 'description' | 'status'>>
  ) => api.patch<LoginSignup>(`${BASE}/${id}`, data),
  delete: (id: string) => api.delete<void>(`${BASE}/${id}`),
}

import type { AuthUser, UserRole } from './auth-store'
import i18n from '../i18n/config'

// Demo accounts info (for display purposes only, auth happens via database)
export const demoAccounts = [
  {
    role: 'admin' as UserRole,
    username: 'admin',
    description: 'Accès complet au système',
  },
  {
    role: 'manager' as UserRole,
    username: 'manager1',
    description: 'Opérations commerciales',
  },
  {
    role: 'server' as UserRole,
    username: 'server1',
    description: 'Commandes sur place',
  },
  {
    role: 'counter' as UserRole,
    username: 'counter1',
    description: 'Commandes + paiements',
  },
  {
    role: 'kitchen' as UserRole,
    username: 'kitchen1',
    description: 'Préparation des commandes',
  },
]

// Transform database user to AuthUser
export function transformToAuthUser(dbUser: {
  id: number | string
  username: string
  fullName: string
  role: string
  email: string | null
  phone: string | null
}): AuthUser {
  return {
    id: String(dbUser.id),
    username: dbUser.username,
    fullName: dbUser.fullName,
    role: dbUser.role as UserRole,
    email: dbUser.email,
    phone: dbUser.phone,
  }
}

// Get route for role after login
export function getDefaultRouteForRole(role: UserRole): string {
  const roleRoutes: Record<UserRole, string> = {
    admin: '/dashboard',
    manager: '/dashboard',
    server: '/dashboard/pos',
    counter: '/dashboard/pos',
    kitchen: '/dashboard/kitchen',
  }
  return roleRoutes[role] || '/dashboard'
}

// Get role display name
export function getRoleDisplayName(role: string): string {
  return i18n.t(`roles.${role}`, { defaultValue: role })
}

// Get role color for badges
export function getRoleColor(role: string): string {
  const roleColors: Record<string, string> = {
    admin: 'bg-red-500',
    manager: 'bg-purple-500',
    server: 'bg-blue-500',
    counter: 'bg-green-500',
    kitchen: 'bg-orange-500',
  }
  return roleColors[role] || 'bg-gray-500'
}

import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'

import { AuthProvider } from '../lib/auth-context'
import { Provider } from '../integrations/tanstack-query/root-provider'
import '../i18n/config'

import type { QueryClient } from '@tanstack/react-query'

import type { TRPCRouter } from '@/integrations/trpc/router'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'

interface MyRouterContext {
  queryClient: QueryClient

  trpc: TRPCOptionsProxy<TRPCRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover',
      },
      {
        title: 'TanStack POS - Gestion de Restaurant',
      },
      {
        name: 'description',
        content: 'Application mobile de point de vente pour restaurants',
      },
      {
        name: 'theme-color',
        content: '#06b6d4',
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'TanStack POS',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),

  component: RootComponent,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()
  
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-slate-900">
        <Provider queryClient={queryClient}>
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        </Provider>
        <Scripts />
      </body>
    </html>
  )
}

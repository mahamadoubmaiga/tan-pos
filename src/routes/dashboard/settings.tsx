import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '../../integrations/trpc/react'
import { RoleGuard } from '../../components/RoleGuard'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useTranslation } from 'react-i18next'
import {
  Store,
  DollarSign,
  Receipt,
  Bell,
  Save,
  RotateCcw,
  Loader2,
} from 'lucide-react'

export const Route = createFileRoute('/dashboard/settings')({
  component: () => (
    <RoleGuard allowedRoles={['admin']}>
      <SettingsPage />
    </RoleGuard>
  ),
})

// Default settings
const defaultSettings = {
  restaurant_name: 'TanStack Restaurant',
  address: '123 Main Street, City, Country',
  phone: '+1 234 567 8900',
  email: 'contact@restaurant.com',
  currency: 'USD',
  tax_rate: '10',
  service_charge: '0',
  receipt_header: 'Thank you for dining with us!',
  receipt_footer: 'Please visit us again!',
  show_logo: 'true',
  order_notifications: 'true',
  kitchen_alerts: 'true',
  sound_enabled: 'true',
}

function SettingsPage() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  // Fetch settings from database
  const { data: settingsData = [], isLoading } = useQuery(trpc.settings.list.queryOptions())

  // Local state for form
  const [restaurantName, setRestaurantName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [taxRate, setTaxRate] = useState(10)
  const [serviceCharge, setServiceCharge] = useState(0)
  const [receiptHeader, setReceiptHeader] = useState('')
  const [receiptFooter, setReceiptFooter] = useState('')
  const [showLogo, setShowLogo] = useState(true)
  const [orderNotifications, setOrderNotifications] = useState(true)
  const [kitchenAlerts, setKitchenAlerts] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Update local state when settings are loaded
  useEffect(() => {
    if (settingsData.length > 0) {
      const getValue = (key: string) => {
        const setting = settingsData.find(s => s.key === key)
        return setting?.value || defaultSettings[key as keyof typeof defaultSettings] || ''
      }
      
      setRestaurantName(getValue('restaurant_name'))
      setAddress(getValue('address'))
      setPhone(getValue('phone'))
      setEmail(getValue('email'))
      setCurrency(getValue('currency'))
      setTaxRate(parseFloat(getValue('tax_rate')) || 10)
      setServiceCharge(parseFloat(getValue('service_charge')) || 0)
      setReceiptHeader(getValue('receipt_header'))
      setReceiptFooter(getValue('receipt_footer'))
      setShowLogo(getValue('show_logo') === 'true')
      setOrderNotifications(getValue('order_notifications') === 'true')
      setKitchenAlerts(getValue('kitchen_alerts') === 'true')
      setSoundEnabled(getValue('sound_enabled') === 'true')
    } else {
      setRestaurantName(defaultSettings.restaurant_name)
      setAddress(defaultSettings.address)
      setPhone(defaultSettings.phone)
      setEmail(defaultSettings.email)
      setCurrency(defaultSettings.currency)
      setTaxRate(parseFloat(defaultSettings.tax_rate))
      setServiceCharge(parseFloat(defaultSettings.service_charge))
      setReceiptHeader(defaultSettings.receipt_header)
      setReceiptFooter(defaultSettings.receipt_footer)
      setShowLogo(defaultSettings.show_logo === 'true')
      setOrderNotifications(defaultSettings.order_notifications === 'true')
      setKitchenAlerts(defaultSettings.kitchen_alerts === 'true')
      setSoundEnabled(defaultSettings.sound_enabled === 'true')
    }
  }, [settingsData])

  // Save mutation
  const updateMutation = useMutation(
    trpc.settings.updateMultiple.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.settings.list.queryKey() })
        alert(t('settings.messages.saveSuccess'))
      },
    })
  )

  const handleSave = () => {
    updateMutation.mutate({
      settings: [
        { key: 'restaurant_name', value: restaurantName },
        { key: 'address', value: address },
        { key: 'phone', value: phone },
        { key: 'email', value: email },
        { key: 'currency', value: currency },
        { key: 'tax_rate', value: String(taxRate) },
        { key: 'service_charge', value: String(serviceCharge) },
        { key: 'receipt_header', value: receiptHeader },
        { key: 'receipt_footer', value: receiptFooter },
        { key: 'show_logo', value: String(showLogo) },
        { key: 'order_notifications', value: String(orderNotifications) },
        { key: 'kitchen_alerts', value: String(kitchenAlerts) },
        { key: 'sound_enabled', value: String(soundEnabled) },
      ]
    })
  }

  const handleReset = () => {
    if (confirm(t('settings.messages.resetConfirm'))) {
      setRestaurantName(defaultSettings.restaurant_name)
      setAddress(defaultSettings.address)
      setPhone(defaultSettings.phone)
      setEmail(defaultSettings.email)
      setCurrency(defaultSettings.currency)
      setTaxRate(parseFloat(defaultSettings.tax_rate))
      setServiceCharge(parseFloat(defaultSettings.service_charge))
      setReceiptHeader(defaultSettings.receipt_header)
      setReceiptFooter(defaultSettings.receipt_footer)
      setShowLogo(defaultSettings.show_logo === 'true')
      setOrderNotifications(defaultSettings.order_notifications === 'true')
      setKitchenAlerts(defaultSettings.kitchen_alerts === 'true')
      setSoundEnabled(defaultSettings.sound_enabled === 'true')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('settings.title')}</h1>
          <p className="text-gray-400">{t('settings.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-slate-700"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('common.reset')}
          </Button>
          <Button
            className="bg-cyan-500 hover:bg-cyan-600"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            {t('settings.saveChanges')}
          </Button>
        </div>
      </div>

      {/* Restaurant Information */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Store className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">{t('settings.sections.restaurant.title')}</h2>
            <p className="text-sm text-gray-400">{t('settings.sections.restaurant.description')}</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-300">{t('settings.sections.restaurant.name')}</Label>
            <Input
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-300">{t('settings.sections.restaurant.email')}</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-300">{t('settings.sections.restaurant.phone')}</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-300">{t('settings.sections.restaurant.address')}</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>
        </div>
      </div>

      {/* Financial Settings */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">{t('settings.sections.financial.title')}</h2>
            <p className="text-sm text-gray-400">{t('settings.sections.financial.description')}</p>
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="text-gray-300">{t('settings.sections.financial.currency')}</Label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              <option value="USD">{t('settings.sections.financial.currencies.usd')}</option>
              <option value="EUR">{t('settings.sections.financial.currencies.eur')}</option>
              <option value="GBP">{t('settings.sections.financial.currencies.gbp')}</option>
              <option value="JPY">{t('settings.sections.financial.currencies.jpy')}</option>
              <option value="IDR">{t('settings.sections.financial.currencies.idr')}</option>
            </select>
          </div>
          <div>
            <Label className="text-gray-300">{t('settings.sections.financial.taxRate')}</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value))}
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-300">{t('settings.sections.financial.serviceCharge')}</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={serviceCharge}
              onChange={(e) => setServiceCharge(parseFloat(e.target.value))}
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>
        </div>
      </div>

      {/* Receipt Settings */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">{t('settings.sections.receipt.title')}</h2>
            <p className="text-sm text-gray-400">{t('settings.sections.receipt.description')}</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <Label className="text-gray-300">{t('settings.sections.receipt.headerMessage')}</Label>
            <Input
              value={receiptHeader}
              onChange={(e) => setReceiptHeader(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>
          <div>
            <Label className="text-gray-300">{t('settings.sections.receipt.footerMessage')}</Label>
            <Input
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">{t('settings.sections.receipt.showLogo')}</p>
              <p className="text-sm text-gray-400">{t('settings.sections.receipt.showLogoDescription')}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowLogo(!showLogo)}
              className={`w-12 h-6 rounded-full transition-colors ${
                showLogo ? 'bg-cyan-500' : 'bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  showLogo ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">{t('settings.sections.notifications.title')}</h2>
            <p className="text-sm text-gray-400">{t('settings.sections.notifications.description')}</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white">{t('settings.sections.notifications.newOrder')}</p>
              <p className="text-sm text-gray-400">{t('settings.sections.notifications.newOrderDescription')}</p>
            </div>
            <button
              type="button"
              onClick={() => setOrderNotifications(!orderNotifications)}
              className={`w-12 h-6 rounded-full transition-colors ${
                orderNotifications ? 'bg-cyan-500' : 'bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  orderNotifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white">{t('settings.sections.notifications.kitchenAlerts')}</p>
              <p className="text-sm text-gray-400">{t('settings.sections.notifications.kitchenAlertsDescription')}</p>
            </div>
            <button
              type="button"
              onClick={() => setKitchenAlerts(!kitchenAlerts)}
              className={`w-12 h-6 rounded-full transition-colors ${
                kitchenAlerts ? 'bg-cyan-500' : 'bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  kitchenAlerts ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white">{t('settings.sections.notifications.soundEffects')}</p>
              <p className="text-sm text-gray-400">{t('settings.sections.notifications.soundEffectsDescription')}</p>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                soundEnabled ? 'bg-cyan-500' : 'bg-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="font-semibold text-white mb-4">{t('settings.sections.system.title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-400">{t('settings.sections.system.version')}</p>
            <p className="text-white font-medium">1.0.0</p>
          </div>
          <div>
            <p className="text-gray-400">{t('settings.sections.system.framework')}</p>
            <p className="text-white font-medium">TanStack Start</p>
          </div>
          <div>
            <p className="text-gray-400">{t('settings.sections.system.database')}</p>
            <p className="text-white font-medium">PostgreSQL 15</p>
          </div>
          <div>
            <p className="text-gray-400">{t('settings.sections.system.lastUpdated')}</p>
            <p className="text-white font-medium">Jan 7, 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}

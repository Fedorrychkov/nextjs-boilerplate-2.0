'use client'

import isNil from 'lodash/isNil'
import { LayoutDashboardIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

// import { useAuth } from '~/providers'
import { cn } from '~/utils/cn'

import { SpinnerScreen } from '../Loaders'
import { ExpandableTabs } from '../ui/expandable-tabs'

export const MainLayout = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  // const { isLoading, isFetched } = useAuth()
  const router = useRouter()

  const isLoading = false
  const isFetched = true

  const tabs = [{ title: 'Главная', icon: LayoutDashboardIcon, url: '/' }, { type: 'separator' }, { title: 'Профиль', icon: UserIcon, url: '/profile' }]

  const handleSelectTab = (index: number | null) => {
    if (isNil(index)) return

    const tab = tabs[index ?? 0]

    if (tab.url) {
      router.push(tab.url)
    }
  }

  return (
    <div className="w-full h-full flex-1 flex flex-col gap-4 safe-area-top">
      <div className={cn('w-full flex-1 flex flex-col p-4 container mx-auto mb-[60px] safe-area-x', className)}>
        {isLoading || !isFetched ? <SpinnerScreen /> : children}
      </div>

      <div className="w-full flex flex-col px-4 container mx-auto items-center fixed bottom-0 left-0 right-0 z-10 safe-area-bottom safe-area-x pb-4">
        <ExpandableTabs onChange={handleSelectTab} tabs={tabs} />
      </div>
    </div>
  )
}

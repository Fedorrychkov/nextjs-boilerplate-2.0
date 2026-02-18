'use client'

import { UserRoundIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'

import { cn } from '~/utils/cn'
import { matchesPathname } from '~/utils/matchPath'

import { SpinnerScreen } from '../Loaders'
import { Typography } from '../ui'
import { NavItem } from './types'

type Props = {
  nav: NavItem[]
}

const SettingsNavigation = (props: Props) => {
  const { nav } = props

  const pathname = usePathname()

  return (
    <ul className="flex justify-between gap-4">
      {nav?.map((item) => (
        <li key={[item.url, item.title].join('-')}>
          <Link
            className={cn(
              'flex flex-row p-2 bg-slate-100 dark:bg-slate-900 justify-start items-center select-none gap-1 rounded-t-md leading-none no-underline outline-none transition-colors hover:text-accent-foreground',
              {
                'text-accent-foreground': matchesPathname(item.url, pathname),
              },
            )}
            href={item.url}
          >
            {item.icon}
            <div>
              <Typography
                variant="Body/XS/Regular"
                className={cn('text-xs', {
                  'font-semibold': matchesPathname(item.url, pathname),
                })}
              >
                {item.title}
              </Typography>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

const nav = [{ title: 'Профиль', url: '/settings/profile', icon: <UserRoundIcon width={16} height={16} /> }]

export const SettingsNavigationLazy = (props: Omit<Props, 'nav'>) => {
  return (
    <Suspense fallback={<SpinnerScreen />}>
      <SettingsNavigation nav={nav} {...props} />
    </Suspense>
  )
}

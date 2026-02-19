'use server'

import { defaultGuard, PageProps } from '@lib/page'
import React, { Suspense } from 'react'

import { SpinnerScreen } from '~/components/Loaders'
import { Typography } from '~/components/ui'

const SubscriptionBadge = React.lazy(() =>
  import('~/components/Entities/Dashboard/Blocks/SubscriptionBadge').then((module) => ({ default: module.SubscriptionBadge })),
)

const Dashboard = async (props: PageProps) => {
  await defaultGuard({ ...props, segments: ['dashboard'] })

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="w-full flex gap-4 items-center">
        <Typography variant="heading-3" className="flex-1">
          Dashboard
        </Typography>

        <Suspense fallback={<SpinnerScreen />}>
          <SubscriptionBadge />
        </Suspense>
      </div>
    </div>
  )
}

export default Dashboard

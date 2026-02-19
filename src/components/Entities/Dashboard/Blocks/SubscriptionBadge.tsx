'use client'

import { Badge, Typography } from '~/components/ui'
import { useAuth } from '~/providers'
import { useCurrentSubscriptionQuery } from '~/query/subscription'
import { useUsageTokensQuery } from '~/query/usage'

const SubscriptionBadge = () => {
  const { authUser } = useAuth()

  const { data: subscription } = useCurrentSubscriptionQuery(!!authUser?.id)
  const { data: usageTokens } = useUsageTokensQuery(!!authUser?.id)

  return (
    <Badge variant="secondary" className="px-4 py-1 rounded-sm">
      <div className="w-full flex flex-col gap-2">
        <Typography variant="Body/S/Regular" className="whitespace-nowrap">
          Used tokens:
        </Typography>
        <Typography variant="Body/S/Regular" className="whitespace-nowrap">
          {usageTokens?.totalTokens}
          {' / '}
          {subscription?.totalTokensLimit}
        </Typography>
      </div>
    </Badge>
  )
}

export { SubscriptionBadge }

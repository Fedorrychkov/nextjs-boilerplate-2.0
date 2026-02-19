'use client'

import { useRouter } from 'next/navigation'

import { Skeleton } from '~/components/Loaders'
import { Button, Typography } from '~/components/ui'
import { useAuth } from '~/providers'
import { useUserProfileQuery } from '~/query/user'

const Profile = () => {
  const router = useRouter()

  const { authUser } = useAuth()
  const { data: user, isLoading: isUserLoading, isFetched: isUserFetched } = useUserProfileQuery(!!authUser?.id)

  return (
    <div className="w-full flex items-center justify-center flex-col gap-4">
      <div className="w-full flex flex-col gap-4">
        {isUserLoading || !isUserFetched ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="w-full" height={300} />
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4 bg-slate-100 rounded-b-lg rounded-tr-lg p-4">
            <div className="w-full flex flex-col gap-2">
              <Typography variant="Body/M/Semibold">Email</Typography>
              <Typography variant="Body/M/Regular">{user?.email}</Typography>
            </div>
            <div className="w-full flex flex-col gap-2">
              <Typography variant="Body/M/Semibold">Email</Typography>
              <Typography variant="Body/M/Regular">{user?.email}</Typography>
            </div>
            <div className="w-full flex flex-col gap-2">
              <Typography variant="Body/M/Semibold">Role</Typography>
              <Typography variant="Body/M/Regular">{user?.role}</Typography>
            </div>
            <Button onClick={() => router.push('/logout')}>Logout</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

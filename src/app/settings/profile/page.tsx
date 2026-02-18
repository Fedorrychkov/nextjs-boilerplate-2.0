'use server'

import { defaultGuard, PageProps } from '@lib/page'

import Profile from './Profile'

const Dashboard = async (props: PageProps) => {
  await defaultGuard({ ...props, segments: ['settings', 'profile'] })

  return <Profile />
}

export default Dashboard

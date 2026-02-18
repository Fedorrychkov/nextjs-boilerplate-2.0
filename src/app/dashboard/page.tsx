'use server'

import { defaultGuard, PageProps } from '@lib/page'

const Dashboard = async (props: PageProps) => {
  await defaultGuard(props)

  return (
    <>
      <h1>Dashboard</h1>
    </>
  )
}

export default Dashboard

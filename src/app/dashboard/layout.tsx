import { MainLayout } from '~/components/Layouts'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout className="!max-w-[100%]">{children}</MainLayout>
}

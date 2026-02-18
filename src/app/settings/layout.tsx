import { MainLayout } from '~/components/Layouts'
import { SettingsNavigationLazy } from '~/components/Navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <div className="flex flex-col flex-1 w-full">
        <div className="px-2">
          <SettingsNavigationLazy />
        </div>
        <div className="flex flex-col flex-1 w-full px-2">{children}</div>
      </div>
    </MainLayout>
  )
}

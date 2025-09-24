import PublicHeader from '@/components/header/PublicHeader'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PublicHeader fixed />
      <main className='min-h-screen'>{children}</main>
    </>
  )
}

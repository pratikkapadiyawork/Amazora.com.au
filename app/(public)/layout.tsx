import { Navbar }       from '@/components/layout/Navbar'
import { NavbarMobile } from '@/components/layout/NavbarMobile'
import { Footer }       from '@/components/layout/Footer'
import { CartDrawer }   from '@/components/layout/CartDrawer'
import { SearchModal }  from '@/components/layout/SearchModal'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main
        id="main-content"
        className="flex-1 pt-[72px] pb-[68px] lg:pb-0"
      >
        {children}
      </main>
      <Footer />
      <NavbarMobile />
      {/* Overlays last in DOM + z-drawer so they sit above page content */}
      <CartDrawer />
      <SearchModal />
    </div>
  )
}

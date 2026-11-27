import { Navbar }       from '@/components/layout/Navbar'
import { NavbarMobile } from '@/components/layout/NavbarMobile'
import { Footer }       from '@/components/layout/Footer'
import { CartDrawer }   from '@/components/layout/CartDrawer'
import { SearchModal }  from '@/components/layout/SearchModal'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { IntroCurtain } from '@/components/motion/IntroCurtain'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SmoothScroll />
      <ScrollProgress />
      <IntroCurtain />
      <Navbar />
      <main
        id="main-content"
        className="flex-1 pt-[108px] pb-[68px] lg:pb-0"
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

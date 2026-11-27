import { Truck, ShieldCheck, RotateCcw, MapPin } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: Truck,       title: 'Free AU Delivery', desc: 'On orders over A$99' },
  { icon: ShieldCheck, title: 'Secure Checkout',  desc: 'Stripe · SSL encrypted' },
  { icon: RotateCcw,   title: '30-Day Returns',   desc: 'Hassle-free returns' },
  { icon: MapPin,      title: 'Australian Owned', desc: 'Locally operated' },
]

export function TrustBar() {
  return (
    <section className="bg-[rgba(15,13,11,0.4)] backdrop-blur-xl border-b border-[rgba(217,169,63,0.14)] py-7">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-4">
            <span className="w-11 h-11 rounded-full border border-[#D9A93F]/30 flex items-center justify-center text-[#F3D27A] shrink-0">
              <Icon size={18} />
            </span>
            <div>
              <p className="text-[#F4ECDC] text-sm font-semibold tracking-wide">{title}</p>
              <p className="text-[#A99F8C] text-xs">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

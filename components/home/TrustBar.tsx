const TRUST_ITEMS = [
  { icon: '🚚', title: 'Free AU Delivery',      desc: 'Orders over A$99'    },
  { icon: '🔒', title: 'Secure Checkout',       desc: 'SSL + Stripe'        },
  { icon: '↩',  title: '30-Day Returns',        desc: 'Hassle-free'         },
  { icon: '🇦🇺', title: 'Australian Business',  desc: 'Locally operated'    },
]

export function TrustBar() {
  return (
    <section className="bg-brand-cream border-y border-brand-steel/15 py-5">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-brand-steel/15">
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 lg:px-8 first:lg:pl-0 last:lg:pr-0"
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-semibold text-brand-navy text-sm">{item.title}</p>
                <p className="text-brand-muted/60 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

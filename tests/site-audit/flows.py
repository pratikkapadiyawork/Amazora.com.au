"""Click-through tests for every interactive feature a shopper uses. Prints PASS/FAIL per check."""
import sys, re
from playwright.sync_api import sync_playwright, expect

BASE = sys.argv[1].rstrip('/')
results = []

def check(name, fn):
    try:
        fn(); results.append(('PASS', name, ''))
    except Exception as e:
        results.append(('FAIL', name, ' | '.join(l.strip() for l in str(e).split('\n') if 'intercepts' in l or 'Timeout' in l or 'Error' in l)[:400]))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome',
                          args=['--no-proxy-server', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])

    def new(mobile=False):
        ctx = b.new_context(viewport={'width': 390, 'height': 844} if mobile else {'width': 1440, 'height': 900},
                            is_mobile=mobile, has_touch=mobile)
        ctx.add_init_script("try{sessionStorage.setItem('amz-intro','1')}catch(e){}")
        pg = ctx.new_page()
        pg.set_default_timeout(12000)
        pg.route('https://clerk.example.com/**', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
        return pg

    pg = new()
    home = lambda: (pg.goto(BASE + '/', wait_until='load'), pg.wait_for_timeout(1500))
    cart_count = lambda: pg.evaluate("JSON.parse(localStorage.getItem('amazora-cart-v2')||'{}')?.state?.items?.reduce((n,i)=>n+i.qty,0) ?? 0")

    def hero_shop():
        home(); pg.get_by_role('link', name='Shop the sale').click(); pg.wait_for_url(re.compile(r'/shop$'))
    check('Hero: "Shop the sale" opens /shop', hero_shop)

    def hero_showroom():
        home(); pg.get_by_role('link', name='Enter the showroom').click(); pg.wait_for_timeout(2500)
        top = pg.evaluate("document.getElementById('showroom').getBoundingClientRect().top")
        assert -200 < top < 300, f'showroom top at {top}px'
    check('Hero: "Enter the showroom" scrolls to the showroom', hero_showroom)

    def showroom_arrows():
        name = pg.locator('#showroom a.font-display')
        before = name.inner_text()
        pg.get_by_role('button', name='Next piece').click(); pg.wait_for_timeout(1200)
        assert name.inner_text() != before, 'name did not change'
        pg.get_by_role('button', name='Previous piece').click(); pg.wait_for_timeout(1200)
        assert name.inner_text() == before, 'previous did not return'
    check('Showroom: next/previous arrows change the piece', showroom_arrows)

    def showroom_add():
        pg.locator('#showroom').get_by_role('button', name='Add to bag').click(); pg.wait_for_timeout(800)
        expect(pg.get_by_role('dialog', name='Shopping cart')).to_be_visible()
    check('Showroom: "Add to bag" adds and opens the cart', showroom_add)

    def cart_controls():
        d = pg.get_by_role('dialog', name='Shopping cart')
        d.get_by_role('button', name=re.compile('increase', re.I)).first.click(); pg.wait_for_timeout(400)
        assert cart_count() == 2, f'qty {cart_count()}'
        d.get_by_role('button', name=re.compile('decrease', re.I)).first.click(); pg.wait_for_timeout(400)
        assert cart_count() == 1, f'qty {cart_count()}'
    check('Cart drawer: + / − change quantity', cart_controls)

    def cart_checkout():
        d = pg.get_by_role('dialog', name='Shopping cart')
        d.get_by_role('button', name=re.compile('checkout', re.I)).or_(d.get_by_role('link', name=re.compile('checkout', re.I))).first.click()
        pg.wait_for_url(re.compile('/checkout'))
    check('Cart drawer: checkout button opens /checkout', cart_checkout)

    def checkout_continue():
        pg.wait_for_timeout(1200)
        pg.get_by_role('button', name=re.compile('Continue to Delivery', re.I)).click(); pg.wait_for_timeout(800)
        expect(pg.get_by_text(re.compile('email|first name|address', re.I)).first).to_be_visible()
    check('Checkout: "Continue to Delivery" shows the delivery form', checkout_continue)

    def vault():
        home(); pg.evaluate("document.getElementById('vault').scrollIntoView()"); pg.wait_for_timeout(1200)
        v = pg.locator('#vault')
        v.get_by_role('tab', name='Guitars').click(); pg.wait_for_timeout(700)
        h = v.locator('h3').inner_text()
        v.get_by_role('button', name='Style 3').click(); pg.wait_for_timeout(700)
        assert v.locator('h3').inner_text() != h and 'Style 3' in v.locator('h3').inner_text()
        n = cart_count(); v.get_by_role('button', name='Add to bag').click(); pg.wait_for_timeout(600)
        assert cart_count() == n + 1
        pg.keyboard.press('Escape')
    check('Collector\'s Vault: tabs, edition picker, add to bag', vault)

    def card_add_and_wish():
        pg.goto(BASE + '/shop', wait_until='load'); pg.wait_for_timeout(2000)
        n = cart_count()
        pg.get_by_role('button', name=re.compile('^Add .* to cart$')).first.click(); pg.wait_for_timeout(700)
        assert cart_count() == n + 1, 'card + did not add'
        pg.keyboard.press('Escape'); pg.wait_for_timeout(500)
        pg.get_by_role('button', name='Add to wishlist').first.click(); pg.wait_for_timeout(400)
        assert pg.get_by_role('button', name='Remove from wishlist').count() >= 1
    check('Product card: "+" adds to cart, heart saves to wishlist', card_add_and_wish)

    def card_opens():
        pg.goto(BASE + '/shop', wait_until='load'); pg.wait_for_timeout(2000)
        pg.locator('article a[href^="/shop/"]').first.click(); pg.wait_for_url(re.compile(r'/shop/[a-z0-9-]+$'))
    check('Product card: clicking opens the product page', card_opens)

    def pdp():
        pg.goto(BASE + '/shop/ned-kelly-1-gun-large-bronze', wait_until='load'); pg.wait_for_timeout(1500)
        n = cart_count()
        pg.get_by_role('button', name=re.compile('^Add to Cart', re.I)).click(); pg.wait_for_timeout(700)
        assert cart_count() == n + 1
    check('Product page: "Add to Cart" works', pdp)

    def search():
        pg.goto(BASE + '/', wait_until='load'); pg.wait_for_timeout(1200)
        pg.get_by_role('button', name='Search products').click(); pg.wait_for_timeout(500)
        pg.keyboard.type('ned kelly'); pg.wait_for_timeout(1800)
        assert pg.locator('a[href^="/shop/ned-kelly"]').count() > 0, 'no results'
    check('Search: opens and finds products', search)

    def nav_links():
        for label, path in [('Gifts', '/category/gifts'), ('Accessories', '/category/leather'), ('Tankards', '/category/mugs'),
                            ('Models', '/category/ships'), ('Decor', '/category/ceramic'), ('Black Friday', '/shop')]:
            pg.goto(BASE + '/', wait_until='load'); pg.wait_for_timeout(600)
            pg.locator('header nav').get_by_role('link', name=label, exact=True).click()
            pg.wait_for_url(re.compile(re.escape(path) + '$'))
    check('Header: all six nav links open the right pages', nav_links)

    def wishlist_icon():
        pg.goto(BASE + '/', wait_until='load'); pg.wait_for_timeout(800)
        pg.get_by_role('link', name=re.compile('^Wishlist')).click(); pg.wait_for_url(re.compile('/saved$'))
    check('Header: wishlist icon opens saved items', wishlist_icon)

    def keychains():
        pg.goto(BASE + '/', wait_until='load'); pg.wait_for_timeout(800)
        btn = pg.get_by_role('button', name=re.compile('Show all'))
        btn.scroll_into_view_if_needed(); pg.wait_for_timeout(800)
        before = pg.locator('a[href^="/shop/keychain-"]').count()
        btn.click(); pg.wait_for_timeout(800)
        assert pg.locator('a[href^="/shop/keychain-"]').count() > before
    check('Marque Wall: "Show all marques" expands', keychains)

    def filters():
        pg.goto(BASE + '/shop', wait_until='load'); pg.wait_for_timeout(1200)
        pg.get_by_role('button', name=re.compile('Hip Flasks')).first.click(); pg.wait_for_url(re.compile('category=hip-flasks'))
    check('Shop: category filter chips work', filters)

    def newsletter():
        pg.goto(BASE + '/', wait_until='load'); pg.wait_for_timeout(800)
        f = pg.locator('section').filter(has_text='Gifts, stories').locator('input[type=email]')
        f.scroll_into_view_if_needed(); f.fill('test@example.com')
        with pg.expect_response(lambda r: '/api/newsletter' in r.url) as resp:
            pg.locator('section').filter(has_text='Gifts, stories').get_by_role('button').first.click()
        assert resp.value.status in (200, 201), f'status {resp.value.status}'
    check('Newsletter: subscribe posts to the API', newsletter)

    def footer():
        pg.goto(BASE + '/', wait_until='load'); pg.wait_for_timeout(800)
        hrefs = pg.locator('footer a[href^="/"]').evaluate_all('els => els.map(e => e.getAttribute("href"))')
        assert len(hrefs) > 8
    check('Footer: internal links present', footer)

    # mobile
    pg = new(mobile=True)
    def mobile_nav():
        pg.goto(BASE + '/', wait_until='load'); pg.wait_for_timeout(1500)
        nav = pg.locator('nav').filter(has=pg.get_by_role('button', name=re.compile('Search', re.I))).last
        nav.get_by_role('button', name=re.compile('Search', re.I)).click(); pg.wait_for_timeout(600)
        expect(pg.locator('input[type=search], input[placeholder*="earch"]').first).to_be_visible()
        pg.keyboard.press('Escape'); pg.wait_for_timeout(500)
        nav.get_by_role('button', name=re.compile('Cart', re.I)).click(); pg.wait_for_timeout(600)
        expect(pg.get_by_role('dialog', name='Shopping cart')).to_be_visible()
    check('Mobile: bottom nav search + cart buttons', mobile_nav)

    def mobile_cards():
        pg.goto(BASE + '/shop', wait_until='load'); pg.wait_for_timeout(2000)
        a = pg.locator('article a[href^="/shop/"]').first
        a.evaluate("e => e.scrollIntoView({block: 'center'})"); pg.wait_for_timeout(800)
        a.tap(); pg.wait_for_url(re.compile(r'/shop/[a-z0-9-]+$'))
    check('Mobile: tapping a product card opens it', mobile_cards)

    b.close()

for s, n, e in results:
    print(f'{s}  {n}' + (f'\n      ↳ {e}' if e else ''))
print(f"\n{sum(r[0]=='PASS' for r in results)}/{len(results)} passed")

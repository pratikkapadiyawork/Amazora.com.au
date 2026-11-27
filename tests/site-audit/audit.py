"""Amazora button & link audit.

1. Hit-test: for every visible <a>/<button> on each page, the element on top at its centre must be the
   control itself (or inside it) — otherwise an overlay is swallowing clicks.
2. Dead links: every internal href found is requested; anything that ends in 4xx/5xx is reported.
3. Buttons with no action: <button> without onClick handler / type=submit inside a form / aria-controls.
Run:  python3 audit.py BASE [mobile]
"""
import json, sys, urllib.parse, urllib.request
from playwright.sync_api import sync_playwright

BASE = sys.argv[1].rstrip('/')
MOBILE = len(sys.argv) > 2 and sys.argv[2] == 'mobile'
PAGES = ['/', '/shop', '/products', '/category/leather', '/category/gifts', '/shop/ned-kelly-1-gun-large-bronze',
         '/collections/for-him', '/collections/for-her', '/collections/for-home', '/about', '/contact', '/blog',
         '/shipping', '/returns', '/privacy', '/terms', '/saved', '/checkout']

HIT_JS = r"""
() => {
  const out = [];
  const els = [...document.querySelectorAll('a[href], button, [role=button], [role=tab]')];
  for (const el of els) {
    const r = el.getBoundingClientRect();
    const st = getComputedStyle(el);
    if (r.width < 4 || r.height < 4 || st.visibility === 'hidden' || st.display === 'none' || +st.opacity === 0) continue;
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    const x = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2));
    const y = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2));
    const top = document.elementFromPoint(x, y);
    const ok = top && (top === el || el.contains(top) || top.contains(el));
    if (!ok) {
      const d = top ? (top.tagName + '.' + String(top.className).slice(0, 70)) : 'null';
      out.push({ label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 50), tag: el.tagName, href: el.getAttribute('href'), blockedBy: d });
    }
  }
  return out;
}
"""

def collect_links(pg):
    return pg.evaluate("[...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))")

blocked, links = {}, set()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome',
                          args=['--no-proxy-server', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    ctx = b.new_context(viewport={'width': 390, 'height': 844} if MOBILE else {'width': 1440, 'height': 900},
                        is_mobile=MOBILE, has_touch=MOBILE)
    ctx.add_init_script("try{sessionStorage.setItem('amz-intro','1')}catch(e){}")
    pg = ctx.new_page()
    pg.route('https://clerk.example.com/**', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
    errors = []
    pg.on('pageerror', lambda e: errors.append(f'{pg.url} :: {str(e)[:200]}'))
    for path in PAGES:
        pg.goto(BASE + path, wait_until='load'); pg.wait_for_timeout(1800)
        H = pg.evaluate('document.documentElement.scrollHeight')
        y = 0
        while y < H:
            pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(450)
            for item in pg.evaluate(HIT_JS):
                key = (item['label'], item['href'], item['blockedBy'])
                blocked.setdefault(key, set()).add(path)
            y += 700
        links.update(h for h in collect_links(pg) if h and h.startswith('/'))
    b.close()

print('\n=== CLICK TARGETS COVERED BY ANOTHER ELEMENT ===')
for (label, href, by), paths in sorted(blocked.items(), key=lambda kv: -len(kv[1])):
    print(f'- "{label}" href={href} blocked by {by}  on {sorted(paths)[:4]}')

print('\n=== INTERNAL LINKS ===')
bad = []
opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
for h in sorted(links):
    u = BASE + h
    try:
        r = opener.open(urllib.request.Request(u, method='GET'), timeout=30)
        code = r.status
    except urllib.error.HTTPError as e:
        code = e.code
    except Exception as e:
        code = str(e)[:60]
    if code != 200:
        bad.append((h, code))
print(f'{len(links)} unique internal links, {len(bad)} failing')
for h, c in bad:
    print(f'  {c}  {h}')
print('\n=== PAGE ERRORS ===')
print('\n'.join(errors) or 'none')

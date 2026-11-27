# Site audit (Playwright, Python)

Two checks used before each launch:

- `flows.py BASE_URL` — clicks through every shopper feature (hero, showroom, vault, cart, checkout,
  product cards, wishlist, search, nav, filters, newsletter, mobile nav) and prints PASS/FAIL.
- `audit.py BASE_URL [mobile]` — on every main page: finds buttons/links covered by another element
  (clicks that would be swallowed), requests every internal link, and lists page errors.

```bash
pip install playwright && playwright install chromium
npm run build && npm start            # or point at a preview URL
python3 tests/site-audit/flows.py http://localhost:3000
python3 tests/site-audit/audit.py http://localhost:3000 mobile
```
Edit `executable_path` in both files if Chrome lives somewhere else (or remove it to use Playwright's Chromium).

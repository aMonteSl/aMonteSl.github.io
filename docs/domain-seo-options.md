# Domain SEO options for Adrian Montes Linares

RDAP availability was checked on 2026-06-24. Treat these results as a strong screening signal, not as a purchase guarantee. Always confirm availability and price in the registrar before buying.

## Recommended domains

| Rank | Domain | RDAP result | Recommendation | SEO reasoning |
| --- | --- | --- | --- | --- |
| 1 | `adrianmonteslinares.com` | 404 / not found | Buy first | Exact match for the full professional name, globally recognizable, strongest long-term canonical domain. |
| 2 | `adrianmonteslinares.es` | 404 / not found | Defensive buy | Good Spanish identity signal and protects the exact full name in Spain. Redirect to `.com`. |
| 3 | `adrianmonteslinares.dev` | 404 / not found | Optional | Strong developer signal, but less universal than `.com`. Redirect to `.com`. |
| 4 | `amontesl.com` | 404 / not found | Optional short alias | Matches GitHub handle and is easy to type, but weaker for name-search SEO. Redirect to `.com`. |
| 5 | `adrianmontes.io` | 404 / not found | Optional | Short and technical, but `.io` can be pricier and less name-complete. Redirect to `.com`. |

## Not recommended / likely unavailable

| Domain | RDAP result | Reason |
| --- | --- | --- |
| `adrianmontes.com` | Registered | Best short name, but unavailable in RDAP. |
| `adrianmontes.dev` | Registered | Good developer-domain candidate, but unavailable in RDAP. |
| `adrianmontes.tech` | Check blocked by registry | Possible, but less professional than `.com` and needs registrar verification. |
| `adrianmonteslinares.tech` | Check blocked by registry | Possible, but lower priority than `.com`, `.es`, or `.dev`. |

## Default choice

Use `adrianmonteslinares.com` as the primary canonical domain.

Use `https://code-xr.adrianmonteslinares.com/` as the canonical public URL for the Code-XR documentation.

Status on 2026-06-24: purchased and prepared in this repository through `public/CNAME` and `LINKS.website`.

Keep all other bought domains as redirects to:

```text
https://adrianmonteslinares.com/
```

## GitHub Pages setup after purchase

1. In GitHub Pages settings, set the custom domain to:

```text
adrianmonteslinares.com
```

2. Add a `public/CNAME` file containing exactly:

```text
adrianmonteslinares.com
```

3. Configure DNS:

```text
www    CNAME    amontesl.github.io
@      A        185.199.108.153
@      A        185.199.109.153
@      A        185.199.110.153
@      A        185.199.111.153
```

4. Enable "Enforce HTTPS" in GitHub Pages after DNS resolves.

5. Update `LINKS.website` in `src/lib/constants.ts` to:

```ts
website: 'https://adrianmonteslinares.com',
```

6. Rebuild and verify:

```bash
npm run check
npm run build
```

7. Submit the sitemap in Google Search Console:

```text
https://adrianmonteslinares.com/sitemap.xml
```

## SEO notes

- Keep `/` as the English canonical page and `/es/` as the Spanish localized page.
- Keep hreflang alternates for `en`, `es`, and `x-default`.
- Use `Adrián Montes Linares`, `Adrian Montes Linares`, `Adrián Montes`, `Adrian Montes`, and `aMonteSl` in structured data aliases.
- Avoid changing the domain again after Google indexes the custom domain unless absolutely necessary.

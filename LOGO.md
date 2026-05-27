# Adding your real logo

The website is already wired up for the **Educators United Pvt Ltd** brand
and the domain **educatorsunited.in**. A clean SVG placeholder ships at
`public/logo.svg` so the site never looks broken before you upload the real
logo.

## What renders where

The logo is used in:

- the site **header** (top-left)
- the site **footer** (brand column)
- the **browser tab** favicon
- **Open Graph / Twitter** previews when the site is shared on social media

It reads from the `logo_url` site setting (default: `/logo.png`). The
header component falls back automatically to `/logo.svg`, then to an "EU"
monogram badge, if a file is missing — so the UI never shows a broken
image.

## Option A — commit the PNG to the repo (recommended)

1. Save your logo image as `logo.png` (square, transparent background, at
   least 512 × 512 px).
2. Place it at `public/logo.png` in this repository.
3. Commit and push:

   ```bash
   git add public/logo.png
   git commit -m "Add real logo"
   git push
   ```

That's it — the site auto-uses it on next deploy.

## Option B — host externally and paste the URL

1. Upload `logo.png` somewhere public (Hostinger File Manager, S3, Cloudinary,
   even your Facebook page's image URL).
2. Sign in as admin at `/login`.
3. Go to `/admin/settings`.
4. Paste the URL into the **Logo URL** field and Save.

## Option C — keep the placeholder

The SVG at `public/logo.svg` is a clean blue roundel with an orange star
and an "EU PVT LTD" wordmark. It works as-is until you swap in the real
file using Option A or B.

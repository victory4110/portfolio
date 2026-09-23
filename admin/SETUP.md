# One-time admin login setup

The editor is ready at `/portfolio/admin/`, but GitHub requires a secure authentication
service before it may publish changes.

1. Create a free account at https://turbo.decapcms.org/.
2. Connect GitHub and allow access only to `victory4110/portfolio`.
3. Create a site with:
   - Repo: `victory4110/portfolio`
   - Branch: `main`
   - Config path: `admin/config.yml`
   - Admin URL: `https://victory4110.github.io/portfolio/admin/`
4. Copy the Site ID from the Turbo overview.
5. Add the Site ID to `admin/config.yml`.

After that, log in at https://victory4110.github.io/portfolio/admin/. Publishing from the
editor commits `content.json` and uploaded images to GitHub, which triggers GitHub Pages.

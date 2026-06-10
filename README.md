# Nihar Masurkar — Academic Portfolio (Jekyll)

A single-page academic portfolio with an acoustic-signal theme. All content
lives in Markdown and YAML, so you edit data files rather than HTML.

## What to edit

| You want to change...        | Edit this file                  |
|------------------------------|---------------------------------|
| Name, role, email, LinkedIn  | `_config.yml`                   |
| Hero "tap / listen" wording  | `_config.yml` + `_includes/hero.html` |
| Focus areas                  | `_data/focus.yml`               |
| Projects                     | `_data/projects.yml`            |
| Visual-résumé timeline       | `_data/timeline.yml`            |
| Publications                 | `_data/publications.yml`        |
| Skills                       | `_data/skills.yml`              |
| Colors / fonts / spacing     | `assets/css/style.css` (`:root`)|
| Waveform behavior            | `assets/js/scope.js`            |
| Logo / favicon               | `assets/*.svg` (see below)      |

You do **not** touch HTML to change content — the section partials in
`_includes/` loop over the YAML automatically.

## Branding

The logo and favicon are already wired in:

- `assets/logo-mark.svg` — the NM monogram, shown in the nav bar.
- `assets/logo-wordmark.svg` — full horizontal logo (name + tagline).
- `assets/favicon.svg` + PNG/ICO fallbacks — linked from `_includes/head.html`.

The mark is your initials in an amber->teal gradient (tap -> listen). To
recolor everything, change the two `stop-color` values at the top of each SVG.

## Run it locally

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.

## Publish free on GitHub Pages

1. Create a repo named `your-username.github.io` (for a root site) and push
   these files to it.
2. In the repo: Settings -> Pages -> Build from the `main` branch.
3. If you instead use a project repo (e.g. `portfolio`), set
   `baseurl: "/portfolio"` in `_config.yml`.

GitHub builds and deploys automatically on every push.

## Notes

- The waveform respects `prefers-reduced-motion`.
- Publications are maintained by hand here. If the list grows, the al-folio
  Jekyll theme can generate this section straight from a BibTeX file.

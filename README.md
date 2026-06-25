# Nihar Masurkar — Academic Portfolio

A single-page academic portfolio with an acoustic-signal theme. All content
lives in YAML data files and `_config.yml`, so you edit data rather than HTML.

## What to edit

| You want to change...              | Edit this file                         |
|------------------------------------|----------------------------------------|
| Name, role, email, links, résumé   | `_config.yml`                          |
| About Me paragraphs                | `_config.yml` (`about:`)               |
| About Me photo                     | drop `profile.jpg` into `assets/media/`, set `about: photo:` in `_config.yml` |
| Education entries                  | `_data/education.yml`                  |
| Focus areas                        | `_data/focus.yml`                      |
| Projects (cards + modal content)   | `_data/projects.yml`                   |
| Project photos / videos            | drop into `assets/media/`, then point to them in `_data/projects.yml` |
| Timeline                           | `_data/timeline.yml`                   |
| Publications (journals/conferences)| `_data/publications.yml`               |
| Awards                             | `_data/awards.yml`                     |
| Skills                             | `_data/skills.yml`                     |
| Colors / fonts / spacing           | `assets/css/style.css` (`:root`)       |
| Waveform + modal behavior          | `assets/js/scope.js`                   |
| Résumé PDF                         | replace `assets/docs/Nihar_Masurkar_Resume.pdf` |

You don't touch HTML to change content — the partials in `_includes/` loop
over the YAML automatically.

## Adding your About-section photo

1. Put your portrait in `assets/media/` named `profile.jpg` (or `.png`).
2. Confirm `_config.yml` points to it:

   ```yaml
   about:
     photo: /assets/media/profile.jpg
   ```

3. It appears in a circular frame on a colored disc on the right of the About
   section. A cut-out style photo (plain or transparent background, head and
   shoulders) sits best on the disc. Until you add one, a "your photo goes
   here" placeholder shows.

## Adding photos / videos to a project

1. Put the file in `assets/media/` (e.g. `tap-robot.jpg` or `tap-robot.mp4`).
2. In `_data/projects.yml`, set the project's media fields:

   ```yaml
   media: /assets/media/tap-robot.jpg
   media_type: image
   ```

   For video:

   ```yaml
   media: /assets/media/tap-robot.mp4
   media_type: video
   poster: /assets/media/tap-robot-thumb.jpg   # optional thumbnail
   ```

3. The card thumbnail and the lightbox modal pick it up automatically.
   Leaving `media: ""` shows a styled "media coming soon" placeholder.

## Publications

`_data/publications.yml` has two lists: `journals:` and `conferences:`.
Each entry needs `venue`, `title`, `authors`, and `doi`. Leave `doi: ""`
for entries without a link — they render as plain (non-clickable) rows.

## Run it locally

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.

## Publish on GitHub Pages

This repo is meant for `https://github.com/NiharMasurkar/niharmasurkar.github.io`.

1. Push these files to that repo's `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Deploy from a
   branch**, branch `main`, folder `/ (root)`.
3. GitHub builds and deploys automatically on every push.

The `CNAME` file points the site at `niharmasurkar.com`. If you don't use a
custom domain, delete `CNAME` and the site serves at
`https://niharmasurkar.github.io`.

## Notes

- The waveform and timeline reveals respect `prefers-reduced-motion`.
- The logo (`assets/logo-mark.svg`) and favicon (`assets/favicon.svg`) are an
  NM monogram in an amber→teal gradient (tap → listen). Swap in your own SVGs
  to rebrand; recolor by changing the two `stop-color` values at the top.

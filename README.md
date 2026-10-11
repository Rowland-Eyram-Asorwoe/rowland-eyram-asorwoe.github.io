# Rowland Asorwoe Eyram — Developer Portfolio

A responsive developer portfolio with four CV-based project presentations, interactive browser-local samples, professional experience, skills, education, contact links, and a downloadable CV.

Planned GitHub Pages address: **https://rowland-eyram-asorwoe.github.io/**. This address becomes live only after the repository is uploaded and GitHub Pages is enabled.

## Publish on GitHub Pages

1. Create a **public** repository owned by `Rowland-Eyram-Asorwoe` named `rowland-eyram-asorwoe.github.io`. Initialize it with a README so the default `main` branch exists.
2. Upload the contents of this folder to the repository root. `index.html` must be at the root, alongside `app.js`, `model.js`, `styles.css`, `assets/`, and `.nojekyll`.
3. Open the repository’s **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, then **main** and **/(root)**. Select **Save**.
5. Wait for the GitHub Pages deployment to complete, then select **Visit site** in Settings → Pages.

GitHub Pages is available on GitHub Free with a public repository. The default Pages workflow republishes changes committed to the selected branch. No paid hosting account, custom domain, package installation, or server is needed.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Edit and verify

- `index.html`: content, project summaries, experience, contact details, and metadata.
- `styles.css`: responsive layout and design tokens.
- `app.js` and `model.js`: project dialogs and sample interactions.
- `assets/`: self-hosted fonts, illustrations, social card, and the original CV.
- `DESIGN.md`: visual decisions and interaction conventions.

The site is ready to host without a build command. Optional checks require Node.js 18 or newer:

```sh
npm run check
npm test
```

If the domain or repository path changes, update canonical and social URLs in `index.html`, plus `robots.txt` and `sitemap.xml`. Relative asset paths already support a repository subdirectory.

## Project samples

The task manager supports adding, editing, moving, removing, and restoring sample tasks. The storefront supports product filters, cart quantities, and a sample order preview. The chest X-ray project illustrates its research workflow without running a medical model. The portfolio project explains this website.

Samples are newly authored recreations from the supplied CV descriptions. They are not the original deployed projects. Example data resets when the page refreshes; no accounts, payments, patient data, or submitted contact records are collected.

## Fonts

The self-hosted URW Nimbus fonts include original font files and their distribution/license notice under `assets/fonts/`.

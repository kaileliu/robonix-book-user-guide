# Robonix Book

Robonix Book is the Chinese user and developer handbook for Robonix. It covers online exploration, Robonix Hub and Console, robot operation, common tasks, troubleshooting, and advanced integration. The site is built with Docusaurus. Source-level reference pages are aligned with pinned `dev` revision [`223675d9a5000e70debae4f2512404cec5c9c442`](https://github.com/syswonder/robonix/tree/223675d9a5000e70debae4f2512404cec5c9c442). The archived mdBook source and tooling remain under `archive/mdbook/` for history and URL migration checks; contributors should edit the Markdown files under `docs/`.

## Local preview

Prerequisites:

- Node.js 20 or newer;
- npm, which is included with the official Node.js distribution;
- GNU Make.

Run the following commands from the repository root:

```bash
make install
make dev
```

Open <http://127.0.0.1:3000/>. Docusaurus watches `docs/`, `src/`, `static/`, `sidebars.ts`, and `docusaurus.config.ts` and refreshes the development preview after a saved change.

Before opening a pull request, run:

```bash
make check
```

This command checks fenced Bash, JavaScript, JSON, Python, TOML, and YAML examples; validates local image paths and alternative text; runs the TypeScript check; builds the production site in `build/`; verifies internal links, legacy mdBook URLs and fragments; and checks the generated search index. Use `make help` to list every supported target.

The normal preview covers the handbook. To reproduce the deployed artifact with the Rust and Python API trees, use a clean Robonix checkout at the revision in `ROBONIX_SOURCE_REVISION`:

```bash
make api-install ROBONIX_SOURCE=/absolute/path/to/robonix
make full-check \
  ROBONIX_SOURCE=/absolute/path/to/robonix \
  API_PYTHON=.venv-api/bin/python
make full-serve \
  ROBONIX_SOURCE=/absolute/path/to/robonix \
  API_PYTHON=.venv-api/bin/python
```

## Personal GitHub Pages site

The `user-guide` branch has a separate Pages workflow for publishing this handbook
under a personal GitHub account. Enable **Settings → Pages → GitHub Actions** in
the destination repository, then push that branch. The workflow derives the site
address from the repository name and publishes it after validation.

To check the same build locally:

```bash
GITHUB_REPOSITORY=YOUR_USERNAME/robonix-book npm run build:pages
python3 scripts/check-built-links.py build-pages --base-url /robonix-book/
```

This build preserves the handbook styling and screenshots. The separately
generated Rust and Python API links open their pages on `book.robonix.ai`.

## Offline export (double-click to open)

To share the handbook with readers who do not have Node.js or a local web server:

```bash
npm run export:offline
```

Send `offline/robonix-book-offline.zip`. Readers should **extract the entire ZIP**
and double-click `robonix-book/index.html` in Chrome, Edge, Firefox, or Safari.
Keep the HTML files and asset folders together; sending `index.html` alone will
not work. A local copy is also available at `offline/robonix-book/index.html`.

The export includes relative file links, the complete sidebar, offline text
search, images, Mermaid diagrams, platform tabs, and code copying. It uses a
separate static runtime compatible with `file://`; the ordinary production
`build/` directory still targets HTTP hosting. Hub, GitHub, online demos, and
the separately generated Rust/Python API reference require internet access;
API links are marked “在线”. Regenerate the ZIP after changing the handbook.

## Contributing

Read the [documentation contribution guide](docs/contributing/documentation.md) and [writing standard](STYLE.md) before changing technical instructions. Commands, configuration fields, paths, expected output, and implementation status must be verified against the exact Robonix source revision described by the page.


## License

Robonix Book is licensed under the [Mulan Permissive Software License, Version 2](LICENSE). Notices for incorporated third-party source files are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

This edition is based on [syswonder/robonix-book](https://github.com/syswonder/robonix-book) and retains its license and notices.

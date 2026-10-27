# Robonix Book

Robonix Book is the Chinese documentation site for Robonix. The current handbook is built with Docusaurus and aligned with pinned `dev` revision [`c363f077de1fdc82e11ce27ff87e1b038d0ad88d`](https://github.com/syswonder/robonix/tree/c363f077de1fdc82e11ce27ff87e1b038d0ad88d). The archived mdBook source and tooling remain under `archive/mdbook/` for history and URL migration checks; contributors should edit the Markdown files under `docs/`.

## Hub and Console guide

The user-facing workflow is maintained as **one page**:
[`docs/getting-started/hub-console.md`](docs/getting-started/hub-console.md).
It is an entry in the existing handbook's **入门** sidebar, with one link from
the homepage. The existing developer, component, interface and Client pages
remain the technical references. This is not a separate user handbook.

The earlier multi-page user handbook is preserved in `archive/user-guide/` for
source comparison and is excluded from the published documentation and search.
Screenshots used by the guide are in `static/img/hub/`.

The personal Pages configuration remains available for reviewing the integrated
book. It does not change the upstream site's configuration. Check it locally:

```bash
GITHUB_REPOSITORY=kaileliu/robonix-book-user-guide npm run build:pages
python3 scripts/check-built-links.py build-pages --base-url /robonix-book-user-guide/
```

No upstream pull request is part of this consolidation.

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

## Contributing

Read the [documentation contribution guide](docs/contributing/documentation.md) and [writing standard](STYLE.md) before changing technical instructions. Commands, configuration fields, paths, expected output, and implementation status must be verified against the exact Robonix source revision described by the page.

## License

Robonix Book is licensed under the [Mulan Permissive Software License, Version 2](LICENSE). Notices for incorporated third-party source files are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

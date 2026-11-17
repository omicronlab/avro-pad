AvroPad
=======
Live: http://avro.im

---

AvroPad is a full featured Avro Phonetic application with dictionary support. It runs locally on the browser, without requiring any server side processing and thus can be used offline without crippling its functionality.

This project has been started by [Sarim](https://github.com/sarim) (who is also the maintainer of [ibus-avro](http://linux.omicronlab.com)). Since ibus-avro was written entirely in JavaScript, AvroPad was the first attempt to port that entire functionality to web.

Yes, we know [Google Input Tools](http://www.google.com/inputtools/try/) is there and provides far superior suggestions with its machine learning capability. AvroPad doesn't aim to be a replacement of that, but it provides some interesting benefits:

* It works offline.
* It's fast and instant, there is no roundtrip delay for processing every word you type.
* It's values privacy. Whatever you write or save in the drafts don't leave your browser unless you want them to.
* It's open source. Google [deprecated their transliteration API service on May 26, 2011](https://developers.google.com/transliterate/), and it [may not be available after 3 years](https://developers.google.com/transliterate/terms) since the announcement. As a developer you are free to integrate AvroPad in your application under the terms of MPL 1.1. We hate vendor locking as much as you do.

## Development

Install [Bun](https://bun.sh/). Vite 8 also needs Node.js 20.19+ (or 22.12+) available on the machine.

**Install dependencies:**

```bash
$ bun install
```

Runtime libraries are committed under `public/vendor/`, so there is no Bower
step and no globally installed build tool.

**Run (development mode):**

```bash
$ bun run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser. Vite
reloads the page when a source file changes.

The entry points are `index.html`, `src/main.ts` and `src/main.css`. Static
assets, including the phonetic engine and the vendored libraries, live in
`public/`.

## Build

```bash
$ bun run build
```

This type-checks the TypeScript and writes a minified, fingerprinted build to
`dist/`. The old gulp build also generated an offline AppCache manifest; that
step is gone because browsers have removed AppCache support.

To test the production build locally:

```bash
$ bun run preview
```

Open [http://localhost:4173/](http://localhost:4173/) in your browser.

## Vendored dependencies

The runtime libraries are checked into `public/vendor/` at the exact versions
the original Bower build resolved to. Bower is retired and several pinned
plugin versions are not reliably available from npm. See
`public/vendor/README.md` for the versions and the pinning rationale.

## Browser support

AvroPad has been tested with Chrome, Firefox, Safari, iOS Safari. We don't know what will happen on IE, let us know in our [forum](http://forum.omicronlab.com) or in [issues](https://github.com/torifat/avro-pad/issues) if you test that, but right now we don't promise IE support.

Android support is very minimal, because of the bugs in Chrome for Android:

* [keydown and keyup events do not have proper keyCode (it's always 0)](https://code.google.com/p/chromium/issues/detail?id=118639)
* [Chrome for Android does not honor autocomplete and autocorrect attributes](https://code.google.com/p/chromium/issues/detail?id=303883)
* [add autocapitalize property support](https://code.google.com/p/chromium/issues/detail?id=116152)

And it's rare to have fixes on older Android releases, so old native Android browser probably will never be supported.

## Contributors

* Sarim Khan
* Rifat Nabi
* Mehdi Hasan
* Tanbin Islam Siyam

## License

AvroPad is licensed under Mozilla Public License 1.1 ("MPL"), an open source/free software license.

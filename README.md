
AvroPad

=======

Live: https://avro.im

  

---

  

[![NPM Dev Dependencies](http://img.shields.io/david/dev/omicronlab/avro-pad.svg?style=flat-square)](https://david-dm.org/omicronlab/avro-pad#info=devDependencies&view=table) ![enter image description here](https://img.shields.io/github/languages/code-size/omicronlab/avro-pad.svg) ![](https://img.shields.io/website/https/avro.im.svg?label=Avro.im&up_message=Operational)

---

  

AvroPad is a full featured Avro Phonetic application with dictionary support. It runs locally on the browser, without requiring any server side processing and thus can be used offline without crippling its functionality.

  

This project has been started by [Sarim](https://github.com/sarim) (who is also the maintainer of [ibus-avro](http://linux.omicronlab.com)). Since ibus-avro was written entirely in JavaScript, AvroPad was the first attempt to port that entire functionality to web.

  

Yes, we know [Google Input Tools](http://www.google.com/inputtools/try/) is there and provides far superior suggestions with its machine learning capability. AvroPad doesn't aim to be a replacement of that, but it provides some interesting benefits:

  

* It works offline.

* It's fast and instant, there is no roundtrip delay for processing every word you type.

* It's values privacy. Whatever you write or save in the drafts don't leave your browser unless you want them to.

* It's open source. Google [deprecated their transliteration API service on May 26, 2011](https://developers.google.com/transliterate/), and it [may not be available after 3 years](https://developers.google.com/transliterate/terms) since the announcement. As a developer you are free to integrate AvroPad in your application under the terms of MPL 1.1. We hate vendor locking as much as you do.

  

## Development

  

Install [Node.js](http://nodejs.org/) if you haven't already.

  

**Install dependencies:**

  

```bash

$ npm install -g gulp

$ npm install

```

  

Running `npm install` will also install bower components for you.

  

**Run (Development mode):**

  

```bash

$ gulp watch

```

  

Open [http://localhost:8080/](http://localhost:8080/) in your browser.

  

[Chrome Livereload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei) extension will also come in handy if you don't want to refresh your browser manually every time you change the code.

  

## Build

  

```bash

$ gulp build

```

  

This will minify assets and prepare the offline manifest file to deploy on production under ./build directory. Alternatively,

  

```bash

$ gulp

```

  

This `$ gulp` command alone will do the above and also start a server with the production ready application. Open [http://localhost:8888/](http://localhost:8888/) in your browser to test.

  

## Browser support

  

AvroPad has been tested with Chrome, Firefox, Safari, Microsoft Edge (EDGEHtml version), Microsoft Edge (Chromium Based Version) iOS Safari and Brave, Samsung Internet, kiwi browser on mobile. We don't know what will happen on IE, let us know in our [forum](http://forum.omicronlab.com) or in [issues](https://github.com/torifat/avro-pad/issues) if you test that, but right now we don't promise IE support.

  

Android support is very minimal, because of the bugs in Chrome for Android:

  

*  [keydown and keyup events do not have proper keyCode (it's always 0)](https://code.google.com/p/chromium/issues/detail?id=118639)

*  [Chrome for Android does not honor autocomplete and autocorrect attributes](https://code.google.com/p/chromium/issues/detail?id=303883)

*  [add autocapitalize property support](https://code.google.com/p/chromium/issues/detail?id=116152)

  

And it's rare to have fixes on older Android releases, so old native Android browser probably will never be supported.

  

## Contributors

  

* Sarim Khan

* Rifat Nabi

* Mehdi Hasan

* Tanbin Islam Siyam
* Salman Hossain Saif

  

## License

  

AvroPad is licensed under Mozilla Public License 1.1 ("MPL"), an open source/free software license.
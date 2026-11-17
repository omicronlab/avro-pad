# Vendored libraries

These are the exact versions the original Bower build resolved to. They are
committed here because the Bower registry is retired and `src/vendor/` was
gitignored upstream. Keep them byte-identical when updating.

| File | Version | Source |
| --- | --- | --- |
| `jquery.js` | 2.1.4 | https://unpkg.com/jquery@2.1.4/dist/jquery.js |
| `jquery.caret.js` | 0.0.9 | https://github.com/ichord/Caret.js/tree/v0.0.9 |
| `jquery.atwho.js` | 0.4.10 | https://github.com/ichord/At.js/tree/v0.4.10 |
| `jquery.atwho.css` | 0.4.10 | https://github.com/ichord/At.js/tree/v0.4.10 |
| `jquery.autosize.js` | 1.18.18 | https://unpkg.com/jquery-autosize@1.18.18/jquery.autosize.js |
| `jquery.touchSwipe.js` | 1.6.19 | https://unpkg.com/jquery-touchswipe@1.6.19/jquery.touchSwipe.js |
| `device.js` | 0.2.7 | https://github.com/matthewhudson/device.js/tree/v0.2.7 |

At.js 0.4.10 is required: the app uses `tpl_eval`, `start_with_space`,
`on_keydown` and `this.view.$el`, which were removed in later At.js releases.
Caret.js 0.0.9 is required: At.js calls `caret({iframe: ...}).caret('offset', ...)`,
an object-initialisation API removed in Caret.js 0.1.0+. Newer versions throw
`Method [object Object] does not exist on jQuery.caret`.

Licenses: jQuery (MIT), Caret.js (MIT), At.js (MIT), jquery-autosize (MIT),
jquery-touchSwipe (MIT), device.js (MIT).

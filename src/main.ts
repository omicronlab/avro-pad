import './main.css'

$(function () {
  $('#wrapper').show()
  $('#loader').slideUp().remove()

  const KEY_CODE = {
    DOWN: 40,
    UP: 38,
    ESC: 27,
    TAB: 9,
    ENTER: 13,
    SPACE: 32,
    CTRL: 17,
    P: 80,
    N: 78
  }

  let isHorizontal: () => boolean
  let avro: AvroPhoneticInstance
  const drafts: string[] = []
  let selectedIndex: number
  let toggleLanguage: () => void
  let fetchAllDrafts: () => void
  let loadDraftId: (id: number) => void
  let currentDraftId = 0
  let makeTitle: (content: string, index: number) => string
  const $editor: JQuery = $('textarea')
  const $statusControl: JQuery = $('#state')
  let $current: JQuery
  let isBN = true
  const titleLength = 25
  const LS = window.localStorage
  let runningEvent = 0
  const selectedTpl = '<li class="cur" data-value="${name}"><a href="#">${name}</a></li>'

  // Show incompatibily alert
  if (navigator.userAgent.match(/Android/i)) {
    if (!LS.browserWarning) {
      LS.browserWarning = 1
      alert('AvroPad may not work as expected due to some bugs of Android. Ask Google to get their things right.')
    }
  }

  isHorizontal = function () {
    return (device.mobile() || device.tablet() || $(window).width()! <= 800)
  }

  avro = new AvroPhonetic(
    function () {
      if (LS.AvroCandidateSelection) {
        return JSON.parse(LS.AvroCandidateSelection)
      } else {
        return {}
      }
    },
    function (cS) {
      LS.AvroCandidateSelection = JSON.stringify(cS)
    }
  )

  // Functions
  toggleLanguage = function () {
    isBN = !isBN
    $(document.body).toggleClass('sys')
    $statusControl.prop('checked', isBN)
    runningEvent = 0
  }

  fetchAllDrafts = function () {
    $('.drafts ul li a').each(function (index) {
      let data = ''
      if (LS['draft-' + index]) {
        data = JSON.parse(LS['draft-' + index])
      }
      drafts[index] = data
      $(this).text(makeTitle(data, index))
    })
  }

  makeTitle = function (content: string, index: number) {
    if (!!content) {
      content = content.trim().split('\n')[0]
    } else {
      content = ''
    }

    if (content && content.trim().length) {
      if (content.length <= titleLength) return content
      if (content[titleLength] === ' ') {
        return content.substring(0, titleLength)
      } else {
        const pos = content.lastIndexOf(' ', titleLength)
        return content.substring(0, pos)
      }
    } else {
      return 'Draft ' + (index + 1)
    }
  }

  loadDraftId = function (id: number) {
    $editor.val(drafts[id])
    $editor.trigger('autosize.resize').focus()
  }

  // Event Handlers
  $(document).on('keydown', function (e) {
    if (e.ctrlKey && [190, 110].indexOf(e.keyCode) !== -1) {
      e.preventDefault()
      toggleLanguage()
    }
  })

  $statusControl.on('change', function () {
    isBN = $(this).is(':checked')
  })

  $('.drafts ul').on('click', 'li', function (e) {
    e.preventDefault()
    $('.drafts ul li.active').removeClass('active')
    $(this).addClass('active')
    $current = $(this).find('a')

    currentDraftId = $(this).index()
    loadDraftId(currentDraftId)
  })

  // Init
  fetchAllDrafts()
  // Load the first draft
  $('.drafts ul li:first a').trigger('click')

  // The TextArea
  $editor
    .autosize()
    .prop('disabled', false)
    .atwho({
      at: '',
      data: {},
      tpl: '<li data-value="${name}"><a href="#">${name}</a></li>',
      start_with_space: false,
      limit: 11,
      highlight_first: false,
      callbacks: {
        // just match everything baby :3
        matcher: function (_flag: string, subtext: string) {
          if (!isBN) return null // always return null when user selects english
          const res = subtext.match(/\s?([^\s]+)$/)
          // console.log(subtext, res);
          if (res == null) return null
          const bnregex = /[\u0980-\u09FF]+$/
          if (bnregex.exec(res[1])) return null
          return res[1]
        },
        // main work is done here
        filter: function (query: string, _data: unknown, _search_key: string) {
          // console.log(query, data, search_key);
          const bnarr = avro.suggest(query)

          bnarr.words = bnarr.words.slice(0, 10)
          if (avro.candidate(query) === query) {
            bnarr.prevSelection = bnarr.words.length
          }
          bnarr.words.push(query)

          selectedIndex = 0
          return $.map(bnarr.words, function (value: string, i: number) {
            if (i === bnarr.prevSelection) selectedIndex = i
            return {
              id: i,
              name: value
            }
          })
        },
        before_insert: function (value: string, _li: unknown) {
          // save the selected value to user preferences;
          const qtxt = (this as unknown as AtWhoApp).query.text
          setTimeout(function () {
            avro.commit(qtxt, value)
          }, 500)
          return value
        },
        highlighter: function (li: unknown, _query: string) {
          return li
        },
        sorter: function (_query: string, items: unknown, _search_key: string) {
          return items
        },
        tpl_eval: function (tpl: string, map: { id: number; name: string }) {
          try {
            if (selectedIndex === map.id) {
              tpl = selectedTpl
            }
            const tmpHTML = $(tpl)
            tmpHTML.attr('data-value', map.name)
            tmpHTML.find('a').html(map.name)
            return $('<p>').append(tmpHTML).html() // jQuery object to html string
          } catch (error) {
            return ''
          }
        },
        before_reposition: function (offset: { top: number; left: number }) {
          if (isHorizontal()) {
            const winWidth = $(window).width()!
            const $view = (this as unknown as AtWhoApp).view.$el

            $view.css({ maxWidth: winWidth, minWidth: 0 })
            $view.offset({ left: 0, top: offset.top })

            const cWinWidth = $view.width()!

            if (offset.left + cWinWidth > winWidth) {
              if (cWinWidth + 2 >= winWidth) {
                offset.left = 0
              } else {
                const left = offset.left - cWinWidth
                if (left >= 0) {
                  offset.left = left
                } else {
                  offset.left = 0
                }
              }
            }

            // console.log(offset.top, cWinHeight, winHeight);
            // if (offset.top + cWinHeight > winHeight){
            //   offset.top = offset.top - cWinHeight - 100;
            // }
          }
          if (--runningEvent < 0) {
            runningEvent = 0
          }
          return offset
        }
      }
    })
    // Auto Save Draft
    // inserted.atwho
    .on('keyup', function () {
      const content = $editor.val() as string
      drafts[currentDraftId] = content
      LS['draft-' + currentDraftId] = JSON.stringify(content)
      $current.text(makeTitle(content, currentDraftId))
    })
    .focus()
    // Sorcery
    .data('atwho').on_keydown = function (e: KeyboardEvent) {
      const extraKeys = [192, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 189, 187, 219, 221, 186, 222, 188, 190, 191, 106, 107, 109, 110, 111, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105]
      if (((e.keyCode >= 65 && e.keyCode <= 90) || extraKeys.indexOf(e.keyCode) !== -1) && !e.metaKey) {
        ++runningEvent
      }

      const app = this as unknown as AtWhoApp
      const view = app.controller()?.view
      if (!(view && view.visible())) {
        runningEvent = 0 // when writing english or using system IM, keep event to 0.
        return
      }
      switch (e.keyCode) {
        case KEY_CODE.ESC:
          e.preventDefault()
          view.hide()
          break
        case KEY_CODE.UP:
          e.preventDefault()
          view.prev()
          break
        case KEY_CODE.DOWN:
          e.preventDefault()
          view.next()
          break
        case KEY_CODE.P:
          if (!e.ctrlKey) {
            return
          }
          e.preventDefault()
          view.prev()
          break
        case KEY_CODE.N:
          if (!e.ctrlKey) {
            return
          }
          e.preventDefault()
          view.next()
          break
        case KEY_CODE.TAB:
        case KEY_CODE.ENTER:
        case KEY_CODE.SPACE:

          if (!view.visible()) {
            return
          }
          e.preventDefault()

          const chooseFunc = function () {
            // trying commit
            if (runningEvent < 1) {
              // commit
              view.choose.call(view)
            } else {
              // delaying, still processing
              setTimeout(chooseFunc, 50)
            }
          }
          chooseFunc()
          break
        default:
          $.noop()
      }
    }

  $('.content').on('click', function () {
    $editor.focus()
  })

  $.fn.swipe.defaults.excludedElements = 'label, button, input, select, a, .noSwipe'

  $('body').swipe({
    swipeLeft: toggleLanguage,
    swipeRight: toggleLanguage,
    fallbackToMouseEvents: false,
    allowPageScroll: 'vertical'
  })
})

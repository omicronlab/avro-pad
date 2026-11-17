/// <reference types="jquery" />

// Globals exposed by the vendored classic scripts loaded in index.html.
declare const $: JQueryStatic
declare const jQuery: JQueryStatic

interface AvroSuggestion {
  words: string[]
  prevSelection?: number
}

interface AvroPhoneticInstance {
  suggest(query: string): AvroSuggestion
  commit(query: string, value: string): void
  candidate(query: string): string | undefined
}

declare const AvroPhonetic: new (
  loadCandidateSelections: () => Record<string, string>,
  saveCandidateSelections: (selections: Record<string, string>) => void,
) => AvroPhoneticInstance

interface Device {
  mobile(): boolean
  tablet(): boolean
  desktop(): boolean
}

declare const device: Device

interface AtWhoView {
  $el: JQuery
  visible(): boolean
  hide(): void
  prev(): void
  next(): void
  choose(): void
}

interface AtWhoController {
  view: AtWhoView
}

interface AtWhoApp {
  query: { text: string }
  view: AtWhoView
  controller(): AtWhoController | undefined
  on_keydown: (event: KeyboardEvent) => void
}

interface SwipePlugin {
  (options?: Record<string, unknown>): JQuery
  defaults: { excludedElements: string }
}

interface JQuery<TElement = HTMLElement> {
  autosize(options?: Record<string, unknown>): this
  atwho(options?: Record<string, unknown>): this
  swipe: SwipePlugin
}

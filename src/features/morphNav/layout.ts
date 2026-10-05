/**
 * Layout constants shared by the morphing navigation and the page shell.
 *
 * The desktop sidebar is fixed and 17rem wide from the `xl` breakpoint (80rem).
 * Every consumer that has to make room for it (home content, footer, the
 * scroll cue) reads these literal class strings so the offset lives in one place.
 * Keep them as full literals: Tailwind v4 only generates classes it can see in source.
 */
export const SIDEBAR_WIDTH_CLASS = 'w-[17rem]'

/** Applied to the home content and footer at xl+ (17rem sidebar + 2rem gutter). */
export const SIDEBAR_CONTENT_OFFSET_CLASS = 'xl:ml-[17rem] xl:pl-8'

/** Below xl the floating menu button (56px, bottom-left) would cover the end of the page; this clears it. */
export const FLOATING_MENU_CLEARANCE_CLASS = 'max-xl:pb-[calc(5rem+env(safe-area-inset-bottom))]'

/** Re-centres a viewport-centred element inside the offset column: (17rem + 2rem) / 2. */
export const SIDEBAR_RECENTER_CLASS = 'xl:-translate-x-[9.5rem]'

/** Media query matching the desktop sidebar breakpoint (Tailwind `xl`). */
export const SIDEBAR_MEDIA_QUERY = '(min-width: 80rem)'

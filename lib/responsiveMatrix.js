/**
 * Canonical responsive verification matrix for Bookit 5s Arena.
 *
 * Phase 4 — 2026-04-28
 * Architect: Kholofelo "Robyn" Rababalela
 *
 * This module is the single source of truth for which device tiers the
 * platform must work on, what each tier's behaviour contract is, and which
 * components are critical to each tier. Phase 5 (NavBar mobile fix) and
 * Phase 6 (full site audit) consume these constants.
 *
 * Tier 1 (entry Android, 360px) is the PRIMARY target. The product serves a
 * South African township user base where entry-level Android on 3G/4G is the
 * dominant device class. Tier ordering is therefore by who-we-serve-first,
 * not by viewport width ascending.
 *
 * See STRUCTURE/04-Updates/2026-04-28 - Phase 4 - Responsive Matrix.md for
 * audit data and Phase 5/6 target lists.
 */

export const DEVICE_TIERS = {
  TIER_1_ENTRY_ANDROID: {
    label: 'Entry Android',
    priority: 'PRIMARY',
    viewport: { width: 360, height: 640, orientation: 'portrait' },
    tailwindBreakpoint: 'default',
    networkProfile: '3G_INTERMITTENT',
    realisticBandwidthMbps: 1.5,
    minTapTarget: 44,
    minFontSize: 14,
    maxHorizontalScroll: 0,
    rationale:
      'Most common device class for South African township users. Pillar 2 (Community / Fellowship) requires this tier serve first.',
  },
  TIER_2_MIDRANGE_SMARTPHONE: {
    label: 'Mid-range Smartphone',
    priority: 'HIGH',
    viewport: { width: 414, height: 896, orientation: 'portrait' },
    tailwindBreakpoint: 'default',
    networkProfile: '4G_5G_STABLE',
    realisticBandwidthMbps: 15,
    minTapTarget: 44,
    minFontSize: 14,
    maxHorizontalScroll: 0,
    rationale:
      'iPhone 14/15, Samsung S-series, Pixel. Tier 1 contract plus visual polish (proper spacing, brand presentation, animations honoured).',
  },
  TIER_3_PHONE_LANDSCAPE: {
    label: 'Phone Landscape',
    priority: 'HIGH',
    viewport: { width: 812, height: 375, orientation: 'landscape' },
    tailwindBreakpoint: 'sm',
    networkProfile: 'SAME_AS_DEVICE',
    realisticBandwidthMbps: 10,
    minTapTarget: 44,
    minFontSize: 14,
    maxHorizontalScroll: 0,
    rationale:
      'Same hardware as Tier 1+2 rotated. NavBar must remain reachable. Dense forms must not require vertical scroll for primary action.',
  },
  TIER_4_TABLET: {
    label: 'Tablet',
    priority: 'MEDIUM',
    viewport: { width: 768, height: 1024, orientation: 'portrait' },
    tailwindBreakpoint: 'md',
    networkProfile: 'WIFI_TYPICAL',
    realisticBandwidthMbps: 50,
    minTapTarget: 44,
    minFontSize: 14,
    maxHorizontalScroll: 0,
    rationale:
      'iPad, Galaxy Tab, Huawei MatePad. Hybrid layout — should not serve cramped mobile or gappy desktop. Tablet-specific breakpoint required.',
  },
  TIER_5_LAPTOP: {
    label: 'Laptop',
    priority: 'MEDIUM',
    viewport: { width: 1366, height: 768, orientation: 'landscape' },
    tailwindBreakpoint: 'lg',
    networkProfile: 'WIFI_ETHERNET',
    realisticBandwidthMbps: 100,
    minTapTarget: 32,
    minFontSize: 14,
    maxHorizontalScroll: 0,
    rationale:
      'Most common dev / admin / venue-operator workstation. The tier currently working — Phase 4+ must not regress it.',
  },
  TIER_6_DESKTOP_LARGE: {
    label: 'Desktop / Large',
    priority: 'LOW',
    viewport: { width: 1920, height: 1080, orientation: 'landscape' },
    tailwindBreakpoint: '2xl',
    networkProfile: 'WIFI_ETHERNET',
    realisticBandwidthMbps: 200,
    minTapTarget: 32,
    minFontSize: 14,
    maxHorizontalScroll: 0,
    maxContentWidth: 1440,
    rationale:
      'External monitor / modern desktop. Cap content width so line lengths stay readable.',
  },
};

export const TAILWIND_BREAKPOINT_MAP = {
  default: '< 640px (Tier 1 + Tier 2 portrait)',
  sm: '640px+ (Tier 3 phone landscape, lower tablets)',
  md: '768px+ (Tier 4 tablet)',
  lg: '1024px+ (Tier 5 laptop)',
  xl: '1280px+ (Tier 5 laptop large)',
  '2xl': '1536px+ (Tier 6 desktop)',
};

/**
 * Components whose responsive behaviour must be verified at every tier.
 * A break in any of these on Tier 1 is a P0 — the user cannot navigate.
 */
export const CRITICAL_COMPONENTS = [
  'components/Header.jsx',
  'components/BottomNavbar.jsx',
  'components/manager/ManagerNavbar.jsx',
  'components/Footer.jsx',
  'components/SearchModal.jsx',
  'components/RoleSwitcher.jsx',
  'components/BookingForm.jsx',
  'components/CourtCard.jsx',
  'components/home/HeroSection.jsx',
  'components/home/CourtsSection.jsx',
  'components/home/TournamentSection.jsx',
  'components/home/TournamentShowcase.jsx',
  'components/fixtures/ArenaFixturesExperience.jsx',
  'components/fixtures/PremierLeagueFixturesHub.jsx',
];

export const KNOWN_FAILURE_MODES = {
  TIER_1_ENTRY_ANDROID: [
    'Horizontal scroll from elements wider than 360px',
    'Tap targets smaller than 44×44px',
    'Text smaller than 14px (especially nav labels and form helper text)',
    'Hamburger menu not opening or trapped behind z-index',
    'Modals overflowing viewport (right edge clipped, close button unreachable)',
    'Form inputs without sufficient touch padding (<12px vertical)',
    'Sticky headers consuming >15% of viewport height',
    'Bottom-positioned CTAs hidden behind floating dock or browser chrome',
  ],
  TIER_2_MIDRANGE_SMARTPHONE: [
    'Same as Tier 1',
    'Animations dropping frames on lower-mid Android (e.g., A52)',
    'Image lazy-loading flicker on slow scroll',
  ],
  TIER_3_PHONE_LANDSCAPE: [
    'Hamburger menu cut off by safe-area-insets',
    'Dense forms requiring vertical scroll to reach submit',
    'Tournament tables overflowing horizontally without scroll affordance',
    'Sticky headers consuming >25% of viewport height',
  ],
  TIER_4_TABLET: [
    'Mobile single-column layout serving cramped reading experience',
    'Desktop multi-column layout serving gappy whitespace',
    'Touch targets shrinking to desktop sizes (32px) when md: kicks in',
    'NavBar collapsing to hamburger when there is room for inline tabs',
  ],
  TIER_5_LAPTOP: [
    'Content overflowing viewport at 1366×768',
    'Modal heights exceeding viewport',
    'Hover states required to discover navigation',
  ],
  TIER_6_DESKTOP_LARGE: [
    'Line lengths exceeding 80ch and harming readability',
    'Hero sections stretched without max-width cap',
    'Image grids becoming sparse without column-count adjustment',
  ],
};

/**
 * Manual verification flow per tier. A tester (Architect or Claude Code in
 * dev-server mode using Chrome DevTools device emulation) walks this path
 * to certify the tier.
 */
export const VERIFICATION_FLOWS = {
  TIER_1_ENTRY_ANDROID: [
    'Open / as guest. Header visible, no horizontal scroll, hamburger tappable.',
    'Open mobile drawer. All 5 nav items reachable without scroll.',
    'Tap Book → courts grid renders, BOOK NOW button is full tap target.',
    'Open /tournament. Bracket renders without horizontal overflow.',
    'Open /fixtures. Tabs scrollable, no clipped edges.',
    'Open /login. Form fields ≥48px tall, submit reachable without keyboard cover.',
  ],
  TIER_2_MIDRANGE_SMARTPHONE: [
    'Run Tier 1 flow.',
    'Confirm hero animations render at 60fps.',
    'Confirm court images load above the fold without layout shift.',
  ],
  TIER_3_PHONE_LANDSCAPE: [
    'Rotate device to landscape on /.',
    'Confirm header height ≤25% viewport.',
    'Open hamburger — confirm full menu visible without inner scroll.',
    'Open /tournament/standings — confirm group tables either fit or scroll horizontally with affordance.',
  ],
  TIER_4_TABLET: [
    'Open / on iPad portrait. Hero, courts, fixtures sized for tablet (not stretched mobile).',
    'Open /admin/dashboard as admin. Sidebar + content layout uses md: breakpoint.',
    'Confirm no hamburger when inline nav fits.',
  ],
  TIER_5_LAPTOP: [
    'Open / at 1366×768. All sections render without vertical overflow on a single hero viewport.',
    'Open /admin/competitions. Tables use full width with appropriate column priorities.',
  ],
  TIER_6_DESKTOP_LARGE: [
    'Open / at 1920+. Confirm content max-width cap engaged.',
    'Confirm hero text not stretched edge-to-edge.',
  ],
};

export const MATRIX_VERSION = '1.0.0';
export const MATRIX_LAST_UPDATED = '2026-04-28';

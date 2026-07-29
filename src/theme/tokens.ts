// Design tokens — extracted from actual Figma component usage (NOT the sample
// "Color palette - Blue" frame, which is unused). Values confirmed via MCP sweep.
// Two cyans coexist by role: `primary` (buttons) vs `selected` (chips/pagination).

export const tokens = {
  color: {
    // brand
    primary: "#2fc4d1", // filled buttons
    primaryHover: "#74cfe2", // button hover (lighter)
    primaryPressed: "#0f59a3", // button pressed / navy accent
    selected: "#11acd0", // selected state (chip / pagination)
    selectedBg: "#d6eaf7", // selected surface (outline-selected / selected chip)
    selectedBorder: "#abcce5", // selected chip border (17:442)
    navy: "#0f59a3",
    accentBlue: "#0165e2", // IconTab selected + tinted card border (151:1045 / 161:638)
    ink: "#1c1b1f", // near-black label/title text (151:1043 IconTab, list titles)
    // neutrals
    border: "#e2eaf0",
    borderMuted: "#c1d0db",
    text: "#527086",
    textSecondary: "#8596a3",
    paginationMuted: "#bcc1c5", // boxed pagination unselected numerals (17:499/500)
    disabled: "#c8d1d7",
    tagGray: "#636870", // solid gray pill tag (58:1066 인기종목)
    bg: "#f2f7fa",
    white: "#ffffff",
    // molecule surfaces (tier 2)
    iconTabSelectedBg: "#edf4fa", // IconTab selected background (151:1045)
    cardTinted: "#f6fbff", // BaseCard tinted background (161:638)
    cardBorder: "#dbdbdb", // BaseCard plain border (156:623)
    iconMuted: "#d9d9d9", // IconTab default (unselected) icon (151:1043)
    iconBoxBg: "#dae9ff", // ListRow leading icon box (127:2355)
    borderGray: "#c0c0c0", // IconTab default border (151:1043)
    mutedGray: "#b4b4b4", // NewsTab unselected text (127:499)
    subtleText: "#626262", // ListRow sub-labels (127:2355)
    iconTabHoverBg: "#f3f3f3", // IconTab hover background (151:1275)
    ctaHover: "#0095b7", // CtaButton hover fill (112:1130)
    // calendar (tier 3, 17:888) — Active endpoint = selected #11acd0 (pixel-confirmed)
    calText: "#1e1e1e", // current-month day number
    calWeekday: "#757575", // Su–Sa weekday header
    calDisabled: "#b3b3b3", // other-month / disabled day
    calInRange: "#f5f5f5", // in-range fill (between endpoints)
    calHover: "#bbe5ef", // day hover fill (105:850)
    // login screen (92:624)
    loginTitle: "#4f4f4f", // 로그인 title (92:645)
    loginLabel: "#6f6f6f", // field labels 이름/비밀번호 (92:646)
    loginFieldBorder: "#d8d8d8", // field border (92:647)
    loginLink: "#a9a9a9", // footer links (92:652)
    loginSeparator: "#f4f4f4", // link separator |
    loginWordmark: "#42576c", // Marsh Mallow brand wordmark (92:671)
    //login screen added(07/29)
    loginOauthBorder: "#e6e6e6", // 간편로그인 버튼 보더 (782:4358)
    loginOauthText: "#8b8b8b", // "Google로 로그인" 라벨 (782:4360)
    // precision-qa deep-audit corrections
    calBorder: "#d9d9d9", // RangeCalendar container border (17:888)
    chipFilledGrayBg: "rgba(200,209,215,0.62)", // filled gray tag bg (58:1066)
    newsTitle: "#3f3f3f", // ListRow news title (124:358)
    holdingsSub: "#bab3b3", // ListRow holdings sub-label (127:2358)
  },
  radius: 8, // buttons (14:359)
  radiusField: 10, // chips & filled search fields (17:441 / 16:395)
  radiusCard: 17, // BaseCard (156:623 / 161:638)
  fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
} as const;

export type Tokens = typeof tokens;

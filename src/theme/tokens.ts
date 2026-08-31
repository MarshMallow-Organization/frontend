// Design tokens — extracted from actual Figma component usage (NOT the sample
// "Color palette - Blue" frame, which is unused). Values confirmed via MCP sweep.
// Two cyans coexist by role: `primary` (buttons) vs `selected` (chips/pagination).

export const tokens = {
  color: {
    // brand
    primary: '#2fc4d1', // filled buttons
    primaryHover: '#74cfe2', // button hover (lighter)
    primaryPressed: '#0f59a3', // button pressed / navy accent
    selected: '#11acd0', // selected state (chip / pagination)
    selectedBg: '#d6eaf7', // selected surface (outline-selected / selected chip)
    selectedBorder: '#abcce5', // selected chip border (17:442)
    navy: '#0f59a3',
    accentBlue: '#0165e2', // IconTab selected + tinted card border (151:1045 / 161:638)
    ink: '#1c1b1f', // near-black label/title text (151:1043 IconTab, list titles)
    // neutrals
    border: '#e2eaf0',
    borderMuted: '#c1d0db',
    text: '#527086',
    textSecondary: '#8596a3',
    paginationMuted: '#bcc1c5', // boxed pagination unselected numerals (17:499/500)
    disabled: '#c8d1d7',
    tagGray: '#636870', // solid gray pill tag (58:1066 인기종목)
    bg: '#f2f7fa',
    white: '#ffffff',
    // molecule surfaces (tier 2)
    iconTabSelectedBg: '#edf4fa', // IconTab selected background (151:1045)
    cardTinted: '#f6fbff', // BaseCard tinted background (161:638)
    cardBorder: '#dbdbdb', // BaseCard plain border (156:623)
    iconMuted: '#d9d9d9', // IconTab default (unselected) icon (151:1043)
    iconBoxBg: '#dae9ff', // ListRow leading icon box (127:2355)
    borderGray: '#c0c0c0', // IconTab default border (151:1043)
    mutedGray: '#b4b4b4', // NewsTab unselected text (127:499)
    subtleText: '#626262', // ListRow sub-labels (127:2355)
    iconTabHoverBg: '#f3f3f3', // IconTab hover background (151:1275)
    ctaHover: '#0095b7', // CtaButton hover fill (112:1130)
    // calendar (tier 3, 17:888) — Active endpoint = selected #11acd0 (pixel-confirmed)
    calText: '#1e1e1e', // current-month day number
    calWeekday: '#757575', // Su–Sa weekday header
    calDisabled: '#b3b3b3', // other-month / disabled day
    calInRange: '#f5f5f5', // in-range fill (between endpoints)
    calHover: '#bbe5ef', // day hover fill (105:850)
    // login screen (92:624)
    loginTitle: '#4f4f4f', // 로그인 title (92:645)
    loginLabel: '#6f6f6f', // field labels 이름/비밀번호 (92:646)
    loginFieldBorder: '#d8d8d8', // field border (92:647)
    loginLink: '#a9a9a9', // footer links (92:652)
    loginSeparator: '#f4f4f4', // link separator |
    loginWordmark: '#42576c', // Marsh Mallow brand wordmark (92:671)
    //login screen added(07/29)
    loginOauthBorder: '#e6e6e6', // 간편로그인 버튼 보더 (782:4358)
    loginOauthText: '#8b8b8b', // "Google로 로그인" 라벨 (782:4360)
    // signup screen (356:1871)
    signupLabel: '#9a9a9a', // 필드 라벨 (356:1897)
    signupRequired: '#dd6e6e', // 필수 표시 * (356:1905)
    signupFieldLine: '#d9d9d9', // 필드 밑줄 (356:1901)
    signupCardShadow: 'rgba(0,0,0,0.3)', // 입력 카드 그림자 (356:1896)
    signupDivider: '#e0e0e0', // 간편로그인 구분선 (356:1914)
    signupDividerText: '#afafaf', // "간편로그인" (356:1916)
    // precision-qa deep-audit corrections
    calBorder: '#d9d9d9', // RangeCalendar container border (17:888)
    chipFilledGrayBg: 'rgba(200,209,215,0.62)', // filled gray tag bg (58:1066)
    newsTitle: '#3f3f3f', // ListRow news title (124:358)
    holdingsSub: '#bab3b3', // ListRow holdings sub-label (127:2358)
    // trade journal (매수/매도 뱃지·카드)
    sell: '#e85d5d', // SELL badge / card accent
    sellBg: '#fff5f5', // SELL card soft fill
    buyBadge: '#11acd0', // BUY badge (= selected cyan)
    // 홈/내 계좌 (등락률 표시, 국내 관행: 상승=빨강/하락=파랑)
    priceUp: '#e6483d', // 상승(양수 등락률)
    priceDown: '#3b82f6', // 하락(음수 등락률)
    // 가상계좌 폴더 트리맵 팔레트 (Figma 339:1043 히트맵 그룹)
    heatmapPink: 'rgba(241,181,181,0.8)',
    heatmapPinkSoft: 'rgba(241,181,181,0.5)',
    heatmapBlue: '#bde8f2',
    heatmapGreen: '#e5f3da',
    // 숨기기 목록 아이콘 박스 (Figma 339:1317: 테슬라=blue accentBlue, 인텔=amber)
    hideIconAmber: '#bf6a02',
    // 기업 상세 화면 (Figma 385:2425, 거래 팝업 834:7018)
    stockAppBg: '#e9eff3',
    stockPanelBg: '#eef5ff',
    stockCardBorder: '#d3d3d3',
    stockPlaceholder: '#d9d9d9',
    stockArticlePlaceholder: '#626262',
    stockMuted: '#9e9e9e',
    stockMeta: '#919191',
    stockPositive: '#4ace55',
    stockSoftCyan: '#d9f2f7',
    stockCyanText: '#008792',
    stockAiText: '#888888',
    stockArticleMeta: '#939393',
    stockMetricBlue: '#3478f6',
    stockMetricGreen: '#2e9b6f',
    stockMetricOrange: '#e08a00',
    stockMetricPurple: '#7a4ddb',
    stockMetricGreenBg: '#eaf8f1',
    stockMetricOrangeBg: '#fff4e4',
    stockMetricPurpleBg: '#f2ecff',
    stockDialogBorder: '#d4d4d4',
    stockDialogOptionBorder: '#b9b9b9',
    // 거래 팝업 리디자인 (Figma 834:7454 시장가 / 834:6742 지정가)
    tradePanelBorder: '#c5c5c5', // 종목정보·주문내역·호가창·주문 패널 카드 보더
    tradeSubCardBg: '#f5f5f5', // 주문 수량 / 예상 금액 내부 카드
    tradeSubCardBorder: '#dadada',
    tradeFieldBorder: '#cbcbcb', // 수량·호가 입력 박스 / 스테퍼 버튼
    tradeEmptyText: '#bbbbbb', // 주문 내역 없음 안내 문구
    tradeColHeader: '#646464', // 호가창 컬럼 헤더 (가격/수량)
    tradeAskBg: '#fff2f2', // 매도 호가 배경
    tradeAskText: '#ff6363',
    tradeBidBg: '#f0f8ff', // 매수 호가 배경
    tradeBidText: '#2097ff',
    tradeQtyCellBg: '#f5f5f5', // 호가창 수량 셀 배경
    tradeCurrentPrice: '#11acd0', // 호가창 현재가
    tradeBuyBg: '#defcff', // 시장가 매수 버튼
    tradeBuyBorder: '#02626a',
    tradeBuyText: '#02626a',
    tradeSellBg: '#ebffed', // 시장가 매도 버튼
    tradeSellBorder: '#00a30e',
    tradeSellText: '#006208',
    tradeTabActive: '#2fc4d1', // 시장가/지정가 활성 탭
    tradeTabInactive: '#b6b6b6',
    tradeSubLabel: '#777777', // 판매/구매 가능 수량 라벨
  },
  radius: 8, // buttons (14:359)
  radiusField: 10, // chips & filled search fields (17:441 / 16:395)
  radiusCard: 17, // BaseCard (156:623 / 161:638)
  fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif',
} as const;

export type Tokens = typeof tokens;

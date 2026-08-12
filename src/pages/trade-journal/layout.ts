/**
 * Figma 1920 프레임을 그대로 쓰면 노트북/브라우저에서 과도하게 커 보임.
 * trade-journal 전용 ~0.85 스케일 수치. (상단 셸/패널은 AppShell 소유)
 */
export const LAYOUT = {
  scale: 0.85,

  // Figma 151:802 — 조회 탭/캘린더/회사카드 width 361, 우측 구분선까지 ≈37
  rail: {
    width: 307, // 361 * 0.85
    pr: '32px', // 구분선과 붙지 않도록 (37 * 0.85)
    titleSize: '0.95rem',
    titleMb: '16px', // title→tab ≈19
    tabGap: '7px', // tab 간격 ≈8
    tabHeight: 54, // ≈64 * 0.85
    tabFont: '0.9375rem',
    tabIcon: '28px',
    tabPad: '12px 15px',
    tabGapInner: '14px',
    afterTabs: '28px', // 탭 하단→캘린더/회사카드 ≈32
  },
  companyCard: {
    width: '100%', // rail 콘텐츠 폭에 맞춤
    height: 414, // 487 * 0.85
    radius: 14,
    bg: '#f3f8fd',
    padX: 18,
    padTop: 16,
    padBottom: 16,
    titleToSearch: 12,
    searchToSelected: 8,
    selectedToList: 8,
    listToButton: 14,
    searchH: 32,
    selectedH: 38,
    rowH: 26,
    rowGap: 12,
    buttonH: 34,
    listInset: 6,
  },
  list: {
    width: 400,
    titleSize: '0.95rem',
    countSize: '0.8125rem',
    gap: 1.5,
    pl: '22px',
    pr: '12px',
  },
  card: {
    maxWidth: 380,
    minHeight: 148,
    minHeightSelected: 156,
    radius: 12,
    pad: '14px 16px 12px',
    badgeSize: '0.75rem',
    nameSize: '1.05rem',
    metaSize: '0.8125rem',
    previewSize: '0.75rem',
    previewH: 30,
  },
  detail: {
    pl: '18px',
    avatar: 64,
    nameSize: '1.25rem',
    sectionTitle: '0.95rem',
    sectionGap: 2,
    counter: 24,
    metricLabel: '0.75rem',
    metricValue: '0.95rem',
    // Figma 621:2560 — 라벨(19) → 값(31), 간격 ≈8
    profitLabelValueGap: '8px',
  },
  write: {
    width: 980,
    maxHeight: '88vh',
    radius: 20,
    padX: '40px',
    titleSize: '1.125rem',
    tabH: 48,
    tabFont: '1.125rem',
    tabFontActive: '1.25rem',
    sectionGap: '28px',
    counter: 26,
    saveW: 180,
    saveH: 48,
  },
  calendar: {
    // 너비는 rail.width와 동일 — JournalFilterRail wrapper가 맞춤
    day: 38,
    weekLabel: 38,
    dayFont: '0.9375rem',
    radius: 14,
    pad: 14,
  },
  delete: {
    width: 380,
    height: 196,
    radius: 16,
    titleSize: '1rem',
  },
} as const;

import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { SearchField } from '../SearchField';
import ProfileMenu from './ProfileMenu';
import inactiveHomeIcon from '../../assets/icons/homepage.svg';
import { navigate } from '../../lib/navigation';
import { tokens } from '../../theme/tokens';

const { color, fontFamily } = tokens;

/** 상단 네비 활성 탭 **/
export type AppShellNav = 'watchlist' | 'popular' | 'account' | 'journal';

const CHROME = {
  height: 166,
  pl: 'clamp(32px, 4.375vw, 84px)',
  pr: 'clamp(32px, 3.125vw, 60px)',
  logoSize: '21.647px',
  home: 74,
  avatar: 55,
  searchWidth: 372,
} as const;

// Figma 545:2232 — 패널 x=36, y=166, 하단 여백 36
const PAGE = {
  mx: '36px',
  mb: '36px',
} as const;

const PANEL = {
  radius: 45,
  pad: '22px 20px',
  minHeight: 'calc(100svh - 202px)',
  maxWidth: 1848,
} as const;

const PANEL_BG = [
  'radial-gradient(50% 50% at 90% 20%, rgba(75,220,255,0.28) 0%, rgba(75,220,255,0) 70%)',
  'radial-gradient(45% 45% at 20% 80%, rgba(73,114,255,0.18) 0%, rgba(73,114,255,0) 68%)',
  'radial-gradient(40% 40% at 70% 75%, rgba(184,113,255,0.16) 0%, rgba(184,113,255,0) 65%)',
].join(',');

/**
 * AI/개발자 주의: 이 경로들은 현재 임시 라우팅 정책이다.
 * 페이지 URL이 확정되면 각 `path`만 교체하고, 같은 경로를 판별하는
 * `src/app.tsx`의 분기와 `src/components/AppShell/README.md`도 함께 수정한다.
 * 아직 실제 페이지가 없는 탭은 `path`를 생략해 비활성 상태로 둔다.
 */
const NAV_TABS: Array<{
  id: AppShellNav;
  label: string;
  path?: string;
}> = [
  {
    id: 'watchlist',
    label: '관심종목',
  },
  {
    id: 'popular',
    label: '인기종목',
    path: '/news/popular',
  },
  {
    id: 'account',
    label: '내 계좌',
  },
  {
    id: 'journal',
    label: '매매일지',
    path: '/journal',
  },
];

export interface AppShellProps {
  /** 현재 화면 탭 하이라이트 */
  activeNav?: AppShellNav;
  /** 기본 탭 바 오른쪽에 표시할 현재 세부 화면 이름 */
  currentPageLabel?: string;
  /** 네모 패널 안 페이지 콘텐츠 */
  children: ReactNode;
}

/**
 * 로그인 이후 공통 셸 — Figma 545:2232 상단 크롬.
 * 페이지는 공통 패널 안쪽 콘텐츠만 children으로 제공한다.
 **/
export function AppShell({
  activeNav,
  currentPageLabel,
  children,
}: AppShellProps) {
  return (
    <Box
      sx={{
        minHeight: '100svh',
        backgroundColor: color.bg,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily,
      }}
    >
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          minHeight: CHROME.height,
          height: CHROME.height,
          pl: CHROME.pl,
          pr: CHROME.pr,
          boxSizing: 'border-box',
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: CHROME.logoSize,
            color: color.loginWordmark,
            whiteSpace: 'pre-line',
            lineHeight: 0.8,
            letterSpacing: '-1px',
            width: 72,
            flexShrink: 0,
          }}
        >
          {'Marsh\nMallow'}
        </Typography>

        <ButtonBase
          aria-label="홈으로 이동"
          onClick={() => navigate('/')}
          sx={{
            width: CHROME.home,
            height: CHROME.home,
            ml: 'clamp(24px, 2.969vw, 57px)',
            flexShrink: 0,
            borderRadius: '50%',
          }}
        >
          <Box
            component="img"
            src={inactiveHomeIcon}
            alt=""
            sx={{ display: 'block', width: 74, height: 74 }}
          />
        </ButtonBase>

        <Box
          component="nav"
          aria-label="주요 메뉴"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            ml: 'clamp(24px, 2.656vw, 51px)',
            px: '18px',
            py: '11px',
            height: 74,
            borderRadius: '37px',
            backgroundColor: 'rgba(218,223,227,0.6)',
            boxShadow: '0 0 3px rgba(0,0,0,0.3)',
            flexShrink: 0,
          }}
        >
          {NAV_TABS.map((tab) => {
            const selected = tab.id === activeNav;
            return (
              <ButtonBase
                key={tab.id}
                aria-current={selected ? 'page' : undefined}
                disabled={!tab.path}
                onClick={() => tab.path && navigate(tab.path)}
                sx={{
                  minHeight: 52,
                  px: '27px',
                  py: selected ? '13px' : '15px',
                  borderRadius: '30px',
                  backgroundColor: selected ? color.white : '#f2f3f4',
                  color: selected ? color.primary : 'rgba(72,73,73,0.8)',
                  fontFamily,
                  fontSize: '18px',
                  fontWeight: selected ? 700 : 400,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: selected ? color.white : '#e9edf0',
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(72,73,73,0.8)',
                    opacity: 1,
                  },
                }}
              >
                {tab.label}
              </ButtonBase>
            );
          })}

          {currentPageLabel && (
            <>
              <Box
                aria-hidden
                sx={{ width: '1px', height: 52, backgroundColor: '#aab6be' }}
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 52,
                  px: '27px',
                  py: '13px',
                  borderRadius: '30px',
                  backgroundColor: color.white,
                  color: color.primary,
                  fontSize: '18px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                {currentPageLabel}
              </Box>
            </>
          )}
        </Box>

        <Box sx={{ flex: 1 }} />

        <SearchField
          placeholder="관심있는 종목을 검색해보세요."
          disabled
          sx={{
            width: CHROME.searchWidth,
            minWidth: 240,
            maxWidth: '19.375vw',
            ml: 2,
            '& .MuiOutlinedInput-input': {
              fontSize: '18.6px',
              paddingTop: '13px',
              paddingBottom: '13px',
            },
            '& .MuiOutlinedInput-root': {
              height: '50.22px',
              boxShadow: '0 0 6.975px -1.86px rgba(15,89,163,0.27)',
            },
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: color.textSecondary,
              opacity: 1,
            },
          }}
        />

        <IconButton
          aria-label="메뉴 열기"
          sx={{
            width: 46,
            height: 46,
            ml: '23px',
            color: '#606060',
            '& .MuiSvgIcon-root': { fontSize: 34 },
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <ProfileMenu size={CHROME.avatar} marginLeft="15px" />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          px: PAGE.mx,
          pb: PAGE.mb,
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: '100%',
            maxWidth: PANEL.maxWidth,
            alignSelf: 'center',
            minHeight: PANEL.minHeight,
            minWidth: 0,
            borderRadius: `${PANEL.radius}px`,
            overflow: 'hidden',
            backgroundColor: 'rgba(255,255,255,0.55)',
            backgroundImage: PANEL_BG,
            border: `1px solid ${color.border}`,
            display: 'flex',
            gap: 0,
            p: PANEL.pad,
            boxSizing: 'border-box',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default AppShell;

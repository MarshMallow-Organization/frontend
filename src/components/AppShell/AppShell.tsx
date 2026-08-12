import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { IconTab } from '../IconTab';
import { SearchField } from '../SearchField';
import { HomeIcon } from '../icons';
import { tokens } from '../../theme/tokens';

const { color, fontFamily } = tokens;

/** 상단 네비 활성 탭 **/
export type AppShellNav = 'watchlist' | 'popular' | 'account' | 'journal';

const CHROME = {
  minHeight: 88,
  px: 2.5,
  py: 1.25,
  logoSize: '1.05rem',
  homeBox: 56,
  homeIcon: 36,
  avatar: 40,
  searchMaxW: 300,
} as const;

// Figma 356:2088 — 패널 x=36, y=166 (탭바 하단 125 → 위 간격 41), 하단 여백 36
const PAGE = {
  mx: '36px',
  mt: '41px',
  mb: '36px',
} as const;

const PANEL = {
  radius: 32,
  pad: '22px 20px',
  minHeight: 'calc(100svh - 120px)',
  maxWidth: 1680,
} as const;

const PANEL_BG = [
  'radial-gradient(50% 50% at 90% 20%, rgba(75,220,255,0.28) 0%, rgba(75,220,255,0) 70%)',
  'radial-gradient(45% 45% at 20% 80%, rgba(73,114,255,0.18) 0%, rgba(73,114,255,0) 68%)',
  'radial-gradient(40% 40% at 70% 75%, rgba(184,113,255,0.16) 0%, rgba(184,113,255,0) 65%)',
].join(',');

const NAV_TABS: {
  id: AppShellNav;
  label: string;
  icon: ReactNode;
}[] = [
  {
    id: 'watchlist',
    label: '관심종목',
    icon: <StarBorderOutlinedIcon fontSize="inherit" />,
  },
  {
    id: 'popular',
    label: '인기종목',
    icon: <ShowChartOutlinedIcon fontSize="inherit" />,
  },
  {
    id: 'account',
    label: '내 계좌',
    icon: <AccountBalanceWalletOutlinedIcon fontSize="inherit" />,
  },
  {
    id: 'journal',
    label: '매매일지',
    icon: <CalendarMonthOutlinedIcon fontSize="inherit" />,
  },
];

export interface AppShellProps {
  /** 현재 화면 탭 하이라이트 */
  activeNav: AppShellNav;
  /** 네모 패널 안 페이지 콘텐츠 */
  children: ReactNode;
}

/**
 * 로그인 이후 공통 셸 — 상단 크롬.
 * 페이지는 자식페이지만 넣으면 된다. 탭 네비게이션 및 검색 라우터는 아직 미구현
 **/
export function AppShell({ activeNav, children }: AppShellProps) {
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
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: CHROME.px,
          py: CHROME.py,
          minHeight: CHROME.minHeight,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: CHROME.logoSize,
            color: color.loginWordmark,
            whiteSpace: 'pre-line',
            lineHeight: 1.15,
            width: 70,
          }}
        >
          {'Marsh\nMallow'}
        </Typography>

        <Box
          sx={{
            width: CHROME.homeBox,
            height: CHROME.homeBox,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
          aria-hidden
        >
          <HomeIcon sx={{ fontSize: CHROME.homeIcon, color: color.selected }} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.25,
            py: 0.75,
            borderRadius: '14px',
            backgroundColor: color.white,
            border: `1px solid ${color.border}`,
          }}
        >
          {NAV_TABS.map((tab) => {
            const selected = tab.id === activeNav;
            return (
              <IconTab
                key={tab.id}
                label={tab.label}
                icon={tab.icon}
                selected={selected}
                disabled={!selected}
                sx={{
                  minWidth: 88,
                  py: 0.75,
                  px: 1.25,
                  gap: 0.75,
                  fontSize: '0.8125rem',
                  opacity: selected ? 1 : 0.55,
                  '&.Mui-disabled': { opacity: 0.55 },
                  '& .IconTab-icon': { fontSize: '22px' },
                }}
              />
            );
          })}
        </Box>

        <Box sx={{ flex: 1 }} />

        <SearchField
          placeholder="관심있는 종목을 검색해보세요."
          disabled
          sx={{
            width: CHROME.searchMaxW,
            maxWidth: '28vw',
            '& .MuiOutlinedInput-input': {
              fontSize: '0.875rem',
              paddingTop: '10px',
              paddingBottom: '10px',
            },
          }}
        />

        <Avatar
          sx={{
            width: CHROME.avatar,
            height: CHROME.avatar,
            bgcolor: color.iconBoxBg,
            color: color.accentBlue,
            fontSize: '0.875rem',
          }}
        >
          U
        </Avatar>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          px: PAGE.mx,
          pt: PAGE.mt,
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

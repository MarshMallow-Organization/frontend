// Isolated single-component render for matched-scale drift verification.
// Open /#verify=<key>. figma-verify screenshots this next to the Figma node at
// the same scale so drift is judged large & side-by-side, not on a tiny full page.
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Switch } from '../components/Switch';
import { Fab } from '../components/Fab';
import { Select } from '../components/Select';
import { SearchField } from '../components/SearchField';
import { Pagination } from '../components/Pagination';
import { IconTab } from '../components/IconTab';
import { BaseCard } from '../components/BaseCard';
import { NewsTab } from '../components/NewsTab';
import { ListRow } from '../components/ListRow';
import { CtaButton } from '../components/CtaButton';
import { RangeCalendar } from '../components/RangeCalendar';
import LoginPage from './login';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';

const months = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`,
  value: i + 1,
}));

const noop = () => {};

// key → single element (as close to the Figma node's own bounds as possible)
const registry: Record<string, ReactNode> = {
  'button-filled': <Button appVariant="filled">Button</Button>,
  'button-outline': <Button appVariant="outline">Button</Button>,
  'button-outlineSelected': (
    <Button appVariant="outlineSelected">Button</Button>
  ),
  'chip-label': <Chip appVariant="outlineGray" label="Label" />,
  'chip-selected': <Chip appVariant="outlineCyan" label="Label" />,
  'pill-cyan': <Chip shape="pill" appVariant="filledCyan" label="시가 총액" />,
  'pill-gray': <Chip shape="pill" appVariant="filledGray" label="인기 종목" />,
  'switch-off': <Switch />,
  'switch-on': <Switch defaultChecked />,
  'fab-cyan': <Fab appVariant="cyanFilled" />,
  'fab-navy': <Fab appVariant="navyFilled" />,
  'fab-cyanOutline': <Fab appVariant="cyanOutline" />,
  'fab-navyOutline': <Fab appVariant="navyOutline" />,
  'select-month': <Select options={months} value={7} />,
  'search-pill': (
    <Box sx={{ width: 508 }}>
      <SearchField appVariant="pill" mic />
    </Box>
  ),
  'search-filled': (
    <Box sx={{ width: 508 }}>
      <SearchField appVariant="filled" mic />
    </Box>
  ),
  'search-right': (
    <Box sx={{ width: 508 }}>
      <SearchField appVariant="filled" searchIconSide="right" />
    </Box>
  ),
  'pagination-container': (
    <Pagination appVariant="container" count={10} defaultPage={2} />
  ),
  'pagination-text': (
    <Pagination appVariant="text" count={10} defaultPage={2} />
  ),
  'pagination-boxedSquare': (
    <Pagination appVariant="boxedSquare" count={10} defaultPage={1} />
  ),
  'pagination-boxedCircular': (
    <Pagination appVariant="boxedCircular" count={10} defaultPage={1} />
  ),
  // molecules (tier 2)
  'icontab-default': (
    <IconTab icon={<CalendarMonthIcon />} label="날짜별 조회" />
  ),
  'icontab-selected': (
    <IconTab icon={<CalendarMonthIcon />} label="날짜별 조회" selected />
  ),
  'basecard-plain': <BaseCard sx={{ width: 320, height: 200 }} />,
  'basecard-tinted': (
    <BaseCard appVariant="tinted" sx={{ width: 320, height: 200 }} />
  ),
  newstab: (
    <NewsTab
      tabs={['인기 뉴스', '인기 뉴스', '인기 뉴스', '인기 뉴스']}
      value={1}
      onChange={noop}
    />
  ),
  'cta-default': <CtaButton>✨AI 재무 상태 체크</CtaButton>,
  'listrow-news': (
    <Box sx={{ width: 508 }}>
      <ListRow
        leading={
          <Box
            sx={{ width: 76, height: 76, bgcolor: '#d9d9d9', borderRadius: 1 }}
          />
        }
        title="TSLA"
        titleSx={{ color: '#3f3f3f', fontSize: 13 }} // 124:358 news title
        subtitle="FSD 수익화 본격화 시점 판단함. 로보 택시 기대감으로 분할 매수함."
        trailing={<Chip shape="pill" appVariant="filledGray" label="1일 전" />}
      />
    </Box>
  ),
  'listrow-holdings': (
    <Box sx={{ width: 320 }}>
      <ListRow
        leading={
          <Box
            sx={{ width: 34, height: 34, bgcolor: '#dae9ff', borderRadius: 1 }}
          />
        }
        title="898,975원"
        titleSx={{ fontSize: '1.25rem', fontWeight: 500 }} // 20px Medium (127:2357)
        subtitle="삼성 전자"
        subtitleSx={{ fontSize: '10px', color: '#bab3b3' }} // 127:2358 sub-label
        trailing={
          // 127:2359 송금 = gray filled chip (#eee bg, #626262 11px, r6, pad 10/4)
          <Box
            component="span"
            sx={{
              bgcolor: '#eee',
              color: '#626262',
              fontSize: 11,
              borderRadius: '6px',
              px: '10px',
              py: '4px',
            }}
          >
            송금
          </Box>
        }
      />
    </Box>
  ),
  'calendar-range': (
    <RangeCalendar
      value={[new Date(2026, 5, 9), new Date(2026, 5, 13)]}
      onChange={noop}
    />
  ),
  // full login screen (92:624) — fixed 1920×1080 frame for matched-scale verify
  login: (
    <Box sx={{ width: 1920, height: 1080, '& > *': { minHeight: '1080px' } }}>
      <LoginPage />
    </Box>
  ),
};

export default function ComponentsVerify({ vkey }: { vkey: string }) {
  const el = registry[vkey];
  return (
    <Box
      id="verify-root"
      sx={{
        display: 'inline-flex',
        p: 0,
        m: 0,
        bgcolor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {el ?? <span style={{ color: 'red' }}>unknown verify key: {vkey}</span>}
    </Box>
  );
}

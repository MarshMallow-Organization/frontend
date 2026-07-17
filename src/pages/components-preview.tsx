// TEMPORARY preview harness for visually diffing shared components against Figma.
// Not a routed/production page. Remove or gate before release.
import { useState } from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { Switch } from '../components/Switch';
import { Fab } from '../components/Fab';
import { Select } from '../components/Select';
import { SearchField } from '../components/SearchField';
import { TextField } from '../components/TextField';
import { Pagination } from '../components/Pagination';
import { IconTab } from '../components/IconTab';
import { BaseCard } from '../components/BaseCard';
import { NewsTab } from '../components/NewsTab';
import { ListRow } from '../components/ListRow';
import { CtaButton } from '../components/CtaButton';
import { RangeCalendar } from '../components/RangeCalendar';
import type { DateRange } from '../components/RangeCalendar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="overline" color="text.secondary">
        {title}
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', flexWrap: 'wrap' }}
      >
        {children}
      </Stack>
    </Box>
  );
}

const months = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`,
  value: i + 1,
}));

export default function ComponentsPreview() {
  const [month, setMonth] = useState<number | string>(7);
  const [newsTab, setNewsTab] = useState(1);
  const [range, setRange] = useState<DateRange>([
    new Date(2026, 5, 9),
    new Date(2026, 5, 13),
  ]);
  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#ffffff' }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Components Preview
      </Typography>

      <Section title="Button">
        <Button appVariant="filled">Button</Button>
        <Button appVariant="outline">Button</Button>
        <Button appVariant="outlineSelected">Button</Button>
        <Button appVariant="filled" disabled>
          Button
        </Button>
      </Section>

      <Section title="Chip / Label (rect, r10)">
        <Chip appVariant="outlineGray" label="Label" />
        <Chip appVariant="outlineCyan" label="Label" />
      </Section>
      <Section title="Chip / Tag (pill, 둥근)">
        <Chip shape="pill" appVariant="filledCyan" label="시가 총액" />
        <Chip shape="pill" appVariant="filledGray" label="인기 종목" />
        <Chip shape="pill" appVariant="outlineCyan" label="Label" />
      </Section>

      <Section title="Switch">
        <Switch />
        <Switch defaultChecked />
      </Section>

      <Section title="Fab / Add">
        <Fab appVariant="cyanFilled" />
        <Fab appVariant="cyanOutline" />
        <Fab appVariant="navyFilled" />
        <Fab appVariant="navyOutline" />
      </Section>

      <Section title="Select">
        <Select
          options={months}
          value={month}
          onChange={(e) => setMonth(e.target.value as number)}
        />
      </Section>

      <Section title="TextField (outlined / pill + label)">
        <Box sx={{ width: 240 }}>
          <TextField label="이름" placeholder="기본" />
        </Box>
        <Box sx={{ width: 320 }}>
          <TextField appVariant="pill" label="비밀번호" type="password" />
        </Box>
      </Section>

      <Section title="SearchField">
        <Box sx={{ width: 320 }}>
          <SearchField appVariant="pill" mic />
        </Box>
        <Box sx={{ width: 320 }}>
          <SearchField appVariant="filled" mic />
        </Box>
        <Box sx={{ width: 320 }}>
          <SearchField appVariant="filled" searchIconSide="right" />
        </Box>
      </Section>

      <Section title="Pagination — container (pag1)">
        <Pagination appVariant="container" count={10} defaultPage={2} />
      </Section>
      <Section title="Pagination — text (pag2)">
        <Pagination appVariant="text" count={10} defaultPage={2} />
      </Section>
      <Section title="Pagination — boxed square (pag3, r≈5)">
        <Pagination appVariant="boxedSquare" count={10} defaultPage={1} />
      </Section>
      <Section title="Pagination — boxed circular (pag4, r=40)">
        <Pagination appVariant="boxedCircular" count={10} defaultPage={1} />
      </Section>

      <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
        Molecules (Tier 2)
      </Typography>

      <Section title="IconTab (날짜별/회사별 조회)">
        <IconTab icon={<CalendarMonthIcon />} label="날짜별 조회" />
        <IconTab icon={<CalendarMonthIcon />} label="날짜별 조회" selected />
        <IconTab icon={<FormatListBulletedIcon />} label="회사별 조회" />
        <IconTab
          icon={<FormatListBulletedIcon />}
          label="회사별 조회"
          selected
        />
      </Section>

      <Section title="BaseCard (plain / tinted)">
        <BaseCard sx={{ width: 240, height: 120 }}>plain</BaseCard>
        <BaseCard appVariant="tinted" sx={{ width: 240, height: 120 }}>
          tinted
        </BaseCard>
      </Section>

      <Section title="NewsTab (인기 뉴스)">
        <NewsTab
          tabs={['인기 뉴스', '인기 뉴스', '인기 뉴스', '인기 뉴스']}
          value={newsTab}
          onChange={setNewsTab}
        />
      </Section>

      <Section title="ListRow (뉴스 / 보유종목)">
        <Box sx={{ width: 420 }}>
          <ListRow
            leading={
              <Box
                sx={{
                  width: 76,
                  height: 76,
                  bgcolor: '#d9d9d9',
                  borderRadius: 1,
                }}
              />
            }
            title="TSLA"
            titleSx={{ color: '#3f3f3f', fontSize: 13 }}
            subtitle="FSD 수익화 본격화 시점 판단함. 로보 택시 기대감으로 분할 매수함."
            trailing={
              <Chip shape="pill" appVariant="filledGray" label="1일 전" />
            }
          />
        </Box>
        <Box sx={{ width: 300 }}>
          <ListRow
            leading={
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: '#dae9ff',
                  borderRadius: 1,
                }}
              />
            }
            title="898,975원"
            titleSx={{ fontSize: '1.25rem', fontWeight: 500 }}
            subtitle="삼성 전자"
            subtitleSx={{ fontSize: '10px', color: '#bab3b3' }}
            trailing={
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
      </Section>

      <Section title="CtaButton (AI 재무 상태 체크)">
        <CtaButton>✨AI 재무 상태 체크</CtaButton>
      </Section>

      <Section title="RangeCalendar (범위 데이트픽커)">
        <RangeCalendar value={range} onChange={setRange} />
      </Section>
    </Box>
  );
}

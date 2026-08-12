import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { IconTab } from '../../../components/IconTab';
import { SearchIcon } from '../../../components/icons/SearchIcon';
import type { DateRange } from '../../../components/RangeCalendar';
import { JournalRangeCalendar } from './JournalRangeCalendar';
import type { ViewMode } from '../types';
import { tokens } from '../../../theme/tokens';
import { LAYOUT } from '../layout';

const { color, fontFamily } = tokens;
const { rail } = LAYOUT;
const COMPANY_CARD = LAYOUT.companyCard;

export interface JournalFilterRailProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  markedDates?: Date[];
  companies: { corpCode: string; corpName: string }[];
  selectedCorpCode: string | null;
  onCorpChange: (corpCode: string | null) => void;
}

export function JournalFilterRail({
  viewMode,
  onViewModeChange,
  dateRange,
  onDateRangeChange,
  markedDates,
  companies,
  selectedCorpCode,
  onCorpChange,
}: JournalFilterRailProps) {
  const [query, setQuery] = useState('');

  const selectedCompany =
    companies.find((c) => c.corpCode === selectedCorpCode) ?? null;

  const filteredCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.corpName.toLowerCase().includes(q) ||
        c.corpCode.toLowerCase().includes(q),
    );
  }, [companies, query]);

  return (
    <Box
      sx={{
        width: rail.width,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        fontFamily,
        pr: rail.pr,
        boxSizing: 'content-box',
      }}
    >
      <Typography
        sx={{
          fontSize: rail.titleSize,
          fontWeight: 600,
          color: color.ink,
          lineHeight: 1.3,
          mb: rail.titleMb,
        }}
      >
        조회 방식
      </Typography>

      <Stack spacing={rail.tabGap}>
        <IconTab
          label="날짜별 조회"
          icon={<CalendarMonthOutlinedIcon fontSize="inherit" />}
          selected={viewMode === 'date'}
          onClick={() => onViewModeChange('date')}
          sx={{
            width: '100%',
            height: rail.tabHeight,
            boxSizing: 'border-box',
            fontSize: rail.tabFont,
            gap: rail.tabGapInner,
            padding: rail.tabPad,
            '& .IconTab-icon': { fontSize: rail.tabIcon },
          }}
        />
        <IconTab
          label="회사별 조회"
          icon={<BusinessOutlinedIcon fontSize="inherit" />}
          selected={viewMode === 'company'}
          onClick={() => onViewModeChange('company')}
          sx={{
            width: '100%',
            height: rail.tabHeight,
            boxSizing: 'border-box',
            fontSize: rail.tabFont,
            gap: rail.tabGapInner,
            padding: rail.tabPad,
            '& .IconTab-icon': { fontSize: rail.tabIcon },
          }}
        />
      </Stack>

      {viewMode === 'date' ? (
        <Box
          sx={{
            mt: rail.afterTabs,
            width: '100%',
          }}
        >
          <JournalRangeCalendar
            value={dateRange}
            onChange={onDateRangeChange}
            markedDates={markedDates}
          />
        </Box>
      ) : (
        <Box
          sx={{
            mt: rail.afterTabs,
            width: '100%',
            height: COMPANY_CARD.height,
            boxSizing: 'border-box',
            borderRadius: `${COMPANY_CARD.radius}px`,
            border: `0.8px solid ${color.cardBorder}`,
            backgroundColor: COMPANY_CARD.bg,
            pt: `${COMPANY_CARD.padTop}px`,
            px: `${COMPANY_CARD.padX}px`,
            pb: `${COMPANY_CARD.padBottom}px`,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: '#414141',
              lineHeight: 1.2,
              mb: `${COMPANY_CARD.titleToSearch}px`,
            }}
          >
            빠른 회사 검색
          </Typography>

          <TextField
            fullWidth
            placeholder="회사명 또는 종목코드 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: '8px' }}>
                    <SearchIcon
                      sx={{
                        width: 16,
                        height: 16,
                        color: '#bcbcbc',
                      }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              mb: `${COMPANY_CARD.searchToSelected}px`,
              '& .MuiOutlinedInput-root': {
                height: COMPANY_CARD.searchH,
                borderRadius: '6px',
                backgroundColor: color.white,
                '& fieldset': {
                  borderColor: '#d7d7d7',
                  borderWidth: '0.7px',
                },
                '&:hover fieldset': { borderColor: '#d7d7d7' },
                '&.Mui-focused fieldset': {
                  borderColor: color.selected,
                  borderWidth: '1px',
                },
              },
              '& .MuiOutlinedInput-input': {
                fontSize: '12px',
                fontWeight: 400,
                color: '#393939',
                py: 0,
                '&::placeholder': {
                  color: '#bcbcbc',
                  opacity: 1,
                },
              },
            }}
          />

          {selectedCompany ? (
            <Box
              sx={{
                width: 'calc(100% + 12px)',
                height: COMPANY_CARD.selectedH,
                ml: '-6px',
                mb: `${COMPANY_CARD.selectedToList}px`,
                borderRadius: '24px',
                backgroundColor: 'rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                pl: '16px',
                pr: 2,
                boxSizing: 'border-box',
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: color.iconMuted,
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#393939',
                  lineHeight: 1.2,
                }}
              >
                {selectedCompany.corpName}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#a0a0a0',
                  lineHeight: 1.2,
                }}
              >
                {selectedCompany.corpCode}
              </Typography>
            </Box>
          ) : null}

          <Stack
            spacing={`${COMPANY_CARD.rowGap}px`}
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              pl: `${COMPANY_CARD.listInset}px`,
              mb: `${COMPANY_CARD.listToButton}px`,
            }}
          >
            {filteredCompanies.map((c) => {
              const selected = selectedCorpCode === c.corpCode;
              return (
                <Box
                  key={c.corpCode}
                  component="button"
                  type="button"
                  onClick={() => onCorpChange(selected ? null : c.corpCode)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: COMPANY_CARD.rowH,
                    border: 0,
                    background: 'transparent',
                    cursor: 'pointer',
                    p: 0,
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: color.iconMuted,
                      flexShrink: 0,
                      mr: '12px',
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#393939',
                      lineHeight: 1.2,
                      mr: '14px',
                    }}
                  >
                    {c.corpName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#a0a0a0',
                      lineHeight: 1.2,
                    }}
                  >
                    {c.corpCode}
                  </Typography>
                </Box>
              );
            })}
            {filteredCompanies.length === 0 ? (
              <Typography sx={{ fontSize: '12px', color: '#a0a0a0' }}>
                검색 결과가 없습니다.
              </Typography>
            ) : null}
          </Stack>

          <Box
            component="button"
            type="button"
            onClick={() => {
              setQuery('');
              onCorpChange(null);
            }}
            sx={{
              width: '100%',
              height: COMPANY_CARD.buttonH,
              borderRadius: '8px',
              border: '1px solid #d7d7d7',
              backgroundColor: COMPANY_CARD.bg,
              fontFamily,
              fontSize: '12px',
              fontWeight: 500,
              color: '#191919',
              cursor: 'pointer',
              flexShrink: 0,
              '&:hover': {
                backgroundColor: color.white,
              },
            }}
          >
            전체 회사 보기
          </Box>
        </Box>
      )}
    </Box>
  );
}

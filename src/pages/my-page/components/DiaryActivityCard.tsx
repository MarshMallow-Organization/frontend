import { useMemo, useState } from 'react';
import LightbulbOutlineRoundedIcon from '@mui/icons-material/LightbulbOutlineRounded';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import BaseCard from '../../../components/BaseCard/BaseCard';
import type {
  DiaryPreviewDto,
  DiaryType,
} from '../../../features/diaries/diariesApi';
import { tokens } from '../../../theme/tokens';
import { MY_PAGE_CARD_SX, MY_PAGE_CARD_TITLE_SX } from '../card-styles';
import { number, shortDate, won } from '../format';

interface DiaryActivityCardProps {
  diaries: DiaryPreviewDto[];
  loading: boolean;
  year: number;
  onYearChange: (year: number) => void;
}

type Filter = 'ALL' | DiaryType;
type Sort = 'LATEST' | 'AMOUNT';

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'SELL', label: '매도' },
  { value: 'BUY', label: '매수' },
];

function monthKey(value: string) {
  return value.slice(0, 7);
}

function monthFill(count: number) {
  if (count === 0) return 'rgba(230, 234, 238, 0.7)';
  if (count === 1) return 'rgba(47, 196, 209, 0.3)';
  return '#2FC4D1';
}

export default function DiaryActivityCard({
  diaries,
  loading,
  year,
  onYearChange,
}: DiaryActivityCardProps) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');
  const [sort, setSort] = useState<Sort>('LATEST');
  const effectiveMonth = selectedMonth.startsWith(`${year}-`)
    ? selectedMonth
    : '';
  const years = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => new Date().getFullYear() - index),
    [],
  );
  const months = useMemo(
    () =>
      Array.from(
        { length: 12 },
        (_, index) => `${year}-${String(index + 1).padStart(2, '0')}`,
      ),
    [year],
  );
  const monthDiaries = diaries
    .filter(
      (diary) =>
        monthKey(diary.date) === effectiveMonth &&
        (filter === 'ALL' || diary.type === filter),
    )
    .sort((left, right) => {
      if (sort === 'LATEST') return right.date.localeCompare(left.date);
      const leftAmount = (left.avgPrice ?? -1) * left.quantity;
      const rightAmount = (right.avgPrice ?? -1) * right.quantity;
      return rightAmount - leftAmount;
    });

  return (
    <BaseCard
      component="section"
      aria-labelledby="diary-activity-title"
      sx={{
        ...MY_PAGE_CARD_SX,
        height: 586,
        position: 'relative',
      }}
    >
      <Typography
        id="diary-activity-title"
        component="h2"
        sx={{
          ...MY_PAGE_CARD_TITLE_SX,
          position: 'absolute',
          top: 27,
          left: 34,
        }}
      >
        매수·매도 일지 현황
      </Typography>

      <Select
        variant="standard"
        disableUnderline
        value={year}
        aria-label="일지 조회 연도"
        onChange={(event) => onYearChange(Number(event.target.value))}
        sx={{
          position: 'absolute',
          top: 76,
          left: 39,
          width: 104,
          color: '#5D5D5D',
          fontSize: 20,
          fontWeight: 650,
          '& .MuiSelect-select': { py: 0.5 },
          '& .MuiSelect-icon': { right: 8, color: '#A8A8A8' },
        }}
      >
        {years.map((item) => (
          <MenuItem key={item} value={item}>
            {item}년
          </MenuItem>
        ))}
      </Select>

      <Box
        aria-label={`${year}년 월별 일지 현황`}
        sx={{
          position: 'absolute',
          top: 132,
          left: 41,
          width: 283,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 81px)',
          gridAutoRows: '92px',
          columnGap: '20px',
          rowGap: '9px',
        }}
      >
        {months.map((month, index) => {
          const count = diaries.filter(
            (diary) => monthKey(diary.date) === month,
          ).length;
          const selected = month === effectiveMonth;
          return (
            <ButtonBase
              key={month}
              aria-label={`${index + 1}월, 일지 ${count}건`}
              aria-pressed={selected}
              onClick={() => setSelectedMonth(month)}
              sx={{
                width: 81,
                height: 92,
                display: 'block',
                overflow: 'visible',
                borderRadius: '7px',
                boxShadow: selected
                  ? `0 0 0 1px ${tokens.color.primary}`
                  : 'none',
              }}
            >
              <Typography
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 1,
                  fontSize: 7,
                  lineHeight: 1,
                  color: 'rgba(0, 0, 0, 0.7)',
                  letterSpacing: '-0.14px',
                }}
              >
                {index + 1}월
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 0,
                  width: 81,
                  height: 80,
                  borderRadius: '7px',
                  bgcolor: monthFill(count),
                  border: '1px solid #FFFFFF',
                }}
              />
            </ButtonBase>
          );
        })}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: 119,
          left: 344,
          width: 316,
          height: 429,
          borderRadius: '10px',
          border: '1px solid rgba(15, 89, 163, 0.35)',
          bgcolor: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        {effectiveMonth ? (
          <DiaryBranchPanel
            month={effectiveMonth}
            diaries={monthDiaries}
            loading={loading}
            filter={filter}
            sort={sort}
            onFilter={setFilter}
            onSort={setSort}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pb: 1,
            }}
          >
            <LightbulbOutlineRoundedIcon
              sx={{ width: 31, height: 31, color: '#FFB800', mb: 1 }}
            />
            <Typography
              sx={{
                width: 284,
                color: '#52555A',
                fontSize: 12,
                lineHeight: 1.45,
                textAlign: 'center',
                letterSpacing: '-0.36px',
              }}
            >
              궁금한 월을 클릭하면
              <br />
              상세 매도·매수 내역을 볼 수 있어요.
            </Typography>
          </Box>
        )}
      </Box>
    </BaseCard>
  );
}

interface DiaryBranchPanelProps {
  month: string;
  diaries: DiaryPreviewDto[];
  loading: boolean;
  filter: Filter;
  sort: Sort;
  onFilter: (filter: Filter) => void;
  onSort: (sort: Sort) => void;
}

function DiaryBranchPanel({
  month,
  diaries,
  loading,
  filter,
  sort,
  onFilter,
  onSort,
}: DiaryBranchPanelProps) {
  const [year, monthNumber] = month.split('-');

  return (
    <Box sx={{ height: '100%', px: 3, pt: 2 }}>
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 650,
          color: '#626262',
          lineHeight: 1.2,
        }}
      >
        {year}년 {Number(monthNumber)}월
      </Typography>

      <Box
        sx={{
          mt: 1.7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.7 }}>
          {FILTERS.map((item) => (
            <ButtonBase
              key={item.value}
              onClick={() => onFilter(item.value)}
              sx={{
                minWidth: item.value === 'ALL' ? 35 : 34,
                height: 20,
                px: 0.8,
                borderRadius: '8px',
                bgcolor:
                  filter === item.value ? 'rgba(47,196,209,0.16)' : '#F6F6F6',
                color: filter === item.value ? '#11ACD0' : '#C5C5C5',
                fontSize: 10,
              }}
            >
              {item.label}
            </ButtonBase>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {(
            [
              ['LATEST', '최신순'],
              ['AMOUNT', '금액순'],
            ] as const
          ).map(([value, label]) => (
            <ButtonBase
              key={value}
              onClick={() => onSort(value)}
              sx={{
                minWidth: 55,
                height: 20,
                borderRadius: '8px',
                bgcolor: sort === value ? '#ECECEC' : 'transparent',
                color: sort === value ? '#777777' : '#C6C6C6',
                fontSize: 10,
              }}
            >
              {label}▼
            </ButtonBase>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          position: 'relative',
          mt: 2,
          height: 322,
          overflowY: 'auto',
          pr: 0.5,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 999,
            backgroundColor: '#D8E1E7',
          },
        }}
      >
        {loading && diaries.length === 0 && (
          <Box sx={{ pt: 10, textAlign: 'center' }}>
            <CircularProgress size={28} />
          </Box>
        )}
        {!loading && diaries.length === 0 && (
          <Typography
            sx={{ pt: 10, textAlign: 'center', fontSize: 12, color: '#999' }}
          >
            선택한 조건의 일지가 없습니다.
          </Typography>
        )}
        {diaries.length > 0 && (
          <>
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                top: 3,
                bottom: 8,
                left: 8,
                width: 2,
                borderRadius: 99,
                bgcolor: 'rgba(47,196,209,0.34)',
              }}
            />
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                top: 29,
                bottom: 20,
                left: 20,
                width: 2,
                borderRadius: 99,
                bgcolor: 'rgba(5,201,63,0.28)',
              }}
            />
            {diaries.map((diary) => {
              const buy = diary.type === 'BUY';
              const lane = buy ? 8 : 20;
              const color = buy ? '#08C4D1' : '#05C93F';
              const total =
                diary.avgPrice === null
                  ? null
                  : diary.avgPrice * diary.quantity;
              return (
                <Box
                  key={diary.diaryId}
                  sx={{ position: 'relative', minHeight: 82, pl: 5.1, pb: 1.2 }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      position: 'absolute',
                      top: 4,
                      left: lane - 5,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: '#FFFFFF',
                      border: `2px solid ${color}`,
                      zIndex: 2,
                    }}
                  />
                  <Box
                    aria-hidden
                    sx={{
                      position: 'absolute',
                      top: 9,
                      left: lane + 7,
                      width: 22,
                      height: 12,
                      borderTop: `2px solid ${color}`,
                      borderRight: `2px solid ${color}`,
                      borderTopRightRadius: 10,
                      opacity: 0.72,
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 750, color }}>
                      {buy ? '매수' : '매도'} · {diary.corpName}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 9,
                        color: '#A0A0A0',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {shortDate(diary.date)}
                    </Typography>
                  </Box>
                  <Typography
                    noWrap
                    sx={{ mt: 0.8, fontSize: 11, color: '#686868' }}
                  >
                    {diary.avgPrice === null
                      ? '가격 미제공'
                      : won.format(diary.avgPrice)}
                    {'  ·  '}
                    {number.format(diary.quantity)}주
                  </Typography>
                  <Typography
                    noWrap
                    sx={{ mt: 0.45, fontSize: 10, color: '#9A9A9A' }}
                  >
                    {diary.memo ??
                      (total === null
                        ? '거래 일지'
                        : `총 ${won.format(total)}`)}
                  </Typography>
                </Box>
              );
            })}
          </>
        )}
      </Box>
    </Box>
  );
}

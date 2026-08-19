import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { setMonth, setYear } from 'date-fns';
import { BaseCard } from '../../../components/BaseCard';
import { Select } from '../../../components/Select';
import { INITIAL_JOURNAL_ITEMS } from '../../trade-journal/mock-data';
import { formatTradeDateTime } from '../../trade-journal/filter-items';
import { tokens } from '../../../theme/tokens';

const { color } = tokens;

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`,
  value: i,
}));
const YEARS = Array.from({ length: 11 }, (_, i) => {
  const y = 2020 + i;
  return { label: String(y), value: y };
});
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const recentJournal = [...INITIAL_JOURNAL_ITEMS]
  .sort((a, b) => (a.tradedAt < b.tradedAt ? 1 : -1))
  .slice(0, 3);

export interface CalendarCardProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

/**
 * Home 화면 좌측 — 월 이동 캘린더 + 매매일지 미리보기.
 * 매매일지 미리보기는 이미 구현된 trade-journal mock 데이터를 그대로 재사용한다.
 */
export function CalendarCard({
  currentMonth,
  onMonthChange,
}: CalendarCardProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const today = currentMonth.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array.from(
    { length: firstWeekday },
    () => null,
  );
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return (
    <BaseCard sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          size="small"
          aria-label="이전 달"
          onClick={() => onMonthChange(new Date(year, month - 1, today))}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Select
          options={MONTHS}
          value={month}
          onChange={(e) =>
            onMonthChange(setMonth(currentMonth, e.target.value as number))
          }
          sx={{ flex: 1 }}
        />
        <Select
          options={YEARS}
          value={year}
          onChange={(e) =>
            onMonthChange(setYear(currentMonth, e.target.value as number))
          }
          sx={{ flex: 1 }}
        />
        <IconButton
          size="small"
          aria-label="다음 달"
          onClick={() => onMonthChange(new Date(year, month + 1, today))}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            mb: 0.5,
          }}
        >
          {WEEKDAYS.map((d) => (
            <Typography
              key={d}
              sx={{
                textAlign: 'center',
                fontSize: '0.6875rem',
                color: color.calWeekday,
              }}
            >
              {d}
            </Typography>
          ))}
        </Box>
        {weeks.map((w, i) => (
          <Box
            key={i}
            sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}
          >
            {w.map((day, j) => (
              <Box
                key={j}
                sx={{ display: 'grid', placeItems: 'center', py: 0.5 }}
              >
                {day && (
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '0.75rem',
                      color: day === today ? color.white : color.calText,
                      backgroundColor:
                        day === today ? color.selected : 'transparent',
                    }}
                  >
                    {day}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          borderTop: `1px solid ${color.border}`,
          pt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography
          sx={{ fontSize: '0.875rem', fontWeight: 700, color: color.text }}
        >
          매매일지 미리보기
        </Typography>
        {recentJournal.map((item) => (
          <Box
            key={item.id}
            component="a"
            href="#journal"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1,
              borderRadius: '12px',
              textDecoration: 'none',
              '&:hover': { backgroundColor: color.bg },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor:
                  item.tradeType === 'BUY' ? color.selectedBg : '#eafaea',
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{ fontSize: '0.6875rem', color: color.textSecondary }}
              >
                {formatTradeDateTime(item.tradedAt)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  color: color.ink,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.corpName} {item.tradeType === 'BUY' ? '매수' : '매도'}{' '}
                일지
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </BaseCard>
  );
}

export default CalendarCard;

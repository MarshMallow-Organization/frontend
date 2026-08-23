import { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickerDay, type PickerDayProps } from '@mui/x-date-pickers/PickerDay';
import {
  addMonths,
  format,
  isSameDay,
  parseISO,
  setMonth,
  setYear,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { BaseCard } from '../../../components/BaseCard';
import { Select } from '../../../components/Select';
import { INITIAL_JOURNAL_ITEMS } from '../../trade-journal/mock-data';
import { formatTradeDateTime } from '../../trade-journal/filter-items';
import { STOCK_EVENTS } from '../mock-data';
import { tokens } from '../../../theme/tokens';

const { color } = tokens;

const DAY_SIZE = 32;

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`,
  value: i,
}));
const YEARS = Array.from({ length: 11 }, (_, i) => {
  const y = 2020 + i;
  return { label: String(y), value: y };
});

export interface CalendarCardProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

/**
 * Home 화면 좌측 — 월 이동 캘린더 + 선택한 날짜의 주요 일정/매매기록.
 * 매매일지 페이지의 캘린더 구조(DateCalendar + 커스텀 day 슬롯, 마킹 점)를 그대로 가져와
 * 홈에서는 구간이 아닌 단일 날짜 선택으로 단순화했다.
 */
export function CalendarCard({
  currentMonth,
  onMonthChange,
  selectedDate,
  onSelectDate,
}: CalendarCardProps) {
  const markedDates = useMemo(
    () => [
      ...INITIAL_JOURNAL_ITEMS.map((i) => startOfDay(parseISO(i.tradedAt))),
      ...STOCK_EVENTS.map((e) => startOfDay(parseISO(e.date))),
    ],
    [],
  );

  const dayTrades = useMemo(
    () =>
      INITIAL_JOURNAL_ITEMS.filter((i) =>
        isSameDay(parseISO(i.tradedAt), selectedDate),
      ),
    [selectedDate],
  );
  const dayEvents = useMemo(
    () => STOCK_EVENTS.filter((e) => isSameDay(parseISO(e.date), selectedDate)),
    [selectedDate],
  );

  const renderDay = useCallback(
    (dayProps: PickerDayProps) => (
      <HomeCalendarDay
        {...dayProps}
        selectedDate={selectedDate}
        markedDates={markedDates}
      />
    ),
    [selectedDate, markedDates],
  );

  return (
    <BaseCard sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          size="small"
          aria-label="이전 달"
          onClick={() => onMonthChange(addMonths(currentMonth, -1))}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Select
          options={MONTHS}
          value={currentMonth.getMonth()}
          onChange={(e) =>
            onMonthChange(setMonth(currentMonth, e.target.value as number))
          }
          sx={{ flex: 1 }}
        />
        <Select
          options={YEARS}
          value={currentMonth.getFullYear()}
          onChange={(e) =>
            onMonthChange(setYear(currentMonth, e.target.value as number))
          }
          sx={{ flex: 1 }}
        />
        <IconButton
          size="small"
          aria-label="다음 달"
          onClick={() => onMonthChange(addMonths(currentMonth, 1))}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

      <DateCalendar
        key={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}`}
        value={null}
        referenceDate={currentMonth}
        onChange={(day) => day && onSelectDate(startOfDay(day))}
        onMonthChange={(m) => onMonthChange(startOfMonth(m))}
        showDaysOutsideCurrentMonth
        views={['day']}
        dayOfWeekFormatter={(date) => format(date, 'EEEEEE')}
        slots={{ day: renderDay, calendarHeader: () => null }}
        sx={{
          width: '100%',
          m: 0,
          height: 'auto',
          '& .MuiDayCalendar-slideTransition': {
            minHeight: 6 * (DAY_SIZE + 4),
            overflowY: 'visible',
          },
          '& .MuiDayCalendar-monthContainer': { overflow: 'visible' },
          '& .MuiDayCalendar-weekDayLabel': {
            color: color.calWeekday,
            width: DAY_SIZE,
            fontSize: '0.6875rem',
          },
          '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': {
            justifyContent: 'space-between',
          },
        }}
      />

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
          {format(selectedDate, 'M월 d일')} 일정 · 매매기록
        </Typography>

        {dayEvents.length === 0 && dayTrades.length === 0 && (
          <Typography
            sx={{ fontSize: '0.8125rem', color: color.textSecondary, py: 1 }}
          >
            이 날의 주요 일정이나 매매기록이 없어요.
          </Typography>
        )}

        {dayEvents.map((event) => (
          <Box
            key={event.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1,
              borderRadius: '12px',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: color.selectedBg,
              }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{ fontSize: '0.6875rem', color: color.textSecondary }}
              >
                주요 일정{event.corpName ? ` · ${event.corpName}` : ''}
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
                {event.label}
              </Typography>
            </Box>
          </Box>
        ))}

        {dayTrades.map((item) => (
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

function HomeCalendarDay({
  selectedDate,
  markedDates = [],
  day,
  outsideCurrentMonth,
  sx,
  ...props
}: PickerDayProps & {
  selectedDate?: Date;
  markedDates?: Date[];
}) {
  const isSelected = !!selectedDate && isSameDay(day, selectedDate);
  const isMarked =
    !outsideCurrentMonth && markedDates.some((d) => isSameDay(d, day));

  return (
    <PickerDay
      {...props}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      disableRipple
      sx={{
        width: DAY_SIZE,
        height: DAY_SIZE,
        margin: 0,
        fontSize: '0.75rem',
        borderRadius: '50%',
        color: outsideCurrentMonth ? color.calDisabled : color.calText,
        position: 'relative',
        '&:hover': { backgroundColor: color.calHover },
        ...(isSelected && {
          backgroundColor: color.selected,
          color: color.white,
          '&:hover': { backgroundColor: color.selected },
          '&.Mui-selected': {
            backgroundColor: color.selected,
            color: color.white,
          },
        }),
        ...(isMarked &&
          !isSelected && {
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 3,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: color.selected,
            },
          }),
        ...sx,
      }}
    />
  );
}

export default CalendarCard;

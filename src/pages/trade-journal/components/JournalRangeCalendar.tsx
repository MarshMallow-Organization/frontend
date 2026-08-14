import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickerDay, type PickerDayProps } from '@mui/x-date-pickers/PickerDay';
import {
  addMonths,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  setMonth,
  setYear,
  startOfMonth,
} from 'date-fns';
import { Select } from '../../../components/Select';
import type { DateRange } from '../../../components/RangeCalendar';
import { tokens } from '../../../theme/tokens';
import { LAYOUT } from '../layout';

const { color } = tokens;
const { calendar: cal } = LAYOUT;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((label, value) => ({ label, value }));

const YEARS = Array.from({ length: 11 }, (_, i) => {
  const y = 2020 + i;
  return { label: String(y), value: y };
});

export interface JournalRangeCalendarProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  markedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}

/**
 * 매매일지 전용 구간 캘린더.
 * 기업 아이콘 넣기 전 일지 마킹만 여기서 추가한다.
 **/
export function JournalRangeCalendar({
  value,
  onChange,
  markedDates = [],
  minDate,
  maxDate,
}: JournalRangeCalendarProps) {
  const [displayMonth, setDisplayMonth] = useState<Date>(() =>
    startOfMonth(value[0] ?? new Date()),
  );

  function handleDayClick(day: Date | null) {
    if (!day) return;
    const [start, end] = value;
    if (!start || (start && end)) {
      onChange([day, null]);
    } else if (isBefore(day, start)) {
      onChange([day, start]);
    } else {
      onChange([start, day]);
    }
  }

  const renderDay = useCallback(
    (dayProps: PickerDayProps) => (
      <JournalRangeDay
        {...dayProps}
        range={value}
        displayMonth={displayMonth}
        markedDates={markedDates}
      />
    ),
    [value, displayMonth, markedDates],
  );

  return (
    <Box
      sx={{
        width: '100%',
        boxSizing: 'border-box',
        border: `1px solid ${color.calBorder}`,
        borderRadius: `${cal.radius}px`,
        backgroundColor: color.white,
        p: `${cal.pad}px`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 0.5,
        }}
      >
        <IconButton
          size="small"
          aria-label="이전 달"
          onClick={() => setDisplayMonth((m) => addMonths(m, -1))}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Select
          options={MONTHS}
          value={displayMonth.getMonth()}
          onChange={(e) =>
            setDisplayMonth((m) => setMonth(m, e.target.value as number))
          }
          sx={{ flex: 1 }}
        />
        <Select
          options={YEARS}
          value={displayMonth.getFullYear()}
          onChange={(e) =>
            setDisplayMonth((m) => setYear(m, e.target.value as number))
          }
          sx={{ flex: 1 }}
        />
        <IconButton
          size="small"
          aria-label="다음 달"
          onClick={() => setDisplayMonth((m) => addMonths(m, 1))}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <DateCalendar
        key={`${displayMonth.getFullYear()}-${displayMonth.getMonth()}`}
        value={null}
        referenceDate={displayMonth}
        onChange={handleDayClick}
        onMonthChange={(m) => setDisplayMonth(startOfMonth(m))}
        minDate={minDate}
        maxDate={maxDate}
        showDaysOutsideCurrentMonth
        views={['day']}
        dayOfWeekFormatter={(date) => format(date, 'EEEEEE')}
        slots={{ day: renderDay, calendarHeader: () => null }}
        sx={{
          width: '100%',
          m: 0,
          height: 'auto',
          '& .MuiDayCalendar-slideTransition': {
            minHeight: 6 * (cal.day + 4),
            overflowY: 'visible',
          },
          '& .MuiDayCalendar-monthContainer': { overflow: 'visible' },
          '& .MuiDayCalendar-weekDayLabel': {
            color: color.calWeekday,
            width: cal.weekLabel,
            fontSize: '0.6875rem',
          },
          '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': {
            justifyContent: 'space-between',
          },
        }}
      />
    </Box>
  );
}

function JournalRangeDay({
  range = [null, null],
  displayMonth,
  markedDates = [],
  day,
  outsideCurrentMonth,
  sx,
  ...props
}: PickerDayProps & {
  range?: DateRange;
  displayMonth?: Date;
  markedDates?: Date[];
}) {
  const [start, end] = range;

  if (outsideCurrentMonth) {
    const trailing = displayMonth
      ? isAfter(day, endOfMonth(displayMonth))
      : true;
    if (!trailing) {
      return (
        <PickerDay
          {...props}
          day={day}
          outsideCurrentMonth
          sx={{ visibility: 'hidden', width: cal.day, height: cal.day }}
        />
      );
    }
  }

  const isStart = !!start && isSameDay(day, start);
  const isEnd = !!end && isSameDay(day, end);
  const isEndpoint = isStart || isEnd;
  const inRange =
    !!start &&
    !!end &&
    !isEndpoint &&
    !outsideCurrentMonth &&
    isWithinInterval(day, { start, end });
  const isMarked =
    !outsideCurrentMonth && markedDates.some((d) => isSameDay(d, day));

  return (
    <PickerDay
      {...props}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      disableRipple
      sx={{
        width: cal.day,
        height: cal.day,
        margin: 0,
        fontSize: cal.dayFont,
        borderRadius: '8px',
        color: outsideCurrentMonth ? color.calDisabled : color.calText,
        position: 'relative',
        '&:hover': { backgroundColor: color.calHover },
        ...(inRange && {
          backgroundColor: color.calInRange,
          color: color.calText,
        }),
        ...(isEndpoint && {
          borderRadius: '50%',
          backgroundColor: color.selected,
          color: color.white,
          '&:hover': { backgroundColor: color.selected },
          '&.Mui-selected': {
            backgroundColor: color.selected,
            color: color.white,
          },
        }),
        ...(isMarked &&
          !isEndpoint && {
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

export default JournalRangeCalendar;

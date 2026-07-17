import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import type { PickerDayProps } from '@mui/x-date-pickers/PickerDay';
import {
  addMonths,
  format,
  isBefore,
  setMonth,
  setYear,
  startOfMonth,
} from 'date-fns';
import { Select } from '../Select';
import { tokens } from '../../theme/tokens';
import { RangeDay, type DateRange } from './RangeDay';

const { color } = tokens;

export interface RangeCalendarProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
}

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

/**
 * Range date picker (17:888). Community DateCalendar + custom RangeDay slot;
 * custom header (month/year Select + prev/next). Endpoints = cyan #11acd0,
 * in-range = #f5f5f5, other-month = #b3b3b3. Controlled via `value` [start,end].
 */
export function RangeCalendar({
  value,
  onChange,
  minDate,
  maxDate,
}: RangeCalendarProps) {
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

  // Day slot closes over the current range/month (avoids slotProps typing).
  const renderDay = useCallback(
    (dayProps: PickerDayProps) => (
      <RangeDay {...dayProps} range={value} displayMonth={displayMonth} />
    ),
    [value, displayMonth],
  );

  return (
    <Box
      sx={{
        width: 318,
        border: `1px solid ${color.calBorder}`, // 17:888 = #d9d9d9
        borderRadius: '16px', // 17:888 frame radius
        backgroundColor: color.white,
        p: 2, // 16px (17:888 space-400)
      }}
    >
      {/* custom header: ◀ [month] [year] ▶ */}
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
        value={null}
        referenceDate={displayMonth}
        onChange={handleDayClick}
        onMonthChange={(m) => setDisplayMonth(startOfMonth(m))}
        minDate={minDate}
        maxDate={maxDate}
        showDaysOutsideCurrentMonth
        views={['day']}
        dayOfWeekFormatter={(date) => format(date, 'EEEEEE')} // Su Mo Tu … (17:888)
        slots={{ day: renderDay, calendarHeader: () => null }}
        sx={{
          width: '100%',
          m: 0,
          '& .MuiDayCalendar-weekDayLabel': {
            color: color.calWeekday,
            width: 42,
            fontSize: '0.75rem', // 12px (17:888 weekday = text-xs)
          },
          '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': {
            justifyContent: 'space-between',
          },
        }}
      />
    </Box>
  );
}

export default RangeCalendar;

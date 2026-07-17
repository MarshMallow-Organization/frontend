import { PickerDay, type PickerDayProps } from '@mui/x-date-pickers/PickerDay';
import { isSameDay, isWithinInterval, isAfter, endOfMonth } from 'date-fns';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export type DateRange = [Date | null, Date | null];

export interface RangeDayProps extends PickerDayProps {
  /** injected via slotProps.day */
  range?: DateRange;
  displayMonth?: Date;
}

/**
 * Day cell for the range calendar (17:888 states).
 * - Active (range start/end) = cyan #11acd0 circle + white text
 * - Range (between)          = #f5f5f5 fill
 * - Disabled (other month, trailing) = #b3b3b3
 * - leading other-month days are hidden (Figma shows blank leading, disabled trailing)
 */
export function RangeDay({
  range = [null, null],
  displayMonth,
  day,
  outsideCurrentMonth,
  sx,
  ...props
}: RangeDayProps) {
  const [start, end] = range;

  // Leading outside-month days → blank; trailing → shown disabled.
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
          sx={{ visibility: 'hidden', width: 42, height: 42 }}
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

  return (
    <PickerDay
      {...props}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      disableRipple
      sx={{
        width: 42,
        height: 42,
        margin: 0,
        fontSize: '1.125rem', // 18px
        borderRadius: '10px',
        color: outsideCurrentMonth ? color.calDisabled : color.calText,
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
        ...sx,
      }}
    />
  );
}

export default RangeDay;

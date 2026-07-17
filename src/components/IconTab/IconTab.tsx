import type { ReactNode } from 'react';
import ButtonBase, { type ButtonBaseProps } from '@mui/material/ButtonBase';
import { tokens } from '../../theme/tokens';

const { color, fontFamily } = tokens;

export interface IconTabProps extends Omit<ButtonBaseProps, 'color'> {
  icon?: ReactNode;
  label: ReactNode;
  selected?: boolean;
}

/**
 * Icon + label tab button (날짜별/회사별 조회). Exact from 151:1043(default) /
 * 151:1045(selected) / 151:1275(hover): radius 12, gap 19, pl 18, py 14.5.
 * - default   → white bg, 0.8px #c0c0c0 border, label #1c1b1f 18px Regular
 * - hover     → bg #f3f3f3
 * - selected  → bg #edf4fa, 1px #0165e2 border, label #0165e2 20px Medium
 */
export function IconTab({
  icon,
  label,
  selected = false,
  sx,
  ...props
}: IconTabProps) {
  return (
    <ButtonBase
      aria-pressed={selected}
      sx={{
        fontFamily,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '19px',
        borderRadius: '12px',
        padding: '14.5px 18px',
        fontSize: selected ? '1.25rem' : '1.125rem', // 20px / 18px
        fontWeight: selected ? 500 : 400,
        border: selected
          ? `1px solid ${color.accentBlue}`
          : `0.8px solid ${color.borderGray}`,
        backgroundColor: selected ? color.iconTabSelectedBg : color.white,
        color: selected ? color.accentBlue : color.ink,
        '& .IconTab-icon': {
          display: 'inline-flex',
          fontSize: '34.729px',
          // 151:1043 default calendar icon is 2-tone; primary strokes = #1c1b1f
          // (ink), not the #d9d9d9 secondary. Single-color MUI icon → dominant ink.
          color: selected ? color.accentBlue : color.ink,
        },
        '&:hover': {
          backgroundColor: selected
            ? color.iconTabSelectedBg
            : color.iconTabHoverBg,
        },
        ...sx,
      }}
      {...props}
    >
      {icon != null && <span className="IconTab-icon">{icon}</span>}
      {label}
    </ButtonBase>
  );
}

export default IconTab;

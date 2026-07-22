import type { ReactNode } from 'react';
import Box, { type BoxProps } from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export interface ListRowProps extends Omit<BoxProps, 'title'> {
  /** leading slot: thumbnail / icon box (news 76×76, holdings small box) */
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** trailing slot: meta text / Chip / Button */
  trailing?: ReactNode;
  /** override title type scale per use (news vs holdings differ) */
  titleSx?: SxProps<Theme>;
  subtitleSx?: SxProps<Theme>;
}

/**
 * Generic list row — renders both the news row (123:464, 76×76 thumb + 2-line
 * text) and the holdings row (127:2355, icon box + amount + sub) via slots.
 * Layout primitive: title = near-black (ink) bold, subtitle = textSecondary.
 * Per-use type scale (news vs holdings differ: amount 20px, sub 10–11px #626262)
 * is content-driven — pass styled nodes / titleSx / subtitleSx to hit exact values.
 */
export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  titleSx,
  subtitleSx,
  sx,
  ...props
}: ListRowProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px', // 127:2355 leading/text gap
        width: '100%',
        ...sx,
      }}
      {...props}
    >
      {leading != null && (
        <Box sx={{ flexShrink: 0, display: 'inline-flex' }}>{leading}</Box>
      )}
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Box
          sx={{
            color: color.ink,
            fontWeight: 400, // news title Regular; holdings overrides via titleSx
            lineHeight: 1.3,
            ...titleSx,
          }}
        >
          {title}
        </Box>
        {subtitle != null && (
          <Box sx={{ color: color.textSecondary, ...subtitleSx }}>
            {subtitle}
          </Box>
        )}
      </Box>
      {trailing != null && (
        <Box
          sx={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center' }}
        >
          {trailing}
        </Box>
      )}
    </Box>
  );
}

export default ListRow;

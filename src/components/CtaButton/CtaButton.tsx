import type { ReactNode } from 'react';
import MuiButton, {
  type ButtonProps as MuiButtonProps,
} from '@mui/material/Button';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export interface CtaButtonProps extends Omit<
  MuiButtonProps,
  'variant' | 'color'
> {
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * Primary CTA pill (112:1128 default / 112:1130 hover) — "AI 재무 상태 체크".
 * Solid cyan #2fc4d1 (not a gradient), white label, radius 60, 16px, leading icon.
 * hover = #0095b7.
 */
export function CtaButton({ icon, children, sx, ...props }: CtaButtonProps) {
  return (
    <MuiButton
      variant="contained"
      startIcon={icon}
      sx={{
        borderRadius: '60px',
        backgroundColor: color.primary,
        color: color.white,
        fontSize: '1rem', // 16px
        fontWeight: 700, // Noto Sans KR Black/Bold (112:1128)
        minHeight: 50, // 191×50 (width is label-driven)
        padding: '13px 30px 14px 24px', // exact pt13 pr30 pb14 pl24
        '&:hover': { backgroundColor: color.ctaHover },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
}

export default CtaButton;

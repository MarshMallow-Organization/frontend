import type { ReactNode } from 'react';
import Paper, { type PaperProps } from '@mui/material/Paper';
import { tokens } from '../../theme/tokens';

const { color, radiusCard } = tokens;

export type BaseCardVariant = 'plain' | 'tinted';

export interface BaseCardProps extends Omit<PaperProps, 'variant'> {
  appVariant?: BaseCardVariant;
  children?: ReactNode;
}

/**
 * Card surface (156:623 plain / 161:638 tinted). radius 17, elevation 0.
 * - plain  → white bg, 1px #dbdbdb border
 * - tinted → #f6fbff bg, 1px #0165e2 border
 */
export function BaseCard({
  appVariant = 'plain',
  sx,
  children,
  ...props
}: BaseCardProps) {
  const tinted = appVariant === 'tinted';
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: `${radiusCard}px`,
        border: `1px solid ${tinted ? color.accentBlue : color.cardBorder}`,
        backgroundColor: tinted ? color.cardTinted : color.white,
        padding: 2,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}

export default BaseCard;

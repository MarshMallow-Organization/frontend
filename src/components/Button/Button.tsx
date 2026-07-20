import MuiButton, {
  type ButtonProps as MuiButtonProps,
} from '@mui/material/Button';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export type AppButtonVariant = 'filled' | 'outline' | 'outlineSelected';

export interface AppButtonProps extends Omit<
  MuiButtonProps,
  'variant' | 'color'
> {
  /** Figma variants: filled(default) / outline(navy) / outline-selected(cyan) */
  appVariant?: AppButtonVariant;
}

/**
 * Shared Button. hover/pressed/disabled are interaction states handled by the
 * theme (see MuiButton overrides), not separate variants.
 * - filled  → contained cyan (#2fc4d1)
 * - outline → outlined NAVY (#0f59a3) border + text (per Figma 14:367)
 * - outlineSelected → outlined SELECTED cyan (#11acd0) + light tint bg (22:546)
 */
export function Button({
  appVariant = 'filled',
  sx,
  ...props
}: AppButtonProps) {
  if (appVariant === 'filled') {
    return <MuiButton variant="contained" color="primary" sx={sx} {...props} />;
  }
  const isSelected = appVariant === 'outlineSelected';
  const accent = isSelected ? color.selected : color.navy;
  // 14:367 outline bg = #f2f7fa; 22:546 selected bg = #d6eaf7.
  const background = isSelected ? color.selectedBg : color.bg;
  return (
    <MuiButton
      variant="outlined"
      sx={{
        color: accent,
        borderColor: accent,
        borderWidth: '1.5px', // 14:367 / 22:546 outline = 1.5px
        backgroundColor: background,
        '&:hover': {
          borderColor: accent,
          borderWidth: '1.5px',
          backgroundColor: color.selectedBg,
        },
        ...sx,
      }}
      {...props}
    />
  );
}

export default Button;

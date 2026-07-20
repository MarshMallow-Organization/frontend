import MuiChip, { type ChipProps as MuiChipProps } from '@mui/material/Chip';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export type AppChipVariant =
  'outlineGray' | 'outlineCyan' | 'filledGray' | 'filledCyan';

export interface AppChipProps extends Omit<MuiChipProps, 'variant' | 'color'> {
  appVariant?: AppChipVariant;
  /** rect = rounded-rect r10 (17:441); pill = fully round (시가총액/인기종목 tags) */
  shape?: 'rect' | 'pill';
}

// Exact values from 17:441 (Label: border #c1d0db, text #527086, radius 10) and
// 17:442 (selected: bg #d6eaf7, border #abcce5, text #11acd0). filled* variants
// are for the solid tags seen on other screens.
const styleByVariant: Record<AppChipVariant, object> = {
  outlineGray: {
    border: `1.5px solid ${color.borderMuted}`, // 17:436 border 1.5px
    color: color.text,
    backgroundColor: color.border, // 17:441 fill = #e2eaf0 (verified via figma-verify)
  },
  outlineCyan: {
    border: `1.5px solid ${color.selectedBorder}`, // 17:443 border 1.5px
    color: color.selected,
    backgroundColor: color.selectedBg,
  },
  // Solid pill tags. 58:1066 인기종목 = translucent gray bg #c8d1d7@62% + #636870 text
  // (weight 400); 58:1065 시가총액 = white Bold on #2fc4d1.
  filledGray: {
    border: 'none',
    color: color.tagGray,
    fontWeight: 400,
    backgroundColor: color.chipFilledGrayBg,
  },
  filledCyan: {
    border: 'none',
    color: color.white,
    fontWeight: 700,
    backgroundColor: color.primary,
  },
};

/** Label/Tag chip. shape=rect (r10 label) or pill (fully-round tag). */
export function Chip({
  appVariant = 'outlineGray',
  shape = 'rect',
  sx,
  ...props
}: AppChipProps) {
  return (
    <MuiChip
      sx={{
        borderRadius: shape === 'pill' ? 999 : `${tokens.radiusField}px`,
        // Exact from 17:441/442: chip 179×54, label 20px Medium.
        height: 54,
        fontSize: '1.25rem', // 20px
        fontWeight: 500,
        '& .MuiChip-label': { paddingLeft: '18px', paddingRight: '18px' },
        ...styleByVariant[appVariant],
        ...sx,
      }}
      {...props}
    />
  );
}

export default Chip;

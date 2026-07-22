import MuiIconButton, { type IconButtonProps } from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export type AppFabVariant =
  'cyanFilled' | 'cyanOutline' | 'navyFilled' | 'navyOutline';

export interface AppFabProps extends Omit<IconButtonProps, 'color' | 'size'> {
  appVariant?: AppFabVariant;
  /** diameter in px */
  diameter?: number;
}

// Exact from SVG assets (16:428/429): cyan = #11acd0 (selected, NOT the button
// cyan #2fc4d1), navy = #0f59a3, circle size 55px.
const styleByVariant: Record<AppFabVariant, object> = {
  cyanFilled: {
    backgroundColor: color.selected,
    color: color.white,
    '&:hover': { backgroundColor: color.selected },
  },
  cyanOutline: {
    border: `1.5px solid ${color.selected}`,
    color: color.selected,
  },
  navyFilled: {
    backgroundColor: color.navy,
    color: color.white,
    '&:hover': { backgroundColor: color.navy },
  },
  navyOutline: { border: `1.5px solid ${color.navy}`, color: color.navy },
};

/** Circular add button. 4 variants: cyan/navy × filled/outline. */
export function Fab({
  appVariant = 'cyanFilled',
  diameter = 55,
  children,
  sx,
  ...props
}: AppFabProps) {
  return (
    <MuiIconButton
      sx={{
        width: diameter,
        height: diameter,
        borderRadius: '50%',
        ...styleByVariant[appVariant],
        ...sx,
      }}
      {...props}
    >
      {children ?? <AddIcon fontSize="small" />}
    </MuiIconButton>
  );
}

export default Fab;

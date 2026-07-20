import MuiPagination, {
  type PaginationProps as MuiPaginationProps,
} from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import { tokens } from '../../theme/tokens';

const { color, radius } = tokens;

export type AppPaginationVariant =
  | 'container' // pag1: one bordered container, square cyan-fill selected
  | 'text' // pag2: no borders, selected = cyan TEXT only
  | 'boxedCircular' // pag3: per-item bordered boxes, circular cyan-fill selected
  | 'boxedSquare'; // pag4: per-item bordered boxes, square cyan-fill selected

export interface AppPaginationProps extends Omit<
  MuiPaginationProps,
  'variant' | 'shape'
> {
  appVariant?: AppPaginationVariant;
}

const selectedFill = {
  backgroundColor: color.selected,
  color: color.white,
  '&:hover': { backgroundColor: color.selected },
};

// Numerals are ~20px across all styles (17:466 ≈19.5, 17:499/500 =20).
const numeralFont = { fontSize: '1.25rem' };

// boxed variants: per-item bordered box (#c1d0db), unselected numerals #bcc1c5,
// items 42×42 (17:499/500). container/text keep MUI's ~32px (matches 17:466 ≈31).
const itemBox = {
  minWidth: 42,
  height: 42,
  border: `1px solid ${color.borderMuted}`, // 17:499/500 boxes = #c1d0db
  color: color.paginationMuted, // unselected boxed numerals = #bcc1c5
  margin: '0 2px',
};

function itemSx(v: AppPaginationVariant) {
  // container/text (17:466) unselected numerals = #527086, default ~32px item.
  const base = { ...numeralFont, color: color.text };
  const boxed = { ...numeralFont, ...itemBox };
  switch (v) {
    case 'text':
      return {
        '& .MuiPaginationItem-root': base,
        // prev/next arrows = #8596a3 (17:454/456), not the #527086 numeral color
        '& .MuiPaginationItem-previousNext': { color: color.textSecondary },
        // selected shown as cyan text, no fill (17:476 = Black 900)
        '& .MuiPaginationItem-root.Mui-selected': {
          backgroundColor: 'transparent',
          color: color.selected,
          fontWeight: 900,
          '&:hover': { backgroundColor: 'transparent' },
        },
      };
    case 'boxedCircular':
      return {
        '& .MuiPaginationItem-root': { ...boxed, borderRadius: '50%' }, // 17:500 box r=40
        '& .MuiPaginationItem-root.Mui-selected': {
          ...selectedFill,
          borderColor: color.selected,
          borderRadius: '50%',
        },
      };
    case 'boxedSquare':
      return {
        '& .MuiPaginationItem-root': { ...boxed, borderRadius: '5px' }, // 17:499 box r≈4.874
        '& .MuiPaginationItem-root.Mui-selected': {
          ...selectedFill,
          borderColor: color.selected,
          borderRadius: '5px',
        },
      };
    case 'container':
    default:
      return {
        '& .MuiPaginationItem-root': base,
        '& .MuiPaginationItem-previousNext': { color: color.textSecondary },
        '& .MuiPaginationItem-root.Mui-selected': {
          ...selectedFill,
          fontWeight: 500, // 17:458 selected = Medium
        },
      };
  }
}

/** Pagination in the 4 Figma styles (17:466/467/499/500). */
export function Pagination({
  appVariant = 'boxedSquare',
  sx,
  ...props
}: AppPaginationProps) {
  const shape = appVariant === 'boxedCircular' ? 'circular' : 'rounded';
  const el = (
    <MuiPagination
      shape={shape}
      sx={[
        itemSx(appVariant),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );

  if (appVariant === 'container') {
    return (
      <Box
        sx={{
          display: 'inline-block',
          border: `1px solid ${color.border}`,
          borderRadius: `${radius}px`,
          padding: '4px 8px',
        }}
      >
        {el}
      </Box>
    );
  }
  return el;
}

export default Pagination;

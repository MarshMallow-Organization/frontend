import Box, { type BoxProps } from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import { tokens } from '../../theme/tokens';

const { color, fontFamily } = tokens;

export interface NewsTabProps extends Omit<BoxProps, 'onChange'> {
  tabs: string[];
  value: number;
  onChange: (index: number) => void;
}

/**
 * Text tab strip (125:472 / 127:499 selected / 127:500 default).
 * - unselected → #b4b4b4, 14px, Bold(700) (127:500 = Noto Sans KR Bold)
 * - selected   → #11acd0 (color.selected), 16px, Black(900) + cyan underline
 *   (127:499 stacks label + 5px gap + 1.5px Line indicator)
 */
export function NewsTab({ tabs, value, onChange, sx, ...props }: NewsTabProps) {
  return (
    <Box
      role="tablist"
      sx={{ display: 'flex', alignItems: 'center', gap: 3, ...sx }}
      {...props}
    >
      {tabs.map((tab, i) => {
        const selected = i === value;
        return (
          <ButtonBase
            key={tab + i}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(i)}
            sx={{
              flexDirection: 'column',
              gap: '5px',
              fontFamily,
              fontSize: selected ? '1rem' : '0.875rem', // 16px / 14px
              fontWeight: selected ? 900 : 700, // Black / Bold (127:499 / 127:500)
              color: selected ? color.selected : color.mutedGray,
              whiteSpace: 'nowrap',
            }}
          >
            {tab}
            {selected && (
              <Box
                sx={{
                  width: '100%',
                  height: '1.5px',
                  backgroundColor: color.selected,
                }}
              />
            )}
          </ButtonBase>
        );
      })}
    </Box>
  );
}

export default NewsTab;

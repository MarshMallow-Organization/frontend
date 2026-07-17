import TextField, { type TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import MicNoneIcon from '@mui/icons-material/MicNone';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export type SearchFieldVariant = 'pill' | 'filled';

export type AppSearchFieldProps = Omit<TextFieldProps, 'variant'> & {
  appVariant?: SearchFieldVariant;
  /** which side the search icon sits (16:419 = right). default left */
  searchIconSide?: 'left' | 'right';
  /** show trailing mic (rendered in Figma's cyan accent) */
  mic?: boolean;
};

/** Search input (16:419 right-icon filled, 15:378/16:395 pill + cyan mic). */
export function SearchField({
  appVariant = 'pill',
  searchIconSide = 'left',
  mic = false,
  placeholder = '검색어를 입력해주세요.',
  sx,
  ...props
}: AppSearchFieldProps) {
  // Exact values: pill radius 65 (16:395 filled radius 10). Search icon is gray
  // #8596a3; the mic asset SVG fill is #11ACD0 (color.selected) — confirmed by
  // fetching node 16:400's asset, which the aggregate color sweep missed.
  // filled bg = #e2eaf0 (color.border), the extracted fill in 16:419/16:395.
  const radius = appVariant === 'pill' ? 999 : tokens.radiusField;
  const bg = appVariant === 'filled' ? color.border : color.white;

  // Navy search icon belongs to the RIGHT-icon variant only (16:419 = #0f59a3);
  // left-icon fields (16:395 filled+mic, 15:378 pill) use gray #8596a3.
  const searchColor =
    searchIconSide === 'right' ? color.navy : color.textSecondary;
  const searchAdornment = (
    <SearchIcon sx={{ color: searchColor }} fontSize="small" />
  );
  const micAdornment = (
    <InputAdornment position="end">
      <MicNoneIcon sx={{ color: color.selected }} fontSize="small" />
    </InputAdornment>
  );

  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      slotProps={{
        input: {
          startAdornment:
            searchIconSide === 'left' ? (
              <InputAdornment position="start">
                {searchAdornment}
              </InputAdornment>
            ) : undefined,
          endAdornment:
            searchIconSide === 'right' ? (
              <InputAdornment position="end">{searchAdornment}</InputAdornment>
            ) : mic ? (
              micAdornment
            ) : undefined,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: `${radius}px`,
          backgroundColor: bg,
          '& fieldset': {
            borderColor: appVariant === 'filled' ? 'transparent' : color.border,
          },
          '&:hover fieldset': { borderColor: color.borderMuted },
        },
        // Exact from 16:419/15:378: field 508×54, placeholder 20px Regular.
        '& .MuiOutlinedInput-input': {
          fontSize: '1.25rem', // 20px
          paddingTop: '15px',
          paddingBottom: '15px',
        },
        ...sx,
      }}
      {...props}
    />
  );
}

export default SearchField;

import MuiSelect, { type SelectProps } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { tokens } from '../../theme/tokens';

const { color, radius } = tokens;

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface AppSelectProps extends Omit<SelectProps, 'children'> {
  options: SelectOption[];
}

/** Outlined select (Month/Year dropdowns from 105:839). */
export function Select({ options, sx, ...props }: AppSelectProps) {
  return (
    <MuiSelect
      size="small"
      sx={{
        borderRadius: `${radius}px`,
        minWidth: 96,
        backgroundColor: color.white,
        '& .MuiOutlinedInput-notchedOutline': { borderColor: color.border },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: color.borderMuted,
        },
        ...sx,
      }}
      {...props}
    >
      {options.map((o) => (
        <MenuItem key={o.value} value={o.value}>
          {o.label}
        </MenuItem>
      ))}
    </MuiSelect>
  );
}

export default Select;

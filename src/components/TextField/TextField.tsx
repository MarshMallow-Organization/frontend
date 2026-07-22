import type { ReactNode } from 'react';
import MuiTextField, {
  type TextFieldProps as MuiTextFieldProps,
} from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export type AppTextFieldVariant = 'outlined' | 'pill';

export interface AppTextFieldProps extends Omit<MuiTextFieldProps, 'variant'> {
  /** associated top label (rendered above the input) */
  label?: ReactNode;
  appVariant?: AppTextFieldVariant;
}

// pill field (login 92:647): 625×58, r40, 1px #d8d8d8, translucent white.
const pillSx = {
  '& .MuiOutlinedInput-root': {
    height: 58,
    borderRadius: '40px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: color.loginTitle,
    '& fieldset': { borderColor: color.loginFieldBorder },
    '&:hover fieldset': { borderColor: color.loginFieldBorder },
  },
  '& .MuiOutlinedInput-input': { padding: '0 24px' },
};

/**
 * Design-system text input — thin MUI TextField wrapper.
 * - `label` renders an associated top label (`<label htmlFor>` when `id` is set).
 * - `pill` variant = the app's rounded translucent field; `outlined` = standard.
 */
export function TextField({
  label,
  appVariant = 'outlined',
  id,
  sx,
  ...props
}: AppTextFieldProps) {
  const field = (
    <MuiTextField
      id={id}
      sx={[
        appVariant === 'pill' ? pillSx : {},
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
  if (label == null) return field;
  return (
    <Stack sx={{ width: '100%', gap: '6px' }}>
      <Typography
        component="label"
        htmlFor={id}
        sx={{ fontSize: 20, color: color.loginLabel }}
      >
        {label}
      </Typography>
      {field}
    </Stack>
  );
}

export default TextField;

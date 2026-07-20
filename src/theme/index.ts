import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

const { color, radius, fontFamily } = tokens;

export const theme = createTheme({
  palette: {
    primary: { main: color.primary, contrastText: color.white },
    secondary: { main: color.navy, contrastText: color.white },
    text: { primary: color.text, secondary: color.textSecondary },
    divider: color.border,
    background: { default: color.bg, paper: color.white },
    action: { disabledBackground: color.disabled },
  },
  shape: { borderRadius: radius },
  typography: {
    fontFamily,
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: radius,
          // Exact values from 14:359: Noto Sans KR Medium(500), 20px, padding 15/25.
          fontWeight: 500,
          fontSize: '1.25rem', // 20px
          padding: '15px 25px',
          lineHeight: 1.2,
          // Disabled: keep Figma's gray fill (#c8d1d7) with legible white label,
          // not MUI's default translucent-black text.
          '&.Mui-disabled': {
            backgroundColor: color.disabled,
            color: color.white,
          },
        },
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: color.primary,
            '&:hover': { backgroundColor: color.primaryHover },
            '&:active': { backgroundColor: color.primaryPressed },
          },
        },
      ],
    },
  },
});

export { tokens } from './tokens';

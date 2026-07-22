import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// Pretendard (self-hosted, dynamic-subset → loads only used glyph ranges incl. Korean).
// Family "Pretendard"; falls back to Noto Sans KR / system-ui via theme fontFamily.
import 'pretendard/dist/web/static/pretendard-dynamic-subset.css';
import './index.css';
import App from './app.tsx';
import { theme } from './theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <App />
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
);

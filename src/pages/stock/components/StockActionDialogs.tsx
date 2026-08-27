import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import { tokens } from '../../../theme/tokens';

const { color, fontFamily } = tokens;

const paperSx = {
  width: 520,
  maxWidth: 'calc(100vw - 32px)',
  borderRadius: '32px',
  border: `1px solid ${color.stockDialogBorder}`,
  boxShadow: '0 0 3px rgba(0,0,0,0.3)',
  fontFamily,
} as const;

interface ConfirmStockDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  loading: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmStockDialog({
  open,
  title,
  description,
  confirmLabel,
  loading,
  error,
  onCancel,
  onConfirm,
}: ConfirmStockDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      aria-labelledby="stock-confirm-dialog-title"
      slotProps={{ paper: { sx: paperSx } }}
    >
      <DialogContent sx={{ p: { xs: 3, sm: 5 } }}>
        <Typography
          id="stock-confirm-dialog-title"
          component="h2"
          sx={{ color: color.ink, fontSize: '28px', fontWeight: 700 }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            mt: 2,
            color: color.subtleText,
            fontSize: '17px',
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          sx={{
            mt: 4,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
          }}
        >
          <Button
            appVariant="outline"
            disabled={loading}
            onClick={onCancel}
            sx={{ height: 54, borderRadius: '14px' }}
          >
            취소
          </Button>
          <Button
            disabled={loading}
            onClick={onConfirm}
            sx={{ height: 54, borderRadius: '14px' }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              confirmLabel
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

interface HideStockDialogProps {
  open: boolean;
  stockName: string;
  loading: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: (hiddenUntilDate: string) => void;
}

function defaultHiddenDate() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
}

export function HideStockDialog({
  open,
  stockName,
  loading,
  error,
  onCancel,
  onConfirm,
}: HideStockDialogProps) {
  const [hiddenUntil, setHiddenUntil] = useState(defaultHiddenDate);

  function handleCancel() {
    if (loading) return;
    setHiddenUntil(defaultHiddenDate());
    onCancel();
  }

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleCancel}
      aria-labelledby="hide-stock-dialog-title"
      slotProps={{ paper: { sx: paperSx } }}
    >
      <DialogContent sx={{ p: { xs: 3, sm: 5 } }}>
        <Typography
          id="hide-stock-dialog-title"
          component="h2"
          sx={{ color: color.ink, fontSize: '28px', fontWeight: 700 }}
        >
          종목 숨기기
        </Typography>
        <Typography
          sx={{
            mt: 2,
            color: color.subtleText,
            fontSize: '17px',
            lineHeight: 1.6,
          }}
        >
          {stockName} 종목을 다시 표시할 날짜를 선택해 주세요.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          label="다시 표시할 날짜"
          type="date"
          value={hiddenUntil}
          onChange={(event) => setHiddenUntil(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ mt: 3 }}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          sx={{
            mt: 4,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 1.5,
          }}
        >
          <Button
            appVariant="outline"
            disabled={loading}
            onClick={handleCancel}
            sx={{ height: 54, borderRadius: '14px' }}
          >
            취소
          </Button>
          <Button
            disabled={loading || !hiddenUntil}
            onClick={() => onConfirm(hiddenUntil)}
            sx={{ height: 54, borderRadius: '14px' }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              '숨기기'
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

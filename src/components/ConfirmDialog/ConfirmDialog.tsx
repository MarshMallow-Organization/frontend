import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '../Button';
import { tokens } from '../../theme/tokens';

const { fontFamily, color } = tokens;

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  error?: string | null;
  isSubmitting?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  submittingLabel?: string;
}

/** 삭제 등 되돌릴 수 없는 동작을 실행하기 전 확인을 받는 범용 모달. */
export function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  error,
  isSubmitting = false,
  cancelLabel = '취소',
  confirmLabel = '확인',
  submittingLabel = '처리 중...',
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      slotProps={{
        paper: {
          sx: {
            width: 380,
            maxWidth: '92vw',
            borderRadius: '24px',
            fontFamily,
          },
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
        >
          <Typography
            sx={{ fontSize: '0.9375rem', fontWeight: 700, color: '#333' }}
          >
            {title}
          </Typography>
          <IconButton aria-label="닫기" onClick={onCancel} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {description && (
          <Typography
            sx={{ fontSize: '0.8125rem', color: color.textSecondary }}
          >
            {description}
          </Typography>
        )}

        {error && (
          <Typography
            sx={{ fontSize: '0.75rem', color: color.priceDown, mt: 1 }}
          >
            {error}
          </Typography>
        )}

        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}
        >
          <Button
            appVariant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
          <Button
            appVariant="filled"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? submittingLabel : confirmLabel}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;

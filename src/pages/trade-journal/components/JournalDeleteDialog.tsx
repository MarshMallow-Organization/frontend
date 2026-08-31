import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '../../../theme/tokens';
import { LAYOUT } from '../layout';

const { color, fontFamily } = tokens;
const { delete: del } = LAYOUT;

export interface JournalDeleteDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

/** Figma 632:2754 — 450×230, radius 20, 삭제(red) / 취소(outline) **/
export function JournalDeleteDialog({
  open,
  onConfirm,
  onCancel,
  loading = false,
}: JournalDeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      slotProps={{
        paper: {
          sx: {
            width: del.width,
            maxWidth: '92vw',
            height: del.height,
            borderRadius: `${del.radius}px`,
            border: '1px solid #ddd',
            boxShadow: '0px 0px 3px 0px rgba(0,0,0,0.1)',
            m: 2,
            overflow: 'hidden',
            fontFamily,
          },
        },
      }}
    >
      <DialogContent
        sx={{
          position: 'relative',
          p: 0,
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <IconButton
          aria-label="닫기"
          onClick={onCancel}
          sx={{
            position: 'absolute',
            top: 17,
            right: 17,
            width: 24,
            height: 24,
            p: 0,
            color: color.ink,
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <Typography
          sx={{
            position: 'absolute',
            top: 70,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: del.titleSize,
            fontWeight: 400,
            color: '#000',
            lineHeight: 1.2,
          }}
        >
          정말 삭제하시겠습니까?
        </Typography>

        <Box
          sx={{
            position: 'absolute',
            top: 130,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <Box
            component="button"
            type="button"
            onClick={onConfirm}
            disabled={loading}
            sx={{
              width: 140,
              height: 40,
              border: 0,
              borderRadius: '7px',
              backgroundColor: '#ff4d4d',
              color: color.white,
              fontFamily,
              fontSize: '0.9375rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              '&:hover': { backgroundColor: '#e64444' },
            }}
          >
            {loading ? '삭제 중…' : '삭제'}
          </Box>
          <Box
            component="button"
            type="button"
            onClick={onCancel}
            disabled={loading}
            sx={{
              width: 140,
              height: 40,
              borderRadius: '7px',
              border: '1px solid #a8a8a8',
              backgroundColor: color.white,
              color: '#a3a3a3',
              fontFamily,
              fontSize: '0.9375rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              '&:hover': { backgroundColor: '#f7f7f7' },
            }}
          >
            취소
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

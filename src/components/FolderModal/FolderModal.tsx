import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { TextField } from '../TextField';
import { Button } from '../Button';
import { tokens } from '../../theme/tokens';

const { fontFamily } = tokens;

export interface FolderModalProps {
  open: boolean;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

/** 가상 계좌 화면의 "폴더 추가" 모달. */
export function FolderModal({
  open,
  value,
  onChange,
  onCancel,
  onConfirm,
}: FolderModalProps) {
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
            폴더 추가
          </Typography>
          <IconButton aria-label="닫기" onClick={onCancel} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        <TextField
          label="폴더 이름"
          autoFocus
          fullWidth
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ex. 안정형 투자"
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button appVariant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button
            appVariant="filled"
            onClick={onConfirm}
            disabled={!value.trim()}
          >
            완료
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default FolderModal;

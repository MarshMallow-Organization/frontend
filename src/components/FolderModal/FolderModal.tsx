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
  /** 가상계좌 생성/이름 변경 API 에러 메시지 (400/404/409 등 서버 메시지를 그대로 표시). */
  error?: string | null;
  isSubmitting?: boolean;
  /** 모달 제목. 기본은 "폴더 추가"(생성), 이름 변경 시 다른 문구로 재사용한다. */
  title?: string;
  /** 완료 버튼 문구(대기 상태 아닐 때). */
  confirmLabel?: string;
  /** 완료 버튼 문구(제출 중일 때). */
  submittingLabel?: string;
}

/** 가상 계좌 화면의 "폴더 추가"/"이름 변경" 모달. */
export function FolderModal({
  open,
  value,
  onChange,
  onCancel,
  onConfirm,
  error,
  isSubmitting = false,
  title = '폴더 추가',
  confirmLabel = '완료',
  submittingLabel = '생성 중...',
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
            {title}
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
          error={Boolean(error)}
          helperText={error ?? ' '}
          disabled={isSubmitting}
          sx={{ mb: 1 }}
        />

        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}
        >
          <Button
            appVariant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            appVariant="filled"
            onClick={onConfirm}
            disabled={!value.trim() || isSubmitting}
          >
            {isSubmitting ? submittingLabel : confirmLabel}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default FolderModal;

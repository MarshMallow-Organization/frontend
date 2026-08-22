import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export interface HideConfirmScreenProps {
  targetName: string | null;
  guidePhrase: string;
  value: string;
  onChange: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

// Figma 339:1246: 배경 그라데이션 패널 위에 떠 있는 카드 하나(취소/완료), 헤더 없음.
// 안내 문구 자체를 보여주는 말풍선은 Figma 목업에 없지만, 그대로 베껴 써야 하는 문구를
// 화면 어디에도 노출하지 않으면 입력을 완료할 수 없으므로 그대로 유지한다.
export function HideConfirmScreen({
  targetName,
  guidePhrase,
  value,
  onChange,
  onCancel,
  onConfirm,
}: HideConfirmScreenProps) {
  const isMatch = value.trim() === guidePhrase;

  return (
    <Box
      sx={{
        minHeight: 560,
        borderRadius: '24px',
        background:
          'linear-gradient(135deg, #eef6ff 0%, #f7f2ff 50%, #eafcff 100%)',
        display: 'grid',
        placeItems: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: 420,
          maxWidth: '100%',
          borderRadius: '32px',
          border: `1px solid ${color.borderMuted}`,
          backgroundColor: 'rgba(255,255,255,0.8)',
          boxShadow: '0px 0px 16px -4px rgba(133,150,163,0.5)',
          p: 4,
        }}
      >
        <Typography
          sx={{ fontSize: '1rem', fontWeight: 600, color: color.text, mb: 2 }}
        >
          아래 안내 문구를 그대로 작성하시오
          {targetName ? ` · ${targetName}` : ''}
        </Typography>

        <Typography sx={{ fontSize: '0.875rem', color: color.text, mb: 2 }}>
          &ldquo;{guidePhrase}&rdquo;
        </Typography>

        <TextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="안내 문구를 입력해주세요"
          fullWidth
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button appVariant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button appVariant="filled" onClick={onConfirm} disabled={!isMatch}>
            완료
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default HideConfirmScreen;

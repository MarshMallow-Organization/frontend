import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import { Button } from '../Button';
import { tokens } from '../../theme/tokens';

const { color, fontFamily } = tokens;

export interface AuthSuccessDialogProps {
  open: boolean;
  /** 카드 제목 (Figma 1197:6849). 기본값은 디자인 그대로 "회원가입 완료". */
  title?: string;
  /** 인사말에 굵게 들어가는 사용자 이름 (Figma 1197:6850 의 "김민지"). 없으면 인사말 줄을 생략한다. */
  userName?: string;
  /** 이름 줄 아래 안내 문구 (Figma 1197:6850 2번째 줄). */
  message?: string;
  /** "확인" 클릭 시 호출. 보통 다음 화면으로 navigate 한다. */
  onConfirm: () => void;
}

/**
 * 회원가입 완료·API Key 등록 완료 후 다음 화면으로 넘어가기 전에 띄우는 완료 팝업.
 * Figma "회원가입 완료 팝업" (I6LiJUhTSEXkGDYdGPQlKF / 1197:6846).
 *
 * onClose 를 넘기지 않아 backdrop 클릭·ESC 로는 닫히지 않는다. "확인"만 다음으로 진행.
 */
export function AuthSuccessDialog({
  open,
  title = '회원가입 완료',
  userName,
  message = '지금 바로 Marsh Mallow를 경험해보세요!',
  onConfirm,
}: AuthSuccessDialogProps) {
  return (
    <Dialog
      open={open}
      slotProps={{
        paper: {
          sx: {
            width: 414,
            maxWidth: '92vw',
            boxSizing: 'border-box',
            px: '25px',
            pt: '56px', // Figma: 카드 상단 → 아이콘 원 (1197:6848→6851)
            pb: '40px', // Figma: 확인 버튼 → 카드 하단 (1197:6852→6848)
            borderRadius: '40px',
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(2px)',
            border: '1px solid rgba(133,150,163,0.5)', // token textSecondary 계열 @ 50%
            boxShadow: '0px 0px 10px -2px rgba(133,150,163,0.5)',
            fontFamily,
          },
        },
      }}
    >
      <Stack sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Box
          sx={{
            width: 62,
            height: 62,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(189,232,242,0.72)', // token heatmapBlue #bde8f2 @ 72%
          }}
        >
          <CheckIcon sx={{ width: 38, height: 38, color: color.primary }} />
        </Box>

        <Typography
          component="h2"
          sx={{
            mt: '23px', // 아이콘 원 → 제목 (1197:6851→6849)
            fontWeight: 700,
            fontSize: 32,
            letterSpacing: '-0.64px',
            color: '#1e1e1e', // Figma 1197:6849
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: '30px', // 제목 → 안내 문구 (1197:6849→6850)
            fontSize: 18,
            lineHeight: 1.6,
            letterSpacing: '-0.36px',
            color: '#1e1e1e', // Figma 1197:6850
          }}
        >
          {userName != null && userName !== '' && (
            <>
              {'환영합니다, '}
              <Box component="span" sx={{ fontWeight: 700 }}>
                {userName}
              </Box>
              {' 님.'}
              <br />
            </>
          )}
          {message}
        </Typography>

        <Button
          appVariant="filled"
          onClick={onConfirm}
          sx={{
            mt: '44px', // 안내 문구 → 확인 버튼 (1197:6850→6852)
            width: 255,
            maxWidth: '100%',
            py: '15px',
            borderRadius: '50px',
            fontSize: 20,
            fontWeight: 700,
            boxShadow: 'none',
          }}
        >
          확인
        </Button>
      </Stack>
    </Dialog>
  );
}

export default AuthSuccessDialog;

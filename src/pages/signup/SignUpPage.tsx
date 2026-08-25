import { useState } from 'react';
import type { FormEvent } from 'react';
import Box from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { signup } from '../../features/auth/authApi';
import { ApiError } from '../../lib/api';
import { navigate } from '../../lib/navigation';
import { tokens } from '../../theme/tokens';
import googleLogo from '../../assets/icons/google.svg';

const { color } = tokens;

/**
 * 회원가입 (Figma 356:1871).
 *
 * 로그인 화면(92:624)과 좌우 대칭이다. 바깥 레이아웃(페이지 여백, 유리 바탕,
 * pane 비율, 브랜드 영역)은 LoginPage.tsx와 동일한 값을 쓰고 좌우만 바꿨다.
 * 두 화면이 함께 움직여야 하므로 이 값들은 한쪽만 고치지 않는다.
 */

// Form-pane background wash. LoginPage와 동일 (92:662).
const FORM_PANE_BG = [
  'radial-gradient(60% 56% at 104% 34%, rgba(75,220,255,0.40) 0%, rgba(75,220,255,0) 68%)',
  'radial-gradient(54% 54% at 64% 64%, rgba(184,113,255,0.22) 0%, rgba(184,113,255,0) 66%)',
  'radial-gradient(54% 54% at 38% 64%, rgba(73,114,255,0.20) 0%, rgba(73,114,255,0) 66%)',
  'radial-gradient(52% 56% at 2% 74%, rgba(77,183,255,0.34) 0%, rgba(77,183,255,0) 68%)',
].join(',');

const API_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');
// LoginPage와 동일한 값. 백엔드 auth 컨트롤러는 `/auths`이므로 실제 OAuth 경로가
// 확정되면 두 화면을 함께 수정한다.
const GOOGLE_OAUTH_URL = `${API_BASE}/auth/google`;

// Figma 주석(356:1893): 가입 완료 후 API Key 등록 화면으로 이동. Google OAuth도 동일.
// 해당 화면과 app.tsx 분기가 아직 없어 지금은 로그인으로 폴백된다.
const AFTER_SIGNUP_PATH = '/api-key';

// 356:1897~1904 — 라벨 top에서 밑줄까지 63px. 이 높이가 곧 카드 높이(344px)를
// 결정하므로, 공용 TextField의 label prop(20px 줄 높이) 대신 라벨을 직접 그린다.
const FIELD_ROW_HEIGHT = 63;

const underlineFieldSx = {
  flex: 1,
  '& .MuiOutlinedInput-root': {
    height: '100%',
    borderRadius: 0,
    '& fieldset': { border: 'none' },
  },
  '& .MuiOutlinedInput-input': { padding: '0 4px', fontSize: 18 },
};

type FormState = {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
};

type FieldKey = keyof FormState;

const INITIAL_FORM: FormState = {
  email: '',
  name: '',
  password: '',
  passwordConfirm: '',
};

const FIELDS: {
  key: FieldKey;
  label: string;
  type: string;
  autoComplete: string;
}[] = [
  { key: 'email', label: '이메일', type: 'email', autoComplete: 'email' },
  { key: 'name', label: '이름', type: 'text', autoComplete: 'name' },
  {
    key: 'password',
    label: '비밀번호',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    key: 'passwordConfirm',
    label: '비밀번호 확인',
    type: 'password',
    autoComplete: 'new-password',
  },
];

/** 356:1897 / 356:1905 — 필수 표시 별표 + 라벨 (18px #9a9a9a, 줄 높이 21px) */
function FieldLabel({ htmlFor, text }: { htmlFor: string; text: string }) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      sx={{
        fontSize: 18,
        lineHeight: '21px',
        fontWeight: 500,
        color: color.signupLabel,
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{ fontSize: 15, color: color.signupRequired, mr: '2px' }}
      >
        *
      </Box>
      {text}
    </Typography>
  );
}

export default function SignUpPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleSignUp = () => {
    window.location.href = GOOGLE_OAUTH_URL;
  };

  const validate = (): string => {
    if (FIELDS.some(({ key }) => form[key].trim() === '')) {
      return '모든 항목을 입력해 주세요.';
    }
    if (form.password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }
    if (form.password !== form.passwordConfirm) {
      return '비밀번호가 일치하지 않습니다.';
    }
    return '';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = validate();
    if (message !== '') {
      setError(message);
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      // TODO: accessToken 저장소가 아직 없다. 인증 상태 관리가 정해지면 연결한다.
      await signup({
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
      });
      navigate(AFTER_SIGNUP_PATH);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : '회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100svh',
        boxSizing: 'border-box',
        p: { xs: '3vh 4vw', md: '5.5vh 4.5vw' },
        background:
          'linear-gradient(135deg, #eef6ff 0%, #f7f2ff 50%, #eafcff 100%)',
        // 추가: 매우 큰 화면에서도 배경이 계속 적용됨
        minWidth: '100vw',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          height: { xs: 'auto', md: '100%' },
          minHeight: { md: '89svh' },
          borderRadius: '40px',
          overflow: 'hidden',
          boxShadow: '0 24px 70px rgba(60, 80, 120, 0.18)',
        }}
      >
        {/* left: brand pane (356:1881) — 로그인 화면의 우측 pane과 같은 값 */}
        <Stack
          sx={{
            flex: '1 1 38%',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '23px', // web site name → wordmark (356:1883→1894)
            px: 'clamp(24px, 5vw, 64px)',
            py: { xs: 6, md: 0 },
            pb: { xs: 6, md: '88px' },
            backgroundColor: color.white,
          }}
        >
          <Typography sx={{ fontSize: 20, color: 'common.black' }}>
            web site name
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Buffy', Georgia, serif",
              fontWeight: 400, // 700 → 400 (Bold 웨이트 없음)
              fontSize: 'clamp(28px, 3.2vw, 50px)',
              color: color.loginWordmark,
            }}
          >
            Marsh Mallow
          </Typography>
        </Stack>

        {/* right: form pane */}
        <Box
          sx={{
            position: 'relative',
            flex: '1 1 62%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: 'rgba(212,212,212,0.15)',
            backgroundImage: FORM_PANE_BG,
            py: { xs: 6, md: 0 },
            // 로그인 화면의 중앙 정렬 위치와 동일: (89svh - 694px) / 2
            pt: { xs: 6, md: 'max(24px, calc(44.5svh - 347px))' },
          }}
        >
          <Stack
            sx={{
              position: 'relative',
              width: 'min(100%, 625px)',
              px: 4,
              alignItems: 'center',
            }}
          >
            <Typography
              component="h1"
              sx={{
                mb: '39px', // title bottom → card top (356:1893→1896)
                fontSize: 'clamp(32px, 4.5vw, 55px)', // 356:1893 = 55px
                fontWeight: 500,
                color: color.loginTitle,
              }}
            >
              회원가입
            </Typography>

            <Stack
              component="form"
              onSubmit={(event) => {
                void handleSubmit(event);
              }}
              noValidate
              sx={{ width: '100%', alignItems: 'center' }}
            >
              {/* 356:1896 — 625×344, r20, shadow 0 0 3px */}
              <Stack
                sx={{
                  width: '100%',
                  gap: '12px',
                  p: '28px 36px 28px 31px',
                  borderRadius: '20px',
                  backgroundColor: color.white,
                  boxShadow: `0 0 3px 0 ${color.signupCardShadow}`,
                }}
              >
                {FIELDS.map(({ key, label, type, autoComplete }) => (
                  <Stack
                    key={key}
                    sx={{
                      height: FIELD_ROW_HEIGHT,
                      borderBottom: `1px solid ${color.signupFieldLine}`,
                    }}
                  >
                    <FieldLabel htmlFor={`signup-${key}`} text={label} />
                    <TextField
                      id={`signup-${key}`}
                      type={type}
                      fullWidth
                      value={form[key]}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      autoComplete={autoComplete}
                      sx={underlineFieldSx}
                    />
                  </Stack>
                ))}
              </Stack>

              {error !== '' && (
                <Typography
                  role="alert"
                  sx={{
                    alignSelf: 'flex-start',
                    mt: '12px',
                    fontSize: 15,
                    color: color.signupRequired,
                  }}
                >
                  {error}
                </Typography>
              )}

              {/* 356:1910 */}
              <Button
                appVariant="filled"
                type="submit"
                fullWidth
                disabled={submitting}
                sx={{
                  mt: '36px', // card bottom → button (356:1896→1910)
                  height: 63,
                  borderRadius: '50px',
                  fontSize: 30, // 356:1911
                  fontWeight: 500,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                }}
              >
                회원가입
              </Button>
            </Stack>

            {/* 356:1913 간편로그인 구분 텍스트 */}
            <Stack
              direction="row"
              sx={{
                mt: '40px', // button → 간편로그인 (356:1910→1916)
                width: 'min(100%, 443px)',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <Box
                sx={{ flex: 1, height: '1px', bgcolor: color.signupDivider }}
              />
              <Typography
                sx={{
                  fontSize: 15, // 356:1916
                  fontWeight: 500,
                  color: color.signupDividerText,
                }}
              >
                간편로그인
              </Typography>
              <Box
                sx={{ flex: 1, height: '1px', bgcolor: color.signupDivider }}
              />
            </Stack>

            {/* 356:1918 구글 — 443×52, r80, 보더 #e6e6e6 */}
            <MuiButton
              type="button"
              onClick={handleGoogleSignUp}
              disableElevation
              sx={{
                mt: '40px',
                position: 'relative',
                width: 'min(100%, 443px)',
                height: 52,
                padding: 0,
                borderRadius: '80px',
                border: `1px solid ${color.loginOauthBorder}`,
                backgroundColor: color.white,
                color: color.loginOauthText,
                fontSize: 15, // 356:1920
                fontWeight: 500,
                '&:hover': { backgroundColor: color.bg },
              }}
            >
              <img
                src={googleLogo}
                alt=""
                style={{
                  position: 'absolute',
                  left: 24,
                  width: 25,
                  height: 26,
                }}
              />
              Google 계정으로 가입
            </MuiButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

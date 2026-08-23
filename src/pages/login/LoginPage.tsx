import { useState } from 'react';
import Box from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { tokens } from '../../theme/tokens';
import googleLogo from '../../assets/icons/google.svg';
import { navigate } from '../../lib/navigation';

const { color } = tokens;

// Form-pane background wash. Reproduces the Figma gradient blobs (92:662 —
// cyan #4bdcff / lilac #b871ff / blue #4972ff / azure #4db7ff) as pure CSS
// radial-gradients instead of blurred SVGs blended with hard-light. Vectors
// render smooth at any scale (no rasterized-blur banding, no harsh blend).
const FORM_PANE_BG = [
  'radial-gradient(60% 56% at 104% 34%, rgba(75,220,255,0.40) 0%, rgba(75,220,255,0) 68%)',
  'radial-gradient(54% 54% at 64% 64%, rgba(184,113,255,0.22) 0%, rgba(184,113,255,0) 66%)',
  'radial-gradient(54% 54% at 38% 64%, rgba(73,114,255,0.20) 0%, rgba(73,114,255,0) 66%)',
  'radial-gradient(52% 56% at 2% 74%, rgba(77,183,255,0.34) 0%, rgba(77,183,255,0) 68%)',
].join(',');

const API_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, ''); //api.ts에  BASE_URL에 export 안되있길래 그냥 만듬
const GOOGLE_OAUTH_URL = `${API_BASE}/auth/google`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_OAUTH_URL;
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
        {/* left: form pane */}
        <Box
          sx={{
            position: 'relative',
            flex: '1 1 62%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: 'rgba(212,212,212,0.15)',
            backgroundImage: FORM_PANE_BG,
            py: { xs: 6, md: 0 },
          }}
        >
          <Stack
            component="form"
            onSubmit={(e) => e.preventDefault()}
            sx={{
              position: 'relative',
              width: 'min(100%, 625px)',
              px: 4,
              alignItems: 'center',
              // Figma 92:624 rhythm is deliberately airy & uneven (not uniform).
              gap: 0,
            }}
          >
            <Typography
              component="h1"
              sx={{
                mb: '98px', // title bottom → first field (92:645→646 exact)
                fontSize: 'clamp(32px, 4.5vw, 55px)',
                fontWeight: 500,
                color: color.loginTitle,
              }}
            >
              로그인
            </Typography>

            <Stack sx={{ width: '100%', gap: '17px' }}>
              <TextField
                appVariant="pill"
                id="login-email"
                label="이메일"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <TextField
                appVariant="pill"
                id="login-password"
                label="비밀번호"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Stack>

            <Button
              appVariant="filled"
              type="submit"
              fullWidth
              sx={{
                mt: '119px', // password field bottom → button (92:649→658 exact)
                height: 63,
                borderRadius: '50px',
                fontSize: 30, // 92:660
                fontWeight: 500,
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              }}
            >
              로그인
            </Button>

            <Stack
              direction="row"
              sx={{
                mt: '22px', // button → links (Figma ~small)
                alignItems: 'center',
                gap: '10px',
                fontSize: 17,
                color: color.loginLink,
              }}
            >
              <Link //추후 href 교체
                href="#"
                underline="hover"
                sx={{ color: 'inherit', fontSize: 17 }}
              >
                비밀번호 찾기
              </Link>
              <Box
                component="span"
                aria-hidden
                sx={{ color: color.loginSeparator, fontSize: 13 }}
              >
                |
              </Box>
              <Link
                href="#"
                underline="hover"
                sx={{ color: 'inherit', fontSize: 17 }}
              >
                이메일 찾기
              </Link>
              <Box
                component="span"
                aria-hidden
                sx={{ color: color.loginSeparator, fontSize: 13 }}
              >
                |
              </Box>
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/signup')}
                underline="hover"
                sx={{ color: 'inherit', fontSize: 17 }}
              >
                회원가입
              </Link>
            </Stack>

            {/* 간편로그인 (782:4352) — 443×52, r80, 보더 #e6e6e6 */}
            <MuiButton
              type="button"
              onClick={handleGoogleLogin}
              disableElevation
              sx={{
                mt: '27px', // links → 간편로그인 (341:3855→782:4358)
                position: 'relative',
                width: 'min(100%, 443px)',
                height: 52,
                padding: 0,
                borderRadius: '80px',
                border: `1px solid ${color.loginOauthBorder}`,
                backgroundColor: color.white,
                color: color.loginOauthText,
                fontSize: 15, // 782:4360
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
              Google로 로그인
            </MuiButton>
          </Stack>
        </Box>

        {/* right: brand pane */}
        <Stack
          sx={{
            flex: '1 1 38%',
            alignItems: 'center',
            // Figma 92:634: brand block is bottom-anchored (logo/icon area above).
            justifyContent: 'flex-end',
            gap: '23px', // web site name → wordmark (92:635→671)
            px: 'clamp(24px, 5vw, 64px)',
            pb: 'clamp(48px, 9%, 88px)',
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
      </Box>
    </Box>
  );
}

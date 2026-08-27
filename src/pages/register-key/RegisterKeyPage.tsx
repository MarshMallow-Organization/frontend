import { useState } from 'react';
import type { FormEvent } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { TextField } from '../../components/TextField';
import { Button } from '../../components/Button';
import { tokens } from '../../theme/tokens';
import { navigate } from '../../lib/navigation';

const { color } = tokens;

/** 토스증권 오픈 API 키 발급처 (Figma 782:4444 개발 주석) */
const TOSS_OPEN_API_URL = 'https://corp.tossinvest.com/ko/open-api';

// LoginPage / SignUpPage와 동일한 폼 페인 배경 (92:662).
// TODO(tech-debt): 세 화면이 모두 머지된 뒤 FORM_PANE_BG를
// src/constants/auth.ts 로 추출해 공유한다.
const FORM_PANE_BG = [
  'radial-gradient(60% 56% at 104% 34%, rgba(75,220,255,0.40) 0%, rgba(75,220,255,0) 68%)',
  'radial-gradient(54% 54% at 64% 64%, rgba(184,113,255,0.22) 0%, rgba(184,113,255,0) 66%)',
  'radial-gradient(54% 54% at 38% 64%, rgba(73,114,255,0.20) 0%, rgba(73,114,255,0) 66%)',
  'radial-gradient(52% 56% at 2% 74%, rgba(77,183,255,0.34) 0%, rgba(77,183,255,0) 68%)',
].join(',');

/**
 * API Key 등록 화면 (Figma 782:4367).
 *
 * 경로는 `/register-key`다. `/api-key`는 vite.config.ts의 `/api` 프록시 접두사에
 * 걸려 dev 서버가 index.html 대신 백엔드로 프록시해 버리므로 쓰지 않는다.
 *
 * 로그인/회원가입과 같은 1920×1080 시안 계열이며, 폼 페인이 왼쪽·브랜드 페인이
 * 오른쪽인 로그인 화면과 동일한 배치다. 바깥 레이아웃(페이지 여백, 유리 바탕,
 * pane 비율, 브랜드 영역)은 LoginPage.tsx와 같은 값을 쓰므로 한쪽만 고치지 않는다.
 *
 * 주의: 시안 주석에 따르면 이 화면은 최초 사용자에게만 노출된다. 노출 조건은
 * 백엔드 계약(사용자 API Key 등록 여부)이 확정된 뒤 라우팅 단에서 처리한다.
 */
export default function RegisterKeyPage() {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: 백엔드에 API Key 등록 엔드포인트가 생기면
    // features/auth/authApi.ts에 registerApiKey를 추가해 연결한다.
    // (회원가입 브랜치에서 만든 authApi를 그대로 확장하면 된다.)
  };

  const handleSkip = () => {
    navigate('/home');
  };

  return (
    <Box
      sx={{
        minHeight: '100svh',
        boxSizing: 'border-box',
        p: { xs: '3vh 4vw', md: '5.5vh 4.5vw' },
        background:
          'linear-gradient(135deg, #eef6ff 0%, #f7f2ff 50%, #eafcff 100%)',
        // 회원가입 브랜치와 동일: 매우 큰 화면에서도 배경이 계속 적용됨
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
        {/* left: form pane (782:4368 유리 바탕 좌측 영역) */}
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
            onSubmit={handleSubmit}
            sx={{
              position: 'relative',
              width: 'min(100%, 625px)',
              px: 4,
              alignItems: 'center',
              // 시안 세로 리듬이 균일하지 않아 gap 대신 요소별 여백을 쓴다.
              gap: 0,
            }}
          >
            <Typography
              component="h1"
              sx={{
                mb: '41px', // 제목 하단 → 안내문 (782:4389 → 782:4444)
                fontSize: 'clamp(32px, 4.5vw, 55px)',
                fontWeight: 500,
                color: color.loginTitle,
              }}
            >
              API Key 등록
            </Typography>

            <Typography
              sx={{
                mb: '41px', // 안내문 → API Key 라벨 (782:4444 → 782:4392)
                width: '100%',
                fontSize: 'clamp(14px, 1.1vw, 20px)',
                lineHeight: 1.5,
                color: color.loginLabel,
              }}
            >
              Marshmallow는 토스증권 API를 사용하여 통신하므로, 원활한 사용을
              위해서는{' '}
              <Box component="span" sx={{ fontWeight: 700 }}>
                토스증권 API 키
              </Box>
              를 등록해야 합니다.{' '}
              <Link
                href={TOSS_OPEN_API_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: 'inherit', textDecorationColor: 'currentColor' }}
              >
                여기에서 발급
              </Link>
              받으신 후, 토스증권 API Key를 등록해 주세요. 등록하신 API Key는
              암호화되어 보관됩니다.
            </Typography>

            <Stack sx={{ width: '100%', gap: '17px' }}>
              <TextField
                appVariant="pill"
                id="api-key"
                label="API Key"
                fullWidth
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <TextField
                appVariant="pill"
                id="api-secret"
                label="API Secret"
                type="password"
                fullWidth
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </Stack>

            <Button
              appVariant="filled"
              type="submit"
              fullWidth
              sx={{
                mt: '119px', // API Secret 하단 → 등록 버튼 (782:4394 → 782:4403)
                height: 63,
                borderRadius: '50px',
                fontSize: 30, // 782:4404
                fontWeight: 500,
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              }}
            >
              등록
            </Button>

            <Link
              component="button"
              type="button"
              onClick={handleSkip}
              underline="hover"
              sx={{
                mt: '34px', // 등록 버튼 → 나중에 등록하기 (782:4403 → 782:4398)
                color: color.loginLink,
                fontSize: 17,
              }}
            >
              나중에 등록하기
            </Link>
          </Stack>
        </Box>

        {/* right: brand pane (782:4377) — 로그인 화면과 동일 구성 */}
        <Stack
          sx={{
            flex: '1 1 38%',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '23px', // web site name → wordmark (782:4379→4405)
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
              fontWeight: 400, // Buffy에는 Bold 웨이트가 없다
              fontSize: 'clamp(28px, 3.2vw, 50px)', // 782:4405 = 50px
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

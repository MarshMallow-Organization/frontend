// src/pages/auth/GoogleCallbackPage.tsx
// Google → 프론트 → 백엔드 → 로그인 처리
//
// AI/개발자 주의: 현재는 app.tsx의 pathname 분기로 진입한다. 라우터 도입 시
// useSearchParams / useNavigate로 바꾸면 되며, 아래 로직은 그대로 옮길 수 있다.

import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import { ApiError, apiFetch } from '../../lib/api';
import { GOOGLE_REDIRECT_URI, popStoredState } from '../../lib/googleAuth';

interface GoogleLoginResponse {
  accessToken?: string;
  user?: { id: number | string; email: string; nickname?: string };
}

/** 콜백 URL 검사 결과. 성공이면 인가 코드, 실패면 사용자에게 보여줄 메시지. */
type CallbackParams =
  { ok: true; code: string } | { ok: false; message: string };

function readCallbackParams(): CallbackParams {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const oauthError = params.get('error');

  if (oauthError) {
    return {
      ok: false,
      message:
        oauthError === 'access_denied'
          ? 'Google 로그인이 취소되었습니다.'
          : `Google 인증에 실패했습니다. (${oauthError})`,
    };
  }
  if (!code) {
    return { ok: false, message: '인가 코드가 전달되지 않았습니다.' };
  }

  // CSRF 방지: 요청 시 저장한 state와 일치해야 한다(1회용이라 꺼내면 지워진다).
  const savedState = popStoredState();
  if (!savedState || savedState !== state) {
    return { ok: false, message: '잘못된 요청입니다. 다시 시도해 주세요.' };
  }

  return { ok: true, code };
}

export default function GoogleCallbackPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // 인가 코드는 1회용이므로 StrictMode의 이중 실행을 막는다.
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    // 검증과 토큰 교환을 하나의 비동기 흐름으로 묶는다.(effect 본문에서 setState를 직접 호출하지 않기 위한 구조이기도 하다.)
    const handleCallback = async (): Promise<string | null> => {
      const parsed = readCallbackParams();
      if (!parsed.ok) return parsed.message;

      try {
        // 인가 코드를 백엔드로 POST → JWT & 유저 정보 수신
        const data = await apiFetch<GoogleLoginResponse>('/auth/google', {
          method: 'POST',
          credentials: 'include', // refresh token을 쿠키로 받을 경우 필요
          body: JSON.stringify({
            code: parsed.code,
            redirectUri: GOOGLE_REDIRECT_URI,
          }),
        });

        // 저장 후 로그인 처리
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // navigation.ts의 navigate()는 pushState라 인가 코드가 담긴 URL이
        // 히스토리에 남는다. 로그인 직후에는 replace로 흔적을 지운다.
        window.location.replace('/');
        return null;
      } catch (e) {
        if (e instanceof ApiError) {
          return `로그인에 실패했습니다. (${e.status})`;
        }
        return '로그인 처리 중 오류가 발생했습니다.';
      }
    };

    void handleCallback().then(setErrorMessage);
  }, []);

  return (
    <Box
      sx={{ minHeight: '100svh', display: 'grid', placeItems: 'center', px: 3 }}
    >
      {errorMessage ? (
        <Stack sx={{ gap: 2, alignItems: 'center' }}>
          <Typography sx={{ fontSize: 18 }}>{errorMessage}</Typography>
          <Link href="/" underline="hover">
            로그인 화면으로 돌아가기
          </Link>
        </Stack>
      ) : (
        <Stack sx={{ gap: 2, alignItems: 'center' }}>
          <CircularProgress />
          <Typography sx={{ fontSize: 16 }}>로그인 중입니다…</Typography>
        </Stack>
      )}
    </Box>
  );
}

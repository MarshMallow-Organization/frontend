import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import AppShell from '../../components/AppShell/AppShell';
import BaseCard from '../../components/BaseCard/BaseCard';
import Button from '../../components/Button/Button';
import TextField from '../../components/TextField/TextField';
import { ApiError } from '../../lib/api';
import { navigate } from '../../lib/navigation';
import { getMyInfo, type UserInfo } from '../../features/users/usersApi';
import { tokens } from '../../theme/tokens';
import { MY_PAGE_CARD_SX, MY_PAGE_CARD_TITLE_SX } from './card-styles';
import googleLogo from '../../assets/icons/google.svg';

const { color } = tokens;

/**
 * 마이페이지 · 회원 정보 수정 (Figma 824:6502).
 *
 * 마이페이지 대시보드(`MyPage.tsx`)의 "프로필 수정"에서 진입(`/my-page/edit`).
 * 공통 헤더/패널은 `AppShell`이 담당하고 이 파일은 패널 children만 그린다.
 *
 * 데이터 범위:
 * - 이름·이메일·프로필 이미지·증권 API 연동 상태 → `GET /users/me` 실연동.
 * - 저장 / 비밀번호 변경 / API Key·Secret 저장 / Google 연동 해제 → 백엔드
 *   엔드포인트가 아직 없어 화면에서만 처리한다(mock, 네트워크 호출 없음).
 */

// Figma 라벨 텍스트 색 (#5d5d5d / #3f3f3f). 근사 토큰이 없어 화면 상수로 둔다.
const LABEL_INK = '#5d5d5d';
const TITLE_INK = '#3f3f3f';

const FIELD_BORDER = 'rgba(155,155,155,0.5)';
const ROW_DIVIDER = 'rgba(155,155,155,0.28)';
const LABEL_BG = 'rgba(230,234,238,0.5)';

// 공용 TextField(pill/outlined)로는 표현이 안 되는 Figma의 작은 입력칸
// (높이 37, 1.5px #9b9b9b@50%, 살짝 둥근 모서리)을 sx로 맞춘다.
const compactInputSx = {
  '& .MuiOutlinedInput-root': {
    height: 37,
    borderRadius: '6px',
    backgroundColor: color.white,
  },
  '& .MuiOutlinedInput-input': { padding: '0 12px', fontSize: 15 },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: FIELD_BORDER,
    borderWidth: '1.5px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: FIELD_BORDER },
} as const;

const MIN_PASSWORD_LENGTH = 8;

function splitEmail(email: string): { local: string; domain: string } {
  const at = email.lastIndexOf('@');
  if (at === -1) return { local: email, domain: '' };
  return { local: email.slice(0, at), domain: email.slice(at + 1) };
}

/** 정보 카드 안 필드 묶음 — 옅은 테두리로 감싼 그룹. */
function FieldGroup({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        border: `1px solid ${ROW_DIVIDER}`,
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.4)',
      }}
    >
      {children}
    </Box>
  );
}

/** 필드 그룹 안 한 줄 — [라벨 셀 | 내용 셀]. */
function FieldLine({
  label,
  badge,
  last = false,
  children,
}: {
  label: string;
  badge?: ReactNode;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: 57,
        borderBottom: last ? 'none' : `1px solid ${ROW_DIVIDER}`,
      }}
    >
      <Box
        sx={{
          width: { xs: 108, sm: 150, md: 196 },
          flexShrink: 0,
          backgroundColor: LABEL_BG,
          borderRight: `1px solid ${ROW_DIVIDER}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 0.5,
          px: { xs: 1.5, md: '30px' },
          py: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: 14, md: 20 },
            fontWeight: 500,
            color: LABEL_INK,
            letterSpacing: '-0.4px',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Typography>
        {badge}
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
          px: { xs: 1.5, md: '28px' },
          py: 1.25,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function ConnectionBadge({ connected }: { connected: boolean }) {
  return (
    <Typography
      sx={{
        fontSize: { xs: 11, md: 13 },
        fontWeight: 600,
        color: connected ? color.selected : color.textSecondary,
      }}
    >
      {connected ? '연동됨' : '미연동'}
    </Typography>
  );
}

type FormState = {
  emailLocal: string;
  emailDomain: string;
  newPassword: string;
  passwordConfirm: string;
  apiKey: string;
  apiSecret: string;
};

const EMPTY_FORM: FormState = {
  emailLocal: '',
  emailDomain: '',
  newPassword: '',
  passwordConfirm: '',
  apiKey: '',
  apiSecret: '',
};

export default function MyPageEditPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saveNotice, setSaveNotice] = useState('');

  const baseForm = useMemo<FormState>(() => {
    if (!user) return EMPTY_FORM;
    const { local, domain } = splitEmail(user.email);
    return { ...EMPTY_FORM, emailLocal: local, emailDomain: domain };
  }, [user]);

  useEffect(() => {
    const controller = new AbortController();

    getMyInfo(controller.signal)
      .then((data) => {
        setUser(data);
        const { local, domain } = splitEmail(data.email);
        setForm({ ...EMPTY_FORM, emailLocal: local, emailDomain: domain });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setLoadError(
          err instanceof ApiError
            ? err.message
            : '회원 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
        );
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const setField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormError('');
    setSaveNotice('');
  };

  const handleSave = () => {
    const { newPassword, passwordConfirm } = form;
    if (newPassword !== '' || passwordConfirm !== '') {
      if (newPassword.length < MIN_PASSWORD_LENGTH) {
        setFormError(`비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`);
        return;
      }
      if (newPassword !== passwordConfirm) {
        setFormError('비밀번호가 일치하지 않습니다.');
        return;
      }
    }
    setFormError('');
    // TODO(mock): 회원 정보 저장 API (PATCH /users/me, 비밀번호 변경, API Key 저장)가
    // 백엔드에 아직 없다. 엔드포인트가 확정되면 features/users에 추가하고 연결한다.
    setSaveNotice('저장 기능은 아직 서버에 연결되지 않았습니다. (화면 확인용)');
  };

  const handleCancel = () => {
    setForm(baseForm);
    setFormError('');
    setSaveNotice('');
    navigate('/my-page');
  };

  const tossConnected = user?.tossApi.connected ?? false;

  return (
    <AppShell currentPageLabel="마이페이지 수정">
      <Box
        component="main"
        sx={{
          flex: 1,
          width: '100%',
          minWidth: 0,
          overflowY: 'auto',
          px: { xs: 2, md: 'clamp(20px, 3vw, 43px)' },
          py: { xs: 2, md: 'clamp(16px, 2vw, 24px)' },
          fontFamily: tokens.fontFamily,
        }}
      >
        <Typography
          component="h1"
          sx={{
            textAlign: 'center',
            fontSize: 'clamp(26px, 3.2vw, 48px)',
            fontWeight: 500,
            color: TITLE_INK,
            letterSpacing: '-0.96px',
            mb: 'clamp(16px, 2.5vw, 32px)',
          }}
        >
          회원 정보 수정
        </Typography>

        <BaseCard
          component="section"
          sx={{
            ...MY_PAGE_CARD_SX,
            maxWidth: 1769,
            mx: 'auto',
            backgroundColor: 'rgba(255,255,255,0.5)',
            p: { xs: '20px 16px', md: 'clamp(24px, 3vw, 40px)' },
          }}
        >
          <Typography sx={{ ...MY_PAGE_CARD_TITLE_SX, mb: 2 }}>
            회원 정보 입력
          </Typography>

          <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
            이름·이메일·연동 상태는 서버에서 불러온 값입니다. 저장·비밀번호
            변경·API Key 입력은 아직 서버에 연결되지 않아 저장되지 않습니다.
          </Alert>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={32} />
            </Box>
          ) : loadError !== '' ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {loadError}
            </Alert>
          ) : (
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 2, md: 'clamp(24px, 4vw, 56px)' },
                alignItems: 'flex-start',
              }}
            >
              {/* 프로필 이미지 — 업로드는 미구현(TODO) */}
              <Box
                sx={{
                  position: 'relative',
                  flexShrink: 0,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                <Avatar
                  src={user?.profileImageUrl ?? undefined}
                  sx={{
                    width: { sm: 96, md: 115 },
                    height: { sm: 96, md: 115 },
                    bgcolor: '#c8d9e4',
                    color: color.white,
                  }}
                >
                  <PersonRoundedIcon sx={{ width: '62%', height: '62%' }} />
                </Avatar>
                <ButtonBase
                  aria-label="프로필 사진 변경"
                  onClick={() =>
                    setSaveNotice('프로필 사진 변경은 아직 준비 중입니다.')
                  }
                  sx={{
                    position: 'absolute',
                    right: -2,
                    bottom: 2,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: color.white,
                    boxShadow: '0 0 3px rgba(0,0,0,0.25)',
                    color: '#6f6f6f',
                  }}
                >
                  <PhotoCameraRoundedIcon sx={{ fontSize: 17 }} />
                </ButtonBase>
              </Box>

              <Stack sx={{ flex: 1, minWidth: 0, gap: 2 }}>
                <FieldGroup>
                  <FieldLine label="이름">
                    <Typography
                      sx={{
                        fontSize: { xs: 15, md: 20 },
                        fontWeight: 600,
                        color: LABEL_INK,
                      }}
                    >
                      {user?.name ?? '—'}
                    </Typography>
                  </FieldLine>
                  <FieldLine label="e-mail" last>
                    <TextField
                      aria-label="이메일 아이디"
                      placeholder="kimminji"
                      value={form.emailLocal}
                      onChange={(e) => setField('emailLocal', e.target.value)}
                      autoComplete="email"
                      sx={{ ...compactInputSx, width: 'min(240px, 46vw)' }}
                    />
                    <Typography sx={{ fontSize: 18, color: 'rgba(0,0,0,0.5)' }}>
                      @
                    </Typography>
                    <TextField
                      aria-label="이메일 도메인"
                      placeholder="naver.com"
                      value={form.emailDomain}
                      onChange={(e) => setField('emailDomain', e.target.value)}
                      sx={{ ...compactInputSx, width: 'min(160px, 34vw)' }}
                    />
                  </FieldLine>
                </FieldGroup>

                <FieldGroup>
                  <FieldLine label="Google 연동" last>
                    {/* TODO(mock): Google 연동 상태 조회/해제 API 미정. 정적 표시. */}
                    <Box
                      component="img"
                      src={googleLogo}
                      alt=""
                      sx={{ width: 19, height: 19 }}
                    />
                    <Typography
                      sx={{ fontSize: { xs: 14, md: 18 }, color: LABEL_INK }}
                    >
                      계정으로 로그인
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <ButtonBase
                      onClick={() =>
                        setSaveNotice('Google 연동 해제는 아직 준비 중입니다.')
                      }
                      sx={{
                        px: '18px',
                        py: '7px',
                        borderRadius: '999px',
                        fontFamily: tokens.fontFamily,
                        fontSize: 15,
                        color: 'rgba(72,73,73,0.8)',
                        backgroundColor: '#f2f3f4',
                      }}
                    >
                      Disconnect
                    </ButtonBase>
                  </FieldLine>
                </FieldGroup>

                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: color.primary,
                    letterSpacing: '-0.28px',
                    mt: 0.5,
                  }}
                >
                  * 비밀번호 변경을 원하시면 새로운 비밀번호를 입력하세요.
                </Typography>

                <FieldGroup>
                  <FieldLine label="신규 비밀번호">
                    <TextField
                      type="password"
                      placeholder="새 비밀번호"
                      value={form.newPassword}
                      onChange={(e) => setField('newPassword', e.target.value)}
                      autoComplete="new-password"
                      sx={{ ...compactInputSx, width: 'min(420px, 100%)' }}
                    />
                  </FieldLine>
                  <FieldLine label="비밀번호 확인" last>
                    <TextField
                      type="password"
                      placeholder="새 비밀번호 확인"
                      value={form.passwordConfirm}
                      onChange={(e) =>
                        setField('passwordConfirm', e.target.value)
                      }
                      autoComplete="new-password"
                      sx={{ ...compactInputSx, width: 'min(420px, 100%)' }}
                    />
                  </FieldLine>
                </FieldGroup>

                <FieldGroup>
                  <FieldLine
                    label="API Key"
                    last
                    badge={<ConnectionBadge connected={tossConnected} />}
                  >
                    <TextField
                      placeholder="API Key"
                      value={form.apiKey}
                      onChange={(e) => setField('apiKey', e.target.value)}
                      sx={{ ...compactInputSx, width: 'min(420px, 100%)' }}
                    />
                    <Link
                      href="#"
                      underline="always"
                      onClick={(e) => e.preventDefault()}
                      sx={{
                        fontSize: 15,
                        color: color.primary,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      API는 어떻게 얻나요?
                    </Link>
                  </FieldLine>
                </FieldGroup>

                <FieldGroup>
                  <FieldLine
                    label="API Secret"
                    last
                    badge={<ConnectionBadge connected={tossConnected} />}
                  >
                    <TextField
                      placeholder="API Secret"
                      value={form.apiSecret}
                      onChange={(e) => setField('apiSecret', e.target.value)}
                      sx={{ ...compactInputSx, width: 'min(420px, 100%)' }}
                    />
                  </FieldLine>
                </FieldGroup>

                {formError !== '' && (
                  <Typography
                    role="alert"
                    sx={{ fontSize: 14, color: color.sell }}
                  >
                    {formError}
                  </Typography>
                )}
                {saveNotice !== '' && (
                  <Typography sx={{ fontSize: 14, color: color.textSecondary }}>
                    {saveNotice}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              appVariant="filled"
              onClick={handleSave}
              disabled={loading || loadError !== ''}
              sx={{
                borderRadius: '30px',
                minHeight: 0,
                height: 'auto',
                px: '25px',
                py: '12px',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              변경사항 저장
            </Button>
            <ButtonBase
              onClick={handleCancel}
              sx={{
                fontFamily: tokens.fontFamily,
                fontSize: 16,
                fontWeight: 700,
                color: 'rgba(93,93,93,0.7)',
                px: 1,
                py: 0.5,
                borderRadius: '6px',
              }}
            >
              취소
            </ButtonBase>
          </Box>
        </BaseCard>
      </Box>
    </AppShell>
  );
}

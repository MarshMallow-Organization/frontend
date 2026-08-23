import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import GoogleIcon from '@mui/icons-material/Google';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AppShell from '../../components/AppShell/AppShell';
import BaseCard from '../../components/BaseCard/BaseCard';
import Button from '../../components/Button/Button';
import { readSessionUser, writeSessionUser } from '../../lib/authSession';
import { navigate } from '../../lib/navigation';
import { tokens } from '../../theme/tokens';

export default function MyPageEditPage() {
  const sessionUser = useMemo(() => readSessionUser(), []);
  const [name, setName] = useState(sessionUser.name);
  const [nickname, setNickname] = useState(sessionUser.nickname);
  const [email, setEmail] = useState(sessionUser.email);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [googleConnected, setGoogleConnected] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!name.trim() || !nickname.trim() || !email.trim()) {
      setError('이름, 닉네임, 이메일을 모두 입력해 주세요.');
      return;
    }
    if (password && password !== passwordConfirm) {
      setError('새 비밀번호가 서로 일치하지 않습니다.');
      return;
    }

    writeSessionUser({
      ...sessionUser,
      name: name.trim(),
      nickname: nickname.trim(),
      email: email.trim(),
    });
    navigate('/my-page');
  }

  return (
    <AppShell currentPageLabel="마이페이지 수정">
      <Box
        component="main"
        sx={{
          width: '100%',
          minWidth: 0,
          overflow: 'auto',
          p: { xs: 0.5, md: 1.5 },
        }}
      >
        <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 2.5 }}
          >
            <IconButton
              aria-label="마이페이지로 돌아가기"
              onClick={() => navigate('/my-page')}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
            <Box>
              <Typography
                component="h1"
                sx={{ fontSize: 28, fontWeight: 800, color: '#3D5669' }}
              >
                내 정보 수정
              </Typography>
              <Typography
                sx={{
                  mt: 0.35,
                  fontSize: 14,
                  color: tokens.color.textSecondary,
                }}
              >
                프로필과 연결 정보를 관리합니다.
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 2.5, borderRadius: 3 }}>
            프로필 수정 API가 아직 제공되지 않아 이 화면의 변경사항은 현재
            브라우저에만 저장됩니다. 비밀번호와 API 인증 정보는 저장하지
            않습니다.
          </Alert>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '330px minmax(0, 1fr)' },
              gap: 2.5,
            }}
          >
            <BaseCard
              component="section"
              sx={{
                p: 3.5,
                border: 0,
                alignSelf: 'start',
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(72, 106, 128, 0.10)',
              }}
            >
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <Avatar
                  src={imagePreview ?? undefined}
                  sx={{
                    width: 144,
                    height: 144,
                    bgcolor: '#DDEAF2',
                    color: '#FFFFFF',
                  }}
                >
                  <PersonRoundedIcon sx={{ width: 106, height: 106 }} />
                </Avatar>
                <IconButton
                  component="label"
                  aria-label="프로필 사진 선택"
                  sx={{
                    position: 'absolute',
                    right: 1,
                    bottom: 2,
                    width: 42,
                    height: 42,
                    color: '#FFFFFF',
                    bgcolor: tokens.color.primary,
                    border: '3px solid #FFFFFF',
                    '&:hover': { bgcolor: tokens.color.primaryPressed },
                  }}
                >
                  <CameraAltRoundedIcon fontSize="small" />
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />
                </IconButton>
              </Box>
              <Typography
                sx={{
                  mt: 2.2,
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#3D5669',
                }}
              >
                {name || '사용자'}
              </Typography>
              <Typography sx={{ mt: 0.4, color: tokens.color.textSecondary }}>
                @{nickname || 'nickname'}
              </Typography>
              <Typography
                sx={{ mt: 2, fontSize: 12, lineHeight: 1.6, color: '#98A6B0' }}
              >
                JPG, PNG 이미지를 선택할 수 있습니다.
                <br />
                이미지는 새로고침하면 초기화됩니다.
              </Typography>
            </BaseCard>

            <BaseCard
              component="section"
              sx={{
                p: { xs: 2.5, md: 4 },
                border: 0,
                boxShadow: '0 10px 30px rgba(72, 106, 128, 0.10)',
              }}
            >
              <Typography
                component="h2"
                sx={{ fontSize: 21, fontWeight: 800, color: '#3D5669' }}
              >
                기본 정보
              </Typography>
              <Box
                sx={{
                  mt: 2.5,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <TextField
                  required
                  label="이름"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                <TextField
                  required
                  label="닉네임"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                />
                <TextField
                  required
                  type="email"
                  label="이메일"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  sx={{ gridColumn: { sm: '1 / -1' } }}
                />
              </Box>

              <Divider sx={{ my: 3.5 }} />
              <Typography
                component="h2"
                sx={{ fontSize: 21, fontWeight: 800, color: '#3D5669' }}
              >
                보안 정보
              </Typography>
              <Box
                sx={{
                  mt: 2.5,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <TextField
                  type="password"
                  label="새 비밀번호"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <TextField
                  type="password"
                  label="새 비밀번호 확인"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                />
              </Box>

              <Divider sx={{ my: 3.5 }} />
              <Typography
                component="h2"
                sx={{ fontSize: 21, fontWeight: 800, color: '#3D5669' }}
              >
                외부 서비스 연결
              </Typography>
              <Box
                sx={{
                  mt: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  border: `1px solid ${tokens.color.border}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <GoogleIcon color="action" />
                  <Box>
                    <Typography sx={{ fontWeight: 750, color: '#40586A' }}>
                      Google 계정
                    </Typography>
                    <Typography
                      sx={{ fontSize: 12, color: tokens.color.textSecondary }}
                    >
                      {googleConnected ? '연결됨' : '연결 해제됨'}
                    </Typography>
                  </Box>
                </Box>
                <FormControlLabel
                  label={googleConnected ? '연결' : '해제'}
                  labelPlacement="start"
                  control={
                    <Switch
                      checked={googleConnected}
                      onChange={(event) =>
                        setGoogleConnected(event.target.checked)
                      }
                    />
                  }
                />
              </Box>
              <Box
                sx={{
                  mt: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                }}
              >
                <TextField
                  type="password"
                  label="증권 API Key"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  helperText="화면 시연용 입력란이며 저장되지 않습니다."
                />
                <TextField
                  type="password"
                  label="증권 API Secret"
                  value={apiSecret}
                  onChange={(event) => setApiSecret(event.target.value)}
                  helperText="화면 시연용 입력란이며 저장되지 않습니다."
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2.5 }}>
                  {error}
                </Alert>
              )}
              <Box
                sx={{
                  mt: 3.5,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1.25,
                }}
              >
                <Button
                  type="button"
                  appVariant="outline"
                  onClick={() => navigate('/my-page')}
                >
                  취소
                </Button>
                <Button type="submit">변경사항 저장</Button>
              </Box>
            </BaseCard>
          </Box>
        </Box>
      </Box>
    </AppShell>
  );
}

import { useMemo, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { clearAuthSession, readSessionUser } from '../../lib/authSession';
import { navigate } from '../../lib/navigation';
import { tokens } from '../../theme/tokens';

interface ProfileMenuProps {
  size: number;
  marginLeft: string;
}

export default function ProfileMenu({ size, marginLeft }: ProfileMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const user = useMemo(() => readSessionUser(), []);

  function close() {
    setAnchor(null);
  }

  function openMyPage() {
    close();
    navigate('/my-page');
  }

  function logout() {
    clearAuthSession();
    window.location.replace('/');
  }

  return (
    <>
      <IconButton
        aria-label="프로필 메뉴 열기"
        aria-haspopup="menu"
        aria-expanded={anchor ? 'true' : undefined}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ width: size, height: size, ml: marginLeft, p: 0 }}
      >
        <Avatar
          sx={{
            width: size,
            height: size,
            bgcolor: '#C8D9E4',
            color: tokens.color.white,
          }}
        >
          <PersonRoundedIcon sx={{ width: 42, height: 42 }} />
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={anchor !== null}
        onClose={close}
        slotProps={{
          paper: {
            sx: {
              mt: 1.2,
              width: 250,
              borderRadius: 3,
              border: `1px solid ${tokens.color.border}`,
              boxShadow: '0 14px 36px rgba(45, 75, 96, 0.18)',
            },
          },
        }}
      >
        <Box sx={{ px: 2.25, py: 1.5 }}>
          <Typography sx={{ fontWeight: 750, color: '#3E5668' }}>
            {user.name}
          </Typography>
          <Typography noWrap sx={{ mt: 0.3, fontSize: 12, color: '#8A9AA6' }}>
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={openMyPage} sx={{ gap: 1.25, py: 1.25 }}>
          <SettingsRoundedIcon fontSize="small" />
          마이페이지
        </MenuItem>
        <MenuItem
          onClick={logout}
          sx={{ gap: 1.25, py: 1.25, color: '#D45555' }}
        >
          <LogoutRoundedIcon fontSize="small" />
          로그아웃
        </MenuItem>
      </Menu>
    </>
  );
}

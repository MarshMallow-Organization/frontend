import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import BaseCard from '../../../components/BaseCard/BaseCard';
import type { SessionUser } from '../../../lib/authSession';
import { navigate } from '../../../lib/navigation';
import { MY_PAGE_CARD_SX } from '../card-styles';

interface ProfileCardProps {
  user: SessionUser;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  return (
    <BaseCard
      component="section"
      aria-labelledby="my-profile-title"
      sx={{
        ...MY_PAGE_CARD_SX,
        height: 189,
        position: 'relative',
      }}
    >
      <Avatar
        sx={{
          position: 'absolute',
          top: 34,
          left: '6.82%',
          width: 115,
          height: 115,
          bgcolor: '#C8D9E4',
          color: '#E8F0F5',
        }}
      >
        <PersonRoundedIcon sx={{ width: 91, height: 91 }} />
      </Avatar>
      <Box sx={{ position: 'absolute', top: 53, left: '28.01%', minWidth: 0 }}>
        <Typography
          id="my-profile-title"
          component="h1"
          sx={{
            fontSize: 40,
            fontWeight: 700,
            lineHeight: 1.2,
            color: '#1E1E1E',
            letterSpacing: '-0.8px',
          }}
        >
          {user.name}
        </Typography>
        <Typography
          sx={{
            mt: 0,
            fontSize: 20,
            lineHeight: 1.2,
            color: 'rgba(63, 63, 63, 0.6)',
            letterSpacing: '-0.4px',
          }}
        >
          @{user.nickname}
        </Typography>
      </Box>
      <IconButton
        aria-label="프로필 수정"
        onClick={() => navigate('/my-page/edit')}
        sx={{
          position: 'absolute',
          top: 23,
          right: 29,
          width: 46,
          height: 46,
          color: '#A6BAC8',
        }}
      >
        <EditRoundedIcon sx={{ width: 29, height: 29 }} />
      </IconButton>
    </BaseCard>
  );
}

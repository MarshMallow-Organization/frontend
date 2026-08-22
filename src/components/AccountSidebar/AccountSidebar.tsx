import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import type { AccountSubTab } from '../../types/account';
import { tokens } from '../../theme/tokens';

const { color, fontFamily } = tokens;

const TABS: AccountSubTab[] = ['자산 현황', '가상 계좌', '숨기기'];

export interface AccountSidebarProps {
  active: AccountSubTab;
  onSelect: (tab: AccountSubTab) => void;
}

/** "내 계좌" 화면 전용 좌측 서브 내비게이션 (자산 현황 / 가상 계좌 / 숨기기). */
export function AccountSidebar({ active, onSelect }: AccountSidebarProps) {
  return (
    <Box
      component="aside"
      sx={{
        width: 200,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        p: '12px',
        borderRadius: '20px',
        border: `1px solid ${color.border}`,
        backgroundColor: color.white,
        fontFamily,
      }}
    >
      {TABS.map((tab) => {
        const selected = active === tab;
        return (
          <ButtonBase
            key={tab}
            onClick={() => onSelect(tab)}
            sx={{
              justifyContent: 'flex-start',
              gap: 1,
              px: '16px',
              py: '12px',
              borderRadius: '14px',
              fontSize: '0.9375rem',
              fontWeight: selected ? 700 : 400,
              color: selected ? color.selected : color.text,
              backgroundColor: selected
                ? color.iconTabSelectedBg
                : 'transparent',
              '&:hover': {
                backgroundColor: selected
                  ? color.iconTabSelectedBg
                  : color.iconTabHoverBg,
              },
            }}
          >
            {tab === '숨기기' && <LockOutlinedIcon sx={{ fontSize: 16 }} />}
            {tab}
          </ButtonBase>
        );
      })}
    </Box>
  );
}

export default AccountSidebar;

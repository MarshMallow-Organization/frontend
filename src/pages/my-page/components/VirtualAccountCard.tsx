import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import BaseCard from '../../../components/BaseCard/BaseCard';
import { MY_PAGE_CARD_SX, MY_PAGE_CARD_TITLE_SX } from '../card-styles';
import { number } from '../format';
import type { VirtualAccountView } from '../types';

interface VirtualAccountCardProps {
  accounts: VirtualAccountView[];
  loading: boolean;
}

export default function VirtualAccountCard({
  accounts,
  loading,
}: VirtualAccountCardProps) {
  return (
    <BaseCard
      component="section"
      aria-labelledby="virtual-account-title"
      sx={{
        ...MY_PAGE_CARD_SX,
        height: 415,
        position: 'relative',
      }}
    >
      <Typography
        id="virtual-account-title"
        component="h2"
        sx={{
          ...MY_PAGE_CARD_TITLE_SX,
          position: 'absolute',
          top: 30,
          left: 38,
        }}
      >
        내 계좌
      </Typography>
      <Typography
        sx={{
          position: 'absolute',
          top: 70,
          left: 38,
          fontSize: 16,
          color: 'rgba(93,93,93,0.8)',
        }}
      >
        주계좌
      </Typography>
      <Typography
        sx={{
          position: 'absolute',
          top: 70,
          left: '41.1%',
          fontSize: 16,
          color: 'rgba(93,93,93,0.8)',
        }}
      >
        가상계좌
      </Typography>

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 117,
          bottom: 23,
          left: '37.9%',
          width: '1px',
          bgcolor: '#D8E1E7',
        }}
      />

      {loading && accounts.length === 0 ? (
        <CircularProgress
          size={28}
          sx={{ position: 'absolute', top: '52%', left: '50%' }}
        />
      ) : (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: 130,
              left: 46,
              width: '28.2%',
              height: 211,
            }}
          >
            {accounts.slice(0, 4).map((account, index) => (
              <Box
                key={`${account.id}-${index}`}
                sx={{
                  position: 'absolute',
                  top: [0, 84, 131, 177][index],
                  left: 0,
                  right: 0,
                  minHeight: 31,
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      width: 26,
                      height: 31,
                      flexShrink: 0,
                      borderRadius: '8px',
                      bgcolor: '#DAE9FF',
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: 20.7,
                        lineHeight: 1,
                        fontWeight: 550,
                        color: '#101010',
                        letterSpacing: '-0.6px',
                      }}
                    >
                      {number.format(account.balance)}원
                    </Typography>
                    <Typography
                      noWrap
                      sx={{ mt: 0.35, fontSize: 10.4, color: '#BAB3B3' }}
                    >
                      {account.category}
                    </Typography>
                  </Box>
                </Box>
                {index === 0 && (
                  <Box sx={{ mt: 2.1, height: '1px', bgcolor: '#CDD9E1' }} />
                )}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: 90,
              right: 31,
              display: 'flex',
              alignItems: 'center',
              gap: 0.6,
            }}
          >
            <Box
              sx={{
                height: 28,
                px: 1.8,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 30,
                border: '1px solid #2FC4D1',
                color: '#2FC4D1',
                fontSize: 10,
                fontWeight: 750,
              }}
            >
              {accounts[0]?.name ?? '안정형 투자'}
            </Box>
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                bgcolor: '#EEEEEE',
              }}
            />
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                bgcolor: '#EEEEEE',
              }}
            />
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: 132,
              left: '41.4%',
              right: 26,
              display: 'grid',
              gap: 1.4,
            }}
          >
            {accounts.slice(0, 2).map((account) => (
              <Box
                key={account.id}
                sx={{
                  height: 100,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '12px',
                  border: '1px solid #E2EAF0',
                  bgcolor: '#FFFFFF',
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    bgcolor: account.accent,
                    opacity: 0.2,
                  }}
                />
                <Box sx={{ ml: 1.5, minWidth: 0, flex: 1 }}>
                  <Typography
                    noWrap
                    sx={{ fontSize: 17, fontWeight: 700, color: '#303030' }}
                  >
                    {account.name}
                  </Typography>
                  <Typography sx={{ mt: 0.35, fontSize: 12, color: '#9A9A9A' }}>
                    {account.category}
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontSize: 18, fontWeight: 700, color: '#303030' }}
                >
                  {number.format(account.balance)}원
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </BaseCard>
  );
}

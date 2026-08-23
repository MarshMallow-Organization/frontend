import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BaseCard from '../../../components/BaseCard/BaseCard';
import { MY_PAGE_CARD_SX, MY_PAGE_CARD_TITLE_SX } from '../card-styles';
import { number } from '../format';
import type { UsageSummary } from '../types';

interface UsageSummaryCardProps {
  summary: UsageSummary;
}

export default function UsageSummaryCard({ summary }: UsageSummaryCardProps) {
  return (
    <BaseCard
      component="section"
      aria-labelledby="usage-summary-title"
      sx={{ ...MY_PAGE_CARD_SX, height: 191, position: 'relative' }}
    >
      <Typography
        id="usage-summary-title"
        component="h2"
        sx={{
          ...MY_PAGE_CARD_TITLE_SX,
          position: 'absolute',
          top: 30,
          left: 35,
        }}
      >
        이용 현황
      </Typography>

      <Box
        sx={{
          position: 'absolute',
          top: 60,
          left: 34,
          right: 29,
          display: 'grid',
          gridTemplateColumns: '109px 1fr 1.1fr',
          alignItems: 'center',
          rowGap: 1.2,
        }}
      >
        <span />
        <Typography
          sx={{ fontSize: 12, textAlign: 'center', color: '#D2D2D2' }}
        >
          TODAY
        </Typography>
        <Typography
          sx={{ fontSize: 12, textAlign: 'center', color: '#D2D2D2' }}
        >
          TOTAL
        </Typography>

        <Typography sx={{ mt: 0.7, fontSize: 18, color: '#858585' }}>
          접속수
        </Typography>
        <Typography
          sx={{ mt: 0.7, fontSize: 18, textAlign: 'center', color: '#777777' }}
        >
          {number.format(summary.visitsToday)}
        </Typography>
        <Typography
          sx={{
            mt: 0.7,
            fontSize: 19,
            fontWeight: 650,
            textAlign: 'center',
            color: '#626262',
          }}
        >
          {number.format(summary.visitsTotal)}
        </Typography>

        <Box sx={{ gridColumn: '1 / -1', height: '1px', bgcolor: '#D5DEE4' }} />

        <Typography sx={{ fontSize: 18, color: '#858585' }}>거래수</Typography>
        <Typography
          sx={{ fontSize: 18, textAlign: 'center', color: '#777777' }}
        >
          {number.format(summary.tradesToday)}
        </Typography>
        <Typography
          sx={{
            fontSize: 19,
            fontWeight: 650,
            textAlign: 'center',
            color: '#626262',
          }}
        >
          {number.format(summary.tradesTotal)}
        </Typography>
      </Box>
    </BaseCard>
  );
}

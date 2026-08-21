import type { KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { TradeJournalItem } from '../types';
import { formatPrice, formatTradeDateTime, previewText } from '../filter-items';
import { tokens } from '../../../theme/tokens';
import { LAYOUT } from '../layout';

const { color, fontFamily } = tokens;
const { card } = LAYOUT;

const BUY_BADGE = { bg: '#92e0e7', text: '#02626a' };
const SELL_BADGE = { bg: '#92e799', text: '#006208' };

export interface JournalCardProps {
  item: TradeJournalItem;
  selected: boolean;
  onSelect: () => void;
}

export function JournalCard({ item, selected, onSelect }: JournalCardProps) {
  const isBuy = item.tradeType === 'BUY';
  const badge = isBuy ? BUY_BADGE : SELL_BADGE;

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  }

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      sx={{
        width: '100%',
        maxWidth: card.maxWidth,
        minHeight: selected ? card.minHeightSelected : card.minHeight,
        boxSizing: 'border-box',
        borderRadius: `${card.radius}px`,
        border: selected
          ? `1px solid ${isBuy ? color.accentBlue : '#2e9b4f'}`
          : `1px solid ${color.cardBorder}`,
        backgroundColor: selected
          ? isBuy
            ? color.cardTinted
            : '#f4fff6'
          : color.white,
        p: card.pad,
        cursor: 'pointer',
        fontFamily,
        '&:hover': {
          borderColor: isBuy ? color.accentBlue : '#2e9b4f',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: '8px',
        }}
      >
        <Box
          sx={{
            px: '10px',
            py: '4px',
            borderRadius: '6px',
            backgroundColor: badge.bg,
            color: badge.text,
            fontSize: card.badgeSize,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {isBuy ? '매수' : '매도'}
        </Box>
        <Typography
          sx={{ fontSize: '0.6875rem', fontWeight: 300, color: '#7e7e7e' }}
        >
          {formatTradeDateTime(item.tradedAt)}
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: card.nameSize,
          fontWeight: 700,
          color: '#000',
          mb: '8px',
          lineHeight: 1.25,
        }}
      >
        {item.corpName}
      </Typography>

      <Typography
        sx={{
          fontSize: card.metaSize,
          fontWeight: 500,
          color: '#454545',
          mb: '10px',
          lineHeight: 1.35,
        }}
      >
        <Box component="span" sx={{ color: '#a8a8a8' }}>
          평균 단가
        </Box>
        {`  ${item.price != null ? formatPrice(item.price) : '-'}   |   ${item.amount}주`}
      </Typography>

      <Box
        sx={{
          px: '12px',
          height: card.previewH,
          display: 'flex',
          alignItems: 'center',
          borderRadius: '8px',
          backgroundColor: '#f3f3f3',
          border: `1px solid ${color.cardBorder}`,
        }}
      >
        <Typography
          sx={{
            fontSize: card.previewSize,
            color: '#808080',
            letterSpacing: '-0.2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {previewText(item)}
        </Typography>
      </Box>
    </Box>
  );
}

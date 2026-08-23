import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import BaseCard from '../../../components/BaseCard/BaseCard';
import { MY_PAGE_CARD_SX, MY_PAGE_CARD_TITLE_SX } from '../card-styles';
import { number } from '../format';
import type { RecentOrder } from '../types';

interface RecentOrdersCardProps {
  orders: RecentOrder[];
}

function orderDate(value: string) {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}.${part('month')}.${part('day')} ${part('hour')}:${part('minute')}:${part('second')}`;
}

export default function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  return (
    <BaseCard
      component="section"
      aria-labelledby="recent-orders-title"
      sx={{ ...MY_PAGE_CARD_SX, height: 587, position: 'relative' }}
    >
      <Typography
        id="recent-orders-title"
        component="h2"
        sx={{
          ...MY_PAGE_CARD_TITLE_SX,
          position: 'absolute',
          top: 30,
          left: 35,
        }}
      >
        주문 내역
      </Typography>

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 91,
          bottom: 128,
          left: 43,
          width: '1px',
          bgcolor: '#A7A7A7',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 110,
          left: 35,
          right: 39,
          display: 'grid',
          gap: '35px',
        }}
      >
        {orders.slice(0, 3).map((order) => {
          const buy = order.type === 'BUY';
          const color = buy ? '#08C4D1' : '#05C93F';
          return (
            <Box
              key={order.id}
              sx={{ position: 'relative', minHeight: 91, pl: 4.2 }}
            >
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  top: 2,
                  left: 0,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: buy ? color : '#FFFFFF',
                  border: buy ? 'none' : `1.5px solid ${color}`,
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  sx={{ fontSize: 16, lineHeight: 1, fontWeight: 700, color }}
                >
                  {buy ? '매수' : '매도'}
                </Typography>
                <Typography
                  sx={{ fontSize: 10, color: '#A4A4A4', whiteSpace: 'nowrap' }}
                >
                  {orderDate(order.occurredAt)}
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 2.1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.7,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    lineHeight: 1,
                    fontWeight: 650,
                    color: '#222222',
                  }}
                >
                  {order.corpName}
                </Typography>
                <Typography
                  sx={{ fontSize: 13, lineHeight: 1, color: '#8E8E8E' }}
                >
                  {order.stockCode}
                </Typography>
              </Box>
              <Box
                sx={{
                  mt: 1.55,
                  display: 'grid',
                  gridTemplateColumns: '72px 1px 52px 1fr',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Typography sx={{ fontSize: 13, color: '#222222' }}>
                  {number.format(order.price)}원
                </Typography>
                <Box sx={{ width: '1px', height: 17, bgcolor: '#E1E1E1' }} />
                <Typography sx={{ fontSize: 13, color: '#222222' }}>
                  {number.format(order.quantity)}주
                </Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 650,
                    textAlign: 'right',
                    color,
                  }}
                >
                  {number.format(order.total)}원
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <ButtonBase
        disabled
        sx={{
          position: 'absolute',
          left: 46,
          right: 46,
          bottom: 21,
          height: 62,
          borderRadius: '10px',
          border: '1px solid #D7D7D7',
          color: '#C2C2C2',
          fontSize: 14,
          fontWeight: 650,
          '&.Mui-disabled': { color: '#C2C2C2' },
        }}
      >
        전체 주문 내역 보기
      </ButtonBase>
    </BaseCard>
  );
}

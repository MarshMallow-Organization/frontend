import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { Button } from '../../../components/Button';
import { TextField } from '../../../components/TextField';
import {
  createOrder,
  type CreateOrderInput,
  type OrderCategory,
  type OrderType,
  type TradeType,
} from '../../../features/orders/ordersApi';
import { ApiError } from '../../../lib/api';
import { tokens } from '../../../theme/tokens';
import arrowIcon from '../assets/trade-arrow.svg';
import closeIcon from '../assets/trade-close.svg';
import conditionalIcon from '../assets/trade-conditional.svg';
import generalIcon from '../assets/trade-general.svg';

const { color, fontFamily } = tokens;

interface TradeDialogProps {
  open: boolean;
  stockCode: string;
  stockName: string;
  onClose: () => void;
  onCompleted: () => void;
}

interface TradeOption {
  id: OrderCategory;
  title: string;
  description: string;
  icon: string;
}

const OPTIONS: TradeOption[] = [
  {
    id: 'GENERAL',
    title: '일반 거래',
    description: '원하는 수량을 한 번에\n매수 또는 매도합니다.',
    icon: generalIcon,
  },
  {
    id: 'CONDITIONAL',
    title: '조건 거래',
    description: '설정한 금액이 되면 거래를 합니다.',
    icon: conditionalIcon,
  },
];

function asPositiveNumber(value: string): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function tomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function errorMessage(error: unknown) {
  return error instanceof ApiError
    ? error.message
    : '주문을 처리하지 못했습니다.';
}

export function TradeDialog({
  open,
  stockCode,
  stockName,
  onClose,
  onCompleted,
}: TradeDialogProps) {
  const [step, setStep] = useState<'choose' | 'order'>('choose');
  const [category, setCategory] = useState<OrderCategory | null>(null);
  const [tradeType, setTradeType] = useState<TradeType>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [currencyId, setCurrencyId] = useState('1');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [expiredAt, setExpiredAt] = useState(tomorrowDate);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetState() {
    setStep('choose');
    setCategory(null);
    setTradeType('BUY');
    setOrderType('MARKET');
    setQuantity('1');
    setPrice('');
    setCurrencyId('1');
    setTriggerPrice('');
    setExpiredAt(tomorrowDate());
    setError(null);
  }

  function handleClose() {
    if (submitting) return;
    resetState();
    onClose();
  }

  const quantityNumber = asPositiveNumber(quantity);
  const priceNumber = asPositiveNumber(price);
  const currencyNumber = asPositiveNumber(currencyId);
  const triggerNumber = asPositiveNumber(triggerPrice);
  const orderValid =
    category !== null &&
    quantityNumber !== undefined &&
    currencyNumber !== undefined &&
    (orderType === 'MARKET' || priceNumber !== undefined) &&
    (category === 'GENERAL' ||
      (triggerNumber !== undefined && expiredAt.length > 0));

  async function handleSubmit() {
    if (!orderValid || !category || !quantityNumber || !currencyNumber) return;

    const input: CreateOrderInput = {
      orderType,
      orderCategory: category,
      tradeType,
      corpCode: stockCode,
      corpName: stockName,
      currenciesId: currencyNumber,
      quantity: quantityNumber,
      ...(priceNumber === undefined ? {} : { price: priceNumber }),
      ...(category === 'CONDITIONAL' && triggerNumber
        ? {
            orderCondition: {
              triggerPrice: triggerNumber,
              expiredAt: new Date(`${expiredAt}T23:59:59+09:00`).toISOString(),
            },
          }
        : {}),
    };

    setSubmitting(true);
    setError(null);
    try {
      await createOrder(input);
      onCompleted();
      resetState();
      onClose();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : handleClose}
      aria-labelledby="trade-dialog-title"
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(28,27,31,0.42)' } },
        paper: {
          sx: {
            width: 700,
            maxWidth: 'calc(100vw - 32px)',
            minHeight: { xs: 680, sm: 810 },
            m: 2,
            borderRadius: { xs: '32px', sm: '50px' },
            border: `1px solid ${color.stockDialogBorder}`,
            boxShadow: '0 0 3px rgba(0,0,0,0.3)',
            fontFamily,
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogContent sx={{ position: 'relative', p: 0, minHeight: 'inherit' }}>
        <ButtonBase
          aria-label="거래 팝업 닫기"
          onClick={handleClose}
          disabled={submitting}
          sx={{
            position: 'absolute',
            top: 38,
            right: 39,
            width: 36,
            height: 36,
          }}
        >
          <Box
            component="img"
            src={closeIcon}
            alt=""
            sx={{ width: 30, height: 30 }}
          />
        </ButtonBase>

        <Typography
          id="trade-dialog-title"
          component="h2"
          sx={{
            pt: '74px',
            textAlign: 'center',
            color: color.ink,
            fontSize: { xs: '32px', sm: '40px' },
            fontWeight: 500,
            lineHeight: 1.2,
          }}
        >
          거래하기
        </Typography>
        <Typography
          sx={{
            mt: '3px',
            textAlign: 'center',
            color: color.subtleText,
            fontSize: { xs: '18px', sm: '23px' },
          }}
        >
          {stockName} · 현재가 미연동
        </Typography>

        {step === 'choose' ? (
          <>
            <Box
              role="radiogroup"
              aria-label="거래 방식"
              sx={{
                mt: '76px',
                mx: { xs: 3, sm: '70px' },
                display: 'grid',
                gap: '16px',
              }}
            >
              {OPTIONS.map((option) => {
                const selected = option.id === category;
                return (
                  <ButtonBase
                    key={option.id}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setCategory(option.id)}
                    sx={{
                      position: 'relative',
                      height: 138,
                      borderRadius: '15px',
                      border: `1px solid ${selected ? color.primary : color.stockDialogOptionBorder}`,
                      backgroundColor: selected
                        ? color.stockSoftCyan
                        : color.white,
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                    }}
                  >
                    <Box
                      component="img"
                      src={option.icon}
                      alt=""
                      sx={{ width: 99, height: 96, ml: '20px', flexShrink: 0 }}
                    />
                    <Box sx={{ ml: '22px' }}>
                      <Typography
                        sx={{
                          color: color.ink,
                          fontSize: '26px',
                          fontWeight: 500,
                        }}
                      >
                        {option.title}
                      </Typography>
                      <Typography
                        sx={{
                          mt: '2px',
                          color: '#7a7a7a',
                          fontSize: '18px',
                          lineHeight: '20px',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {option.description}
                      </Typography>
                    </Box>
                    <Box
                      component="img"
                      src={arrowIcon}
                      alt=""
                      sx={{
                        position: 'absolute',
                        right: 32,
                        width: 28,
                        height: 28,
                      }}
                    />
                  </ButtonBase>
                );
              })}
            </Box>

            <Box
              sx={{
                position: 'absolute',
                left: { xs: 24, sm: 65 },
                right: { xs: 24, sm: 65 },
                bottom: 60,
              }}
            >
              <Button
                fullWidth
                disabled={!category}
                onClick={() => setStep('order')}
                sx={{ height: 61, borderRadius: '15px', fontSize: '22px' }}
              >
                다음
              </Button>
              <Button
                appVariant="outline"
                fullWidth
                onClick={handleClose}
                sx={{
                  mt: '12px',
                  height: 61,
                  borderRadius: '15px',
                  borderColor: '#d1d1d1',
                  color: '#757575',
                  backgroundColor: color.white,
                  fontSize: '22px',
                }}
              >
                취소
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ mt: 4, mx: { xs: 3, sm: '65px' } }}>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}
            >
              {(['BUY', 'SELL'] as const).map((value) => (
                <Button
                  key={value}
                  appVariant={
                    tradeType === value ? 'outlineSelected' : 'outline'
                  }
                  onClick={() => setTradeType(value)}
                  sx={{ height: 48, borderRadius: '12px', fontSize: '18px' }}
                >
                  {value === 'BUY' ? '매수' : '매도'}
                </Button>
              ))}
            </Box>
            <Box
              sx={{
                mt: 1.5,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.5,
              }}
            >
              {(['MARKET', 'LIMIT'] as const).map((value) => (
                <Button
                  key={value}
                  appVariant={
                    orderType === value ? 'outlineSelected' : 'outline'
                  }
                  onClick={() => setOrderType(value)}
                  sx={{ height: 48, borderRadius: '12px', fontSize: '18px' }}
                >
                  {value === 'MARKET' ? '시장가' : '지정가'}
                </Button>
              ))}
            </Box>

            <Box
              sx={{
                mt: 2.5,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 1.5,
              }}
            >
              <TextField
                label="수량"
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                slotProps={{ htmlInput: { min: 1 } }}
              />
              <TextField
                label="통화 ID"
                type="number"
                value={currencyId}
                onChange={(event) => setCurrencyId(event.target.value)}
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Box>
            {orderType === 'LIMIT' && (
              <TextField
                fullWidth
                label="지정가"
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                slotProps={{ htmlInput: { min: 1 } }}
                sx={{ mt: 1.5 }}
              />
            )}
            {category === 'CONDITIONAL' && (
              <Box
                sx={{
                  mt: 1.5,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 1.5,
                }}
              >
                <TextField
                  label="발동 가격"
                  type="number"
                  value={triggerPrice}
                  onChange={(event) => setTriggerPrice(event.target.value)}
                  slotProps={{ htmlInput: { min: 1 } }}
                />
                <TextField
                  label="만료일"
                  type="date"
                  value={expiredAt}
                  onChange={(event) => setExpiredAt(event.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                disabled={!orderValid || submitting}
                onClick={() => void handleSubmit()}
                sx={{ height: 61, borderRadius: '15px', fontSize: '22px' }}
              >
                {submitting ? (
                  <CircularProgress size={26} color="inherit" />
                ) : (
                  '주문 확정'
                )}
              </Button>
              <Button
                appVariant="outline"
                fullWidth
                disabled={submitting}
                onClick={() => setStep('choose')}
                sx={{
                  mt: 1.5,
                  height: 61,
                  borderRadius: '15px',
                  borderColor: '#d1d1d1',
                  color: '#757575',
                  backgroundColor: color.white,
                  fontSize: '22px',
                }}
              >
                이전
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default TradeDialog;

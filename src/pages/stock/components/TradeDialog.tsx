import { type ReactNode, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Button } from '../../../components/Button';
import {
  createOrder,
  type CreateOrderInput,
  type HoldingSummary,
  type OrderBook,
  type OrderHistoryEntry,
  type OrderType,
  type TradeType,
} from '../../../features/orders/ordersApi';
import { ApiError } from '../../../lib/api';
import { tokens } from '../../../theme/tokens';

const { color, fontFamily } = tokens;

// 통화 선택 UI는 리디자인에서 제거됨 — 추후 domain/api 연동 시 확장.
const CURRENCIES_ID = 1;
// 지정가 호가 스테퍼 단위(원).
const PRICE_STEP = 100;

const krw = new Intl.NumberFormat('ko-KR');

/** 호가창·보유수량 등 실시간 데이터 연동 전 사용하는 예시 값 (Figma 기준). */
const SAMPLE_ORDER_BOOK: OrderBook = {
  asks: Array.from({ length: 5 }, () => ({ price: 255500, quantity: 12345 })),
  bids: Array.from({ length: 5 }, () => ({ price: 255500, quantity: 12345 })),
  currentPrice: 255500,
};

type OrderMode = 'MARKET' | 'LIMIT' | 'CONDITIONAL';
type LimitInputMode = 'QUANTITY' | 'AMOUNT';

const MODES: { id: OrderMode; label: string; disabled?: boolean }[] = [
  { id: 'MARKET', label: '시장가' },
  { id: 'LIMIT', label: '지정가' },
  { id: 'CONDITIONAL', label: '조건 거래', disabled: true },
];

const MODE_TITLE: Record<OrderMode, string> = {
  MARKET: '시장가 거래',
  LIMIT: '지정가 거래',
  CONDITIONAL: '조건 거래',
};

interface TradeDialogProps {
  open: boolean;
  stockCode: string;
  stockName: string;
  /** 영문 종목명 (있을 때만 종목 정보 카드에 표기). */
  stockNameEn?: string;
  onClose: () => void;
  onCompleted: () => void;
  /** 아래 데이터는 domain/api 연동 전까지 미제공 (backend PR #101). */
  orderBook?: OrderBook;
  orderHistory?: OrderHistoryEntry[];
  holdings?: HoldingSummary;
  /** 예상 금액 USD 환산값. 미연동이면 생략. */
  estimatedUsd?: number;
  /** "전체 주문 내역 보기" 클릭. 없으면 버튼 비활성. */
  onViewAllHistory?: () => void;
}

function digitsOnly(value: string) {
  return value.replace(/[^\d]/g, '');
}

function toInt(value: string): number {
  const parsed = Number(digitsOnly(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatInput(value: string) {
  return value ? krw.format(Number(value)) : '';
}

function formatKrw(value: number | null | undefined) {
  return value == null || !Number.isFinite(value)
    ? '—'
    : krw.format(Math.round(value));
}

function errorMessage(error: unknown) {
  return error instanceof ApiError
    ? error.message
    : '주문을 처리하지 못했습니다.';
}

const sectionLabelSx = {
  fontSize: '20px',
  fontWeight: 500,
  color: '#000',
} as const;

const panelSx = {
  border: `1px solid ${color.tradePanelBorder}`,
  borderRadius: '20px',
  bgcolor: color.white,
  p: '20px',
  boxSizing: 'border-box',
} as const;

const subCardSx = {
  bgcolor: color.tradeSubCardBg,
  border: `1px solid ${color.tradeSubCardBorder}`,
  borderRadius: '16px',
  p: '18px',
  boxSizing: 'border-box',
} as const;

const fieldBoxSx = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  height: 48,
  px: '14px',
  bgcolor: color.white,
  border: `1px solid ${color.tradeFieldBorder}`,
  borderRadius: '8px',
  boxSizing: 'border-box',
} as const;

const inputSx = {
  flex: 1,
  minWidth: 0,
  border: 'none',
  outline: 'none',
  bgcolor: 'transparent',
  textAlign: 'right',
  fontFamily: 'inherit',
  fontSize: '20px',
  fontWeight: 500,
  color: '#000',
  '&::placeholder': { color: '#bdbdbd' },
} as const;

interface StepperFieldProps {
  value: string;
  onChange: (digits: string) => void;
  suffix: string;
  step?: number;
  min?: number;
  readOnly?: boolean;
  ariaLabel: string;
}

function StepperField({
  value,
  onChange,
  suffix,
  step = 1,
  min = 0,
  readOnly = false,
  ariaLabel,
}: StepperFieldProps) {
  const stepBtnSx = {
    width: 40,
    minWidth: 40,
    height: 48,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: color.white,
    border: `1px solid ${color.tradeFieldBorder}`,
    borderRadius: '8px',
    color: '#4a4a4a',
    cursor: 'pointer',
    '&:disabled': { opacity: 0.4, cursor: 'default' },
  } as const;

  return (
    <Box sx={{ display: 'flex', gap: '8px', width: '100%' }}>
      <Box sx={fieldBoxSx}>
        <Box
          component="input"
          type="text"
          inputMode="numeric"
          size={1}
          aria-label={ariaLabel}
          value={formatInput(value)}
          readOnly={readOnly}
          placeholder="0"
          onChange={(event) => onChange(digitsOnly(event.target.value))}
          sx={inputSx}
        />
        <Typography sx={{ fontSize: '15px', color: '#848484' }}>
          {suffix}
        </Typography>
      </Box>
      <Box
        component="button"
        type="button"
        aria-label={`${ariaLabel} 증가`}
        disabled={readOnly}
        onClick={() => onChange(String(Math.max(min, toInt(value) + step)))}
        sx={stepBtnSx}
      >
        <AddIcon sx={{ fontSize: 20 }} />
      </Box>
      <Box
        component="button"
        type="button"
        aria-label={`${ariaLabel} 감소`}
        disabled={readOnly}
        onClick={() => onChange(String(Math.max(min, toInt(value) - step)))}
        sx={stepBtnSx}
      >
        <RemoveIcon sx={{ fontSize: 20 }} />
      </Box>
    </Box>
  );
}

interface MarketActionButtonProps {
  tone: 'buy' | 'sell';
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}

function MarketActionButton({
  tone,
  loading,
  disabled,
  onClick,
  children,
}: MarketActionButtonProps) {
  const palette =
    tone === 'buy'
      ? {
          bg: color.tradeBuyBg,
          border: color.tradeBuyBorder,
          text: color.tradeBuyText,
        }
      : {
          bg: color.tradeSellBg,
          border: color.tradeSellBorder,
          text: color.tradeSellText,
        };
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      sx={{
        width: '100%',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '14px',
        border: `1px solid ${palette.border}`,
        bgcolor: palette.bg,
        color: palette.text,
        fontFamily: 'inherit',
        fontSize: '20px',
        fontWeight: 700,
        cursor: 'pointer',
        '&:disabled': { opacity: 0.5, cursor: 'default' },
      }}
    >
      {loading ? (
        <CircularProgress size={22} sx={{ color: palette.text }} />
      ) : (
        children
      )}
    </Box>
  );
}

function OrderBookRow({
  level,
  side,
  onSelect,
}: {
  level: { price: number; quantity: number };
  side: 'ask' | 'bid';
  onSelect?: () => void;
}) {
  return (
    <Box sx={{ display: 'flex', gap: '8px', height: 52 }}>
      <Box
        component="button"
        type="button"
        onClick={onSelect}
        disabled={!onSelect}
        aria-label={
          onSelect ? `${krw.format(level.price)}원으로 호가 설정` : undefined
        }
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          border: 'none',
          fontFamily: 'inherit',
          bgcolor: side === 'ask' ? color.tradeAskBg : color.tradeBidBg,
          color: side === 'ask' ? color.tradeAskText : color.tradeBidText,
          fontSize: '20px',
          fontWeight: 500,
          cursor: onSelect ? 'pointer' : 'default',
          '&:disabled': { opacity: 1 },
        }}
      >
        {krw.format(level.price)}
      </Box>
      <Box
        sx={{
          width: 118,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: '14px',
          borderRadius: '8px',
          bgcolor: color.tradeQtyCellBg,
          color: '#424242',
          fontSize: '20px',
          fontWeight: 500,
        }}
      >
        {krw.format(level.quantity)}
      </Box>
    </Box>
  );
}

function OrderHistoryRow({ entry }: { entry: OrderHistoryEntry }) {
  const isBuy = entry.tradeType === 'BUY';
  return (
    <Box sx={{ display: 'flex', gap: '12px' }}>
      <Box
        sx={{
          mt: '5px',
          width: 12,
          height: 12,
          flexShrink: 0,
          borderRadius: '50%',
          bgcolor: isBuy ? color.tradeCurrentPrice : color.sell,
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 700,
              color: isBuy ? color.tradeCurrentPrice : color.sell,
            }}
          >
            {isBuy ? '매수' : '매도'}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#9a9a9a' }}>
            {entry.orderedAt.replace('T', ' ').slice(0, 16)}
          </Typography>
        </Box>
        <Box
          sx={{
            mt: '6px',
            display: 'flex',
            gap: '8px',
            alignItems: 'baseline',
          }}
        >
          <Typography sx={{ fontSize: '14px', color: '#3e3e3e' }}>
            {entry.corpName}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: '#b1b1b1' }}>
            {entry.corpCode}
          </Typography>
        </Box>
        <Box
          sx={{
            mt: '2px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <Typography sx={{ fontSize: '13px', color: '#6b6b6b' }}>
            {krw.format(entry.price)}원 · {krw.format(entry.quantity)}주
          </Typography>
          <Typography
            sx={{ fontSize: '13px', fontWeight: 500, color: '#3e3e3e' }}
          >
            {krw.format(entry.amount)}원
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export function TradeDialog({
  open,
  stockCode,
  stockName,
  stockNameEn,
  onClose,
  onCompleted,
  orderBook,
  orderHistory,
  holdings,
  estimatedUsd,
  onViewAllHistory,
}: TradeDialogProps) {
  const [mode, setMode] = useState<OrderMode>('MARKET');
  const [limitTradeType, setLimitTradeType] = useState<TradeType>('BUY');
  const [limitInputMode, setLimitInputMode] =
    useState<LimitInputMode>('QUANTITY');
  const [quantityInput, setQuantityInput] = useState('1');
  const [priceInput, setPriceInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [submittingAction, setSubmittingAction] = useState<
    'market-buy' | 'market-sell' | 'limit' | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const submitting = submittingAction !== null;
  const bookConnected = orderBook != null;
  const book = orderBook ?? SAMPLE_ORDER_BOOK;
  const history = orderHistory ?? [];

  function resetState() {
    setMode('MARKET');
    setLimitTradeType('BUY');
    setLimitInputMode('QUANTITY');
    setQuantityInput('1');
    setPriceInput('');
    setAmountInput('');
    setError(null);
  }

  function handleClose() {
    if (submitting) return;
    resetState();
    onClose();
  }

  const quantity = toInt(quantityInput);
  const limitPrice = toInt(priceInput);
  const amount = toInt(amountInput);

  // 지정가 금액 주문일 때 수량은 (주문 금액 / 호가) 로 역산.
  const derivedQuantity =
    limitInputMode === 'AMOUNT'
      ? limitPrice > 0
        ? Math.floor(amount / limitPrice)
        : 0
      : quantity;

  const marketAmount =
    quantity > 0 && bookConnected ? quantity * book.currentPrice : null;
  const limitAmount =
    limitInputMode === 'AMOUNT'
      ? amount || null
      : limitPrice > 0 && quantity > 0
        ? limitPrice * quantity
        : null;

  const marketValid = quantity > 0;
  const limitValid = limitPrice > 0 && derivedQuantity > 0;

  const usdText = useMemo(
    () =>
      estimatedUsd != null && Number.isFinite(estimatedUsd)
        ? `USD : ${krw.format(Math.round(estimatedUsd))}`
        : 'USD : 미연동',
    [estimatedUsd],
  );

  async function submit(
    action: 'market-buy' | 'market-sell' | 'limit',
    orderType: OrderType,
    tradeType: TradeType,
  ) {
    const qty = orderType === 'LIMIT' ? derivedQuantity : quantity;
    if (qty <= 0) return;
    if (orderType === 'LIMIT' && limitPrice <= 0) return;

    const input: CreateOrderInput = {
      orderType,
      orderCategory: 'GENERAL',
      tradeType,
      corpCode: stockCode,
      corpName: stockName,
      currenciesId: CURRENCIES_ID,
      quantity: qty,
      ...(orderType === 'LIMIT' ? { price: limitPrice } : {}),
    };

    setSubmittingAction(action);
    setError(null);
    try {
      await createOrder(input);
      onCompleted();
      resetState();
      onClose();
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSubmittingAction(null);
    }
  }

  const holdingRows: { label: string; value: number | undefined }[] = [
    { label: '판매 가능 수량', value: holdings?.sellable },
    { label: '구매 가능 수량', value: holdings?.buyable },
    { label: '현재 보유 수량', value: holdings?.owned },
  ];

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : handleClose}
      aria-labelledby="trade-dialog-title"
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(28,27,31,0.42)' } },
        paper: {
          sx: {
            width: 1280,
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 32px)',
            m: 2,
            boxSizing: 'border-box',
            borderRadius: '30px',
            border: `1px solid ${color.stockDialogBorder}`,
            boxShadow: '0 0 3px rgba(0,0,0,0.3)',
            fontFamily,
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
            px: { xs: 3, md: '40px' },
            pt: { xs: 3, md: '44px' },
            pb: '20px',
          }}
        >
          <Box>
            <Typography
              id="trade-dialog-title"
              component="h2"
              sx={{
                fontSize: { xs: '24px', md: '30px' },
                fontWeight: 500,
                color: '#000',
              }}
            >
              {MODE_TITLE[mode]}
            </Typography>
            <Typography
              sx={{ mt: '6px', fontSize: '15px', color: color.stockMuted }}
            >
              {stockName} · {stockCode} · 시세 미연동
            </Typography>
          </Box>
          <IconButton
            aria-label="거래 팝업 닫기"
            onClick={handleClose}
            disabled={submitting}
            sx={{ color: '#000', mt: '-4px' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            flexWrap: { lg: 'wrap' },
            alignItems: 'stretch',
            gap: '20px',
            px: { xs: 3, md: '40px' },
            pb: { xs: 3, md: '44px' },
          }}
        >
          {/* 좌측: 종목 정보 + 주문 내역 */}
          <Stack
            sx={{
              gap: '20px',
              width: { xs: '100%', lg: 'auto' },
              flex: { lg: '0 1 264px' },
            }}
          >
            <Box sx={panelSx}>
              <Typography sx={sectionLabelSx}>종목 정보</Typography>
              <Box
                sx={{
                  mt: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    flexShrink: 0,
                    borderRadius: '10px',
                    bgcolor: color.stockPlaceholder,
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}
                  >
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#3e3e3e',
                      }}
                    >
                      {stockName}
                    </Typography>
                    <Typography sx={{ fontSize: '13px', color: '#b1b1b1' }}>
                      {stockCode}
                    </Typography>
                  </Box>
                  {stockNameEn && (
                    <Typography
                      sx={{ mt: '4px', fontSize: '14px', color: '#b1b1b1' }}
                    >
                      {stockNameEn}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                ...panelSx,
                flex: { lg: 1 },
                display: 'flex',
                flexDirection: 'column',
                minHeight: { lg: 360 },
              }}
            >
              <Typography sx={sectionLabelSx}>주문 내역</Typography>
              {history.length === 0 ? (
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: '48px',
                    gap: '10px',
                  }}
                >
                  <LibraryBooksOutlinedIcon
                    sx={{ fontSize: 44, color: color.tradeEmptyText }}
                  />
                  <Typography
                    sx={{
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: 500,
                      lineHeight: 1.9,
                      color: color.tradeEmptyText,
                    }}
                  >
                    주문 내역이 없습니다.
                    <br />
                    주문을 입력하면
                    <br />
                    내역이 여기에 표시됩니다.
                  </Typography>
                </Box>
              ) : (
                <Stack sx={{ mt: '18px', flex: 1, gap: '18px' }}>
                  <Stack sx={{ gap: '18px' }}>
                    {history.map((entry) => (
                      <OrderHistoryRow key={entry.id} entry={entry} />
                    ))}
                  </Stack>
                  <Box sx={{ mt: 'auto', pt: '8px' }}>
                    <Button
                      appVariant="outline"
                      fullWidth
                      disabled={!onViewAllHistory}
                      onClick={onViewAllHistory}
                      sx={{
                        height: 44,
                        borderRadius: '12px',
                        fontSize: '14px',
                      }}
                    >
                      전체 주문 내역 보기
                    </Button>
                  </Box>
                </Stack>
              )}
            </Box>
          </Stack>

          {/* 중앙: 호가창 */}
          <Box
            sx={{
              ...panelSx,
              width: { xs: '100%', lg: 'auto' },
              flex: { lg: '0 1 320px' },
              borderRadius: '24px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <Typography sx={sectionLabelSx}>호가창</Typography>
              {!bookConnected && (
                <Typography sx={{ fontSize: '12px', color: color.stockMuted }}>
                  실시간 미연동
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                mt: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                px: '6px',
                fontSize: '13px',
                color: color.tradeColHeader,
              }}
            >
              <span>가격 (원)</span>
              <span>수량 (주)</span>
            </Box>
            <Stack
              sx={{ mt: '10px', gap: '8px', opacity: bookConnected ? 1 : 0.55 }}
            >
              {book.asks.map((level, index) => (
                <OrderBookRow
                  key={`ask-${index}`}
                  level={level}
                  side="ask"
                  onSelect={
                    mode === 'LIMIT'
                      ? () => setPriceInput(String(level.price))
                      : undefined
                  }
                />
              ))}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  py: '12px',
                  my: '2px',
                  borderTop: `1px solid ${color.border}`,
                  borderBottom: `1px solid ${color.border}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: color.tradeCurrentPrice,
                  }}
                >
                  {formatKrw(book.currentPrice)}
                </Typography>
              </Box>
              {book.bids.map((level, index) => (
                <OrderBookRow
                  key={`bid-${index}`}
                  level={level}
                  side="bid"
                  onSelect={
                    mode === 'LIMIT'
                      ? () => setPriceInput(String(level.price))
                      : undefined
                  }
                />
              ))}
            </Stack>
          </Box>

          {/* 우측: 주문 패널 */}
          <Box
            sx={{
              ...panelSx,
              flex: { lg: '1 1 380px' },
              minWidth: 0,
              borderRadius: '24px',
            }}
          >
            <Box sx={{ display: 'flex' }} role="tablist" aria-label="주문 유형">
              {MODES.map((item) => {
                const active = item.id === mode;
                return (
                  <Box
                    key={item.id}
                    component="button"
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-disabled={item.disabled}
                    title={item.disabled ? '서비스 준비 중입니다.' : undefined}
                    onClick={() => !item.disabled && setMode(item.id)}
                    sx={{
                      flex: 1,
                      pb: '12px',
                      bgcolor: 'transparent',
                      border: 'none',
                      borderBottom: active
                        ? `3px solid ${color.tradeTabActive}`
                        : `1px solid ${color.border}`,
                      fontFamily: 'inherit',
                      fontSize: active ? '20px' : '18px',
                      fontWeight: 700,
                      color: active
                        ? color.tradeTabActive
                        : color.tradeTabInactive,
                      cursor: item.disabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {item.label}
                  </Box>
                );
              })}
            </Box>

            {mode === 'CONDITIONAL' && (
              <Box sx={{ py: '96px', textAlign: 'center' }}>
                <Typography sx={{ fontSize: '16px', color: color.stockMuted }}>
                  조건 거래는 서비스 준비 중입니다.
                </Typography>
              </Box>
            )}

            {mode === 'MARKET' && (
              <Stack sx={{ mt: '28px', gap: '20px' }}>
                <Box sx={subCardSx}>
                  <Typography sx={{ fontSize: '17px', color: '#000' }}>
                    주문 수량
                  </Typography>
                  <Box sx={{ mt: '18px' }}>
                    <StepperField
                      ariaLabel="주문 수량"
                      value={quantityInput}
                      onChange={setQuantityInput}
                      suffix="주"
                      min={0}
                    />
                  </Box>
                  <Stack sx={{ mt: '22px', gap: '12px' }}>
                    {holdingRows.map((row, index) => (
                      <Box key={row.label}>
                        {index === 2 && (
                          <Box
                            sx={{
                              mb: '12px',
                              borderTop: `1px solid ${color.tradeSubCardBorder}`,
                            }}
                          />
                        )}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '15px',
                              fontWeight: 500,
                              color: color.tradeSubLabel,
                            }}
                          >
                            {row.label}
                          </Typography>
                          <Typography
                            sx={{ fontSize: '15px', color: '#6b6b6b' }}
                          >
                            {row.value == null ? (
                              '—'
                            ) : (
                              <>
                                <Box
                                  component="span"
                                  sx={{ fontSize: '16px', color: '#000' }}
                                >
                                  {krw.format(row.value)}
                                </Box>{' '}
                                주
                              </>
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box sx={subCardSx}>
                  <Typography sx={{ fontSize: '17px', color: '#000' }}>
                    예상 금액
                  </Typography>
                  <Typography
                    sx={{
                      mt: '18px',
                      textAlign: 'center',
                      fontSize: '32px',
                      fontWeight: 700,
                      color: '#000',
                    }}
                  >
                    {formatKrw(marketAmount)}{' '}
                    <Box
                      component="span"
                      sx={{ fontSize: '22px', fontWeight: 500 }}
                    >
                      원
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      mt: '12px',
                      textAlign: 'center',
                      fontSize: '17px',
                      color: '#777',
                    }}
                  >
                    KRW : {formatKrw(marketAmount)}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: 'center',
                      fontSize: '17px',
                      color: '#777',
                    }}
                  >
                    {usdText}
                  </Typography>
                </Box>

                {error && <Alert severity="error">{error}</Alert>}

                <Stack sx={{ gap: '12px' }}>
                  <MarketActionButton
                    tone="buy"
                    loading={submittingAction === 'market-buy'}
                    disabled={!marketValid || submitting}
                    onClick={() => void submit('market-buy', 'MARKET', 'BUY')}
                  >
                    시장가 매수
                  </MarketActionButton>
                  <MarketActionButton
                    tone="sell"
                    loading={submittingAction === 'market-sell'}
                    disabled={!marketValid || submitting}
                    onClick={() => void submit('market-sell', 'MARKET', 'SELL')}
                  >
                    시장가 매도
                  </MarketActionButton>
                </Stack>
              </Stack>
            )}

            {mode === 'LIMIT' && (
              <Stack sx={{ mt: '28px', gap: '20px' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  {(['BUY', 'SELL'] as const).map((value) => (
                    <Button
                      key={value}
                      appVariant={
                        limitTradeType === value ? 'outlineSelected' : 'outline'
                      }
                      onClick={() => setLimitTradeType(value)}
                      sx={{
                        height: 48,
                        borderRadius: '12px',
                        fontSize: '17px',
                      }}
                    >
                      {value === 'BUY' ? '매수' : '매도'}
                    </Button>
                  ))}
                </Box>

                <Box>
                  <Typography
                    sx={{ fontSize: '15px', color: color.tradeSubLabel }}
                  >
                    주문 방식
                  </Typography>
                  <Box sx={{ mt: '12px', display: 'flex', gap: '28px' }}>
                    {(
                      [
                        { id: 'QUANTITY', label: '수량 주문' },
                        { id: 'AMOUNT', label: '금액 주문' },
                      ] as const
                    ).map((item) => {
                      const selected = limitInputMode === item.id;
                      return (
                        <Box
                          key={item.id}
                          component="button"
                          type="button"
                          onClick={() => setLimitInputMode(item.id)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            p: 0,
                            border: 'none',
                            bgcolor: 'transparent',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              border: `2px solid ${
                                selected
                                  ? color.tradeTabActive
                                  : color.tradeFieldBorder
                              }`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {selected && (
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  bgcolor: color.tradeTabActive,
                                }}
                              />
                            )}
                          </Box>
                          <Typography sx={{ fontSize: '15px', color: '#333' }}>
                            {item.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                <Box>
                  <Typography
                    sx={{
                      mb: '10px',
                      fontSize: '15px',
                      color: color.tradeSubLabel,
                    }}
                  >
                    호가 (지정가)
                  </Typography>
                  <StepperField
                    ariaLabel="호가"
                    value={priceInput}
                    onChange={setPriceInput}
                    suffix="원"
                    step={PRICE_STEP}
                    min={0}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      mb: '10px',
                      fontSize: '15px',
                      color: color.tradeSubLabel,
                    }}
                  >
                    수량
                  </Typography>
                  <StepperField
                    ariaLabel="수량"
                    value={
                      limitInputMode === 'AMOUNT'
                        ? String(derivedQuantity)
                        : quantityInput
                    }
                    onChange={setQuantityInput}
                    suffix="주"
                    min={0}
                    readOnly={limitInputMode === 'AMOUNT'}
                  />
                </Box>

                <Box
                  sx={{ borderTop: `1px solid ${color.tradeSubCardBorder}` }}
                />

                <Box>
                  <Typography
                    sx={{
                      mb: '10px',
                      fontSize: '15px',
                      color: color.tradeSubLabel,
                    }}
                  >
                    주문 금액
                  </Typography>
                  <Box sx={fieldBoxSx}>
                    <Box
                      component="input"
                      type="text"
                      inputMode="numeric"
                      size={1}
                      aria-label="주문 금액"
                      placeholder="0"
                      readOnly={limitInputMode === 'QUANTITY'}
                      value={
                        limitInputMode === 'QUANTITY'
                          ? formatKrw(limitAmount) === '—'
                            ? ''
                            : formatKrw(limitAmount)
                          : formatInput(amountInput)
                      }
                      onChange={(event) =>
                        setAmountInput(digitsOnly(event.target.value))
                      }
                      sx={inputSx}
                    />
                    <Typography sx={{ fontSize: '15px', color: '#848484' }}>
                      원
                    </Typography>
                  </Box>
                  <Typography
                    sx={{ mt: '8px', fontSize: '12px', color: '#a5a5a5' }}
                  >
                    주문 금액 = 호가 × 수량
                  </Typography>
                </Box>

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  fullWidth
                  disabled={!limitValid || submitting}
                  onClick={() => void submit('limit', 'LIMIT', limitTradeType)}
                  sx={{
                    height: 60,
                    borderRadius: '14px',
                    fontSize: '20px',
                    fontWeight: 700,
                  }}
                >
                  {submittingAction === 'limit' ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `확정하기 (${limitTradeType === 'BUY' ? '매수' : '매도'})`
                  )}
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default TradeDialog;

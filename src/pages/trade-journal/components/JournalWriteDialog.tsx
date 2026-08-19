import { useState, type ChangeEvent, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import type {
  BuyDiary,
  GoalEvaluationCode,
  SellDiary,
  SellReasonCode,
  TradeJournalItem,
  TradeType,
} from '../types';
import {
  GOAL_EVAL_OPTIONS,
  HOLD_PERIOD_OPTIONS,
  SELL_REASON_OPTIONS,
} from '../types';
import {
  formatMarketCap,
  formatPrice,
  formatTradeDateTime,
} from '../filter-items';
import { tokens } from '../../../theme/tokens';
import { LAYOUT } from '../layout';
import { EmotionPicker } from './EmotionPicker';

const { color, fontFamily } = tokens;
const { write } = LAYOUT;

const BUY_ACCENT = '#11acd0';
const SELL_ACCENT = '#2e9b4f';
const CARD_BG = '#f5f7f9';
const INPUT_BORDER = '#d7d7d7';

export type JournalWritePayload = {
  tradeId: number;
  buyDiary?: Omit<BuyDiary, 'id'> & { id?: number };
  sellDiary?: Omit<SellDiary, 'id'> & { id?: number };
};

export interface JournalWriteDialogProps {
  open: boolean;
  item: TradeJournalItem | null;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSave: (payload: JournalWritePayload) => void;
  onTradeTypeChange?: (type: TradeType) => void;
}

/** Figma 360:2125 / 377:2221 — 일기 쓰기 팝업 **/
export function JournalWriteDialog({
  open,
  item,
  mode,
  onClose,
  onSave,
  onTradeTypeChange,
}: JournalWriteDialogProps) {
  if (!item) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      scroll="paper"
      slotProps={{
        paper: {
          sx: {
            width: write.width,
            maxWidth: `min(${write.width}px, 94vw)`,
            maxHeight: write.maxHeight,
            borderRadius: `${write.radius}px`,
            overflow: 'hidden',
            fontFamily,
          },
        },
        backdrop: {
          sx: { backgroundColor: 'rgba(0,0,0,0.28)' },
        },
      }}
    >
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: write.padX,
            pt: '24px',
            pb: '14px',
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{ fontSize: write.titleSize, fontWeight: 700, color: '#000' }}
          >
            매매 일기 작성
            {mode === 'edit' ? ' (수정)' : ''}
          </Typography>
          <IconButton onClick={onClose} aria-label="닫기" size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <WriteForm
          key={`${item.id}-${mode}-${String(open)}`}
          item={item}
          onSave={onSave}
          onTradeTypeChange={onTradeTypeChange}
        />
      </DialogContent>
    </Dialog>
  );
}

function WriteForm({
  item,
  onSave,
  onTradeTypeChange,
}: {
  item: TradeJournalItem;
  onSave: (payload: JournalWritePayload) => void;
  onTradeTypeChange?: (type: TradeType) => void;
}) {
  const isBuy = item.tradeType === 'BUY';
  const accent = isBuy ? BUY_ACCENT : SELL_ACCENT;
  const buy = item.buyDiary;
  const sell = item.sellDiary;

  const holdPreset =
    buy?.goalHoldPeriod &&
    HOLD_PERIOD_OPTIONS.some((o) => o.value === buy.goalHoldPeriod)
      ? buy.goalHoldPeriod
      : buy?.goalHoldPeriod
        ? HOLD_PERIOD_OPTIONS[3].value
        : HOLD_PERIOD_OPTIONS[1].value;

  const [diaryBody, setDiaryBody] = useState(buy?.diaryBody ?? '');
  const [goalStock, setGoalStock] = useState(
    buy?.goalStock != null ? String(buy.goalStock) : '',
  );
  const [goalHoldPeriod, setGoalHoldPeriod] = useState(holdPreset);
  const [holdOtherText, setHoldOtherText] = useState(
    buy?.goalHoldPeriod &&
      !HOLD_PERIOD_OPTIONS.some((o) => o.value === buy.goalHoldPeriod)
      ? buy.goalHoldPeriod
      : '',
  );
  const [emotion, setEmotion] = useState<number | undefined>(
    buy?.emotion ?? sell?.emotion,
  );
  const [memo, setMemo] = useState(buy?.memo ?? '');

  const [sellReasonCode, setSellReasonCode] = useState<
    SellReasonCode | undefined
  >(sell?.sellReasonCode);
  const [sellReasonDetail, setSellReasonDetail] = useState(
    sell?.sellReasonDetail ?? '',
  );
  const [goalEvalCode, setGoalEvalCode] = useState<
    GoalEvaluationCode | undefined
  >(sell?.goalEvaluationCode);
  const [goalEvalDetail, setGoalEvalDetail] = useState(
    sell?.goalEvaluationDetail ?? '',
  );
  const [retrospectiveMemo, setRetrospectiveMemo] = useState(
    sell?.retrospectiveMemo ?? '',
  );

  const isHoldOther = goalHoldPeriod === HOLD_PERIOD_OPTIONS[3].value;

  const buyValid =
    diaryBody.trim().length > 0 &&
    (!isHoldOther || holdOtherText.trim().length > 0);
  const sellValid =
    Boolean(sellReasonCode) &&
    (sellReasonCode !== 'OTHER' || sellReasonDetail.trim().length > 0);
  const canSave = isBuy ? buyValid : sellValid;

  function handleSave() {
    if (!canSave) return;
    if (item.tradeType === 'BUY') {
      onSave({
        tradeId: item.id,
        buyDiary: {
          id: buy?.id,
          tradeId: item.id,
          diaryBody: diaryBody.trim(),
          goalStock: goalStock
            ? Number(goalStock.replace(/,/g, ''))
            : undefined,
          goalHoldPeriod: isHoldOther ? holdOtherText.trim() : goalHoldPeriod,
          emotion,
          memo: memo.trim() || undefined,
        },
      });
    } else {
      onSave({
        tradeId: item.id,
        sellDiary: {
          id: sell?.id,
          tradeId: item.id,
          sellReasonCode: sellReasonCode!,
          sellReasonDetail: sellReasonDetail.trim() || undefined,
          goalEvaluationCode: goalEvalCode,
          goalEvaluationDetail: goalEvalDetail.trim() || undefined,
          emotion,
          retrospectiveMemo: retrospectiveMemo.trim() || undefined,
        },
      });
    }
  }

  return (
    <>
      <Box
        sx={{
          px: write.padX,
          pb: 2,
          overflowY: 'auto',
          flex: 1,
          minHeight: 0,
        }}
      >
        <TradeTypeTabs
          tradeType={item.tradeType}
          onChange={onTradeTypeChange}
        />

        <Stack spacing={write.sectionGap} sx={{ mt: '28px' }}>
          <Section
            n={1}
            title="거래 정보"
            accent={accent}
            body={
              <InfoCard>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    rowGap: '20px',
                    columnGap: 3,
                  }}
                >
                  <Field label="종목명" value={item.corpName} />
                  <Field
                    label={isBuy ? '매수 일시' : '매도 일시'}
                    value={formatTradeDateTime(item.tradedAt)}
                  />
                  <Field
                    label={isBuy ? '매수가' : '매도가'}
                    value={formatPrice(item.price)}
                  />
                  <Field label="수량" value={`${item.amount}주`} />
                  <Field label="총 금액" value={formatPrice(item.totalPrice)} />
                </Box>
              </InfoCard>
            }
          />

          <Section
            n={2}
            title="거래 당시 기업 정보"
            accent={accent}
            body={
              <InfoCard sx={{ minHeight: 160 }}>
                <Box sx={{ display: 'flex', gap: 2, minHeight: 120 }}>
                  <Box
                    sx={{
                      flex: '0 0 42%',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 3,
                      alignContent: 'start',
                    }}
                  >
                    <Field
                      label="PER (주가수익비율)"
                      value={item.per?.toFixed(1) ?? '-'}
                    />
                    <Field
                      label="PBR (주가순자산비율)"
                      value={item.pbr?.toFixed(1) ?? '-'}
                    />
                    <Field
                      label="시가 총액"
                      value={formatMarketCap(item.marketCap)}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: '1px',
                      alignSelf: 'stretch',
                      backgroundColor: '#e0e0e0',
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: color.textSecondary,
                        mb: 1.5,
                      }}
                    >
                      당시 캔들 차트
                    </Typography>
                    <Box
                      sx={{
                        height: 88,
                        borderRadius: '8px',
                        backgroundColor: '#d9d9d9',
                        backgroundImage: item.candle
                          ? `url(${item.candle})`
                          : undefined,
                        backgroundSize: 'cover',
                      }}
                    />
                  </Box>
                </Box>
              </InfoCard>
            }
          />

          {isBuy ? (
            <>
              <Section
                n={3}
                title="매수 이유"
                required
                accent={accent}
                body={
                  <MultilineInput
                    value={diaryBody}
                    onChange={setDiaryBody}
                    placeholder="자유롭게 작성해주세요."
                    minHeight={111}
                  />
                }
              />

              <Section
                n={4}
                title="투자 계획"
                accent={accent}
                body={
                  <Box sx={{ display: 'flex', gap: '15px' }}>
                    <InfoCard
                      sx={{ flex: '0 0 360px', height: 160, p: '20px 28px' }}
                    >
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#393939',
                          mb: '11px',
                        }}
                      >
                        목표 주가
                      </Typography>
                      <Box
                        component="input"
                        value={goalStock}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setGoalStock(e.target.value)
                        }
                        placeholder="예 : 90,000원"
                        sx={{
                          width: 347,
                          maxWidth: '100%',
                          height: 44,
                          borderRadius: '8px',
                          border: `1px solid ${INPUT_BORDER}`,
                          backgroundColor: color.white,
                          px: '20px',
                          fontSize: '0.875rem',
                          fontFamily,
                          outline: 'none',
                          boxSizing: 'border-box',
                          '&::placeholder': { color: '#bcbcbc' },
                          '&:focus': { borderColor: accent },
                        }}
                      />
                    </InfoCard>
                    <InfoCard sx={{ flex: 1, height: 160, p: '20px 28px' }}>
                      <Typography
                        sx={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#393939',
                          mb: 2,
                        }}
                      >
                        목표 보유 기간
                      </Typography>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '24px 20px',
                        }}
                      >
                        {HOLD_PERIOD_OPTIONS.map((opt) => (
                          <RadioOption
                            key={opt.value}
                            label={opt.label}
                            selected={goalHoldPeriod === opt.value}
                            onClick={() => setGoalHoldPeriod(opt.value)}
                            accent={accent}
                          />
                        ))}
                      </Box>
                      {isHoldOther ? (
                        <Box
                          component="input"
                          value={holdOtherText}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setHoldOtherText(e.target.value)
                          }
                          placeholder="보유 기간을 직접 입력해주세요."
                          sx={{
                            mt: 2,
                            width: '100%',
                            height: 44,
                            borderRadius: '8px',
                            border: `1px solid ${INPUT_BORDER}`,
                            backgroundColor: color.white,
                            px: '16px',
                            fontSize: '14px',
                            fontFamily,
                            outline: 'none',
                            boxSizing: 'border-box',
                            '&::placeholder': { color: '#bcbcbc' },
                            '&:focus': { borderColor: accent },
                          }}
                        />
                      ) : null}
                    </InfoCard>
                  </Box>
                }
              />

              <Section
                n={5}
                title="지금 감정"
                accent={accent}
                body={<EmotionPicker value={emotion} onChange={setEmotion} />}
              />

              <Section
                n={6}
                title="추가 메모 (선택)"
                accent={accent}
                body={
                  <MultilineInput
                    value={memo}
                    onChange={setMemo}
                    placeholder="기타 메모를 자유롭게 작성해주세요."
                    minHeight={111}
                  />
                }
              />
            </>
          ) : (
            <>
              <Section
                n={3}
                title="실현 손익"
                accent={accent}
                body={
                  <InfoCard
                    sx={{
                      backgroundColor: 'rgba(146,231,153,0.18)',
                      border: '1px solid #c8e6c9',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        py: 2,
                        minHeight: 88,
                      }}
                    >
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            lineHeight: 1.2,
                            color: color.textSecondary,
                          }}
                        >
                          실현 손익 (세전)
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '1.375rem',
                            lineHeight: 1.2,
                            fontWeight: 700,
                            color: SELL_ACCENT,
                          }}
                        >
                          {item.realizedProfit != null
                            ? `${item.realizedProfit >= 0 ? '+ ' : ''}${formatPrice(item.realizedProfit)}`
                            : '-'}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: '1px',
                          alignSelf: 'stretch',
                          minHeight: 56,
                          backgroundColor: '#d0d0d0',
                          flexShrink: 0,
                        }}
                      />
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px',
                            lineHeight: 1.2,
                            color: color.textSecondary,
                          }}
                        >
                          수익률
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '1.375rem',
                            lineHeight: 1.2,
                            fontWeight: 700,
                            color: SELL_ACCENT,
                          }}
                        >
                          {item.returnRate != null
                            ? `${item.returnRate >= 0 ? '+ ' : ''}${item.returnRate.toFixed(2)}%`
                            : '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </InfoCard>
                }
              />

              <Section
                n={4}
                title="매도 이유"
                required
                accent={accent}
                body={
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '20px 28px',
                      }}
                    >
                      {SELL_REASON_OPTIONS.map((opt) => (
                        <RadioOption
                          key={opt.value}
                          label={opt.label}
                          selected={sellReasonCode === opt.value}
                          onClick={() => setSellReasonCode(opt.value)}
                          accent={accent}
                        />
                      ))}
                    </Box>
                    <MultilineInput
                      value={sellReasonDetail}
                      onChange={setSellReasonDetail}
                      placeholder="기타 이유를 입력해주세요."
                      minHeight={56}
                      singleLine={sellReasonCode !== 'OTHER'}
                    />
                  </Stack>
                }
              />

              <Section
                n={5}
                title="지금 감정"
                accent={accent}
                body={<EmotionPicker value={emotion} onChange={setEmotion} />}
              />

              <Section
                n={6}
                title="목표 대비 평가"
                accent={accent}
                subtitle="(돌아보면 어땠나요?)"
                body={
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '20px 28px',
                      }}
                    >
                      {GOAL_EVAL_OPTIONS.map((opt) => (
                        <RadioOption
                          key={opt.value}
                          label={opt.label}
                          selected={goalEvalCode === opt.value}
                          onClick={() => setGoalEvalCode(opt.value)}
                          accent={accent}
                        />
                      ))}
                    </Box>
                    <MultilineInput
                      value={goalEvalDetail}
                      onChange={setGoalEvalDetail}
                      placeholder="기타 의견을 입력해주세요."
                      minHeight={56}
                    />
                  </Stack>
                }
              />

              <Section
                n={7}
                title="회고 메모"
                accent={accent}
                body={
                  <MultilineInput
                    value={retrospectiveMemo}
                    onChange={setRetrospectiveMemo}
                    placeholder="이번 거래에서 배운 점이나 느낀 점을 작성해주세요."
                    minHeight={140}
                  />
                }
              />
            </>
          )}
        </Stack>
      </Box>

      <Box
        sx={{
          px: write.padX,
          py: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          flexShrink: 0,
          borderTop: `1px solid ${color.border}`,
        }}
      >
        <Box
          component="button"
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          sx={{
            width: write.saveW,
            height: write.saveH,
            border: 0,
            borderRadius: '24px',
            fontFamily,
            fontSize: '0.9375rem',
            fontWeight: 700,
            cursor: canSave ? 'pointer' : 'not-allowed',
            backgroundColor: canSave ? accent : '#c8c8c8',
            color: color.white,
            '&:hover': {
              backgroundColor: canSave
                ? isBuy
                  ? '#0e9bb8'
                  : '#278a45'
                : '#c8c8c8',
            },
          }}
        >
          일기 저장하기
        </Box>
      </Box>
    </>
  );
}

function TradeTypeTabs({
  tradeType,
  onChange,
}: {
  tradeType: TradeType;
  onChange?: (type: TradeType) => void;
}) {
  const isBuy = tradeType === 'BUY';
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 840,
        height: write.tabH,
        borderRadius: '12px',
        backgroundColor: '#f4f3f5',
        boxShadow: '0px 0px 3px 0px rgba(0,0,0,0.3)',
        display: 'flex',
        p: '4px',
        boxSizing: 'border-box',
        mx: 'auto',
      }}
    >
      <Box
        component="button"
        type="button"
        aria-pressed={isBuy}
        onClick={() => onChange?.('BUY')}
        sx={{
          flex: 1,
          border: 0,
          borderRadius: '12px',
          backgroundColor: isBuy ? color.white : 'transparent',
          display: 'grid',
          placeItems: 'center',
          cursor: onChange ? 'pointer' : 'default',
          fontFamily,
        }}
      >
        <Typography
          sx={{
            fontSize: isBuy ? write.tabFontActive : write.tabFont,
            fontWeight: isBuy ? 700 : 500,
            color: isBuy ? BUY_ACCENT : '#9a9a9a',
          }}
        >
          매수
        </Typography>
      </Box>
      <Box
        component="button"
        type="button"
        aria-pressed={!isBuy}
        onClick={() => onChange?.('SELL')}
        sx={{
          flex: 1,
          border: 0,
          borderRadius: '12px',
          backgroundColor: !isBuy ? color.white : 'transparent',
          display: 'grid',
          placeItems: 'center',
          cursor: onChange ? 'pointer' : 'default',
          fontFamily,
        }}
      >
        <Typography
          sx={{
            fontSize: !isBuy ? write.tabFontActive : write.tabFont,
            fontWeight: !isBuy ? 700 : 500,
            color: !isBuy ? SELL_ACCENT : '#9a9a9a',
          }}
        >
          매도
        </Typography>
      </Box>
    </Box>
  );
}

function Section({
  n,
  title,
  required,
  subtitle,
  accent,
  body,
}: {
  n: number;
  title: string;
  required?: boolean;
  subtitle?: string;
  accent: string;
  body: ReactNode;
}) {
  return (
    <Box>
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '12px' }}
      >
        <Box
          sx={{
            width: write.counter,
            height: write.counter,
            borderRadius: '50%',
            backgroundColor: accent,
            color: color.white,
            display: 'grid',
            placeItems: 'center',
            fontSize: '0.8125rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {n}
        </Box>
        <Typography
          sx={{ fontSize: '1rem', fontWeight: 700, color: '#191919' }}
        >
          {title}
          {required ? (
            <Box component="span" sx={{ color: '#ff4d4d', ml: 0.5 }}>
              *
            </Box>
          ) : null}
          {subtitle ? (
            <Box
              component="span"
              sx={{
                ml: 1,
                fontSize: '14px',
                fontWeight: 400,
                color: color.textSecondary,
              }}
            >
              {subtitle}
            </Box>
          ) : null}
        </Typography>
      </Box>
      {body}
    </Box>
  );
}

function InfoCard({ children, sx }: { children: ReactNode; sx?: object }) {
  return (
    <Box
      sx={{
        backgroundColor: CARD_BG,
        borderRadius: '12px',
        p: '28px 32px',
        boxSizing: 'border-box',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        sx={{ fontSize: '14px', color: color.textSecondary, mb: '6px' }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#191919' }}>
        {value}
      </Typography>
    </Box>
  );
}

function MultilineInput({
  value,
  onChange,
  placeholder,
  minHeight = 111,
  singleLine,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  minHeight?: number;
  singleLine?: boolean;
}) {
  return (
    <Box
      component={singleLine ? 'input' : 'textarea'}
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
        onChange(e.target.value)
      }
      placeholder={placeholder}
      sx={{
        width: '100%',
        minHeight,
        height: singleLine ? minHeight : undefined,
        borderRadius: '12px',
        border: `1px solid ${INPUT_BORDER}`,
        backgroundColor: color.white,
        p: '22px 24px',
        fontSize: '0.875rem',
        fontFamily,
        resize: singleLine ? 'none' : 'vertical',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#191919',
        '&::placeholder': { color: '#bcbcbc' },
        '&:focus': { borderColor: BUY_ACCENT },
      }}
    />
  );
}

function RadioOption({
  label,
  selected,
  onClick,
  accent,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  accent: string;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        border: 0,
        background: 'transparent',
        cursor: 'pointer',
        p: 0,
        fontFamily,
      }}
    >
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: selected ? `7px solid ${accent}` : `2px solid #c0c0c0`,
          boxSizing: 'border-box',
          backgroundColor: color.white,
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: selected ? 600 : 400,
          color: '#393939',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

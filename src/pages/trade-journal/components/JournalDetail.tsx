import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import type { TradeJournalItem } from '../types';
import {
  EMOTION_OPTIONS,
  GOAL_EVAL_OPTIONS,
  SELL_REASON_OPTIONS,
} from '../types';
import {
  formatMarketCap,
  formatPrice,
  formatTradeDateTime,
} from '../filter-items';
import { tokens } from '../../../theme/tokens';
import { LAYOUT } from '../layout';
import { MoodIcon } from './MoodIcon';

const { color, fontFamily } = tokens;
const { detail } = LAYOUT;

const BUY_BADGE = { bg: '#92e0e7', text: '#02626a' };
const SELL_BADGE = { bg: '#92e799', text: '#006208' };
const BUY_ACCENT = '#11acd0';
const SELL_ACCENT = '#2e9b4f';

export interface JournalDetailProps {
  item: TradeJournalItem | null;
  onEdit: () => void;
  onDelete: () => void;
}

/** Figma 상세 패널 — 번호 섹션 + 거래/기업 정보 카드 **/
export function JournalDetail({ item, onEdit, onDelete }: JournalDetailProps) {
  if (!item) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          placeItems: 'center',
          minHeight: 400,
          fontFamily,
        }}
      >
        <Typography sx={{ fontSize: '1.125rem', color: color.mutedGray }}>
          거래 일지를 선택해 주세요.
        </Typography>
      </Box>
    );
  }

  const isBuy = item.tradeType === 'BUY';
  const accent = isBuy ? BUY_ACCENT : SELL_ACCENT;
  const badge = isBuy ? BUY_BADGE : SELL_BADGE;
  const hasDiary = Boolean(item.buyDiary || item.sellDiary);

  const sellReasonLabel = SELL_REASON_OPTIONS.find(
    (o) => o.value === item.sellDiary?.sellReasonCode,
  )?.label;
  const evalLabel = GOAL_EVAL_OPTIONS.find(
    (o) => o.value === item.sellDiary?.goalEvaluationCode,
  )?.label;
  const emotion = EMOTION_OPTIONS.find(
    (o) => o.value === (item.buyDiary?.emotion ?? item.sellDiary?.emotion),
  );

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        fontFamily,
        pl: 1,
        overflowY: 'auto',
        maxHeight: '100%',
        pr: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 0.5,
          mb: 2,
        }}
      >
        <IconButton
          aria-label="일지 수정"
          onClick={onEdit}
          disabled={!hasDiary}
          size="small"
        >
          <EditOutlinedIcon />
        </IconButton>
        <IconButton
          aria-label="일지 삭제"
          onClick={onDelete}
          disabled={!hasDiary}
          size="small"
        >
          <DeleteOutlineOutlinedIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            width: detail.avatar,
            height: detail.avatar,
            borderRadius: '12px',
            backgroundColor: color.iconMuted,
            flexShrink: 0,
          }}
        />
        <Box>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}
          >
            <Box
              sx={{
                px: '12px',
                py: '6px',
                borderRadius: '7px',
                backgroundColor: badge.bg,
                color: badge.text,
                fontWeight: 700,
                fontSize: '15px',
              }}
            >
              {isBuy ? '매수' : '매도'}
            </Box>
            <Typography
              sx={{ fontSize: detail.nameSize, fontWeight: 700, color: '#000' }}
            >
              {item.corpName}
            </Typography>
          </Box>
          <Typography sx={{ color: color.textSecondary, fontSize: '14px' }}>
            {formatTradeDateTime(item.tradedAt)}
          </Typography>
        </Box>
        {emotion ? (
          <Box sx={{ ml: 'auto' }}>
            <MoodIcon value={emotion.value} selected />
          </Box>
        ) : null}
      </Box>

      <Stack spacing={detail.sectionGap}>
        <DetailSection n={1} title="거래 정보" accent={accent}>
          <InfoCard>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 3,
              }}
            >
              <Metric
                label={isBuy ? '매수가' : '매도가'}
                value={formatPrice(item.price)}
              />
              <Metric label="수량" value={`${item.amount}주`} />
              <Metric label="총 금액" value={formatPrice(item.totalPrice)} />
            </Box>
          </InfoCard>
        </DetailSection>

        <DetailSection n={2} title="거래 당시 기업 정보" accent={accent}>
          <InfoCard>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box
                sx={{
                  flex: '0 0 45%',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 3,
                }}
              >
                <Metric
                  label="PER (주가수익비율)"
                  value={item.per?.toFixed(1) ?? '-'}
                />
                <Metric
                  label="PBR (주가순자산비율)"
                  value={item.pbr?.toFixed(1) ?? '-'}
                />
                <Metric
                  label="시가 총액"
                  value={formatMarketCap(item.marketCap)}
                />
              </Box>
              <Box
                sx={{
                  width: '1px',
                  backgroundColor: '#e0e0e0',
                  alignSelf: 'stretch',
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{ fontSize: '13px', color: color.textSecondary, mb: 1 }}
                >
                  당시 캔들 차트
                </Typography>
                <Box
                  sx={{
                    height: 90,
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
        </DetailSection>

        {!isBuy && (
          <DetailSection n={3} title="실현 손익" accent={accent}>
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
                  py: 1.5,
                  minHeight: 58,
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: detail.profitLabelValueGap,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '13px',
                      lineHeight: 1.2,
                      color: color.textSecondary,
                    }}
                  >
                    실현 손익 (세전)
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1.25rem',
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
                    minHeight: 50,
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
                    gap: detail.profitLabelValueGap,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '13px',
                      lineHeight: 1.2,
                      color: color.textSecondary,
                    }}
                  >
                    수익률
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1.25rem',
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
          </DetailSection>
        )}

        {item.diaryStatus === 'PENDING' && !hasDiary ? (
          <Typography sx={{ color: color.mutedGray }}>
            아직 작성된 일지가 없습니다.
          </Typography>
        ) : isBuy && item.buyDiary ? (
          <>
            <DetailSection n={3} title="매수 이유" accent={accent}>
              <InfoCard>
                <BodyText>{item.buyDiary.diaryBody}</BodyText>
              </InfoCard>
            </DetailSection>
            <DetailSection n={4} title="투자 계획" accent={accent}>
              <InfoCard>
                <Box sx={{ display: 'flex', gap: 6 }}>
                  <Metric
                    label="목표 주가"
                    value={
                      item.buyDiary.goalStock != null
                        ? formatPrice(item.buyDiary.goalStock)
                        : '-'
                    }
                  />
                  <Metric
                    label="목표 보유 기간"
                    value={item.buyDiary.goalHoldPeriod ?? '-'}
                  />
                </Box>
              </InfoCard>
            </DetailSection>
            {item.buyDiary.memo ? (
              <DetailSection n={5} title="추가 메모" accent={accent}>
                <InfoCard>
                  <BodyText>{item.buyDiary.memo}</BodyText>
                </InfoCard>
              </DetailSection>
            ) : null}
          </>
        ) : item.sellDiary ? (
          <>
            <DetailSection n={4} title="매도 이유" accent={accent}>
              <InfoCard>
                <BodyText>
                  {[sellReasonLabel, item.sellDiary.sellReasonDetail]
                    .filter(Boolean)
                    .join(' — ')}
                </BodyText>
              </InfoCard>
            </DetailSection>
            {(evalLabel || item.sellDiary.goalEvaluationDetail) && (
              <DetailSection n={5} title="목표 대비 평가" accent={accent}>
                <InfoCard>
                  <BodyText>
                    {[evalLabel, item.sellDiary.goalEvaluationDetail]
                      .filter(Boolean)
                      .join(' — ')}
                  </BodyText>
                </InfoCard>
              </DetailSection>
            )}
            {item.sellDiary.retrospectiveMemo ? (
              <DetailSection n={6} title="회고 메모" accent={accent}>
                <InfoCard>
                  <BodyText>{item.sellDiary.retrospectiveMemo}</BodyText>
                </InfoCard>
              </DetailSection>
            ) : null}
          </>
        ) : null}
      </Stack>
    </Box>
  );
}

function DetailSection({
  n,
  title,
  accent,
  children,
}: {
  n: number;
  title: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Box
          sx={{
            width: detail.counter,
            height: detail.counter,
            borderRadius: '50%',
            backgroundColor: accent,
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontSize: '14px',
            fontWeight: 700,
          }}
        >
          {n}
        </Box>
        <Typography
          sx={{
            fontSize: detail.sectionTitle,
            fontWeight: 700,
            color: '#191919',
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}

function InfoCard({ children, sx }: { children: ReactNode; sx?: object }) {
  return (
    <Box
      sx={{
        backgroundColor: '#f5f7f9',
        borderRadius: '12px',
        p: '14px 16px',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: detail.metricLabel,
          color: color.textSecondary,
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{ fontSize: detail.metricValue, fontWeight: 600, color: '#191919' }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function BodyText({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={{
        fontSize: '0.8125rem',
        color: '#393939',
        whiteSpace: 'pre-wrap',
        lineHeight: 1.6,
      }}
    >
      {children}
    </Typography>
  );
}

import type {
  BuyDiaryDetailDto,
  DiaryDetailDto,
  DiaryPrefillDto,
  DiaryPreviewDto,
  EmotionScore,
  SellDiaryDetailDto,
  TradeDto,
  TradeJournalItem,
} from './types';

function optionalNumber(value: number | null): number | undefined {
  return value ?? undefined;
}

function optionalText(value: string | null | undefined): string | undefined {
  return value ?? undefined;
}

function emotionScore(value: number): EmotionScore {
  if (value >= 1 && value <= 5 && Number.isInteger(value)) {
    return value as EmotionScore;
  }
  throw new Error(`지원하지 않는 감정 점수입니다: ${value}`);
}

export function diaryPreviewToJournalItem(
  preview: DiaryPreviewDto,
): TradeJournalItem {
  const price = optionalNumber(preview.avgPrice);
  return {
    id: preview.orderId,
    orderId: preview.orderId,
    diaryId: preview.diaryId,
    diaryDate: preview.date,
    tradeType: preview.type,
    corpCode: preview.corpCode,
    corpName: preview.corpName,
    tradedAt: `${preview.date}T00:00:00`,
    price,
    amount: preview.quantity,
    totalPrice: price == null ? undefined : price * preview.quantity,
    diaryStatus: 'COMPLETED',
    previewMemo: optionalText(preview.memo),
    hydrated: false,
  };
}

export function tradesToPendingJournalItems(
  trades: TradeDto[],
  completedOrderIds: ReadonlySet<number>,
): TradeJournalItem[] {
  const byOrder = new Map<number, TradeDto[]>();

  for (const trade of trades) {
    if (completedOrderIds.has(trade.ordersId)) continue;
    const group = byOrder.get(trade.ordersId);
    if (group) group.push(trade);
    else byOrder.set(trade.ordersId, [trade]);
  }

  return [...byOrder.entries()].map(([orderId, orderTrades]) => {
    const sorted = [...orderTrades].sort((a, b) =>
      b.tradedAt.localeCompare(a.tradedAt),
    );
    const representative = sorted[0];
    const amount = orderTrades.reduce((sum, trade) => sum + trade.quantity, 0);
    const totalPrice = orderTrades.reduce(
      (sum, trade) => sum + trade.totalPrice,
      0,
    );
    const realizedProfits = orderTrades.flatMap((trade) =>
      trade.realizedProfit == null ? [] : [trade.realizedProfit],
    );

    return {
      id: orderId,
      orderId,
      diaryDate: representative.tradedAt.slice(0, 10),
      tradeType: representative.tradeType,
      corpCode: representative.corpCode,
      corpName: representative.corpName,
      tradedAt: representative.tradedAt,
      price: amount > 0 ? totalPrice / amount : undefined,
      amount,
      totalPrice,
      diaryStatus: 'PENDING',
      realizedProfit:
        realizedProfits.length > 0
          ? realizedProfits.reduce((sum, value) => sum + value, 0)
          : undefined,
      hydrated: false,
    };
  });
}

function detailBase(detail: DiaryDetailDto): TradeJournalItem {
  return {
    id: detail.orderId,
    orderId: detail.orderId,
    diaryId: detail.diaryId,
    diaryDate: detail.date,
    tradeType: detail.type,
    corpCode: detail.corpCode,
    corpName: detail.corpName,
    tradedAt: detail.orderedAt,
    amount: detail.quantity,
    per: optionalNumber(detail.perAtOrder),
    pbr: optionalNumber(detail.pbrAtOrder),
    marketCap: optionalNumber(detail.marketCapAtOrder),
    candle: optionalText(detail.candleChartAtUrl),
    diaryStatus: 'COMPLETED',
    previewMemo: optionalText(detail.memo),
    hydrated: true,
  };
}

function buyDetailToJournalItem(detail: BuyDiaryDetailDto): TradeJournalItem {
  return {
    ...detailBase(detail),
    price: optionalNumber(detail.price),
    totalPrice: optionalNumber(detail.totalAmount),
    buyDiary: {
      id: detail.diaryId,
      orderId: detail.orderId,
      buyReason: detail.buyReason,
      goalPrice: optionalNumber(detail.goalPrice),
      goalHoldPeriod: detail.goalHoldPeriod ?? undefined,
      customGoalHoldPeriod: optionalText(detail.customGoalHoldPeriod),
      emotion: emotionScore(detail.emotion),
      memo: optionalText(detail.memo),
    },
  };
}

function sellDetailToJournalItem(detail: SellDiaryDetailDto): TradeJournalItem {
  return {
    ...detailBase(detail),
    price: optionalNumber(detail.sellPrice),
    totalPrice: optionalNumber(detail.totalSellAmount),
    realizedProfit: optionalNumber(detail.realizedProfit),
    returnRate: optionalNumber(detail.returnRate),
    sellDiary: {
      id: detail.diaryId,
      orderId: detail.orderId,
      sellReasonCode: detail.sellReasonCode,
      sellReasonDetail: optionalText(detail.sellReasonDetail),
      goalEvaluationCode: detail.goalEvaluationCode ?? undefined,
      goalEvaluationDetail: optionalText(detail.goalEvaluationDetail),
      emotion: emotionScore(detail.emotion),
      memo: optionalText(detail.memo),
    },
  };
}

export function diaryDetailToJournalItem(
  detail: DiaryDetailDto,
): TradeJournalItem {
  return detail.type === 'BUY'
    ? buyDetailToJournalItem(detail)
    : sellDetailToJournalItem(detail);
}

export function diaryPrefillToJournalItem(
  prefill: DiaryPrefillDto,
  current?: TradeJournalItem,
): TradeJournalItem {
  const common: TradeJournalItem = {
    id: prefill.orderId,
    orderId: prefill.orderId,
    diaryId: current?.diaryId,
    diaryDate: current?.diaryDate ?? prefill.orderedAt.slice(0, 10),
    tradeType: prefill.type,
    corpCode: prefill.corpCode,
    corpName: prefill.corpName,
    tradedAt: prefill.orderedAt,
    amount: prefill.quantity,
    per: optionalNumber(prefill.perAtOrder),
    pbr: optionalNumber(prefill.pbrAtOrder),
    marketCap: optionalNumber(prefill.marketCapAtOrder),
    candle: optionalText(prefill.candleChartAtUrl),
    diaryStatus: current?.diaryStatus ?? 'PENDING',
    previewMemo: current?.previewMemo,
    hydrated: true,
    buyDiary: current?.buyDiary,
    sellDiary: current?.sellDiary,
  };

  if (prefill.type === 'BUY') {
    return {
      ...common,
      price: optionalNumber(prefill.price),
      totalPrice: optionalNumber(prefill.totalAmount),
    };
  }

  return {
    ...common,
    price: optionalNumber(prefill.sellPrice),
    totalPrice: optionalNumber(prefill.totalSellAmount),
    realizedProfit: optionalNumber(prefill.realizedProfit),
    returnRate: optionalNumber(prefill.returnRate),
  };
}

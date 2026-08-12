import { endOfDay, isWithinInterval, parseISO, startOfDay } from 'date-fns';
import type { TradeJournalItem, ViewMode } from './types';

export interface JournalFilter {
  viewMode: ViewMode;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  corpCode: string | null;
}

export function filterJournalItems(
  items: TradeJournalItem[],
  filter: JournalFilter,
): TradeJournalItem[] {
  return items.filter((item) => {
    const traded = parseISO(item.tradedAt);

    if (filter.viewMode === 'date' && filter.rangeStart) {
      const start = startOfDay(filter.rangeStart);
      const end = startOfDay(filter.rangeEnd ?? filter.rangeStart);
      if (
        !isWithinInterval(traded, {
          start,
          end: endOfDay(end),
        })
      ) {
        return false;
      }
    }

    if (filter.viewMode === 'company' && filter.corpCode) {
      if (item.corpCode !== filter.corpCode) return false;
    }

    return true;
  });
}

/** 일기가 있는 종목 목록 (회사별 검색) **/
export function listCompanies(items: TradeJournalItem[]): {
  corpCode: string;
  corpName: string;
}[] {
  const map = new Map<string, string>();
  for (const item of items) {
    if (!item.corpCode) continue;
    if (item.buyDiary || item.sellDiary || item.diaryStatus === 'PENDING') {
      map.set(item.corpCode, item.corpName);
    }
  }
  return [...map.entries()]
    .map(([corpCode, corpName]) => ({ corpCode, corpName }))
    .sort((a, b) => a.corpName.localeCompare(b.corpName, 'ko'));
}

/** 캘린더 마킹용 — 거래가 있는 날짜 **/
export function listDiaryDates(items: TradeJournalItem[]): Date[] {
  const seen = new Set<string>();
  const dates: Date[] = [];
  for (const item of items) {
    if (!(item.buyDiary || item.sellDiary || item.diaryStatus === 'PENDING')) {
      continue;
    }
    const d = startOfDay(parseISO(item.tradedAt));
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    dates.push(d);
  }
  return dates;
}

export function previewText(item: TradeJournalItem, max = 40): string {
  const raw =
    item.buyDiary?.diaryBody ??
    item.sellDiary?.retrospectiveMemo ??
    item.sellDiary?.sellReasonDetail ??
    (item.diaryStatus === 'PENDING' ? '일지를 작성해 주세요.' : '');
  if (raw.length <= max) return raw;
  return `${raw.slice(0, max)}…`;
}

export function formatPrice(n: number): string {
  return `${n.toLocaleString('ko-KR')}원`;
}

export function formatMarketCap(n?: number): string {
  if (n == null) return '-';
  const jo = n / 1e12;
  if (jo >= 1) return `${jo.toFixed(0)}조`;
  const eok = n / 1e8;
  return `${eok.toFixed(0)}억`;
}

export function formatTradeDateTime(iso: string): string {
  const d = parseISO(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}.${m}.${day} ${hh}:${mm}`;
}

export function formatTradeDateTitle(iso: string): string {
  const d = parseISO(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day} 거래일지`;
}

export function defaultListTitle(items: TradeJournalItem[]): string {
  if (items.length === 0) return '거래일지';
  return formatTradeDateTitle(items[0].tradedAt);
}

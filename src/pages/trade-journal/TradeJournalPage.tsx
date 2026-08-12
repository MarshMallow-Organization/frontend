import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { format, isSameDay, parseISO, startOfDay } from 'date-fns';
import type { DateRange } from '../../components/RangeCalendar';
import { AppShell } from '../../components/AppShell';
import { JournalFilterRail } from './components/JournalFilterRail';
import { JournalCardList } from './components/JournalCardList';
import { JournalDetail } from './components/JournalDetail';
import {
  JournalWriteDialog,
  type JournalWritePayload,
} from './components/JournalWriteDialog';
import { JournalDeleteDialog } from './components/JournalDeleteDialog';
import { INITIAL_JOURNAL_ITEMS } from './mock-data';
import {
  defaultListTitle,
  filterJournalItems,
  listCompanies,
  listDiaryDates,
} from './filter-items';
import type { TradeJournalItem, TradeType, ViewMode } from './types';
import { tokens } from '../../theme/tokens';
import { LAYOUT } from './layout';

const { color } = tokens;
const { list, detail } = LAYOUT;

export default function TradeJournalPage() {
  const [items, setItems] = useState<TradeJournalItem[]>(() => [
    ...INITIAL_JOURNAL_ITEMS,
  ]);
  const [viewMode, setViewMode] = useState<ViewMode>('date');
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const d = startOfDay(parseISO('2026-07-30'));
    return [d, d];
  });
  const [selectedCorpCode, setSelectedCorpCode] = useState<string | null>(
    '005930',
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [writeOpen, setWriteOpen] = useState(false);
  const [writeMode, setWriteMode] = useState<'create' | 'edit'>('edit');
  const [writeTradeId, setWriteTradeId] = useState<number | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const companies = useMemo(() => listCompanies(items), [items]);
  const markedDates = useMemo(() => listDiaryDates(items), [items]);

  const filtered = useMemo(
    () =>
      filterJournalItems(items, {
        viewMode,
        rangeStart: dateRange[0],
        rangeEnd: dateRange[1],
        corpCode: selectedCorpCode,
      }),
    [items, viewMode, dateRange, selectedCorpCode],
  );

  /** 필터된 목록에 있는 항목만 상세에 표시 **/
  const selectedItem = filtered.find((i) => i.id === selectedId) ?? null;

  const writeItem =
    (writeTradeId != null ? items.find((i) => i.id === writeTradeId) : null) ??
    null;

  const listTitle =
    viewMode === 'company'
      ? selectedCorpCode
        ? `${companies.find((c) => c.corpCode === selectedCorpCode)?.corpName ?? ''} 거래일지`
        : '전체 거래일지'
      : dateRange[0] && dateRange[1] && !isSameDay(dateRange[0], dateRange[1])
        ? `${format(dateRange[0], 'yyyy.MM.dd')} ~ ${format(dateRange[1], 'yyyy.MM.dd')} 거래일지`
        : dateRange[0]
          ? `${format(dateRange[0], 'yyyy.MM.dd')} 거래일지`
          : defaultListTitle(filtered);

  function openEdit() {
    if (!selectedItem || !(selectedItem.buyDiary || selectedItem.sellDiary)) {
      return;
    }
    setWriteTradeId(selectedItem.id);
    setWriteMode('edit');
    setWriteOpen(true);
  }

  /** 작성 팝업 매수/매도 탭 — 같은 종목의 기존 거래로 전환 **/
  function handleWriteTradeTypeChange(type: TradeType) {
    if (!writeItem || writeItem.tradeType === type) return;

    const match =
      items.find(
        (i) =>
          i.tradeType === type &&
          i.corpCode === writeItem.corpCode &&
          (i.buyDiary || i.sellDiary),
      ) ??
      items.find(
        (i) => i.tradeType === type && i.corpCode === writeItem.corpCode,
      );

    if (!match) return;
    setWriteTradeId(match.id);
    setWriteMode(match.buyDiary || match.sellDiary ? 'edit' : 'create');
  }

  function handleSave(payload: JournalWritePayload) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== payload.tradeId) return item;
        if (payload.buyDiary) {
          const id = payload.buyDiary.id ?? Date.now();
          return {
            ...item,
            diaryStatus: 'COMPLETED' as const,
            buyDiary: {
              id,
              tradeId: item.id,
              diaryBody: payload.buyDiary.diaryBody,
              goalStock: payload.buyDiary.goalStock,
              goalHoldPeriod: payload.buyDiary.goalHoldPeriod,
              emotion: payload.buyDiary.emotion,
              memo: payload.buyDiary.memo,
            },
          };
        }
        if (payload.sellDiary) {
          const id = payload.sellDiary.id ?? Date.now();
          return {
            ...item,
            diaryStatus: 'COMPLETED' as const,
            sellDiary: {
              id,
              tradeId: item.id,
              sellReasonCode: payload.sellDiary.sellReasonCode,
              sellReasonDetail: payload.sellDiary.sellReasonDetail,
              goalEvaluationCode: payload.sellDiary.goalEvaluationCode,
              goalEvaluationDetail: payload.sellDiary.goalEvaluationDetail,
              emotion: payload.sellDiary.emotion,
              retrospectiveMemo: payload.sellDiary.retrospectiveMemo,
            },
          };
        }
        return item;
      }),
    );
    setSelectedId(payload.tradeId);
    setWriteOpen(false);
  }

  function handleDelete() {
    if (!selectedItem) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== selectedItem.id) return item;
        return {
          ...item,
          diaryStatus: 'PENDING' as const,
          buyDiary: undefined,
          sellDiary: undefined,
        };
      }),
    );
    setDeleteOpen(false);
  }

  return (
    <>
      <AppShell activeNav="journal">
        <JournalFilterRail
          viewMode={viewMode}
          onViewModeChange={(mode) => {
            setViewMode(mode);
            setSelectedId(null);
          }}
          dateRange={dateRange}
          onDateRangeChange={(range) => {
            setDateRange(range);
            setSelectedId(null);
          }}
          markedDates={markedDates}
          companies={companies}
          selectedCorpCode={selectedCorpCode}
          onCorpChange={(code) => {
            setSelectedCorpCode(code);
            setSelectedId(null);
          }}
        />

        <Box
          sx={{
            width: '1px',
            alignSelf: 'stretch',
            backgroundColor: color.border,
          }}
        />

        <Box
          sx={{
            pl: list.pl,
            pr: list.pr,
            display: 'flex',
            minWidth: 0,
          }}
        >
          <JournalCardList
            items={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
            listTitle={listTitle}
          />
        </Box>

        <Box
          sx={{
            width: '1px',
            alignSelf: 'stretch',
            backgroundColor: color.border,
          }}
        />

        <Box sx={{ flex: 1, minWidth: 0, pl: detail.pl }}>
          <JournalDetail
            item={selectedItem}
            onEdit={openEdit}
            onDelete={() => setDeleteOpen(true)}
          />
        </Box>
      </AppShell>

      <JournalWriteDialog
        open={writeOpen}
        item={writeItem}
        mode={writeMode}
        onClose={() => setWriteOpen(false)}
        onSave={handleSave}
        onTradeTypeChange={handleWriteTradeTypeChange}
      />

      <JournalDeleteDialog
        open={deleteOpen}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}

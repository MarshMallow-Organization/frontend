import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { format, isSameDay } from 'date-fns';
import type { DateRange } from '../../components/RangeCalendar';
import { AppShell } from '../../components/AppShell';
import {
  createDiary,
  deleteDiary,
  getAllDiaryPreviews,
  getAllTrades,
  getDiaryDetail,
  getDiaryPrefill,
  updateDiary,
} from '../../features/diaries/diariesApi';
import {
  diaryDetailToJournalItem,
  diaryPrefillToJournalItem,
  diaryPreviewToJournalItem,
  tradesToPendingJournalItems,
} from '../../features/diaries/mappers';
import type {
  CreateDiaryRequest,
  DiaryDetailDto,
  TradeJournalItem,
  UpdateDiaryRequest,
} from '../../features/diaries/types';
import { ApiError } from '../../lib/api';
import { JournalFilterRail } from './components/JournalFilterRail';
import { JournalCardList } from './components/JournalCardList';
import { JournalDetail } from './components/JournalDetail';
import {
  JournalWriteDialog,
  type JournalWritePayload,
} from './components/JournalWriteDialog';
import { JournalDeleteDialog } from './components/JournalDeleteDialog';
import {
  defaultListTitle,
  filterJournalItems,
  listCompanies,
  listDiaryDates,
} from './filter-items';
import type { TradeType, ViewMode } from './types';
import { tokens } from '../../theme/tokens';
import { LAYOUT } from './layout';

const { color } = tokens;
const { list, detail } = LAYOUT;

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError || error instanceof Error
    ? error.message
    : fallback;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function toCreateRequest(payload: JournalWritePayload): CreateDiaryRequest {
  if (payload.type === 'BUY') {
    return {
      orderId: payload.orderId,
      type: payload.type,
      date: payload.date,
      emotion: payload.emotion,
      buyReason: payload.buyReason,
      goalPrice: payload.goalPrice,
      goalHoldPeriod: payload.goalHoldPeriod,
      customGoalHoldPeriod: payload.customGoalHoldPeriod,
      memo: payload.memo,
    };
  }

  return {
    orderId: payload.orderId,
    type: payload.type,
    date: payload.date,
    emotion: payload.emotion,
    sellReasonCode: payload.sellReasonCode,
    sellReasonDetail: payload.sellReasonDetail,
    goalEvaluationCode: payload.goalEvaluationCode,
    goalEvaluationDetail: payload.goalEvaluationDetail,
    memo: payload.memo,
  };
}

function toUpdateRequest(payload: JournalWritePayload): UpdateDiaryRequest {
  if (payload.type === 'BUY') {
    return {
      date: payload.date,
      emotion: payload.emotion,
      buyReason: payload.buyReason,
      goalPrice: payload.goalPrice ?? null,
      goalHoldPeriod: payload.goalHoldPeriod,
      customGoalHoldPeriod: payload.customGoalHoldPeriod ?? null,
      memo: payload.memo ?? null,
    };
  }

  return {
    date: payload.date,
    emotion: payload.emotion,
    sellReasonCode: payload.sellReasonCode,
    sellReasonDetail: payload.sellReasonDetail ?? null,
    goalEvaluationCode: payload.goalEvaluationCode ?? null,
    goalEvaluationDetail: payload.goalEvaluationDetail ?? null,
    memo: payload.memo ?? null,
  };
}

function deletedDiaryToPending(item: TradeJournalItem): TradeJournalItem {
  return {
    ...item,
    diaryId: undefined,
    diaryStatus: 'PENDING',
    previewMemo: undefined,
    hydrated: false,
    buyDiary: undefined,
    sellDiary: undefined,
  };
}

export default function TradeJournalPage() {
  const [items, setItems] = useState<TradeJournalItem[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('date');
  const [dateRange, setDateRange] = useState<DateRange>([null, null]);
  const [selectedCorpCode, setSelectedCorpCode] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [writeOpen, setWriteOpen] = useState(false);
  const [writeMode, setWriteMode] = useState<'create' | 'edit'>('edit');
  const [writeOrderId, setWriteOrderId] = useState<number | null>(null);
  const [writeSaving, setWriteSaving] = useState(false);
  const [writeError, setWriteError] = useState<string | null>(null);
  const [autoFillLoading, setAutoFillLoading] = useState(false);
  const [writeReloadVersion, setWriteReloadVersion] = useState(0);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const listAbortRef = useRef<AbortController | null>(null);
  const detailAbortRef = useRef<AbortController | null>(null);

  const loadItems = useCallback(async () => {
    listAbortRef.current?.abort();
    const controller = new AbortController();
    listAbortRef.current = controller;
    setListLoading(true);
    setListError(null);

    try {
      const [previews, trades] = await Promise.all([
        getAllDiaryPreviews(controller.signal),
        getAllTrades(controller.signal),
      ]);
      const completed = previews.map(diaryPreviewToJournalItem);
      const completedOrderIds = new Set(completed.map((item) => item.orderId));
      const pending = tradesToPendingJournalItems(trades, completedOrderIds);
      const nextItems = [...completed, ...pending].sort((a, b) =>
        b.tradedAt.localeCompare(a.tradedAt),
      );

      setItems(nextItems);
      setSelectedId((current) =>
        current != null && nextItems.some((item) => item.id === current)
          ? current
          : null,
      );
    } catch (error) {
      if (!isAbortError(error)) {
        setListError(
          errorMessage(error, '매매일지 목록을 불러오지 못했습니다.'),
        );
      }
    } finally {
      if (listAbortRef.current === controller) setListLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadItems(), 0);
    return () => {
      window.clearTimeout(timeoutId);
      listAbortRef.current?.abort();
      detailAbortRef.current?.abort();
    };
  }, [loadItems]);

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

  const selectedItem = filtered.find((item) => item.id === selectedId) ?? null;
  const writeItem =
    items.find((item) => item.id === writeOrderId) ?? selectedItem;

  const listTitle =
    viewMode === 'company'
      ? selectedCorpCode
        ? `${companies.find((company) => company.corpCode === selectedCorpCode)?.corpName ?? ''} 거래일지`
        : '전체 거래일지'
      : dateRange[0] && dateRange[1] && !isSameDay(dateRange[0], dateRange[1])
        ? `${format(dateRange[0], 'yyyy.MM.dd')} ~ ${format(dateRange[1], 'yyyy.MM.dd')} 거래일지`
        : dateRange[0]
          ? `${format(dateRange[0], 'yyyy.MM.dd')} 거래일지`
          : defaultListTitle(filtered);

  function replaceItem(nextItem: TradeJournalItem) {
    setItems((current) =>
      current.map((item) => (item.id === nextItem.id ? nextItem : item)),
    );
  }

  async function hydrateItem(
    item: TradeJournalItem,
    signal?: AbortSignal,
  ): Promise<TradeJournalItem> {
    if (item.diaryId != null) {
      const detailDto = await getDiaryDetail(item.diaryId, signal);
      return diaryDetailToJournalItem(detailDto);
    }

    const prefillDto = await getDiaryPrefill(item.orderId, signal);
    return diaryPrefillToJournalItem(prefillDto, item);
  }

  async function handleSelect(id: number) {
    setSelectedId(id);
    setDetailError(null);
    const item = items.find((candidate) => candidate.id === id);
    if (!item || item.hydrated) return;

    detailAbortRef.current?.abort();
    const controller = new AbortController();
    detailAbortRef.current = controller;
    setDetailLoading(true);

    try {
      replaceItem(await hydrateItem(item, controller.signal));
    } catch (error) {
      if (!isAbortError(error)) {
        setDetailError(
          errorMessage(error, '매매일지 상세 정보를 불러오지 못했습니다.'),
        );
      }
    } finally {
      if (detailAbortRef.current === controller) setDetailLoading(false);
    }
  }

  async function openWriteForItem(
    item: TradeJournalItem,
    mode: 'create' | 'edit',
  ) {
    setWriteError(null);
    let nextItem = item;

    if (!item.hydrated) {
      setDetailLoading(true);
      try {
        nextItem = await hydrateItem(item);
        replaceItem(nextItem);
      } catch (error) {
        const message = errorMessage(
          error,
          '일기 작성 정보를 불러오지 못했습니다.',
        );
        setDetailError(message);
        setActionMessage(message);
        return;
      } finally {
        setDetailLoading(false);
      }
    }

    setWriteOrderId(nextItem.orderId);
    setWriteMode(mode);
    setWriteOpen(true);
  }

  function openEdit() {
    if (!selectedItem?.diaryId) return;
    void openWriteForItem(selectedItem, 'edit');
  }

  function openCreate() {
    if (!selectedItem || selectedItem.diaryId != null) return;
    void openWriteForItem(selectedItem, 'create');
  }

  function handleWriteTradeTypeChange(type: TradeType) {
    if (!writeItem || writeItem.tradeType === type) return;

    const match = items.find(
      (item) => item.tradeType === type && item.corpCode === writeItem.corpCode,
    );
    if (!match) return;

    void openWriteForItem(match, match.diaryId ? 'edit' : 'create');
  }

  async function handleAutoFill() {
    if (!writeItem) return;
    setAutoFillLoading(true);
    setWriteError(null);

    try {
      const prefillRequest = getDiaryPrefill(writeItem.orderId);
      let refreshedItem: TradeJournalItem;

      if (writeItem.diaryId != null) {
        const [prefill, detailDto] = await Promise.all([
          prefillRequest,
          getDiaryDetail(writeItem.diaryId),
        ]);
        const persistedItem = diaryDetailToJournalItem(detailDto);
        refreshedItem = diaryPrefillToJournalItem(prefill, persistedItem);
      } else {
        const prefill = await prefillRequest;
        refreshedItem = diaryPrefillToJournalItem(prefill, writeItem);
      }

      replaceItem(refreshedItem);
      setWriteReloadVersion((current) => current + 1);
      setActionMessage('서버에 저장된 정보를 다시 불러왔습니다.');
    } catch (error) {
      setWriteError(
        errorMessage(error, '기존 정보를 다시 불러오지 못했습니다.'),
      );
    } finally {
      setAutoFillLoading(false);
    }
  }

  async function handleSave(payload: JournalWritePayload) {
    setWriteSaving(true);
    setWriteError(null);

    try {
      let diaryId = payload.diaryId;
      if (diaryId != null) {
        await updateDiary(diaryId, toUpdateRequest(payload));
      } else {
        const created = await createDiary(toCreateRequest(payload));
        diaryId = created.diaryId;
      }

      let detailDto: DiaryDetailDto;
      try {
        detailDto = await getDiaryDetail(diaryId);
      } catch {
        setWriteOpen(false);
        setWriteOrderId(null);
        setActionMessage(
          '저장은 완료됐지만 상세 정보를 갱신하지 못했습니다. 목록을 다시 불러옵니다.',
        );
        await loadItems();
        return;
      }

      const savedItem = diaryDetailToJournalItem(detailDto);
      replaceItem(savedItem);
      setSelectedId(savedItem.id);
      setWriteOpen(false);
      setWriteOrderId(null);
      setActionMessage(
        payload.diaryId == null
          ? '매매일지를 저장했습니다.'
          : '매매일지를 수정했습니다.',
      );
    } catch (error) {
      setWriteError(errorMessage(error, '매매일지를 저장하지 못했습니다.'));
    } finally {
      setWriteSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedItem?.diaryId) return;
    setDeleteLoading(true);

    try {
      await deleteDiary(selectedItem.diaryId);
      const pending = deletedDiaryToPending(selectedItem);

      try {
        const prefill = await getDiaryPrefill(selectedItem.orderId);
        replaceItem(diaryPrefillToJournalItem(prefill, pending));
      } catch {
        replaceItem(pending);
      }

      setDeleteOpen(false);
      setActionMessage('매매일지를 삭제했습니다.');
    } catch (error) {
      setActionMessage(errorMessage(error, '매매일지를 삭제하지 못했습니다.'));
    } finally {
      setDeleteLoading(false);
    }
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
            onSelect={(id) => void handleSelect(id)}
            listTitle={listTitle}
            loading={listLoading}
            error={listError}
            onRetry={() => void loadItems()}
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
            onCreate={openCreate}
            loading={detailLoading}
            error={detailError}
            onRetry={
              selectedId == null
                ? undefined
                : () => void handleSelect(selectedId)
            }
          />
        </Box>
      </AppShell>

      <JournalWriteDialog
        open={writeOpen}
        item={writeItem}
        mode={writeMode}
        onClose={() => {
          if (!writeSaving) setWriteOpen(false);
        }}
        onSave={(payload) => void handleSave(payload)}
        saving={writeSaving}
        error={writeError}
        onAutoFill={() => void handleAutoFill()}
        autoFillLoading={autoFillLoading}
        reloadVersion={writeReloadVersion}
        onTradeTypeChange={handleWriteTradeTypeChange}
      />

      <JournalDeleteDialog
        open={deleteOpen}
        onConfirm={() => void handleDelete()}
        onCancel={() => {
          if (!deleteLoading) setDeleteOpen(false);
        }}
        loading={deleteLoading}
      />

      <Snackbar
        open={actionMessage != null}
        autoHideDuration={3500}
        onClose={() => setActionMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={() => setActionMessage(null)}>
          {actionMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

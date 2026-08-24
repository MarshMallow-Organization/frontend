import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { format } from 'date-fns';
import { AppShell } from '../../components/AppShell';
import { AccountSidebar } from '../../components/AccountSidebar';
import { FolderModal } from '../../components/FolderModal';
import { useScreenTransition } from '../../hooks/useScreenTransition';
import type {
  AccountSubTab,
  HiddenStock,
  HoldingStock,
  InvestmentFolder,
} from '../../types/account';
import {
  createVirtualAccount,
  getVirtualAccountDetail,
  getVirtualAccounts,
} from '../../features/assets/assetsApi';
import { ApiError } from '../../lib/api';
import { AssetStatusScreen } from './AssetStatusScreen';
import { VirtualAccountScreen } from './VirtualAccountScreen';
import { HideListScreen } from './HideListScreen';
import { HideConfirmScreen } from './HideConfirmScreen';
import {
  DEFAULT_HIDE_DURATION_DAYS,
  HOLDING_STOCKS,
  INITIAL_HIDDEN_STOCKS,
} from './mock-data';

const HIDE_GUIDE_PHRASE = '이 종목을 숨김 처리합니다';

/**
 * "내 계좌" 화면 — 좌측 서브 내비게이션 + 자산 현황/가상 계좌/숨기기 화면 조합.
 * my-react-ts 프로토타입(Dashboard.tsx)의 상태/핸들러 구조를 그대로 이식하고,
 * UI는 기존 디자인 시스템 컴포넌트(BaseCard/ListRow/Chip 등)로 재조립했다.
 */
export default function AccountPage() {
  const subTabTransition = useScreenTransition<AccountSubTab>('자산 현황');
  const [hideFlow, setHideFlow] = useState<'list' | 'confirm'>('list');
  const [pendingHideTarget, setPendingHideTarget] = useState<string | null>(
    null,
  );
  const [hideConfirmText, setHideConfirmText] = useState('');
  const [hiddenStocks, setHiddenStocks] = useState<HiddenStock[]>(
    INITIAL_HIDDEN_STOCKS,
  );

  const [folders, setFolders] = useState<InvestmentFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [holdingsLoadedFolderId, setHoldingsLoadedFolderId] = useState<
    string | null
  >(null);
  const [folderMaxCount, setFolderMaxCount] = useState<number | null>(null);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [folderModalError, setFolderModalError] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    void getVirtualAccounts()
      .then(({ portfolios, maxCount }) => {
        const mapped = portfolios.map((account): InvestmentFolder => ({
          id: String(account.id),
          label: account.name,
          holdings: [],
        }));
        setFolders(mapped);
        setSelectedFolderId(mapped[0]?.id ?? '');
        setFolderMaxCount(maxCount);
      })
      .catch(() => setFolders([]))
      .finally(() => setIsLoadingFolders(false));
  }, []);

  useEffect(() => {
    const portfolioId = Number(selectedFolderId);
    if (!selectedFolderId || !Number.isFinite(portfolioId)) return;

    let cancelled = false;
    void getVirtualAccountDetail(portfolioId)
      .then((detail) => {
        if (cancelled) return;
        const holdings = detail.holdings.map((h): HoldingStock => ({
          id: h.stockCode,
          name: h.stockName,
          amount: h.evaluationAmount,
          changePct: h.returnRate,
        }));
        setFolders((prev) =>
          prev.map((f) => (f.id === selectedFolderId ? { ...f, holdings } : f)),
        );
      })
      .catch(() => {
        /** 보유 종목을 못 불러와도 계좌 자체는 그대로 유지한다. */
      })
      .finally(() => {
        if (!cancelled) setHoldingsLoadedFolderId(selectedFolderId);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedFolderId]);

  const isLoadingHoldings =
    selectedFolderId !== '' && holdingsLoadedFolderId !== selectedFolderId;

  function handleSelectSubTab(tab: AccountSubTab) {
    subTabTransition.navigate(tab);
    if (tab === '숨기기') setHideFlow('list');
  }

  function handleStartHide(stockName: string) {
    setPendingHideTarget(stockName);
    setHideConfirmText('');
    subTabTransition.navigate('숨기기');
    setHideFlow('confirm');
  }

  function handleConfirmHide() {
    if (hideConfirmText.trim() !== HIDE_GUIDE_PHRASE) return;
    if (pendingHideTarget) {
      setHiddenStocks((prev) => [
        ...prev,
        {
          id: `hs-${Date.now()}`,
          name: pendingHideTarget,
          hiddenDate: format(new Date(), 'yyyy-MM-dd'),
          remainingDays: DEFAULT_HIDE_DURATION_DAYS,
        },
      ]);
    }
    setPendingHideTarget(null);
    setHideFlow('list');
  }

  function handleCancelHide() {
    setPendingHideTarget(null);
    setHideFlow('list');
  }

  function handleCloseFolderModal() {
    setShowFolderModal(false);
    setFolderModalError(null);
  }

  async function handleAddFolder() {
    const name = newFolderName.trim();
    if (!name) return;

    setIsCreatingFolder(true);
    setFolderModalError(null);
    try {
      const account = await createVirtualAccount(name);
      const folder: InvestmentFolder = {
        id: String(account.id),
        label: account.name,
        holdings: [],
      };
      setFolders((prev) => [...prev, folder]);
      setSelectedFolderId(folder.id);
      setNewFolderName('');
      setShowFolderModal(false);
    } catch (error) {
      setFolderModalError(
        error instanceof ApiError
          ? error.message
          : '가상계좌 생성에 실패했어요. 다시 시도해 주세요.',
      );
    } finally {
      setIsCreatingFolder(false);
    }
  }

  const subTab = subTabTransition.displayed;
  const hiddenNames = new Set(hiddenStocks.map((s) => s.name));
  const visibleHoldings = HOLDING_STOCKS.filter(
    (h) => !hiddenNames.has(h.name),
  );
  const visibleFolders = folders.map((f) => ({
    ...f,
    holdings: f.holdings.filter((h) => !hiddenNames.has(h.name)),
  }));

  return (
    <AppShell activeNav="account">
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          width: '100%',
          minHeight: 0,
        }}
      >
        <AccountSidebar active={subTab} onSelect={handleSelectSubTab} />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflowY: 'auto',
            transition: 'opacity 0.15s',
            opacity: subTabTransition.visible ? 1 : 0,
          }}
        >
          {subTab === '자산 현황' && (
            <AssetStatusScreen
              holdings={visibleHoldings}
              onHide={handleStartHide}
            />
          )}
          {subTab === '가상 계좌' && (
            <VirtualAccountScreen
              folders={visibleFolders}
              selectedFolderId={selectedFolderId}
              onSelectFolder={setSelectedFolderId}
              onOpenFolderModal={() => setShowFolderModal(true)}
              onHide={handleStartHide}
              isLoadingFolders={isLoadingFolders}
              isLoadingHoldings={isLoadingHoldings}
              disableAddFolder={
                folderMaxCount !== null && folders.length >= folderMaxCount
              }
            />
          )}
          {subTab === '숨기기' && hideFlow === 'list' && (
            <HideListScreen
              hiddenStocks={hiddenStocks}
              onStartHide={() => handleStartHide('새 숨김 대상 종목')}
            />
          )}
          {subTab === '숨기기' && hideFlow === 'confirm' && (
            <HideConfirmScreen
              targetName={pendingHideTarget}
              guidePhrase={HIDE_GUIDE_PHRASE}
              value={hideConfirmText}
              onChange={setHideConfirmText}
              onCancel={handleCancelHide}
              onConfirm={handleConfirmHide}
            />
          )}
        </Box>
      </Box>

      <FolderModal
        open={showFolderModal}
        value={newFolderName}
        onChange={setNewFolderName}
        onCancel={handleCloseFolderModal}
        onConfirm={() => void handleAddFolder()}
        error={folderModalError}
        isSubmitting={isCreatingFolder}
      />
    </AppShell>
  );
}

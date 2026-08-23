import { useState } from 'react';
import Box from '@mui/material/Box';
import { AppShell } from '../../components/AppShell';
import { AccountSidebar } from '../../components/AccountSidebar';
import { FolderModal } from '../../components/FolderModal';
import { useScreenTransition } from '../../hooks/useScreenTransition';
import type {
  AccountSubTab,
  HiddenStock,
  InvestmentFolder,
} from '../../types/account';
import { AssetStatusScreen } from './AssetStatusScreen';
import { VirtualAccountScreen } from './VirtualAccountScreen';
import { HideListScreen } from './HideListScreen';
import { HideConfirmScreen } from './HideConfirmScreen';
import {
  DEFAULT_HIDE_DURATION_DAYS,
  HOLDING_STOCKS,
  INITIAL_FOLDERS,
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

  const [folders, setFolders] = useState<InvestmentFolder[]>(INITIAL_FOLDERS);
  const [selectedFolderId, setSelectedFolderId] = useState(
    INITIAL_FOLDERS[0].id,
  );
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

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
          hiddenDate: new Date().toISOString().slice(0, 10),
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

  function handleAddFolder() {
    if (!newFolderName.trim()) return;
    const folder: InvestmentFolder = {
      id: `f-${Date.now()}`,
      label: newFolderName.trim(),
      holdings: [],
    };
    setFolders((prev) => [...prev, folder]);
    setSelectedFolderId(folder.id);
    setNewFolderName('');
    setShowFolderModal(false);
  }

  const subTab = subTabTransition.displayed;

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
              holdings={HOLDING_STOCKS}
              onHide={handleStartHide}
            />
          )}
          {subTab === '가상 계좌' && (
            <VirtualAccountScreen
              folders={folders}
              selectedFolderId={selectedFolderId}
              onSelectFolder={setSelectedFolderId}
              onOpenFolderModal={() => setShowFolderModal(true)}
              onHide={handleStartHide}
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
        onCancel={() => setShowFolderModal(false)}
        onConfirm={handleAddFolder}
      />
    </AppShell>
  );
}

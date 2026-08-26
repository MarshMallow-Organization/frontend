import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { BaseCard } from '../../components/BaseCard';
import { Chip } from '../../components/Chip';
import type { HoldingStock, InvestmentFolder } from '../../types/account';
import { formatWon } from './mock-data';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export interface VirtualAccountScreenProps {
  folders: InvestmentFolder[];
  selectedFolderId: string;
  onSelectFolder: (id: string) => void;
  onOpenFolderModal: () => void;
  /** 선택된 가상계좌의 이름 변경 모달을 연다. */
  onOpenRenameModal: (folderId: string) => void;
  /** 선택된 가상계좌의 삭제 확인 모달을 연다. */
  onOpenDeleteConfirm: (folderId: string) => void;
  onHide: (stockName: string) => void;
  /** true면 가상계좌 목록(GET /assets/portfolios)을 아직 불러오는 중. */
  isLoadingFolders?: boolean;
  /** true면 선택된 계좌의 보유 종목(GET /assets/portfolios/{id})을 아직 불러오는 중. */
  isLoadingHoldings?: boolean;
  /** 가상계좌 최대 개수(maxCount)에 도달해 "폴더 추가"를 막아야 하는지. */
  disableAddFolder?: boolean;
}

const TREEMAP_PALETTE = [
  color.heatmapPink,
  color.heatmapBlue,
  color.heatmapGreen,
  color.heatmapPinkSoft,
];

// Figma 339:1043: 폴더 보유종목을 금액 비중에 따라 블록 크기를 나눈 트리맵으로 표시.
// sqrt로 스케일을 압축해 소액 종목도 최소 폭을 확보한다.
function FolderTreemap({
  holdings,
  onHide,
}: {
  holdings: HoldingStock[];
  onHide: (stockName: string) => void;
}) {
  const weights = holdings.map((h) => Math.sqrt(Math.max(h.amount, 1)));

  return (
    <Box sx={{ display: 'flex', gap: '2px', height: 320 }}>
      {holdings.map((h, i) => (
        <Box
          key={h.id}
          sx={{
            flex: weights[i],
            minWidth: 90,
            borderRadius: '20px',
            bgcolor: TREEMAP_PALETTE[i % TREEMAP_PALETTE.length],
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 2,
            transition: 'filter 0.15s',
            '&:hover': { filter: 'brightness(0.97)' },
            '&:hover .treemap-hide': { opacity: 1 },
          }}
        >
          {i === 0 && (
            <Box>
              <Typography
                sx={{
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  color: color.ink,
                }}
              >
                {h.name}
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: color.text }}>
                {formatWon(h.amount)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: h.changePct >= 0 ? color.priceUp : color.priceDown,
                }}
              >
                {h.changePct >= 0 ? '+' : ''}
                {h.changePct}%{' '}
                <Box
                  component="span"
                  sx={{ fontWeight: 400, color: color.textSecondary }}
                >
                  (내 평단 대비)
                </Box>
              </Typography>
            </Box>
          )}
          {i !== 0 && (
            <Typography
              sx={{ fontSize: '0.75rem', fontWeight: 600, color: color.ink }}
            >
              {h.name}
            </Typography>
          )}
          <Chip
            className="treemap-hide"
            appVariant="outlineGray"
            label="숨기기"
            onClick={() => onHide(h.name)}
            sx={{
              height: 26,
              fontSize: '0.6875rem',
              mt: 1,
              alignSelf: 'flex-start',
              backgroundColor: color.white,
              opacity: i === 0 ? 1 : 0,
              transition: 'opacity 0.15s',
              cursor: 'pointer',
              '&:focus-visible': { opacity: 1 },
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

// 디자이너 메모: "가상계좌 번호" → 상단에 표시 자리 마련
export function VirtualAccountScreen({
  folders,
  selectedFolderId,
  onSelectFolder,
  onOpenFolderModal,
  onOpenRenameModal,
  onOpenDeleteConfirm,
  onHide,
  isLoadingFolders = false,
  isLoadingHoldings = false,
  disableAddFolder = false,
}: VirtualAccountScreenProps) {
  const selected = folders.find((f) => f.id === selectedFolderId) ?? folders[0];
  const selectedIndex = folders.findIndex((f) => f.id === selected?.id);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <BaseCard sx={{ p: 3, flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              overflowX: 'auto',
            }}
          >
            {folders.map((f) => (
              <Chip
                key={f.id}
                shape="pill"
                appVariant={
                  selected?.id === f.id ? 'filledCyan' : 'outlineGray'
                }
                label={f.label}
                onClick={() => onSelectFolder(f.id)}
                sx={{
                  height: 36,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              />
            ))}
          </Box>
          <Chip
            appVariant="outlineGray"
            label="폴더 추가"
            icon={<AddIcon sx={{ fontSize: 14 }} />}
            onClick={onOpenFolderModal}
            disabled={disableAddFolder}
            sx={{
              height: 34,
              fontSize: '0.75rem',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          />
        </Box>

        {selected && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '1rem',
                fontWeight: 700,
                color: color.ink,
              }}
            >
              {selected.label}
            </Typography>
            <IconButton
              aria-label="가상계좌 이름 변경"
              size="small"
              onClick={() => onOpenRenameModal(selected.id)}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              aria-label="가상계좌 삭제"
              size="small"
              onClick={() => onOpenDeleteConfirm(selected.id)}
            >
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}

        {!selected || selected.holdings.length === 0 ? (
          <Box
            sx={{
              height: 160,
              display: 'grid',
              placeItems: 'center',
              color: color.mutedGray,
              fontSize: '0.875rem',
            }}
          >
            {isLoadingFolders
              ? '가상계좌 목록을 불러오는 중이에요.'
              : isLoadingHoldings
                ? '보유 종목을 불러오는 중이에요.'
                : '아직 이 폴더에 담긴 종목이 없어요.'}
          </Box>
        ) : (
          <FolderTreemap holdings={selected.holdings} onHide={onHide} />
        )}

        <Typography
          sx={{ fontSize: '0.6875rem', color: color.textSecondary, mt: 1.5 }}
        >
          맵의 크기는 금액이 아닌 보유 비중만을 나타내요.
        </Typography>
      </BaseCard>

      <BaseCard sx={{ p: 2.5, width: 200, flexShrink: 0 }}>
        <Typography sx={{ fontSize: '0.8125rem', color: color.textSecondary }}>
          가상 계좌
        </Typography>
        <Typography
          sx={{ fontSize: '0.8125rem', color: color.textSecondary, mb: 2 }}
        >
          {selectedIndex >= 0 ? selectedIndex + 1 : 1}/{folders.length}
        </Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: color.textSecondary }}>
          보유 종목
        </Typography>
        <Typography
          sx={{ fontSize: '0.8125rem', color: color.textSecondary, mb: 2 }}
        >
          {selected?.holdings.length ?? 0}
        </Typography>
        <Chip
          appVariant="outlineGray"
          label="계좌 추가하기"
          disabled
          sx={{ width: '100%', fontSize: '0.75rem' }}
        />
      </BaseCard>
    </Box>
  );
}

export default VirtualAccountScreen;

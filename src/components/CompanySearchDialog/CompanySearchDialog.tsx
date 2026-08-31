import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Chip } from '../Chip';
import { SearchField } from '../SearchField';
import { navigate } from '../../lib/navigation';
import { tokens } from '../../theme/tokens';

interface MockStock {
  stockCode: string;
  name: string;
  market: string;
}

const MOCK_MY_STOCKS: MockStock[] = [
  { stockCode: '005930', name: '삼성전자', market: 'KOSPI' },
  { stockCode: '000660', name: 'SK하이닉스', market: 'KOSPI' },
];

const MOCK_SEARCHABLE_STOCKS: MockStock[] = [
  ...MOCK_MY_STOCKS,
  { stockCode: '035420', name: 'NAVER', market: 'KOSPI' },
  { stockCode: 'AAPL', name: 'Apple', market: 'NASDAQ' },
  { stockCode: 'TSLA', name: 'Tesla', market: 'NASDAQ' },
];

const sectionTitleSx = {
  color: '#565656',
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: '-0.28px',
  lineHeight: 1.15,
};

function StockResultRow({
  stock,
  onSelect,
}: {
  stock: MockStock;
  onSelect: () => void;
}) {
  return (
    <ButtonBase
      onClick={() => {
        onSelect();
        navigate(`/stock?stockCode=${encodeURIComponent(stock.stockCode)}`);
      }}
      sx={{
        width: '100%',
        minHeight: 33,
        justifyContent: 'space-between',
        border: '0.5px solid #d0d0d0',
        borderRadius: '5px',
        backgroundColor: '#eef1f4',
        px: 1.5,
        py: 0.5,
        fontFamily: tokens.fontFamily,
        '&:hover': { backgroundColor: '#e5eaee' },
      }}
    >
      <Typography sx={{ color: '#565656', fontSize: 13, fontWeight: 500 }}>
        {stock.name}
      </Typography>
      <Typography sx={{ color: '#868686', fontSize: 11 }}>
        {stock.stockCode} · {stock.market}
      </Typography>
    </ButtonBase>
  );
}

export interface CompanySearchDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Figma 385:2398 기업 검색 팝업.
 * 종목 목록 API가 dev에 머지되기 전까지 로컬 mock을 검색한다.
 */
export default function CompanySearchDialog({
  open,
  onClose,
}: CompanySearchDialogProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    '삼성전자',
    'Tesla',
    'NAVER',
  ]);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];

    return MOCK_SEARCHABLE_STOCKS.filter((stock) =>
      `${stock.name} ${stock.stockCode} ${stock.market}`
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  function close() {
    setQuery('');
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="company-search-title"
      slotProps={{
        backdrop: { sx: { backgroundColor: 'rgba(0, 0, 0, 0.24)' } },
        paper: {
          sx: {
            width: 'min(482px, calc(100% - 32px))',
            maxWidth: 'none',
            minHeight: 480,
            m: 2,
            overflow: 'visible',
            border: '1px solid #d9d9d9',
            borderRadius: '20px',
            backgroundColor: tokens.color.white,
            boxShadow: '0 0 1.5px rgba(0, 0, 0, 0.2)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: 480,
          boxSizing: 'border-box',
          px: { xs: 2.5, sm: '37px' },
          pt: '49px',
          pb: 4,
        }}
      >
        <Typography
          id="company-search-title"
          sx={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
          }}
        >
          기업 검색
        </Typography>

        <IconButton
          aria-label="기업 검색 닫기"
          onClick={close}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 40,
            height: 40,
            color: '#868686',
          }}
        >
          <CancelOutlinedIcon sx={{ width: 26, height: 26 }} />
        </IconButton>

        <Box
          component="label"
          htmlFor="company-search-input"
          sx={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
          }}
        >
          기업 검색어
        </Box>

        <SearchField
          id="company-search-input"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="관심있는 종목을 검색하세요."
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 48,
              backgroundColor: '#eef1f4',
              '& fieldset': {
                borderWidth: '0.8px',
                borderColor: '#dadada',
              },
            },
            '& .MuiOutlinedInput-input': {
              py: 0,
              fontSize: 15,
              letterSpacing: '-0.3px',
              '&::placeholder': { color: '#b8b8b8', opacity: 1 },
            },
          }}
        />

        {normalizedQuery ? (
          <Stack sx={{ mt: 2.25, gap: 1 }}>
            <Typography sx={sectionTitleSx}>검색 결과</Typography>
            {searchResults.length > 0 ? (
              searchResults.map((stock) => (
                <StockResultRow
                  key={stock.stockCode}
                  stock={stock}
                  onSelect={close}
                />
              ))
            ) : (
              <Box
                sx={{
                  minHeight: 80,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#868686',
                  fontSize: 13,
                }}
              >
                검색 결과가 없습니다.
              </Box>
            )}
          </Stack>
        ) : (
          <>
            <Box sx={{ mt: '19px' }}>
              <Typography sx={sectionTitleSx}>최근 검색</Typography>
              <Stack
                direction="row"
                sx={{ mt: '8px', gap: '7px', flexWrap: 'wrap' }}
              >
                {recentSearches.map((keyword) => (
                  <Chip
                    key={keyword}
                    label={keyword}
                    shape="pill"
                    onClick={() => setQuery(keyword)}
                    onDelete={() =>
                      setRecentSearches((current) =>
                        current.filter((item) => item !== keyword),
                      )
                    }
                    sx={{
                      height: 35,
                      minWidth: 77,
                      border: '0.5px solid #d0d0d0',
                      backgroundColor: '#eef1f4',
                      color: '#565656',
                      fontSize: 12,
                      fontWeight: 400,
                      '& .MuiChip-label': { px: 1.25 },
                      '& .MuiChip-deleteIcon': {
                        width: 14,
                        height: 14,
                        color: '#686868',
                        mr: 0.75,
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{ mt: '34px' }}>
              <Typography sx={sectionTitleSx}>내 종목</Typography>
              <Stack sx={{ mt: '8px', gap: '8px' }}>
                {MOCK_MY_STOCKS.map((stock) => (
                  <StockResultRow
                    key={stock.stockCode}
                    stock={stock}
                    onSelect={close}
                  />
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Dialog>
  );
}

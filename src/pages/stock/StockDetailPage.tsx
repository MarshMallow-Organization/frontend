import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AppShell, type AppShellNav } from '../../components/AppShell';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

// 종목 상세가 관심종목/인기종목 중 어디서 진입할지 기획 미확정 → 임의로 탭을 켜는 대신
// 어느 탭과도 겹치지 않는 값을 넘겨 4개 탭 모두 비활성 상태로 둔다(AppShell 파일은 수정하지 않음).
const STOCK_NAV = 'stock' as unknown as AppShellNav;

/**
 * 종목 화면 — 상세 디자인이 아직 나오지 않아 my-react-ts 프로토타입과 동일하게
 * 플레이스홀더로 유지. 상세 디자인이 나오면 이 컴포넌트 내부만 교체하면 된다.
 */
export default function StockDetailPage() {
  return (
    <AppShell activeNav={STOCK_NAV}>
      <Box
        sx={{
          flex: 1,
          borderRadius: '24px',
          background:
            'linear-gradient(135deg, #eef6ff 0%, #f7f2ff 50%, #eafcff 100%)',
          display: 'grid',
          placeItems: 'center',
          minHeight: 400,
        }}
      >
        <Typography
          sx={{ fontSize: '2.5rem', fontWeight: 500, color: color.text }}
        >
          종목 화면
        </Typography>
      </Box>
    </AppShell>
  );
}

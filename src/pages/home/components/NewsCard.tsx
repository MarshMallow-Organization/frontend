import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BaseCard } from '../../../components/BaseCard';
import { ListRow } from '../../../components/ListRow';
import { Chip } from '../../../components/Chip';
import type { NewsItem } from '../../../types/account';
import { tokens } from '../../../theme/tokens';

const { color } = tokens;

export interface NewsCardProps {
  items: NewsItem[];
  onOpenArticle: (url: string) => void;
  onRefreshTrending: () => void;
}

// 디자이너 메모: "실제 기사 창을 새로 띄워짐 (이동 아님)" → 클릭 시 새 탭으로 오픈
// 디자이너 메모: "토스 API 명세서의 인기 주식 서비스" → onRefreshTrending 자리에 연동 예정
export function NewsCard({
  items,
  onOpenArticle,
  onRefreshTrending,
}: NewsCardProps) {
  return (
    <BaseCard
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        maxHeight: 760,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          sx={{ fontSize: '1rem', fontWeight: 700, color: color.ink }}
        >
          인기 뉴스
        </Typography>
        <Chip
          appVariant="outlineGray"
          label="새로고침"
          onClick={onRefreshTrending}
          sx={{ height: 28, fontSize: '0.6875rem', cursor: 'pointer' }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {items.map((news, i) => (
          <Box
            key={news.id}
            component="button"
            type="button"
            onClick={() => onOpenArticle(news.articleUrl)}
            sx={{
              textAlign: 'left',
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
              p: 1.5,
              borderTop: i === 0 ? 'none' : `1px solid ${color.border}`,
              borderRadius: '12px',
              '&:hover': { backgroundColor: color.bg },
            }}
          >
            <ListRow
              title={news.title}
              titleSx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: color.newsTitle,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              subtitle={`${news.source} · ${news.publishedAt}`}
              subtitleSx={{ fontSize: '0.75rem', mt: 0.5 }}
            />
          </Box>
        ))}
      </Box>
    </BaseCard>
  );
}

export default NewsCard;

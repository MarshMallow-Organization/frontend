import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { BaseCard } from '../../../components/BaseCard';
import { Chip } from '../../../components/Chip';
import { SearchField } from '../../../components/SearchField';
import { CtaButton } from '../../../components/CtaButton';
import type { FavoriteCompany } from '../../../types/account';
import { tokens } from '../../../theme/tokens';

const { color } = tokens;

export interface AiInterpretationCardProps {
  companies: FavoriteCompany[];
  selectedCompanyId: string;
  onSelectCompany: (id: string) => void;
  companySearch: string;
  onCompanySearchChange: (v: string) => void;
  onInterpret: () => void;
  isSummarizing: boolean;
  summary: string | null;
}

// 디자이너 메모: "기업의 철학은 AI 프롬프팅으로 구현할 것이고, 텍스트로 아래 보여질 것이다.
// (가독성 매우 신경 쓸 것)" → 해석 결과 텍스트에 넉넉한 줄간격을 적용.
export function AiInterpretationCard({
  companies,
  selectedCompanyId,
  onSelectCompany,
  companySearch,
  onCompanySearchChange,
  onInterpret,
  isSummarizing,
  summary,
}: AiInterpretationCardProps) {
  return (
    <BaseCard sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography
          sx={{ fontSize: '0.9375rem', fontWeight: 700, color: color.ink }}
        >
          AI 해석
        </Typography>
        <Typography
          sx={{ fontSize: '0.75rem', color: color.textSecondary, mt: 0.5 }}
        >
          숫자를 사람이 읽는 문장으로 풀어드려요.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {companies.map((c) => (
          <Chip
            key={c.id}
            shape="pill"
            appVariant={
              selectedCompanyId === c.id ? 'filledCyan' : 'outlineGray'
            }
            label={c.name}
            onClick={() => onSelectCompany(c.id)}
            sx={{ height: 32, fontSize: '0.75rem', cursor: 'pointer' }}
          />
        ))}
      </Box>

      <SearchField
        appVariant="filled"
        value={companySearch}
        onChange={(e) => onCompanySearchChange(e.target.value)}
        mic
        sx={{
          '& .MuiOutlinedInput-input': {
            fontSize: '0.875rem',
            paddingTop: '10px',
            paddingBottom: '10px',
          },
        }}
      />

      <Typography
        sx={{ fontSize: '0.8125rem', color: color.text, lineHeight: 1.6 }}
      >
        재무 지표만으로는 감이 잘 안 잡히죠.
        <br />
        버튼을 누르면 지금 이 회사의 재무 상태를 해석해 드릴게요.
      </Typography>

      <Box>
        <CtaButton
          icon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
          onClick={onInterpret}
          disabled={isSummarizing}
        >
          {isSummarizing ? '해석 중...' : 'AI 재무 상태 체크'}
        </CtaButton>
      </Box>

      {summary && (
        <Box
          sx={{
            borderRadius: '16px',
            backgroundColor: color.cardTinted,
            border: `1px solid ${color.accentBlue}33`,
            p: 2.5,
            fontSize: '0.9375rem',
            lineHeight: 1.9,
            color: color.text,
          }}
        >
          {summary}
        </Box>
      )}
    </BaseCard>
  );
}

export default AiInterpretationCard;

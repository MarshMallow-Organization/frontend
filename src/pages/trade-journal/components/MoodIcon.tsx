import Box from '@mui/material/Box';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import type { SvgIconComponent } from '@mui/icons-material';

/**
 * Figma `360:1945` 기분 아이콘 컴포넌트.
 * 속성: O(선택) / X(비선택) × 완전 좋음~최악
 * Material `sentiment_*` 아이콘 + 원형 배경 (36×36).
 */
export type MoodValue = 1 | 2 | 3 | 4 | 5;

const ICONS: Record<MoodValue, SvgIconComponent> = {
  5: SentimentVerySatisfiedIcon, // sentiment_excited
  4: SentimentSatisfiedAltIcon, // sentiment_satisfied
  3: SentimentNeutralIcon, // sentiment_neutral
  2: SentimentDissatisfiedIcon, // sentiment_dissatisfied
  1: SentimentVeryDissatisfiedIcon, // sentiment_very_dissatisfied
};

const LABELS: Record<MoodValue, string> = {
  5: '완전 좋음',
  4: '좋음',
  3: '그냥',
  2: '안좋음',
  1: '최악',
};

export interface MoodIconProps {
  value: MoodValue;
  selected?: boolean;
  size?: number;
}

export function MoodIcon({ value, selected = true, size = 36 }: MoodIconProps) {
  const Icon = ICONS[value];
  const iconSize = Math.round(size * (2 / 3)); // Figma inset 16.67% → ~24@36

  return (
    <Box
      aria-label={LABELS[value]}
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: selected ? '#b7f0c5' : '#f0f0f0',
        border: selected ? '1px solid #6bdd87' : '1px solid #e0e0e0',
        display: 'grid',
        placeItems: 'center',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      <Icon
        sx={{
          fontSize: iconSize,
          color: selected ? '#1a7a3a' : '#9a9a9a',
        }}
      />
    </Box>
  );
}

export default MoodIcon;

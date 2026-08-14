import Box from '@mui/material/Box';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import type { SvgIconComponent } from '@mui/icons-material';
import { tokens } from '../../../theme/tokens';
import type { MoodValue } from './MoodIcon';

const { fontFamily } = tokens;

/**
 * Figma `464:2317` Component 32 / `464:2345` 기분 상태 표.
 * 카드 215×68, gap 19, 선택=#b7f0c5+#6bdd87 / 비선택=#f7f7fa+#d9d8d8.
 * 아이콘만 (라벨은 aria / title).
 **/
const OPTIONS: {
  value: MoodValue;
  label: string;
  Icon: SvgIconComponent;
}[] = [
  { value: 5, label: '완전 좋음', Icon: SentimentVerySatisfiedIcon },
  { value: 4, label: '좋음', Icon: SentimentSatisfiedAltIcon },
  { value: 3, label: '그냥', Icon: SentimentNeutralIcon },
  { value: 2, label: '안좋음', Icon: SentimentDissatisfiedIcon },
  { value: 1, label: '최악', Icon: SentimentVeryDissatisfiedIcon },
];

export interface EmotionPickerProps {
  value?: number;
  onChange: (v: MoodValue) => void;
}

export function EmotionPicker({ value, onChange }: EmotionPickerProps) {
  return (
    <Box
      role="radiogroup"
      aria-label="지금 감정"
      sx={{
        display: 'flex',
        gap: '16px', // Figma 19 → ~0.85
        width: '100%',
        fontFamily,
      }}
    >
      {OPTIONS.map(({ value: v, label, Icon }) => {
        const selected = value === v;
        return (
          <Box
            key={v}
            component="button"
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label}
            title={label}
            onClick={() => onChange(v)}
            sx={{
              flex: 1,
              minWidth: 0,
              height: 58, // Figma 68 * 0.85
              borderRadius: '7px',
              border: selected ? '1px solid #6bdd87' : '1px solid #d9d8d8',
              backgroundColor: selected ? '#b7f0c5' : '#f7f7fa',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              p: 0,
              fontFamily: 'inherit',
              transition: 'background-color 0.15s, border-color 0.15s',
              '&:hover': {
                backgroundColor: selected ? '#b7f0c5' : '#efeff2',
              },
            }}
          >
            <Icon
              sx={{
                // Figma: selected ~37px, unselected ~28px
                fontSize: selected ? 32 : 24,
                color: selected ? '#1a7a3a' : '#8a8a8a',
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}

export default EmotionPicker;

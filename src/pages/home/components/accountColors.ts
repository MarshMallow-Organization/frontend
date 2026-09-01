import { tokens } from '../../../theme/tokens';

const { color } = tokens;

// 가상계좌 폴더 트리맵 팔레트(Figma 339:1043)를 범례 색상으로 재사용해 계좌별
// 범례 색과 StockTreemap의 종목 블록 색이 항상 일치하게 한다.
export const ACCOUNT_LEGEND_COLORS = [
  color.heatmapBlue,
  color.accentBlue,
  color.heatmapGreen,
  color.heatmapPink,
];

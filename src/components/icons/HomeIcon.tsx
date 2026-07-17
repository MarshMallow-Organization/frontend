import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

/**
 * 홈 페이지 아이콘 — Figma `90:881` "홈 페이지 아이콘" (74×74).
 * 원형 배지(연블루) + 집 글리프(시안)의 다색 배지라 `currentColor` 미사용;
 * 색은 토큰으로 고정(배지 #D6EAF7/#ABCCE5 = selectedBg/selectedBorder, 글리프 #11ACD0 = selected).
 */
export function HomeIcon(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 74 74" {...props}>
      <rect
        x="0.5"
        y="0.5"
        width="73"
        height="73"
        rx="36.5"
        fill={color.selectedBg}
        stroke={color.selectedBorder}
      />
      <path
        d="M32.1952 52.2238V40.9737H41.1952V52.2238C41.1952 53.4613 42.2077 54.4738 43.4452 54.4738H50.1952C51.4327 54.4738 52.4452 53.4613 52.4452 52.2238V36.4737H56.2702C57.3052 36.4737 57.8002 35.1912 57.0127 34.5163L38.2027 17.5738C37.3477 16.8087 36.0427 16.8087 35.1877 17.5738L16.3777 34.5163C15.6127 35.1912 16.0852 36.4737 17.1202 36.4737H20.9452V52.2238C20.9452 53.4613 21.9577 54.4738 23.1952 54.4738H29.9452C31.1827 54.4738 32.1952 53.4613 32.1952 52.2238Z"
        fill={color.selected}
      />
    </SvgIcon>
  );
}

export default HomeIcon;

import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import { tokens } from '../../theme/tokens';

/**
 * 마이크 아이콘 — Figma `16:400` "mic icon" (24×24).
 * 단색이라 `currentColor`로 그려 recolor 가능.
 * 기본색은 Figma 실사용값 #11ACD0 (token `selected`, 시안).
 */
export function MicIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      viewBox="0 0 24 24"
      sx={{ color: tokens.color.selected }}
      {...props}
    >
      <path
        d="M12 17C14.2133 17 16 15.2133 16 13V5C16 2.78667 14.2133 1 12 1C9.78667 1 8 2.78667 8 5V13C8 15.2133 9.78667 17 12 17Z"
        fill="currentColor"
      />
      <path
        d="M18.4286 12C18.4286 15.312 15.5486 18 12 18C8.45143 18 5.57143 15.312 5.57143 12H3C3 16.236 6.35571 19.716 10.7143 20.304V24H13.2857V20.304C17.6443 19.716 21 16.236 21 12H18.4286Z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}

export default MicIcon;

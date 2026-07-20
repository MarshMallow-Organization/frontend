import MuiSwitch, { type SwitchProps } from '@mui/material/Switch';
import { tokens } from '../../theme/tokens';

const { color } = tokens;

export type AppSwitchProps = SwitchProps;

/**
 * Toggle switch (17:447 off / 17:448 on). Figma is a chunky ~1.7:1 pill with a
 * large flat thumb (no shadow). On = cyan track, off = light gray-blue track.
 */
export function Switch(props: AppSwitchProps) {
  return (
    <MuiSwitch
      disableRipple
      sx={{
        // Exact from SVG asset (17:447/448): track 63×37 rx18.5, thumb r15.5(=31),
        // on track #11acd0, off track #e2eaf0, white thumb, no shadow.
        width: 63,
        height: 37,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          // Exact from SVG (17:447): thumb left-edge inset 4px, vertical 3px;
          // checked thumb center 19.5→44.5 → travel 25px.
          padding: 0,
          margin: '3px 4px',
          '&.Mui-checked': {
            transform: 'translateX(25px)',
            color: color.white,
            '& + .MuiSwitch-track': {
              backgroundColor: color.selected,
              opacity: 1,
            },
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 31,
          height: 31,
          // 17:447/448 thumb drop shadow (feOffset dy1, blur2, erode2 → -2px spread).
          boxShadow: '0 1px 4px -2px rgba(0,0,0,0.25)',
          color: color.white,
        },
        '& .MuiSwitch-track': {
          borderRadius: 18.5,
          backgroundColor: color.border,
          opacity: 1,
          // inner shadow on the rail (filter0_i: #8596a3 @41%, ~1px blur)
          boxShadow: 'inset 0 0 1px rgba(133,150,163,0.41)',
        },
      }}
      {...props}
    />
  );
}

export default Switch;

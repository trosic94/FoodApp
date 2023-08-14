import {Tooltip} from '@mui/material';

const PatchTooltip = ({children, ...props}) =>
  <Tooltip {...props}>
    <span>{children}</span>
  </Tooltip>

export default PatchTooltip;
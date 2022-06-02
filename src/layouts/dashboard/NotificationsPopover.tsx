import MenuDesktop from 'layouts/main/MenuDesktop';
import navConfig from 'layouts/main/MenuConfig';
import { Button } from '@material-ui/core';
// components
import { MHidden } from '../../components/@material-extend';
// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  return (
    <>
      <MHidden width="mdDown">
        <MenuDesktop isOffset={true} isHome={true} navConfig={navConfig} />
        <Button
          variant="contained"
          target="_blank"
          href="https://material-ui.com/store/items/minimal-dashboard/"
        >
          Purchase Now
        </Button>
      </MHidden>
    </>
  );
}

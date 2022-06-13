import MenuDesktop from 'layouts/main/MenuDesktop';
import navConfig from 'layouts/main/MenuConfig';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { Button } from '@material-ui/core';
// components
import { MHidden } from '../../components/@material-extend';
import { PATH_DASHBOARD, PATH_AUTH } from '../../routes/paths';
// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  return (
    <>
      {/* <MenuDesktop isOffset={true} isHome={true} navConfig={navConfig} /> */}
      <Button component={RouterLink} to={PATH_DASHBOARD.eCommerce.order}>
        History Order
      </Button>
    </>
  );
}

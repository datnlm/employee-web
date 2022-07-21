import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import useLocales from 'hooks/useLocales';
import { Button } from '@material-ui/core';
// components
import { MHidden } from '../../components/@material-extend';
import { PATH_DASHBOARD } from '../../routes/paths';
// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const { translate } = useLocales();
  return (
    <>
      {/* <MenuDesktop isOffset={true} isHome={true} navConfig={navConfig} /> */}
      <Button component={RouterLink} to={PATH_DASHBOARD.eCommerce.order}>
        {translate('label.history')}
      </Button>
    </>
  );
}

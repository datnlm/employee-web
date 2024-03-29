import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import { Link as RouterLink, Outlet } from 'react-router-dom';
// material
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@material-ui/core';
// components
import Logo from '../../components/Logo';
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
//
import { MHidden } from '../../components/@material-extend';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import AccountPopover from './AccountPopover';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 0;
// const DRAWER_WIDTH = 280;
// const COLLAPSE_WIDTH = 102;
const COLLAPSE_WIDTH = 0;

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

// ----------------------------------------------------------------------

type DashboardNavbarProps = {
  onOpenSidebar: VoidFunction;
};

export default function DashboardNavbar({ onOpenSidebar }: DashboardNavbarProps) {
  const { isCollapse } = useCollapseDrawer();

  return (
    <RootStyle
      sx={{
        ...(isCollapse && {
          width: { lg: `calc(100% - ${COLLAPSE_WIDTH}px)` }
        })
      }}
    >
      <ToolbarStyle>
        <RouterLink to="/">
          <Logo />
        </RouterLink>

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <LanguagePopover />
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}

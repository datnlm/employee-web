import { filter } from 'lodash';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import { manageShop } from '_apis_/products';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import {
  Box,
  Card,
  Table,
  Button,
  TableRow,
  Checkbox,
  TableBody,
  TableCell,
  Container,
  IconButton,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress
} from '@material-ui/core';
import useAuth from 'hooks/useAuth';
// redux
import Label from 'components/Label';
import { statusOrderOptions } from 'utils/constants';
import { getGroups } from 'redux/slices/group';
import {
  EcommerceGroupListHead,
  EcommerceGroupListToolbar,
  EcommerceGroupMoreMenu
} from 'components/_dashboard/e-commerce/group/group_list';
import { RootState, useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';

import { Group } from '../../@types/group';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

// ----------------------------------------------------------------------

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Anonymous = Record<string | number, string>;

function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array: Group[], comparator: (a: any, b: any) => number, query: string) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return filter(
      array,
      (_group) => _group.licensePlate.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function EcommerceGroupList() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { groupList, isLoading, totalCount } = useSelector((state: RootState) => state.group);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');

  useEffect(() => {
    dispatch(getGroups(user?.SiteId, page, rowsPerPage));
  }, [dispatch, page, rowsPerPage]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      // await manageGroup.deleteGroupMode(id).then((respone) => {
      //   if (respone.status == 200) {
      //     enqueueSnackbar(translate('message.delete-success'), { variant: 'success' });
      //     dispatch(getListGroupMode(page, rowsPerPage));
      //   } else {
      //     enqueueSnackbar(translate('message.delete-error'), { variant: 'error' });
      //   }
      // });
    } catch (error) {
      enqueueSnackbar(translate('message.delete-error'), { variant: 'error' });
      console.log(error);
    }
  };

  const emptyRows = !isLoading && !groupList;

  const filteredGroup = applySortFilter(groupList, getComparator(order, orderBy), filterName);

  const isGroupNotFound = filteredGroup.length === 0 && !isLoading;

  const TABLE_HEAD = [
    {
      id: 'licensePlate',
      label: translate('page.group.form.licensePlate'),
      alignRight: false
    },
    {
      id: 'startTime',
      label: translate('page.group.form.startTime'),
      alignRight: false
    },
    {
      id: 'endTime',
      label: translate('page.group.form.endTime'),
      alignRight: false
    },
    {
      id: 'note',
      label: translate('page.group.form.note'),
      alignRight: false
    },
    {
      id: 'status',
      label: translate('page.group.form.status'),
      alignRight: false
    },
    { id: '' }
  ];

  return (
    <Page title={translate('page.group.title.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('page.group.heading1.list')}
          links={[
            { name: translate('page.group.heading2'), href: PATH_DASHBOARD.eCommerce.group },
            { name: translate('page.group.heading4.list') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.eCommerce.groupNew}
              startIcon={<Icon icon={plusFill} />}
            >
              {translate('button.addNew')}
            </Button>
          }
        />

        <Card>
          <EcommerceGroupListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <EcommerceGroupListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={groupList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {isLoading ? (
                    <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                      <CircularProgress />
                    </TableCell>
                  ) : (
                    groupList.map((row, index) => {
                      const { id, startTime, endTime, licensePlate, note, status } = row;

                      const isItemSelected = selected.indexOf(id) !== -1;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox">
                          <TableCell padding="checkbox">
                            {/* <Checkbox checked={isItemSelected} /> */}
                          </TableCell>
                          <TableCell align="left">{licensePlate}</TableCell>
                          <TableCell align="left">{startTime}</TableCell>
                          <TableCell align="left">{endTime}</TableCell>
                          <TableCell align="left">{note}</TableCell>
                          <TableCell align="left">
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              color={(status == '0' && 'error') || 'success'}
                            >
                              {statusOrderOptions.find((v: any) => v.id == status)?.label}

                              {/* {translate(
                                `status.${
                                  statusOrderOptions.find((v: any) => v.id == status)?.label
                                }`
                              )} */}
                            </Label>
                          </TableCell>
                          {/* <TableCell align="left">{status}</TableCell> */}
                          <TableCell align="right">
                            <EcommerceGroupMoreMenu
                              onDelete={() => handleDeleteOrder(id.toString())}
                              id={id.toString()}
                              status={status}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}

                  {emptyRows && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Typography gutterBottom align="center" variant="subtitle1">
                          {translate('message.not-found')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                {isGroupNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        <Box sx={{ py: 3 }}>
                          <SearchNotFound searchQuery={filterName} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            component="div"
            count={25}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, value) => setPage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

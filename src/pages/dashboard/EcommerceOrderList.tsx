import { filter } from 'lodash';
import { useSnackbar } from 'notistack5';
import { paramCase } from 'change-case';
import shoppingCartFill from '@iconify/icons-eva/shopping-cart-fill';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
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
  CircularProgress,
  Stack,
  CardHeader
} from '@material-ui/core';
import useAuth from 'hooks/useAuth';
// redux
import Label from 'components/Label';
import { statusOrderOptions } from 'utils/constants';
import { getGroupById } from '_apis_/group';
import EcommerceGroupNewForm from 'components/_dashboard/e-commerce/group/EcommerceGroupNewForm';
import { getContributions, getGroupModeList } from 'redux/slices/group';
import { getEmployeePartnerList } from 'redux/slices/employee-partner';
import { RootState, useDispatch, useSelector } from '../../redux/store';
import { getOrder, resetCart } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
import {
  OrderDetail,
  ProductState,
  ProductFilter,
  ProductCoralPark,
  Product
} from '../../@types/products';
import { Group } from '../../@types/group';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  EcommerceListHead,
  EcommerceListToolbar,
  EcommerceMoreMenu
} from '../../components/_dashboard/e-commerce/e-commerce_list';

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

function applySortFilter(
  array: OrderDetail[],
  comparator: (a: any, b: any) => number,
  query: string
) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  if (query) {
    return filter(
      array,
      (_groupMode) => _groupMode.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

// ----------------------------------------------------------------------

export default function OrderList() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { user } = useAuth();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { orderDetail, sortBy, filters, isLoading, totalCount } = useSelector(
    (state: { product: ProductState }) => state.product
  );

  // const orderList = useSelector((state: ProductState) => state.orderDetail);
  // const isLoading = useSelector((state: ProductState) => state.isLoading);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('createdAt');
  const { pathname } = useLocation();
  const { name } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentGroup, setCurrentGroup] = useState<Group>();

  const fetchData = async () => {
    await getGroupById(paramCase(name)).then((response) => {
      setCurrentGroup(response.data);
    });
    dispatch(getContributions(0, -1));
    dispatch(getEmployeePartnerList(0, -1));
    dispatch(getGroupModeList(0, -1));
  };

  useEffect(() => {
    fetchData();
    dispatch(getOrder(name, user?.SiteId, page, rowsPerPage));
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

  const handleClick = () => {
    dispatch(resetCart());
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

  const emptyRows = !isLoading && !orderDetail;

  const filteredOrder = applySortFilter(orderDetail, getComparator(order, orderBy), filterName);

  const isOrderNotFound = filteredOrder.length === 0 && !isLoading;

  function convertUTCDateToLocalDate(date: any) {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  }

  const TABLE_HEAD = [
    { id: 'time', label: translate('page.order.form.create'), alignRight: false },
    {
      id: 'total',
      label: translate('page.order.form.total'),
      alignRight: false
    },
    {
      id: 'name',
      label: translate('page.order.form.name'),
      alignRight: false
    },
    {
      id: 'national',
      label: translate('page.order.form.national'),
      alignRight: false
    },
    {
      id: 'status',
      label: translate('page.order.form.status'),
      alignRight: false
    },
    { id: '' }
  ];

  return (
    <Page title={translate('page.order.title.list')}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('page.order.heading1.list')}
          links={[
            { name: translate('page.group.heading2'), href: PATH_DASHBOARD.eCommerce.group },
            { name: translate('page.order.heading3') }
          ]}
        />
        <Stack spacing={2} sx={{ pb: 3 }}>
          <EcommerceGroupNewForm isEdit={true} isView={true} currentGroup={currentGroup} />
        </Stack>

        <Card>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 3, sm: 2 }}
            justifyContent="space-between"
          >
            <EcommerceListToolbar
              numSelected={selected.length}
              filterName={filterName}
              onFilterName={handleFilterByName}
            />
            <CardHeader
              sx={{ mb: 2 }}
              action={
                <Button
                  onClick={handleClick}
                  variant="contained"
                  component={RouterLink}
                  to={`${PATH_DASHBOARD.eCommerce.root}/order/${paramCase(name)}/shop`}
                  startIcon={<Icon icon={shoppingCartFill} />}
                >
                  {translate('button.shop')}
                </Button>
              }
            />
          </Stack>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <EcommerceListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={orderDetail.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {isLoading ? (
                    <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
                      <CircularProgress />
                    </TableCell>
                  ) : (
                    orderDetail.map((row, index) => {
                      const { id, createTime, total, nationalityName, name, status } = row;

                      const isItemSelected = selected.indexOf(id) !== -1;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox">
                          <TableCell padding="checkbox">
                            {/* <Checkbox checked={isItemSelected} /> */}
                          </TableCell>
                          <TableCell align="left">
                            {new Date(createTime).toLocaleDateString()}
                          </TableCell>
                          <TableCell align="left">{total}</TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{nationalityName}</TableCell>
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
                            <EcommerceMoreMenu
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
                {isOrderNotFound && (
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
            count={totalCount}
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

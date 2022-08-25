import { sum } from 'lodash';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { paramCase, sentenceCase } from 'change-case';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import {
  Box,
  Step,
  Stepper,
  Container,
  StepLabel,
  StepConnector,
  Grid,
  Card,
  Button,
  CardHeader,
  Typography
} from '@material-ui/core';
import useLocales from 'hooks/useLocales';
// components
import Scrollbar from 'components/Scrollbar';
import {
  CheckoutBillingInfo,
  CheckoutProductList,
  CheckoutSummary
} from 'components/_dashboard/e-commerce/order';
import EmptyContent from 'components/EmptyContent';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import { useEffect, useState } from 'react';
import { manageShop } from '_apis_/products';
import { LoadingButton } from '@material-ui/lab';
import useAuth from 'hooks/useAuth';
import LoadingScreen from 'components/LoadingScreen';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
// @types
import { ProductState, OrderDetail, Customer } from '../../@types/products';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  deleteCart,
  onNextStep,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity
} from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { name } = useParams();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetail>();
  const [customer, setCustomer] = useState<Customer>();
  const { checkout } = useSelector((state: { product: ProductState }) => state.product);
  const { cart, total, discount, subtotal } = checkout;
  const isEmptyCart = cart.length === 0;

  const handleDeleteCart = (productId: string) => {
    dispatch(deleteCart(productId));
  };

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleIncreaseQuantity = (productId: string) => {
    dispatch(increaseQuantity(productId));
  };

  const handleDecreaseQuantity = (productId: string) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleApplyDiscount = (value: number) => {
    dispatch(applyDiscount(value));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { products: cart },
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const response = await manageShop.cancel(name, '');
        if (response.status == 200) {
          navigate(`${PATH_DASHBOARD.eCommerce.root}`);
          // navigate(`${PATH_DASHBOARD.eCommerce.root}/order/${paramCase(name)}/`);
          enqueueSnackbar(translate('message.cancel-success'), { variant: 'success' });
        } else {
          enqueueSnackbar(translate('message.cancel-error'), { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar(translate('message.cancel-success'), { variant: 'error' });
        console.error(error);
        setSubmitting(false);
        // setErrors(error.message);
      }
    }
  });

  const { values } = formik;
  const totalItems = sum(values.products.map((item) => item.quantity));

  const fetchData = async () => {
    setIsLoading(true);
    await manageShop.getListOrderDetail(user?.SiteId, name, 1, -1).then((response) => {
      setOrderDetail(response.data);
      console.log(response.data.orderDetails);
      setCustomer({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        nationality: response.data.nationalityName
      });
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const { isSubmitting, handleSubmit } = formik;

  return (
    <>
      {isLoading == true ? (
        <LoadingScreen />
      ) : (
        <Page title={translate('page.order.title.order-detail')}>
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading={translate('page.order.heading1.product')}
              links={[
                { name: translate('page.group.heading2'), href: PATH_DASHBOARD.eCommerce.group },
                { name: translate('page.order.heading4.order-detail') }
              ]}
            />

            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                      <CardHeader
                        title={<Typography variant="h6">{translate('form.cart')}</Typography>}
                        sx={{ mb: 3 }}
                      />

                      {orderDetail?.orderDetails ? (
                        <Scrollbar>
                          <CheckoutProductList products={orderDetail!.orderDetails} />
                        </Scrollbar>
                      ) : (
                        <EmptyContent
                          title={translate('message.cart-empty')}
                          description={translate('message.cart-empty-detail')}
                          img="/static/illustrations/illustration_empty_cart.svg"
                        />
                      )}
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <CheckoutBillingInfo customer={customer} />
                    {orderDetail && <CheckoutSummary total={orderDetail!.total} />}
                    <LoadingButton
                      loading={isSubmitting}
                      fullWidth
                      disabled={orderDetail != null ? orderDetail.status != '1' : false}
                      size="large"
                      type="submit"
                      variant="contained"
                      color="error"
                    >
                      {translate('button.cancel')}
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Form>
            </FormikProvider>
          </Container>
        </Page>
      )}
    </>
  );
}

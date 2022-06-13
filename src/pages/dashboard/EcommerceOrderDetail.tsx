import { sum } from 'lodash';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
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
// components
import Scrollbar from 'components/Scrollbar';
import {
  CheckoutBillingInfo,
  CheckoutProductList,
  CheckoutSummary
} from 'components/_dashboard/e-commerce/order';
import EmptyContent from 'components/EmptyContent';
import HeaderBreadcrumbs from 'components/HeaderBreadcrumbs';
import Page from '../../components/Page';
import useSettings from '../../hooks/useSettings';
// @types
import { ProductState } from '../../@types/products';
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
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
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
        setSubmitting(true);
        handleNextStep();
      } catch (error) {
        console.error(error);
        // setErrors(error.message);
      }
    }
  });

  const { values, handleSubmit } = formik;
  const totalItems = sum(values.products.map((item) => item.quantity));

  return (
    <Page title="Ecommerce: Order">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Order"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'E-Commerce',
              href: PATH_DASHBOARD.eCommerce.root
            },
            { name: 'Order' }
          ]}
        />

        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ mb: 3 }}>
                  <CardHeader
                    title={
                      <Typography variant="h6">
                        Card
                        <Typography component="span" sx={{ color: 'text.secondary' }}>
                          &nbsp;({totalItems} item)
                        </Typography>
                      </Typography>
                    }
                    sx={{ mb: 3 }}
                  />

                  {!isEmptyCart ? (
                    <Scrollbar>
                      <CheckoutProductList
                        products={values.products}
                        onDelete={handleDeleteCart}
                        onIncreaseQuantity={handleIncreaseQuantity}
                        onDecreaseQuantity={handleDecreaseQuantity}
                      />
                    </Scrollbar>
                  ) : (
                    <EmptyContent
                      title="Cart is empty"
                      description="Look like you have no items in your shopping cart."
                      img="/static/illustrations/illustration_empty_cart.svg"
                    />
                  )}
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <CheckoutBillingInfo />
                <CheckoutSummary
                  total={total}
                  enableDiscount
                  discount={discount}
                  subtotal={subtotal}
                  onApplyDiscount={handleApplyDiscount}
                />
                <Button fullWidth size="large" type="submit" variant="contained" color="error">
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}

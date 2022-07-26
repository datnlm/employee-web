import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import { useFormik, Form, FormikProvider } from 'formik';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { PATH_DASHBOARD } from 'routes/paths';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// material
import { Grid, Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { manageShop } from '_apis_/products';
// @types
import {
  DeliveryOption,
  PaymentOption,
  CardOption,
  ProductState
} from '../../../../@types/products';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// hook
import useLocales from '../../../../hooks/useLocales';
import {
  onGotoStep,
  onBackStep,
  onNextStep,
  applyShipping,
  resetCart
} from '../../../../redux/slices/product';
//
import CheckoutSummary from './CheckoutSummary';
import CheckoutDelivery from './CheckoutDelivery';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import useAuth from '../../../../hooks/useAuth';
// ----------------------------------------------------------------------

export default function CheckoutPayment() {
  const { translate } = useLocales();
  const { checkout } = useSelector((state: { product: ProductState }) => state.product);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { user } = useAuth();
  const { total, discount, subtotal, shipping } = checkout;

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
    console.log(checkout.billing);
  };

  const handleGotoStep = (step: number) => {
    dispatch(onGotoStep(step));
    console.log(checkout.billing);
  };

  const handleApplyShipping = (value: number) => {
    dispatch(applyShipping(value));
  };

  const PaymentSchema = Yup.object().shape({
    payment: Yup.mixed().required('Payment is required')
  });

  const formik = useFormik({
    initialValues: {
      delivery: shipping,
      payment: 'cash'
    },
    validationSchema: PaymentSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const detail: { price: number; quantity: number; productId: string }[] = [];
        checkout.cart.map((v) =>
          detail.push({
            price: v.price,
            quantity: v.quantity,
            productId: v.id
          })
        );
        const data = {
          staffId: user?.id,
          name: checkout.billing?.name,
          email: checkout.billing?.email,
          phone: checkout.billing?.phone,
          total: checkout.total,
          groupId: name,
          nationalityCode: checkout.billing?.nationality,
          orderDetails: detail
        };
        await manageShop.createOrder(data).then((response) => {
          if (response.status == 200) {
            enqueueSnackbar(translate('message.order-success'), {
              variant: 'success'
            });
            dispatch(resetCart());
            navigate(PATH_DASHBOARD.eCommerce.shop);
          } else {
            enqueueSnackbar(translate('message.order-error'), {
              variant: 'error'
            });
          }
        });
      } catch (error) {
        enqueueSnackbar(translate('message.order-error'), {
          variant: 'error'
        });
        console.error(error);
        setSubmitting(false);
        // setErrors(error.message);
      }
    }
  });
  const PAYMENT_OPTIONS: PaymentOption[] = [
    {
      value: 'momo',
      title: 'MoMo',
      description: translate('message.momo'),
      icons: ['/static/icons/ic_momo.svg']
    },
    {
      value: 'cash',
      title: translate('label.cash'),
      description: translate('message.cash'),
      icons: []
    }
  ];

  const CARDS_OPTIONS: CardOption[] = [
    { value: 'ViSa1', label: '**** **** **** 1212 - Jimmy Holland' },
    { value: 'ViSa2', label: '**** **** **** 2424 - Shawn Stokes' },
    { value: 'MasterCard', label: '**** **** **** 4545 - Cole Armstrong' }
  ];

  const { isSubmitting, handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <CheckoutPaymentMethods
              formik={formik}
              cardOptions={CARDS_OPTIONS}
              paymentOptions={PAYMENT_OPTIONS}
            />
            <Button
              type="button"
              size="small"
              color="inherit"
              onClick={handleBackStep}
              startIcon={<Icon icon={arrowIosBackFill} />}
            >
              {translate('button.back')}
            </Button>
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutBillingInfo onBackStep={handleBackStep} />
            <CheckoutSummary
              enableEdit
              total={total}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              onEdit={() => handleGotoStep(0)}
            />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {translate('button.complete-order')}
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

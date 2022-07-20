import * as Yup from 'yup';
import faker from 'faker';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import { LoadingButton } from '@material-ui/lab';
// material
import {
  Box,
  Grid,
  Card,
  Button,
  Typography,
  Stack,
  TextField,
  Divider,
  Autocomplete
} from '@material-ui/core';
import { Form, FormikProvider, useFormik } from 'formik';
// @types
import { getGroupById } from '_apis_/group';
import { Group } from '../../../../@types/group';
import {
  BillingAddress as Address,
  Customer,
  OnCreateBilling,
  ProductState
} from '../../../../@types/products';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { onBackStep, onNextStep, createBilling } from '../../../../redux/slices/product';
// hook
import useLocales from '../../../../hooks/useLocales';
import Label from '../../../Label';
import CheckoutSummary from './CheckoutSummary';
import CheckoutNewAddressForm from './CheckoutNewAddressForm';
import countries from './countries';
import GroupInfor from './GroupInfor';

// ----------------------------------------------------------------------

type CustomerItemProps = {
  onNextStep: VoidFunction;
  onCreateBilling: OnCreateBilling;
};

function CustomerItem({ onNextStep, onCreateBilling }: CustomerItemProps) {
  const { translate } = useLocales();
  const { checkout } = useSelector((state: { product: ProductState }) => state.product);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string()
      .required()
      .matches(/^[0-9]+$/, 'Phone must be only number')
      .min(10, 'Phone must be 10 number')
      .max(10, 'Phone must be 10 number')
      .required('Phone is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    nationality: Yup.string().required('Nationality is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: checkout.billing?.name || '',
      email: checkout.billing?.email || '',
      phone: checkout.billing?.phone || '',
      nationality: checkout.billing?.nationality.code || countries[238].code
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        onNextStep();
        setSubmitting(true);
        onCreateBilling({
          name: values.name,
          email: values.email,
          phone: values.phone,
          nationality: values.nationality
        });
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  //  -------------------------

  return (
    <Card sx={{ p: 3, mb: 3, position: 'relative' }}>
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3} direction="column">
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      {...getFieldProps('name')}
                      error={Boolean(touched.name && errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      {...getFieldProps('phone')}
                      error={Boolean(touched.phone && errors.phone)}
                      helperText={touched.phone && errors.phone}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      {...getFieldProps('email')}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Country"
                      placeholder="Country"
                      {...getFieldProps('nationality')}
                      SelectProps={{ native: true }}
                      error={Boolean(touched.nationality && errors.nationality)}
                      helperText={touched.nationality && errors.nationality}
                    >
                      {countries.map((option) => (
                        <option key={option.code} value={option.code}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained">
                Confirm
              </Button>
            </Box>
          </Form>
        </FormikProvider>
      </Box>
    </Card>
  );
}

export default function CheckoutBillingInformation() {
  //
  const dispatch = useDispatch();
  const { checkout } = useSelector((state: { product: ProductState }) => state.product);
  const { total, discount, subtotal } = checkout;

  const handleNextStep = () => {
    dispatch(onNextStep());
  };

  const handleBackStep = () => {
    dispatch(onBackStep());
  };

  const handleCreateBilling = (value: Customer) => {
    dispatch(createBilling(value));
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CustomerItem onNextStep={handleNextStep} onCreateBilling={handleCreateBilling} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              size="small"
              color="inherit"
              onClick={handleBackStep}
              startIcon={<Icon icon={arrowIosBackFill} />}
            >
              Back
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <GroupInfor />
          <CheckoutSummary subtotal={subtotal} total={total} discount={discount} />
        </Grid>
      </Grid>
    </>
  );
}

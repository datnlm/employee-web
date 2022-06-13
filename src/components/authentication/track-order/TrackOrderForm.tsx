import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
// material
import { TextField, Alert, Stack } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { PATH_PHOTO } from 'routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

// ----------------------------------------------------------------------

type InitialValues = {
  phone: string;
  afterSubmit?: string;
};

type ResetPasswordFormProps = {
  onSent: VoidFunction;
  onGetEmail: (value: string) => void;
};

export default function ResetPasswordForm({ onSent, onGetEmail }: ResetPasswordFormProps) {
  const { resetPassword } = useAuth();
  const isMountedRef = useIsMountedRef();
  const navigate = useNavigate();

  const ResetPasswordSchema = Yup.object().shape({
    phone: Yup.string().required('Phone is required')
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      phone: ''
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        navigate(PATH_PHOTO.phone);
        resetPassword?.(values.phone);
        if (isMountedRef.current) {
          onSent();
          onGetEmail(formik.values.phone);
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.message });
          setSubmitting(false);
        }
      }
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

          <TextField
            fullWidth
            {...getFieldProps('phone')}
            type="phone"
            label="Phone"
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Confirm
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}

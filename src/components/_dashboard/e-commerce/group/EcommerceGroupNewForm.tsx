import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@material-ui/core/styles';
import { LoadingButton, LocalizationProvider, DesktopDatePicker } from '@material-ui/lab';
import AdapterDateFns from '@date-io/date-fns';
import { RootState, useSelector, useDispatch, dispatch } from 'redux/store';
import useAuth from 'hooks/useAuth';
import {
  Card,
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
  FormHelperText,
  Autocomplete
} from '@material-ui/core';
// utils
import { createGroup, updateGroup } from '_apis_/group';
// routes
import { PATH_DASHBOARD } from 'routes/paths';
// hook
import useLocales from 'hooks/useLocales';
import { OptionStatus, statusOptions } from 'utils/constants';
import { getGroupRoleList } from 'redux/slices/group';
// @types
import { Group, GroupMode, GroupRole } from '../../../../@types/group';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type EcommerceGroupNewFormProps = {
  isEdit: boolean;
  currentGroup?: Group;
};

export default function EcommerceGroupNewForm({
  isEdit,
  currentGroup
}: EcommerceGroupNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const employeePartnerList = useSelector(
    (state: RootState) => state.employeePartner.employeePartnerList
  );
  const groupModeList = useSelector((state: RootState) => state.group.groupModeList);
  const groupRoleList = useSelector((state: RootState) => state.group.groupRoleList);
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const [groupMode, setGroupMode] = useState<GroupMode | null>(null);
  const [groupRole, setGroupRole] = useState<GroupRole | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());

  const NewGardenSchema = Yup.object().shape({
    name: Yup.string().required(translate('message.form.name')),
    imageUrl: Yup.array().min(1, translate('message.form.image'))
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentGroup?.id || '',
      startTime: currentGroup?.startTime || new Date(),
      endTime: currentGroup?.endTime || new Date(),
      licensePlate: currentGroup?.licensePlate || '',
      note: currentGroup?.note || '',
      siteId: currentGroup?.siteId || '',
      status: currentGroup?.status || '',
      personalRate: currentGroup?.personalRate || '',
      contribution: currentGroup?.contribution || '',
      employeePartnerId: currentGroup?.employeePartnerId || '',
      contributionMembers: currentGroup?.contributionMembers || null
    },
    // validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      let flag = false;
      try {
        // values.groupModeId = values.groupModeId.id;
        values.siteId = user?.SiteId;
        values.startTime = startTime ?? new Date();
        values.endTime = endTime ?? new Date();
        !isEdit
          ? await createGroup(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            })
          : await updateGroup(values).then((response) => {
              if (response.status == 200) {
                flag = true;
              }
            });
        if (flag) {
          resetForm();
          setSubmitting(false);
          enqueueSnackbar(
            !isEdit ? translate('message.create-success') : translate('message.update-success'),
            {
              variant: 'success'
            }
          );
          navigate(PATH_DASHBOARD.eCommerce.group);
        } else {
          enqueueSnackbar(
            !isEdit ? translate('message.create-error') : translate('message.create-error'),
            { variant: 'error' }
          );
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });
  useEffect(() => {
    if (groupMode?.id != null) {
      dispatch(getGroupRoleList(groupMode.id, 0, -1));
    }
  }, [groupMode]);

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.group.form.licensePlate')}
                    {...getFieldProps('licensePlate')}
                    error={Boolean(touched.licensePlate && errors.licensePlate)}
                    helperText={touched.licensePlate && errors.licensePlate}
                  />
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="employeePartnerId"
                    {...getFieldProps('employeePartnerId')}
                    options={employeePartnerList}
                    getOptionLabel={(option: any) => (option ? option.name : '')}
                    onChange={(e, value: any) =>
                      value ? { ...setFieldValue('employeePartnerId', value) } : ''
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate('page.group.form.contributionMembers')}
                        error={Boolean(touched.contributionMembers && errors.contributionMembers)}
                        helperText={touched.contributionMembers && errors.contributionMembers}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="contribution"
                    value={groupMode}
                    options={groupModeList}
                    getOptionLabel={(option: any) => (option ? option.name : '')}
                    onChange={(e, value: any) => {
                      setFieldValue('contribution', value);
                      setGroupMode(value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate('page.group.form.contribution')}
                        error={Boolean(touched.contribution && errors.contribution)}
                        helperText={touched.contribution && errors.contribution}
                      />
                    )}
                  />
                  <Autocomplete
                    fullWidth
                    disablePortal
                    clearIcon
                    id="personalRate"
                    value={groupRole}
                    options={groupRoleList}
                    getOptionLabel={(option: any) => (option ? option.personalRate : '')}
                    onChange={(e, value: any) => {
                      setFieldValue('personalRate', value);
                      setGroupRole(value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate('page.group.form.personalRate')}
                        error={Boolean(touched.personalRate && errors.personalRate)}
                        helperText={touched.personalRate && errors.personalRate}
                      />
                    )}
                  />
                </Stack>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <DesktopDatePicker
                      label={translate('page.group.form.startTime')}
                      value={startTime}
                      minDate={new Date('2017-01-01')}
                      onChange={(newValue) => {
                        setStartTime(newValue);
                      }}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                    <DesktopDatePicker
                      label={translate('page.group.form.endTime')}
                      value={endTime}
                      minDate={startTime}
                      onChange={(newValue) => {
                        setEndTime(newValue);
                      }}
                      renderInput={(params) => <TextField fullWidth {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label={translate('page.group.form.note')}
                    {...getFieldProps('note')}
                    error={Boolean(touched.note && errors.note)}
                    helperText={touched.note && errors.note}
                  />
                  {isEdit && (
                    <Autocomplete
                      fullWidth
                      disablePortal
                      clearIcon
                      id="status"
                      value={enumStatus}
                      options={statusOptions}
                      getOptionLabel={(option: OptionStatus) => translate(`status.${option.label}`)}
                      // getOptionLabel={(option: any) => (option ? option.name : '')}
                      onChange={(e, values: OptionStatus | null) => setEnumStatus(values)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={translate('page.garden.form.status')}
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                        />
                      )}
                    />
                  )}
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? translate('button.addNew') : translate('button.update')}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import { useCallback, useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
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
  Autocomplete,
  InputAdornment,
  Button
} from '@material-ui/core';
// utils
import { createGroup, updateGroup } from '_apis_/group';
// routes
import { PATH_DASHBOARD } from 'routes/paths';
// hook
import useLocales from 'hooks/useLocales';
import { OptionStatus, statusOptions, statusOrder, statusOrderOptions } from 'utils/constants';
import { getGroupRoleList } from 'redux/slices/group';
// @types
import { Contribution, Group, GroupMode, GroupRole } from '../../../../@types/group';
import PartnerTaskCard from './PartnerTaskCard';
import PartnerDialog from './PartnerDialog';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

type ContributionMembersNewFormProps = {
  isEdit: boolean;
  isView: boolean;
  currentContribution?: Contribution | null;
  submitRef: any;
  onSubmitCallback: any;
};

export default function ContributionMembersNewForm({
  isEdit,
  isView,
  currentContribution,
  submitRef,
  onSubmitCallback
}: ContributionMembersNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const employeePartnerList = useSelector(
    (state: RootState) => state.employeePartner.employeePartnerList
  );
  const groupModeList = useSelector((state: RootState) => state.group.groupModeList);
  const groupRoleList = useSelector((state: RootState) => state.group.groupRoleList);
  const [groupMode, setGroupMode] = useState<GroupMode | null>(null);
  const [groupRole, setGroupRole] = useState<GroupRole | null>(null);

  const NewGardenSchema = Yup.object().shape({
    employeePartnerId: Yup.object().required(translate('message.form.name')).nullable(true),
    contribution: Yup.object().required(translate('message.form.name')).nullable(true),
    personalRate: Yup.object().required(translate('message.form.name')).nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentContribution?.id || '',
      groupId: currentContribution?.groupId || '',
      contribution: currentContribution?.contribution || '',
      personalRate: currentContribution?.personalRate || '',
      employeePartnerId: currentContribution?.employeePartnerId || '',
      employeePartnerName: currentContribution?.employeePartnerName || '',
      groupRoleId: currentContribution?.groupRoleId || '',
      groupModeId: currentContribution?.groupModeId || ''
    },
    validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      const flag = false;
      try {
        values.groupModeId = values.groupModeId.id;
        if (groupRole != null) {
          values.groupRoleId = groupRole?.id;
          values.groupModeId = groupMode?.id;
          values.contribution = groupMode?.contribution ?? '';
          values.personalRate = groupRole?.personalRate ?? '';
        }
        const tmp = values.employeePartnerId;
        values.employeePartnerId = values.employeePartnerId.id;
        values.employeePartnerName = tmp.name;
        onSubmitCallback(values);
        resetForm();
        setSubmitting(false);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } =
    formik;

  const fetchData = async () => {
    if (groupMode?.id != null) {
      await dispatch(getGroupRoleList(groupMode.id, 0, -1));
    }
  };
  useEffect(() => {
    fetchData();
  }, [groupMode]);

  useEffect(() => {
    if (isEdit) {
      if (currentContribution != null) {
        setGroupMode(groupModeList.find((v) => v.id == currentContribution.groupModeId) ?? null);
        setFieldValue(
          'contribution',
          groupModeList.find((v) => v.id == currentContribution.groupModeId) ?? null
        );
        setFieldValue(
          'employeePartnerId',
          employeePartnerList.find((v) => v.id == currentContribution.employeePartnerId)
        );
      }
    }
  }, [currentContribution]);

  useEffect(() => {
    if (isEdit) {
      setFieldValue(
        'personalRate',
        groupRoleList.find((v) => v.id == currentContribution?.groupRoleId) ?? null
      );
      setGroupRole(groupRoleList.find((v) => v.id == currentContribution?.groupRoleId) ?? null);
    }
  }, [groupRoleList]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={12} md={12}>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  disabled={isView}
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
                      error={Boolean(touched.employeePartnerId && errors.employeePartnerId)}
                      helperText={touched.employeePartnerId && errors.employeePartnerId}
                    />
                  )}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  disabled={isView}
                  clearIcon
                  id="contribution"
                  value={groupMode}
                  options={groupModeList}
                  getOptionLabel={(option: any) =>
                    option ? `${option.name}: ${option.contribution}%` : ''
                  }
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
                  disabled={isView}
                  clearIcon
                  id="personalRate"
                  value={groupRole}
                  options={groupRoleList}
                  getOptionLabel={(option: any) =>
                    option ? `${option.name}:  ${option.personalRate}%` : ''
                  }
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
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" ref={submitRef} disableRipple={true} />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

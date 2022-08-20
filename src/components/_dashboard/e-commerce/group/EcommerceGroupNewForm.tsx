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

type EcommerceGroupNewFormProps = {
  isEdit: boolean;
  isView: boolean;
  currentGroup?: Group;
};

export default function EcommerceGroupNewForm({
  isEdit,
  isView,
  currentGroup
}: EcommerceGroupNewFormProps) {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const employeePartnerList = useSelector(
    (state: RootState) => state.employeePartner.employeePartnerList
  );
  const groupModeList = useSelector((state: RootState) => state.group.groupModeList);
  const groupRoleList = useSelector((state: RootState) => state.group.groupRoleList);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [contribution, setContribution] = useState<Contribution | null>(null);
  const [contributionMembersList, setContributionMembersList] = useState<Contribution[]>([]);
  const [enumStatus, setEnumStatus] = useState<OptionStatus | null>(null);
  const [groupMode, setGroupMode] = useState<GroupMode | null>(null);
  const [groupRole, setGroupRole] = useState<GroupRole | null>(null);
  const [isEditPartner, setIsEditPartner] = useState<boolean>(false);

  const NewGardenSchema = Yup.object().shape({
    name: Yup.string().required(translate('message.form.name')),
    imageUrl: Yup.array().min(1, translate('message.form.image'))
  });

  const handleOpen = (contribution: Contribution | null, isEditContribution: boolean) => {
    setOpen(true);
    if (isEditContribution) {
      setContribution(contribution);
      setIsEditPartner(true);
    } else {
      setContribution(null);
      setIsEditPartner(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
    // setIsOpen(false);
  };

  const handleDelete = async (id: string) => {
    const data = contributionMembersList.filter((object) => object.id != id);
    setContributionMembersList(data);
  };

  const callback = async (values: Contribution) => {
    if (values != null) {
      let data = contributionMembersList;
      if (!isEditPartner) {
        if (data.length == 0) {
          data = [values];
          console.log(data);
        } else {
          data.push(values);
        }
        values.groupId = currentGroup?.id ?? '';
        setContributionMembersList(data);
      } else {
        const index = data.findIndex((object) => object.id == values.id);
        data[index] = values;
        setContributionMembersList(data);
        setIsEditPartner(false);
      }
      setOpen(false);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: currentGroup?.id || '',
      startTime: currentGroup?.startTime || '',
      endTime: currentGroup?.endTime || '',
      licensePlate: currentGroup?.licensePlate || '',
      note: currentGroup?.note || '',
      siteId: currentGroup?.siteId || '',
      status: currentGroup?.status || '',
      groupRoleId: currentGroup?.groupRoleId || '',
      personalRate: currentGroup?.personalRate || '',
      contribution: currentGroup?.contribution || '',
      employeePartnerId: currentGroup?.employeePartnerId || '',
      contributionMembers: currentGroup?.contributionMembers || []
    },
    // validationSchema: NewGardenSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      let flag = false;
      try {
        // values.groupModeId = values.groupModeId.id;
        values.siteId = user?.SiteId;
        if (!isEdit) {
          values.startTime = new Date().toISOString();
        }
        if (isEdit) {
          values.status = enumStatus!.id;
          if (enumStatus!.id == 3) {
            values.endTime = new Date().toISOString();
          }
        }
        values.contributionMembers = contributionMembersList;
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
      if (currentGroup != null) {
        if (currentGroup.contributionMembers?.length != 0) {
          setGroupMode(
            groupModeList.find((v) => v.id == currentGroup?.contributionMembers[0].groupModeId) ??
              null
          );
          setFieldValue(
            'employeePartnerId',
            employeePartnerList.find(
              (v) => v.id == currentGroup?.contributionMembers[0].employeePartnerId
            )
          );
          setContributionMembersList(currentGroup?.contributionMembers);
        }
      }
      setEnumStatus(statusOrder.find((v) => v.id == currentGroup?.status) ?? null);
    }
  }, [currentGroup]);

  useEffect(() => {
    if (isEdit) {
      // if (currentGroup?.contributionMembers != null) {
      //   if (currentGroup?.contributionMembers[0].groupRoleId != null) {
      //     setGroupRole(
      //       groupRoleList.find((v) => v.id == currentGroup?.contributionMembers[0].groupRoleId) ??
      //         null
      //     );
      //   }
      // }
    }
  }, [groupRoleList]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3} style={{ display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ py: 3, px: 3 }}>
              {isView && contributionMembersList.length == 0 && !isLoading && (
                <Stack spacing={2} width="100%" justifyContent="center" alignItems="center">
                  <Typography variant="subtitle1" noWrap>
                    {translate('label.partner-emtpy')}
                  </Typography>
                </Stack>
              )}
              <Stack spacing={2} width="100%">
                {contributionMembersList.map((contribution: Contribution, index: number) => (
                  <PartnerTaskCard
                    isView={isView}
                    handleOpen={handleOpen}
                    key={index}
                    contribution={contribution}
                    handleDelete={handleDelete}
                  />
                ))}
              </Stack>
              <Stack spacing={2} sx={{ pb: 3 }}>
                {!isView && (
                  <Button
                    fullWidth
                    size="large"
                    color="inherit"
                    startIcon={<Icon color="green" icon={plusFill} width={20} height={20} />}
                    onClick={() => handleOpen(null, false)}
                    sx={{ fontSize: 14 }}
                  >
                    <p style={{ color: 'green' }}>{translate('button.addPartner')}</p>
                  </Button>
                )}

                <PartnerDialog
                  open={open}
                  onClose={handleClose}
                  isEdit={isEditPartner}
                  isView={isView}
                  currentContribution={contribution}
                  callback={callback}
                />
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    disabled={isView}
                    label={translate('page.group.form.licensePlate')}
                    {...getFieldProps('licensePlate')}
                    error={Boolean(touched.licensePlate && errors.licensePlate)}
                    helperText={touched.licensePlate && errors.licensePlate}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    disabled={isView}
                    label={translate('page.group.form.note')}
                    {...getFieldProps('note')}
                    error={Boolean(touched.note && errors.note)}
                    helperText={touched.note && errors.note}
                  />
                </Stack>
                {isEdit && (
                  <Stack direction={{ xs: 'column', sm: 'column' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      fullWidth
                      disabled
                      label={translate('page.group.form.startTime')}
                      value={new Date(values.startTime).toLocaleDateString()}
                      error={Boolean(touched.startTime && errors.startTime)}
                      helperText={touched.startTime && errors.startTime}
                    />
                    {values.endTime != null ||
                      (values.endTime != '' && (
                        <TextField
                          fullWidth
                          disabled
                          value={new Date(values.endTime).toLocaleDateString()}
                          label={translate('page.group.form.endTime')}
                          error={Boolean(touched.endTime && errors.endTime)}
                          helperText={touched.endTime && errors.endTime}
                        />
                      ))}
                  </Stack>
                )}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {isEdit && (
                    <Autocomplete
                      fullWidth
                      disablePortal
                      disabled={isView}
                      clearIcon
                      id="status"
                      value={enumStatus}
                      options={statusOrderOptions}
                      getOptionLabel={(option: OptionStatus) => translate(`status.${option.id}`)}
                      onChange={(e, values: OptionStatus | null) => setEnumStatus(values)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={translate('page.group.form.status')}
                          error={Boolean(touched.status && errors.status)}
                          helperText={touched.status && errors.status}
                        />
                      )}
                    />
                  )}
                </Stack>
              </Stack>
            </Card>
            {!isView && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? translate('button.addNew') : translate('button.update')}
                </LoadingButton>
              </Box>
            )}
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

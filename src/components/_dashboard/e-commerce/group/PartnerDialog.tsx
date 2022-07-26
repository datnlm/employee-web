import { useRef, useState, useEffect } from 'react';
import { useSnackbar } from 'notistack5';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// material
import {
  Dialog,
  Button,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { dispatch } from 'redux/store';
import useLocales from 'hooks/useLocales';
import ContributionMembersNewForm from './ContributionMembersNewForm';
import { Contribution } from '../../../../@types/group';
// ----------------------------------------------------------------------

type PartnerDialogProps = {
  //   currentDiverTeam?: DiverTeam;
  currentContribution?: Contribution | null;
  isEdit: boolean;
  isView: boolean;
  open: boolean;
  onClose: VoidFunction;
  callback: any;
};

export default function PartnerDialog({
  currentContribution,
  open,
  onClose,
  isEdit,
  isView,
  callback
}: PartnerDialogProps) {
  const { translate } = useLocales();
  // -------------------
  const submitRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // dispatch(getListGarden(0, -1));
  }, [open]);

  const handleSubmit = () => {
    if (submitRef && submitRef.current) {
      submitRef.current?.click();
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle> {translate('page.group.heading1.contribution')}</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <ContributionMembersNewForm
                  isEdit={isEdit}
                  isView={isView}
                  currentContribution={currentContribution}
                  submitRef={submitRef}
                  onSubmitCallback={callback}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        {!isView && (
          <LoadingButton type="button" variant="contained" onClick={handleSubmit}>
            {translate('button.confirm')}
          </LoadingButton>
        )}
        {!isView && (
          <Button type="button" color="inherit" variant="outlined" onClick={onClose}>
            {translate('button.cancel')}
          </Button>
        )}
        {isView && (
          <Button type="button" variant="contained" onClick={onClose}>
            {translate('button.confirm')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

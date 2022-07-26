import { useState, ChangeEvent, useEffect, useRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Icon } from '@iconify/react';
import checkmarkCircle2Outline from '@iconify/icons-eva/checkmark-circle-2-outline';
import radioButtonOffOutline from '@iconify/icons-eva/radio-button-off-outline';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';

// material
import {
  Paper,
  Typography,
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';
import useLocales from 'hooks/useLocales';
// @types
import { Contribution } from '../../../../@types/group';
//

// ----------------------------------------------------------------------

type PartnerTaskCardProps = {
  isView: boolean;
  handleOpen: (contribution: Contribution, isEditContribution: boolean) => void;
  handleDelete: (id: string) => void;
  contribution: Contribution;
};

export default function PartnerTaskCard({
  isView,
  contribution,
  handleOpen,
  handleDelete
}: PartnerTaskCardProps) {
  const { translate } = useLocales();
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  //   const [currentCellSurvey, setCurrentCellSurvey] = useState<CellSurvey | any>();
  const ref = useRef(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsOpen(false);
  };

  const handleChangeComplete = (event: ChangeEvent<HTMLInputElement>) => {
    // setCompleted(event.target.checked);
  };
  return (
    <>
      <Paper
        sx={{
          px: 2,
          width: '100%',
          position: 'relative',
          boxShadow: (theme) => theme.customShadows.z1,
          '&:hover': {
            boxShadow: (theme) => theme.customShadows.success
          }
        }}
      >
        <Box>
          <Grid container>
            <Grid item xs={11} md={11}>
              <Typography
                noWrap
                variant="subtitle2"
                sx={{
                  width: '100%',
                  py: 3,
                  pl: 2,
                  transition: (theme) =>
                    theme.transitions.create('opacity', {
                      duration: theme.transitions.duration.shortest
                    })
                  // ...(completed && { opacity: 0.48 })
                }}
              >
                {contribution.employeePartnerId} - {contribution.employeePartnerName}
              </Typography>
            </Grid>
            <Grid item xs={1} md={1}>
              <Box sx={{ width: '100%', py: 2, pl: 2 }}>
                <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                  <Icon icon={moreVerticalFill} width={20} height={20} />
                </IconButton>

                <Menu
                  open={isOpen}
                  anchorEl={ref.current}
                  onClose={() => setIsOpen(false)}
                  PaperProps={{
                    sx: { width: 200, maxWidth: '100%' }
                  }}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem
                    onClick={() => {
                      handleOpen(contribution, true);
                      setIsOpen(false);
                    }}
                    sx={{ color: 'text.secondary' }}
                  >
                    <ListItemIcon>
                      <Icon icon={isView ? eyeFill : editFill} width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText
                      primary={isView ? 'View' : 'Edit'}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </MenuItem>

                  {!isView && (
                    <MenuItem onClick={handleClickOpen} sx={{ color: 'text.secondary' }}>
                      <ListItemIcon>
                        <Icon icon={trash2Outline} width={24} height={24} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Delete"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <div>
          <Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title">
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
              {translate('message.title.confirm-delete')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>{translate('message.confirm-delete')}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                {translate('button.cancel')}
              </Button>
              <Button
                onClick={(event) => {
                  handleDelete(contribution.id);
                  handleClose();
                }}
              >
                {translate('button.confirm')}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Paper>
    </>
  );
}

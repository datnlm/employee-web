import { Icon } from '@iconify/react';
import editFill from '@iconify/icons-eva/edit-fill';
// material
import {
  Card,
  Button,
  Typography,
  CardHeader,
  CardContent,
  Grid,
  TextField
} from '@material-ui/core';
import useLocales from 'hooks/useLocales';
// @types
import { useState } from 'react';
import { getGroupById } from '_apis_/group';
import { createGroup } from 'redux/slices/product';
import { ProductState } from '../../../../@types/products';
// redux
import { dispatch, useSelector } from '../../../../redux/store';
import { Group } from '../../../../@types/group';

// ----------------------------------------------------------------------

export default function GroupInfor() {
  const [name, setName] = useState('');
  const { checkout } = useSelector((state: { product: ProductState }) => state.product);
  const { billing } = checkout;
  const [groupId, setGroupId] = useState('');
  const [group, setGroup] = useState<Group | null>();
  const { translate } = useLocales();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupId(event.target.value);
  };
  const getGroup = async () => {
    setGroup(null);
    getGroupById(groupId).then((response) => {
      if (response.status == 200) {
        setGroup(response.data);
        dispatch(createGroup(groupId));
      }
    });
  };
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid spacing={2} item xs={12} sm={12}>
          <TextField
            fullWidth
            label={translate('form.group')}
            value={groupId}
            onChange={handleChange}
            onBlur={getGroup}
          />
        </Grid>
        {group != null ? (
          <>
            <Typography variant="subtitle2" gutterBottom>
              {translate('label.license-plate')}: {group?.licensePlate}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {translate('label.start')}: {group?.startTime}
            </Typography>
            {group?.status != '1' && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {translate('label.end')}: {group?.endTime}
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {translate('label.not-found')}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

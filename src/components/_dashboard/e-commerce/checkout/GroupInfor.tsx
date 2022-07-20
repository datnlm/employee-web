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
  const [group, setGroup] = useState<Group>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupId(event.target.value);
  };
  const getGroup = async () => {
    getGroupById(groupId).then((response) => {
      if (response.status == 200) {
        setGroup(response.data);
        dispatch(createGroup(groupId));
      } else {
        dispatch(createGroup(null));
      }
    });
  };
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid item xs={12} sm={12}>
          <TextField
            fullWidth
            label="Group"
            value={groupId}
            onChange={handleChange}
            onBlur={getGroup}
          />
        </Grid>
        <Typography variant="subtitle2" gutterBottom>
          License Plate: {group?.licensePlate}
        </Typography>

        {/* <Typography variant="body2" gutterBottom>
          {group?.status}
        </Typography> */}
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Start time: {group?.startTime}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          End time: {group?.endTime}
        </Typography>
      </CardContent>
    </Card>
  );
}

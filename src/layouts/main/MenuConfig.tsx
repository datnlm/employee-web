import { Icon } from '@iconify/react';
import homeFill from '@iconify/icons-eva/home-fill';
import fileFill from '@iconify/icons-eva/file-fill';
// routes
import { PATH_PHOTO } from '../../routes/paths';

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22
};

const menuConfig = [
  {
    title: 'Photo',
    path: PATH_PHOTO.root,
    icon: <Icon icon={fileFill} {...ICON_SIZE} />
  }
];

export default menuConfig;

import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
import { getGroupById } from '_apis_/group';
// material
import { Container } from '@material-ui/core';
import EcommerceGroupNewForm from 'components/_dashboard/e-commerce/group/EcommerceGroupNewForm';
import { getContributions, getGroupModeList } from 'redux/slices/group';
import { getEmployeePartnerList } from 'redux/slices/employee-partner';
import { Group } from '../../@types/group';
// redux
import { useDispatch } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// ----------------------------------------------------------------------

export default function EcommerceGroupCreate() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const isEdit = pathname.includes('edit');
  const [currentGroup, setCurrentGroup] = useState<Group>();

  const fetchData = async () => {
    await getGroupById(paramCase(name)).then((response) => {
      setCurrentGroup(response.data);
    });
  };

  useEffect(() => {
    if (isEdit) {
      fetchData();
    }
    dispatch(getContributions(0, -1));
    dispatch(getEmployeePartnerList(0, -1));
    dispatch(getGroupModeList(0, -1));
  }, [dispatch]);

  return (
    <Page
      title={!isEdit ? translate('page.group.title.create') : translate('page.group.title.update')}
    >
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            !isEdit
              ? translate('page.group.heading1.create')
              : translate('page.group.heading1.update')
          }
          links={[
            {
              name: translate('page.group.heading2'),
              href: PATH_DASHBOARD.eCommerce.group
            },
            { name: !isEdit ? translate('page.group.heading4.new') : name }
          ]}
        />
        <EcommerceGroupNewForm isEdit={isEdit} isView={false} currentGroup={currentGroup} />
      </Container>
    </Page>
  );
}

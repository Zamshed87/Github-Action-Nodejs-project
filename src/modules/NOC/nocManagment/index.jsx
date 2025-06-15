import { setFirstLevelNameAction } from 'commonRedux/reduxForLocalStorage/actions';
import React, { useEffect, useMemo } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import NOCLanding from '../components/NOCLanding';
import NotPermittedPage from 'common/notPermitted/NotPermittedPage';

const NOCManagementLanding = () => {
    const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
    const dispatch = useDispatch();
    const pathurl = "/profile/noc/nocApplication";
  //30539
    const permission = useMemo(
      () => permissionList.find((menu) => menu.menuReferenceId === 30611),
      [permissionList]
    );
  
    useEffect(() => {
      dispatch(setFirstLevelNameAction("Employee Management"));
    }, []);
  
    return permission?.isView ? (
      <NOCLanding isManagement={true} pathurl={pathurl} />
    ) : (
      <NotPermittedPage />
    );
}

export default NOCManagementLanding

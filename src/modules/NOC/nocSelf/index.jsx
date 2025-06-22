import { setFirstLevelNameAction } from 'commonRedux/reduxForLocalStorage/actions';
import React from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import NOCLanding from '../components/NOCLanding';

const NocSelfLanding = () => {
    const pathurl = `/SelfService/noc/nocApplication`;
    const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(setFirstLevelNameAction("Employee Self Service"));
      document.title = "NOC Application";
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <NOCLanding isManagement={false} pathurl={pathurl} />;
}

export default NocSelfLanding

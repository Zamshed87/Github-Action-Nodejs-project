import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setFirstLevelNameAction } from '../../commonRedux/reduxForLocalStorage/actions';
import OverviewTab from './OverviewTab';

export default function ComponentList() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Components"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="table-card component-module">
        <div className="table-card-heading">
          <h2>All Components</h2>
        </div>
        <div className="table-card-body">
          <div className="card-body">
            <OverviewTab />
          </div>
        </div>
      </div>
    </>
  )
}

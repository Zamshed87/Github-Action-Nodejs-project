import { Grain } from '@mui/icons-material';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import BackButton from '../../../common/BackButton';
import CircleButton from '../../../common/CircleButton';
import NotPermittedPage from '../../../common/notPermitted/NotPermittedPage';
import { setFirstLevelNameAction } from '../../../commonRedux/reduxForLocalStorage/actions';


export default function NotificationDetails() {
  const dispatch = useDispatch();
  const { state } = useLocation();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 138) {
      permission = item;
    }
  });

  const notifyTypeList = (array) => {
    let modifyArr = array?.filter(itm => itm?.isChecked === true)?.map(itm => itm?.typeName);

    return modifyArr?.join();
  };

  return (
    <>
      {permission?.isCreate ? (
        <>
          <div className="table-card">
            <div className="table-card-heading">
              <div className="d-flex align-items-center">
                <BackButton />
                <h2>View Notification Setup</h2>
              </div>
            </div>
            <div className="card-style mt-3" style={{ padding: "12px 10px 10px" }}>
              <div className="row">
                <div className="col-lg-3">
                  <CircleButton
                    icon={<Grain style={{ fontSize: '24px' }} />}
                    title={state?.companyName || "-"}
                    subTitle="Account Name"
                  />
                </div>
                <div className="col-12">
                  <div className="card-save-border"></div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4">
                  <div className="salary-breakdown-details-table">
                    <div className="table-card-styled employee-table-card tableOne">
                      <table className="table">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Notify Category</th>
                            <th>Notify Types</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state?.notificationCategoryViewModel?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center">
                                  <div>{index + 1}</div>
                                </td>
                                <td>{item?.categoryName}</td>
                                <td>
                                  {notifyTypeList(item?.notificationCategoryTypes)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </>
      ) : (
        <>
          <NotPermittedPage />
        </>
      )}
    </>
  );
}

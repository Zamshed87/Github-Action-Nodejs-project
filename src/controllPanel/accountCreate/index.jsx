/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
import { AddOutlined } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import AntTable from "../../common/AntTable";
import { getPeopleDeskAllLanding } from "../../common/api";
import IConfirmModal from "../../common/IConfirmModal";
import Loading from "../../common/loading/Loading";
import NoResult from "../../common/NoResult";
import NotPermittedPage from "../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import { adminAccountDtoCol } from "./helper";

const initData = {
  search: "",
};

export default function AccountCreateLanding() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { buId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAccountLanding = () => {
    getPeopleDeskAllLanding(
      "AccountLanding",
      orgId,
      buId,
      "",
      setRowDto,
      "",
      setLoading
    );
  };

  useEffect(() => {
    getAccountLanding();
  }, [orgId, buId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Account";
  }, []);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30277) {
      permission = item;
    }
  });

  // popup handler
  const popupHandler = () => {
    const confirmObject = {
      title: "Are you sure?",
      closeOnClickOutside: false,
      yesAlertFunc: () => {},
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ handleSubmit }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <>
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div></div>
                      <ul className="d-flex flex-wrap">
                        <li>
                          <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label={"Account"}
                            icon={
                              <AddOutlined
                                sx={{
                                  marginRight: "0px",
                                  fontSize: "15px",
                                }}
                              />
                            }
                            onClick={() => {
                              if (!permission?.isCreate) {
                                return toast.warning(
                                  "Your are not allowed to access",
                                  {
                                    toastId: 11,
                                  }
                                );
                              }
                              history.push(
                                "/administration/configuration/account/create"
                              );
                            }}
                          />
                        </li>
                      </ul>
                    </div>
                    <div className="table-card-body">
                      {rowDto?.length > 0 ? (
                        <>
                          <div className="table-card-styled employee-table-card tableOne  table-responsive mt-3">
                            <AntTable
                              data={rowDto}
                              removePagination
                              columnsData={adminAccountDtoCol(
                                popupHandler,
                                history
                              )}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {!loading && (
                            <NoResult title="No Result Found" para="" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

// old table binding code

/* 
      <table className="table">
                              <thead>
                                <tr>
                                  <th style={{ width: '30px' }}>SL</th>
                                  <th>
                                    <div className="sortable">
                                      <span>Account Name</span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="sortable">
                                      <span>Owner Name</span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="sortable">
                                      <span>Package Name</span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="sortable">
                                      <span>Address</span>
                                    </div>
                                  </th>
                                  <th>
                                    <div className="sortable">
                                      <span>Email</span>
                                    </div>
                                  </th>
                                  <th width="10%">
                                    <div className="sortable">
                                      <span>Mobile</span>
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {rowDto?.length > 0 &&
                                  rowDto?.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        <td>
                                          <div>{index + 1}</div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <div className="emp-avatar">
                                              <AvatarComponent
                                                classess=""
                                                letterCount={1}
                                                label={item?.strAccountName}
                                              />
                                            </div>
                                            <div className="ml-2">
                                              <span className="tableBody-title">
                                                {item?.strAccountName}
                                              </span>
                                            </div>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="tableBody-title">
                                            {item?.strOwnerName}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="tableBody-title">
                                            {item?.strAccountPackageName}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="tableBody-title">
                                            {item?.strAddress}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="tableBody-title">
                                            {item?.strEmail}
                                          </div>
                                        </td>
                                        <td>
                                          <div className="d-flex align-items-center justify-content-between">
                                            <div className="tableBody-title">
                                              {item?.strMobileNumber}
                                            </div>
                                            <div className="ml-2">
                                              <ActionMenu
                                                // anchorEl={anchorElAction}
                                                // setAnchorEl={setAnchorElAction}
                                                sx={{
                                                  marginRight: "10px",
                                                  fontSize: "12px",
                                                }}
                                                color={gray900}
                                                fontSize={"14px"}
                                                options={[
                                                  {
                                                    value: 1,
                                                    label: "Block",
                                                    icon: (
                                                      <BlockOutlined
                                                        sx={{
                                                          marginRight: "10px",
                                                          fontSize: "16px",
                                                        }}
                                                      />
                                                    ),
                                                    onClick: () => {
                                                      popupHandler();
                                                    },
                                                  },
                                                  {
                                                    value: 2,
                                                    label: "Inactive",
                                                    icon: (
                                                      <NoAccountsOutlined
                                                        sx={{
                                                          marginRight: "10px",
                                                          fontSize: "16px",
                                                        }}
                                                      />
                                                    ),
                                                    onClick: () => {
                                                      popupHandler();
                                                    },
                                                  },
                                                  {
                                                    value: 3,
                                                    label: "Edit",
                                                    icon: (
                                                      <EditOutlinedIcon
                                                        sx={{
                                                          marginRight: "10px",
                                                          fontSize: "16px",
                                                        }}
                                                      />
                                                    ),
                                                    onClick: () => {
                                                      history.push(
                                                        `/administration/configuration/account/edit/${item?.intAccountId}`
                                                      );
                                                    },
                                                  },
                                                ]}
                                              />
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table> 

*/

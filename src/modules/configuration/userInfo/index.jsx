import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { paginationSize } from "../../../common/AntTable";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import Loading from "./../../../common/loading/Loading";
import NoResult from "./../../../common/NoResult";
import PrimaryButton from "./../../../common/PrimaryButton";
import ResetButton from "./../../../common/ResetButton";
import AddEditFormComponent from "./addEditForm/index";
import "./styles.css";
import ViewFormComponent from "./viewForm";
import { userInfoCol } from "./helper";
import MasterFilter from "../../../common/MasterFilter";
import PeopleDeskTable from "../../../common/peopleDeskTable";

const initData = {
  search: "",
  status: "",
};

const validationSchema = Yup.object({});

function UserInfo() {
  const history = useHistory();
  // row Data
  const [singleData, setSingleData] = useState("");

  const [status, setStatus] = useState("");

  // for create state
  const [open, setOpen] = useState(false);

  // for view state
  const [viewModal, setViewModal] = useState(false);

  // for create Modal
  const handleOpen = () => {
    setViewModal(false);
    setOpen(true);
  };
  const handleClose = () => {
    setViewModal(false);
    setOpen(false);
  };

  // for view Modal
  // const handleViewOpen = () => setViewModal(true);
  const handleViewClose = () => setViewModal(false);

  const { orgId, buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // single Data
  const [singelUser, setSingelUser] = useState("");

  const [rowDto, getLanding, loadingLanding, setRowDto] = useAxiosGet();
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Users Info";
  }, []);

  const saveHandler = (values) => {};

  // const getData = (search) => {
  //   const searchText = search ? `&searchTxt=${search}` : "";
  //   getRowDto(
  //     `/Employee/EmployeeListForUserLandingPagination?accountId=${orgId}&businessUnitId=${buId}${searchText}&isUser=0`,
  //     (data) => {
  //       const modifiedData = data?.data?.map((item) => {
  //         return {
  //           ...item,
  //           finalStatus: item?.userStatus ? "Active" : "Inactive",
  //         };
  //       });
  //       setRowDto({ ...data, data: modifiedData });
  //       setAllData({ ...data, data: modifiedData });
  //     }
  //   );
  // };
  const getData = (pagination, searchtText = "") => {
    const api = `/Employee/EmployeeListForUserLandingPagination?businessUnitId=${buId}&PageNo=${
      pagination?.current
    }&PageSize=${
      pagination?.pageSize
    }&workplaceGroupId=${wgId}&workplaceId=${wId}&isUser=0&IsForXl=false&searchTxt=${
      searchtText || ""
    }`;
    getLanding(api, (res) => {
      const modifiedData = res?.data?.map((item, index) => {
        return {
          ...item,
          initialSerialNumber: index + 1,
        };
      });
      setRowDto(modifiedData);
      setPages({
        current: pagination?.current,
        pageSize: pagination?.pageSize,
        total: res?.totalCount,
      });
    });
  };

  const handleChangePage = (_, newPage, searchText) => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });

    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText) => {
    setPages((prev) => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText
    );
  };
  useEffect(() => {
    getData(pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30) {
      permission = item;
    }
  });

  // const filterData = (keywords) => {
  //   try {
  //     const regex = new RegExp(keywords?.toLowerCase());
  //     let newDta = allData?.data?.filter(
  //       (item) =>
  //         regex.test(item?.strEmployeeName?.toLowerCase()) ||
  //         regex.test(item?.strEmployeeCode?.toLowerCase()) ||
  //         regex.test(item?.strOfficeMail?.toLowerCase())
  //     );
  //     setRowDto((prev) => ({ ...prev, data: newDta }));
  //   } catch {
  //     setRowDto([]);
  //   }
  // };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loadingLanding && <Loading />}
            <Form onSubmit={handleSubmit}>
              {permission?.isView ? (
                <div className="table-card userInfo-wrapper">
                  <div className="table-card-heading ">
                    <div className="ml-2">
                      {rowDto?.length > 0 ? (
                        <>
                          <h6 className="count">
                            Total {pages?.total} employees
                          </h6>
                        </>
                      ) : (
                        <>
                          <h6 className="count">Total result 0</h6>
                        </>
                      )}
                    </div>
                    <ul className="d-flex flex-wrap">
                      {(values?.search || status) && (
                        <li>
                          <ResetButton
                            classes="btn-filter-reset"
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{ marginRight: "10px", fontSize: "16px" }}
                              />
                            }
                            styles={{
                              marginRight: "16px",
                            }}
                            onClick={() => {
                              getData(pages);
                              setFieldValue("search", "");
                              setStatus("");
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <MasterFilter
                          inputWidth="250px"
                          width="250px"
                          isHiddenFilter
                          value={values?.search}
                          setValue={(value) => {
                            setFieldValue("search", value);
                            if (value) {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                value
                              );
                            } else {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                ""
                              );
                            }
                          }}
                          cancelHandler={() => {
                            setFieldValue("search", "");
                            getData(
                              { current: 1, pageSize: paginationSize },
                              ""
                            );
                          }}
                        />
                      </li>
                      <li>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center"
                          label={"User"}
                          icon={
                            <AddOutlined
                              sx={{
                                marginRight: "0px",
                                fontSize: "15px",
                              }}
                            />
                          }
                          onClick={(e) => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            history.push(
                              `/administration/roleManagement/usersInfo/create`
                            );
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  {/* table body */}
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {rowDto?.length > 0 ? (
                        <>
                          {/* <AntTable
                            data={rowDto}
                            rowClassName="pointer"
                            columnsData={userInfoCol(
                              pages,
                              permission,
                              setOpen,
                              setSingelUser
                            )}
                            onRowClick={(dataRow) => {
                              setSingelUser(dataRow);
                              setViewModal(true);
                            }}
                            handleTableChange={({ pagination, newRowDto }) =>
                              handleTableChange(
                                pagination,
                                newRowDto,
                                values?.search || ""
                              )
                            }
                            pages={pages?.pageSize}
                            pagination={pages}
                          /> */}
                          <PeopleDeskTable
                            columnData={userInfoCol(
                              pages,
                              permission,
                              setOpen,
                              setSingelUser
                            )}
                            pages={pages}
                            rowDto={rowDto}
                            setRowDto={setRowDto}
                            handleChangePage={(e, newPage) =>
                              handleChangePage(e, newPage, values?.searchString)
                            }
                            handleChangeRowsPerPage={(e) =>
                              handleChangeRowsPerPage(e, values?.searchString)
                            }
                            uniqueKey="strEmployeeCode"
                            // getFilteredData={() => {
                            //   getData(
                            //     {
                            //       current: 1,
                            //       pageSize: paginationSize,
                            //       total: 0,
                            //     },
                            //     ""
                            //   );
                            // }}
                            isCheckBox={false}
                            isScrollAble={false}
                          />
                        </>
                      ) : (
                        <>
                          {!loadingLanding && (
                            <NoResult title="No Result Found" para="" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}

              {/* View Form Modal */}
              <ViewFormComponent
                show={viewModal}
                title={"User Details"}
                onHide={handleViewClose}
                size="lg"
                backdrop="static"
                singelUser={singelUser}
                classes="default-modal"
                handleOpen={handleOpen}
                orgId={orgId}
                buId={buId}
                singleData={singleData}
                setSingleData={setSingleData}
              />

              {/* addEdit form Modal */}
              <AddEditFormComponent
                show={open}
                title={"Edit User"}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal"
                orgId={orgId}
                singelUser={singelUser}
                buId={buId}
                setRowDto={setRowDto}
                singleData={singleData}
                setSingleData={setSingleData}
                getData={getData}
                pages={pages}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default UserInfo;

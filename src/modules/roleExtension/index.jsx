import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import AntTable, { paginationSize } from "../../common/AntTable";
import Loading from "../../common/loading/Loading";
import NoResult from "../../common/NoResult";
import NotPermittedPage from "../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../common/PrimaryButton";
import ResetButton from "../../common/ResetButton";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import useAxiosGet from "../../utility/customHooks/useAxiosGet";
import MasterFilter from "../../common/MasterFilter";
import { userRoleExtensionCol } from "./helper";
import PeopleDeskTable, { paginationSize } from "../../common/peopleDeskTable";

const initData = {
  search: "",
};

export default function UserRoleExtentionLanding() {
  const history = useHistory();
  const [rowDto, getLanding, loadingLanding, setRowDto] = useAxiosGet();
  const { wgId, buId } = useSelector((state) => state?.auth?.profileData);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const getData = (pagination, searchtText = "") => {
    const api = `/Auth/GetAllRoleExtensionAssignedEmployeeLanding?businessUnitId=${buId}&intWorkplaceGroupId=${wgId}&PageNo=${
      pagination?.current
    }&PageSize=${pagination?.pageSize}&SearchText=${searchtText || ""}`;
    getLanding(api, (res) => {
      const modifiedData = res?.data?.map((item, index) => ({
        ...item,
        initialSerialNumber: index + 1,
      }));
      setRowDto(modifiedData);
      setPages({
        current: pagination?.current,
        pageSize: pagination?.pageSize,
        total: res[0]?.totalCount,
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
  }, [wgId]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // // ascending & descending
  // const commonSortByFilter = (filterType, property) => {
  //   const newRowData = [...allData];
  //   let modifyRowData = [];

  //   if (filterType === "asc") {
  //     modifyRowData = newRowData?.sort((a, b) => {
  //       if (a[property] > b[property]) return -1;
  //       return 1;
  //     });
  //   } else {
  //     modifyRowData = newRowData?.sort((a, b) => {
  //       if (b[property] > a[property]) return -1;
  //       return 1;
  //     });
  //   }
  //   setRowDto(modifyRowData);
  // };

  // // search
  // const filterData = (keywords, allData, setRowDto) => {
  //   try {
  //     const regex = new RegExp(keywords?.toLowerCase());
  //     let newDta = allData?.filter(
  //       (item) =>
  //         regex.test(item?.strEmployeeName?.toLowerCase()) ||
  //         regex.test(item?.strDesignation?.toLowerCase())
  //     );
  //     setRowDto(newDta);
  //   } catch {
  //     setRowDto([]);
  //   }
  // };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 85) {
      permission = item;
    }
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          dirty,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loadingLanding && <Loading />}
              {!permission?.isView ? (
                <div className="table-card">
                  <div className="table-card-heading">
                    <div className="d-flex align-items-center"></div>
                    <ul className="d-flex flex-wrap">
                      {values?.search && (
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
                          label="Extension"
                          icon={
                            <AddOutlined
                              sx={{
                                marginRight: "0px",
                                fontSize: "15px",
                              }}
                            />
                          }
                          onClick={() => {
                            history.push(
                              `/administration/roleManagement/userRoleExtension/create`
                            );
                          }}
                        />
                      </li>
                    </ul>
                  </div>

                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {rowDto?.length > 0 ? (
                        <>
                          {/* <AntTable
                            data={rowDto?.length > 0 && rowDto}
                            columnsData={userRoleExtensionCol(pages)}
                            onRowClick={(dataRow) => {
                              history.push(
                                `/administration/roleManagement/userRoleExtension/view/${dataRow?.intEmployeeBasicInfoId}`
                              );
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
                            columnData={userRoleExtensionCol(pages)}
                            pages={pages}
                            rowDto={rowDto}
                            setRowDto={setRowDto}
                            handleChangePage={(e, newPage) =>
                              handleChangePage(e, newPage, values?.searchString)
                            }
                            handleChangeRowsPerPage={(e) =>
                              handleChangeRowsPerPage(e, values?.searchString)
                            }
                            onRowClick={(dataRow) => {
                              history.push(
                                `/administration/roleManagement/userRoleExtension/view/${dataRow?.intEmployeeBasicInfoId}`,
                                {
                                  workplaceGroupId: dataRow?.workplaceGroupId,
                                  businessUnitId: dataRow?.businessUnitId,
                                }
                              );
                            }}
                            uniqueKey="employeeCode"
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
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

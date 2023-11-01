/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import BackButton from "../../../../common/BackButton";
import FavButton from "../../../../common/FavButton";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray900 } from "../../../../utility/customColor";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import AddEditFormComponent from "../addEditForm/index";
import "../styles.css";
import { Add } from "@mui/icons-material";
// import AntTable from "../../../../common/AntTable";
import MasterFilter from "../../../../common/MasterFilter";
import PeopleDeskTable, {
  paginationSize,
} from "../../../../common/peopleDeskTable";

const initData = {
  search: "",
  status: "",
};

const validationSchema = Yup.object({});

function CreateUser() {
  const [rowDto, getRowDto, apiLoading, setRowDto] = useAxiosGet();
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState("");
  // for create state
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  // single Data
  const [singelUser, setSingelUser] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (pagination, search = "") => {
    getRowDto(
      `/Employee/EmployeeListForUserLandingPagination?businessUnitId=${buId}&workplaceGroupId=${wgId}&isUser=2&PageNo=${
        pagination?.current
      }&PageSize=${pagination?.pageSize}&IsForXl=false&searchTxt=${
        search || ""
      }`,
      (res) => {
        const modifyRowData = res?.data?.map((item, index) => {
          return {
            ...item,
            initialSerialNumber: index + 1,
          };
        });
        setRowDto(modifyRowData);
        setAllData(modifyRowData);
        setPages({
          current: pagination?.current,
          pageSize: pagination?.pageSize,
          total: res?.totalCount,
        });
      }
    );
  };
  // /Employee/EmployeeListForUserLandingPagination?businessUnitId=1&workplaceGroupId=1&isUser=0&PageNo=1&PageSize=10&IsForXl=false
  useEffect(() => {
    getData(pages);
  }, [buId, wgId]);

  // active & inactive filter
  // const statusTypeFilter = (statusType) => {
  //   const newRowData = [...allData];
  //   let modifyRowData = [];
  //   if (statusType === "Active") {
  //     modifyRowData = newRowData?.filter((item) => item?.Status === true);
  //   } else {
  //     modifyRowData = newRowData?.filter((item) => item?.Status === false);
  //   }
  //   setRowDto({ Result: modifyRowData });
  // };

  // ascending & descending
  // const sortByFilter = (filterType) => {
  //   const newRowData = [...allData];
  //   let modifyRowData = [];

  //   if (filterType === "asc") {
  //     modifyRowData = newRowData?.sort((a, b) => {
  //       if (a?.BusinessUnitName > b.BusinessUnitName) return -1;
  //       return 1;
  //     });
  //   } else {
  //     modifyRowData = newRowData?.sort((a, b) => {
  //       if (b?.BusinessUnitName > a.BusinessUnitName) return -1;
  //       return 1;
  //     });
  //   }
  //   setRowDto({ Result: modifyRowData });
  // };

  // ascending & descending
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
  //   setRowDto({ Result: modifyRowData });
  // };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30) {
      permission = item;
    }
  });

  /*   const setPaginationHandler = (pageNo, pageSize, values) => {
    getRowDto(
      `/Employee/EmployeeListForUserLandingPagination?accountId=${orgId}&businessUnitId=${buId}&searchTxt=${values?.search}&isUser=2&pageNo=${pageNo}&pageSize=${pageSize}`,
      (data) => {
        setAllData(data);
      }
    );
    getData(pageNo, pageSize);
  }; */

  const userInfoDtoCol = (setOpen, setSingelUser, setIsCreate) => {
    return [
      {
        title: "SL",
        render: (record, index) => index + 1,
        className: "text-center",
        width: 30,
      },
      {
        title: "Name",
        dataIndex: "strEmployeeName",
        sort: true,
        fieldType: "string",
      },
      {
        title: "Designation",
        dataIndex: "strDesignation",
        sort: true,
        fieldType: "string",
      },
      {
        title: "Department",
        dataIndex: "strDepartment",
        sort: true,
        fieldType: "string",
      },
      {
        title: "Code",
        dataIndex: "strEmployeeCode",
        sort: true,
        fieldType: "string",
      },
      {
        title: "Type",
        dataIndex: "strEmploymentType",
        sort: true,
        // filter: true,
        fieldType: "string",
      },
      {
        title: "",
        dataIndex: "",
        render: (record, index) => {
          return (
            <FavButton
              icon={<Add sx={{ color: gray900, fontSize: "16px" }} />}
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
                setSingelUser(record);
                setIsCreate(true);
              }}
            />
          );
        },
      },
    ];
  };
  const searchData = (keywords) => {
    if (!keywords) {
      setRowDto(allData);
      return;
    }
    setLoading(true);
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newData = allData?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strDesignation?.toLowerCase()) ||
          regex.test(item?.strEmployeeCode?.toLowerCase()) ||
          regex.test(item?.strEmploymentType?.toLowerCase())
      );
      setRowDto(newData);
    } catch {
      setRowDto([]);
    }
    setLoading(false);
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

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
            {(loading || apiLoading) && <Loading />}
            <Form>
              {true || permission?.isCreate ? (
                <div className="table-card createUser-wrapper">
                  <div className="table-card-heading">
                    <div>
                      <BackButton />
                    </div>
                    <ul className="d-flex flex-wrap">
                      <li>
                        <MasterFilter
                          isHiddenFilter
                          styles={{
                            marginRight: "0px",
                          }}
                          width="200px"
                          inputWidth="200px"
                          value={values?.search}
                          setValue={(value) => {
                            setFieldValue("search", value);
                            if (value) {
                              searchData(value);
                            } else {
                              getData(pages);
                            }
                          }}
                          cancelHandler={() => {
                            getData({
                              current: 1,
                              pageSize: paginationSize,
                              total: 0,
                            });
                            setFieldValue("search", "");
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
                    {rowDto?.length > 0 ? (
                      <div className="table-card-styled employee-table-card tableOne  table-responsive ">
                        <PeopleDeskTable
                          columnData={userInfoDtoCol(
                            setOpen,
                            setSingelUser,
                            setIsCreate
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
                          isCheckBox={false}
                          isScrollAble={false}
                        />

                        {/* <AntTable
                          data={rowDto}
                          columnsData={userInfoDtoCol(
                            setOpen,
                            setSingelUser,
                            setIsCreate
                          )}
                          rowClassName="pointer"
                          rowKey={(item, index) => item?.strEmployeeCode}
                        /> */}
                      </div>
                    ) : (
                      <NoResult title="No Result Found" para="" />
                    )}
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}

              {/* addEdit form Modal */}
              <AddEditFormComponent
                show={open}
                title={"Create User"}
                onHide={handleClose}
                singelUser={singelUser}
                size="lg"
                backdrop="static"
                classes="default-modal"
                isCreate={isCreate}
                orgId={orgId}
                buId={buId}
                setRowDto={setRowDto}
                setAllData={setAllData}
                singleData={singleData}
                setSingleData={setSingleData}
                getData={getData}
                setFieldValue={setFieldValue}
                pages={pages}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default CreateUser;

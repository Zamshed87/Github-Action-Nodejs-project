import { useEffect } from "react";
import { useState } from "react";
import { Form, Formik } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import AntTable from "../../../common/AntTable";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import { allRequisitionList, trainingRequisitionColumn } from "./helper";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
const initData = {
  search: "",
};
const RequisitionLanding = () => {
  // hook
  const history = useHistory();
  const dispatch = useDispatch();

  // redux state
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30353) {
      permission = item;
    }
  });

  // state
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const getLandingData = () => {
    allRequisitionList(orgId, buId, setRowDto, setAllData, setLoading);
  };

  const searchData = (keywords) => {
    try {
      if (!keywords) {
        setRowDto(allData);
        return;
      }
      setLoading(true);
      const regex = new RegExp(keywords?.toLowerCase());
      const newData = allData?.filter(
        (item) =>
          regex.test(item?.strDepartment?.toLowerCase()) ||
          regex.test(item?.Designation?.toLowerCase()) ||
          regex.test(item?.DepartmentSection?.toLowerCase()) ||
          regex.test(item?.EmploymentType?.toLowerCase()) ||
          regex.test(item?.EmployeeName?.toLowerCase()) ||
          regex.test(item?.EmployeeCode?.toLowerCase())
      );

      setRowDto(newData);
      setLoading(false);
    } catch {
      setRowDto([]);
      setLoading(false);
    }
  };
  // useEffect

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Training & Development"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getLandingData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card">
                  <div className="table-card-heading mt-2 pt-1">
                    <div className="d-flex align-items-center"></div>
                    <div className="table-header-right d-none">
                      <ul className="d-flex flex-wrap">
                        {(isFilter || values?.search) && (
                          <li>
                            <ResetButton
                              classes="btn-filter-reset"
                              title="reset"
                              icon={
                                <SettingsBackupRestoreOutlined
                                  sx={{
                                    marginRight: "10px",
                                    fontSize: "16px",
                                  }}
                                />
                              }
                              onClick={() => {
                                setIsFilter(false);
                                getLandingData();
                                setFieldValue("search", "");
                              }}
                            />
                          </li>
                        )}
                        <li>
                          <MasterFilter
                            isHiddenFilter
                            inputWidth="200px"
                            width="200px"
                            value={values?.search}
                            setValue={(value) => {
                              setFieldValue("search", value);
                              searchData(value);
                            }}
                            cancelHandler={() => {
                              setFieldValue("search", "");
                              getLandingData();
                            }}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {rowDto?.length > 0 ? (
                        <>
                          <div className="table-card-styled employee-table-card tableOne mt-3">
                            <AntTable
                              data={rowDto}
                              columnsData={trainingRequisitionColumn(
                                "",
                                page,
                                paginationSize
                              )}
                              onRowClick={(item) => {
                                history.push({
                                  pathname: `/trainingAndDevelopment/training/requisition/view/${item?.intTrainingId}`,
                                  state: item,
                                });
                              }}
                              rowClassName="pointer"
                              setPage={setPage}
                              setPaginationSize={setPaginationSize}
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
};

export default RequisitionLanding;

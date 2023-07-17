import { useState } from "react";
import { Form, Formik } from "formik";

import AntTable from "../../../common/AntTable";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import { allAttendanceList, attendanceColumn } from "./helper";
import { useHistory } from "react-router";
import { shallowEqual, useSelector } from "react-redux";
import { useEffect } from "react";
import Loading from "../../../common/loading/Loading";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import ResetButton from "../../../common/ResetButton";
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
const initData = {
  search: "",
};
const TrainingAttendanceLanding = () => {
  const history = useHistory();
  const [rowDto, setRowDto] = useState([]);
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30354) {
      permission = item;
    }
  });
  const { orgId, buId } = useSelector(
    // const { orgId, buId, buName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [isFilter, setIsFilter] = useState(false);

  const getLandingData = () => {
    allAttendanceList(orgId, buId, setLoading, setRowDto, setAllData);
  };

  const searchData = (keywords) => {
    try {
      if (!keywords) {
        setRowDto(allData);
        return;
      }
      setLoading(true);
      const regex = new RegExp(keywords?.toLowerCase());
      let newData = rowDto?.filter(
        (item) =>
          regex.test(item?.strTrainingName?.toLowerCase()) ||
          regex.test(item?.strResourcePerson?.toLowerCase()) ||
          regex.test(item?.strVenue?.toLowerCase())
      );

      setRowDto(newData);
      setLoading(false);
    } catch {
      setRowDto(allData);
      setLoading(false);
    }
  };
  useEffect(() => {
    allAttendanceList(orgId, buId, setLoading, setRowDto, setAllData);
  }, [orgId, buId]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
        
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
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card">
                  <div className="table-card-heading ">
                    <div className="d-flex align-items-center"></div>
                    <div className="table-header-right">
                      <ul className="d-flex flex-wrap" style={{marginRight:"-7px"}}>
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
                          <div className="table-card-styled employee-table-card tableOne">
                            <AntTable
                              data={rowDto}
                              columnsData={attendanceColumn(
                                "",
                                page,
                                paginationSize
                              )}
                              onRowClick={(item) => {
                                // history.push(
                                //   `/trainingAndDevelopment/training/attendance/view/${item?.strTrainingCode}`
                                // );
                                history.push({
                                  pathname: `/trainingAndDevelopment/training/attendance/view/${item?.intTrainingId}`,
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

export default TrainingAttendanceLanding;

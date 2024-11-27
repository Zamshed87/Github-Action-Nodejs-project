import React from "react";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { Form, Formik } from "formik";
import Loading from "../../../../common/loading/Loading";
import { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
const initData = {};
const IndividualKpiResult = () => {
  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const individualKpiResultPermission = useMemo(
    () => permissionList.find((item) => item?.menuReferenceId === 30484),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
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
            {false && <Loading />}
            <Form onSubmit={handleSubmit} className="employeeProfile-form-main">
              <div className="employee-profile-main">
                {individualKpiResultPermission?.isView ? (
                  <div className="table-card">
                    <div className="table-card-heading">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="ml-2">Individual Kpi Result</div>
                      </div>
                      <ul className="d-flex flex-wrap">
                        <li>
                          <MasterFilter
                            inputWidth="250px"
                            width="250px"
                            isHiddenFilter
                            value={values?.searchString}
                            setValue={(value) => {
                              setFieldValue("searchString", value);
                              if (value) {
                              } else {
                              }
                            }}
                            cancelHandler={() => {
                              setFieldValue("searchString", "");
                            }}
                          />
                        </li>
                        <li className="pr-2 d-none">
                          {/* <PrimaryButton
                            type="button"
                            className="btn btn-default flex-center"
                            label="Bulk Employee"
                            icon={
                              <AddOutlined
                                sx={{
                                  marginRight: "0px",
                                  fontSize: "15px",
                                }}
                              />
                            }
                            onClick={() => {
                              if (employeeFeature?.isCreate) {
                                history.push("/profile/employee/bulk");
                              } else {
                                toast.warn("You don't have permission");
                              }
                            }}
                          /> */}
                        </li>
                      </ul>
                    </div>
                    <NoResult title={"Individual KPI Result"} para={""} />

                    {/* <div className="table-card-body">
                      {resEmpLanding.length > 0 ? (
                        <div className="table-card-styled employee-table-card tableOne">
                          <AntTable
                            data={resEmpLanding}
                            columnsData={empListColumn(orgId, history)}
                            setColumnsData={(newRow) => {
                              setTableRowDto(newRow);
                            }}
                            rowClassName="pointer"
                            onRowClick={(item) => {
                              history.push({
                                pathname: `/profile/employee/${item?.intEmployeeBasicInfoId}`,
                              });
                            }}
                            pages={empManegmentData?.pageSize}
                            pagination={empManegmentData}
                            handleTableChange={handleTableChange}
                            rowKey={(item) => item?.intEmployeeBasicInfoId}
                          />
                        </div>
                      ) : (
                        <>
                          {
                            <div className="col-12">
                              <NoResult title={"No Data Found"} para={""} />
                            </div>
                          }
                        </>
                      )}
                    </div> */}
                  </div>
                ) : (
                  <NotPermittedPage />
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default IndividualKpiResult;

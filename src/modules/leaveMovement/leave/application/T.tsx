import { APIUrl } from "App";
import {
  DataTable,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { Col, Form, Row } from "antd";
import withLeaveApplication from "common/HOCLeave/withLeaveApplication";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { yearDDLAction } from "utility/yearDDL";
import DemoImg from "../../../../assets/images/demo.png";
import { dateFormatter } from "utility/dateFormatter";
import TLeaveApplicationForm from "common/HOCLeave/component/TLeaveApplicationForm";
import LeaveBalanceTable from "common/HOCLeave/component/LeaveBalanceTable";
import NoResult from "common/NoResult";
import { gray500 } from "utility/customColor";
import Loading from "common/loading/Loading";

type TSelfLeaveApplication = any;
const TLeaveApplication: React.FC<TSelfLeaveApplication> = (props) => {
  const dispatch = useDispatch();

  // States
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Self Leave Application";
  }, []);
  const {
    allData,
    singleData,
    imageFile,
    leaveHistoryData,
    employeeInfo,
    isEdit,
    leaveTypeDDL,
    leaveBalanceData,
    loading,
    demoPopupForDelete,
    saveHandler,
    searchData,
    getData,
    setSingleData,
    setImageFile,
    setIsEdit,
    setLoading,
    setLeaveHistoryData,
    userName,
    initDataForLeaveApplication,
    employeeId,
    buId,
    wgId,
    permission,
    isOfficeAdmin,
    // demoPopupForDeleteAdmin,
    empMgmtLeaveApplicationDto,
    casualLvePunishment,
    medicalLvePunishment,
  } = props?.propjObj;
  // Form Instance
  const [form] = Form.useForm();

  // Life Cycle Hooks
  useEffect(() => {
    // const { empSearchType, date, employee } = form.getFieldsValue(true);
    // empSearchType && date && employee();
  }, [buId, wgId]);

  return (
    <PForm
      form={form}
      initialValues={{
        employee: {
          value: employeeInfo?.[0]?.EmployeeId || employeeId,
          label: employeeInfo?.[0]?.EmployeeName || userName,
        },
        year: moment().format("YYYY"),
        isSelfService: true,
      }}
    >
      {/* {loading && <Loading />} */}

      <PCard>
        <PCardHeader>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { employee } = form.getFieldsValue();
              return (
                <PSelect
                  name="year"
                  placeholder="Year"
                  options={yearDDLAction(5, 10) || []}
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      year: op,
                    });
                    getData(employee?.value, value);
                  }}
                  filterOption={false}
                />
              );
            }}
          </Form.Item>
        </PCardHeader>
        <Row gutter={[10, 2]} style={{ marginTop: "-5.7rem" }}>
          <div className="table-card">
            <div
              //   ref={scrollRef}
              className="table-card-heading pb-1 pr-0"
            >
              <div className="employeeInfo d-flex align-items-center  ml-lg-0 ml-md-4">
                {employeeInfo?.[0]?.strProfileImageUrl ? (
                  <img
                    src={
                      employeeInfo?.[0]?.strProfileImageUrl
                        ? `${APIUrl}/Document/DownloadFile?id=${employeeInfo?.[0]?.strProfileImageUrl}`
                        : DemoImg
                    }
                    alt="Profile"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={DemoImg}
                    alt="Profile"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
                <div className="employeeTitle ml-2 ">
                  <p className="employeeName">
                    {employeeInfo?.[0]?.EmployeeName
                      ? employeeInfo?.[0]?.EmployeeName
                      : ""}
                  </p>
                  <p className="employeePosition">
                    {employeeInfo?.[0]?.DesignationName
                      ? `${employeeInfo?.[0]?.DesignationName}, ${employeeInfo?.[0]?.EmployeeCode}`
                      : ""}
                    {employeeInfo?.[0]?.DesignationName
                      ? `, Joining Date:  ${dateFormatter(
                          employeeInfo?.[0]?.JoiningDate
                        )}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            <Row gutter={[10, 2]} className=" justify-content-center">
              <Col
                md={12}
                className="leave-movement-FormCard"
                style={{ marginTop: "-3.4rem" }}
              >
                <TLeaveApplicationForm
                  propsObj={{
                    saveHandler,
                    singleData,
                    initDataForLeaveApplication,
                    values: form.getFieldsValue(true),
                    homeReset: form.resetFields,
                    imageFile,
                    setImageFile,
                    setLeaveHistoryData,
                    isEdit,
                    setIsEdit,
                    setSingleData,
                    leaveTypeDDL: leaveTypeDDL?.filter(
                      (i: any) => i?.IsLveBalanceApplyForSelfService
                    ),
                    editPermission: permission?.isEdit,
                  }}
                />
              </Col>
              <Col
                md={12}
                className="leave-movement-FormCard"
                style={{ marginTop: "-4px" }}
              >
                <LeaveBalanceTable
                  leaveBalanceData={leaveBalanceData}
                  show={true}
                  values={form.getFieldsValue(true)}
                  casualLvePunishment={casualLvePunishment}
                  medicalLvePunishment={medicalLvePunishment}
                />
              </Col>
            </Row>
            <div className="row">
              <div className="col-md-12 my-3">
                <div className="table-card-body pl-lg-1 pl-md-3">
                  <div>
                    <div className="d-flex align-items-center justify-content-between">
                      <h2 style={{ color: gray500, fontSize: "14px" }}>
                        Leave List
                      </h2>
                      {/* <MasterFilter
                                isHiddenFilter
                                styles={{
                                  marginRight: "0px",
                                }}
                                width="200px"
                                inputWidth="200px"
                                value={values?.search}
                                setValue={(value) => {
                                  searchData(
                                    value,
                                    allData,
                                    setLeaveHistoryData
                                  );
                                  setFieldValue("search", value);
                                }}
                                cancelHandler={() => {
                                  getData();
                                  setFieldValue("search", "");
                                }}
                                handleClick={handleClick}
                              /> */}
                      <PInput
                        // label="Reason"
                        name={"search"}
                        type="text"
                        placeholder="search"
                        onChange={(e: any) => {
                          searchData(
                            e.target.value,
                            allData,
                            setLeaveHistoryData
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className=" table-responsive mt-2"
                    style={{ height: "190px" }}
                  >
                    {leaveHistoryData?.length > 0 ? (
                      <DataTable
                        header={empMgmtLeaveApplicationDto(
                          dispatch,
                          setIsEdit,
                          setSingleData,
                          setImageFile,
                          demoPopupForDelete,
                          form.getFieldsValue(true),
                          isOfficeAdmin
                        )}
                        data={
                          leaveHistoryData?.length > 0 ? leaveHistoryData : []
                        }
                      />
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
            </div>
          </div>
          {/* </>
              );
            }}
          </Form.Item> */}

          <Col
            style={{
              marginTop: "23px",
            }}
          ></Col>
        </Row>
      </PCard>
    </PForm>
  );
};
export default withLeaveApplication(TLeaveApplication);

import { PCard, PForm } from "Components";
import { Col, Form, Row } from "antd";
import withLeaveApplication from "common/HOCLeave/withLeaveApplication";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CommonView } from "common/HOCLeave/component/CommonView";

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
    singleData,
    imageFile,
    leaveHistoryData,
    employeeInfo,
    isEdit,
    leaveTypeDDL,
    leaveBalanceData,
    saveHandler,
    getData,
    setSingleData,
    setImageFile,
    setIsEdit,
    setLeaveHistoryData,
    userName,
    employeeId,
    buId,
    wgId,
    isOfficeAdmin,
    // demoPopupForDeleteAdmin,
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
        <Row gutter={[10, 2]} style={{ marginTop: "-3rem" }}>
          {/* <div className="table-card">
            <LeaveCommonHeader employeeInfo={employeeInfo} />

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

                    values: form.getFieldsValue(true),
                    imageFile,
                    setImageFile,

                    isEdit,
                    leaveTypeDDL,
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
                  // show={true}
                  values={form.getFieldsValue(true)}
                  casualLvePunishment={casualLvePunishment}
                  medicalLvePunishment={medicalLvePunishment}
                />
              </Col>
            </Row>
            <Row gutter={[10, 2]}>
              <Col md={24}>
                <LeaveApp_History
                  empId={form.getFieldValue("employee")?.value}
                  setLeaveHistoryData={setLeaveHistoryData}
                  leaveHistoryData={leaveHistoryData}
                  setIsEdit={setIsEdit}
                  setSingleData={setSingleData}
                  setImageFile={setImageFile}
                  allFormValues={form.getFieldsValue(true)}
                  isOfficeAdmin={isOfficeAdmin}
                  landingData={() => {
                    getData(form.getFieldValue("employee")?.value);
                  }}
                />
              </Col>
            </Row>
          </div> */}
          <CommonView
            employeeInfo={employeeInfo}
            saveHandler={saveHandler}
            singleData={singleData}
            form={form}
            imageFile={imageFile}
            setImageFile={setImageFile}
            isEdit={isEdit}
            leaveTypeDDL={leaveTypeDDL}
            leaveBalanceData={leaveBalanceData}
            medicalLvePunishment={medicalLvePunishment}
            casualLvePunishment={casualLvePunishment}
            setLeaveHistoryData={setLeaveHistoryData}
            leaveHistoryData={leaveHistoryData}
            setSingleData={setSingleData}
            setIsEdit={setIsEdit}
            isOfficeAdmin={isOfficeAdmin}
            getData={getData}
          />
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

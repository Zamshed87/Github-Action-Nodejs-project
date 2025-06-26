import { PButton, PCard, PCardHeader, PForm } from "Components";
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
    casualLvePunishment,
    medicalLvePunishment,
    historyBalanceData,

    showHistoryBalanceData,
    setShowHistoryBalanceData,
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
              // const { employee, year } = form.getFieldsValue();
              return (
                <Row gutter={[10, 2]}>
                  <Col xs={8}>
                    <PButton
                      type="primary"
                      action="button"
                      content="Balance History"
                      onClick={() => {
                        setShowHistoryBalanceData(true);
                      }}
                    />
                  </Col>
                </Row>
              );
            }}
          </Form.Item>
        </PCardHeader>
        <Row gutter={[10, 2]} style={{ marginTop: "-5.4rem" }}>
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
            historyBalanceData={historyBalanceData}
            showHistoryBalanceData={showHistoryBalanceData}
            setShowHistoryBalanceData={setShowHistoryBalanceData}
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
export default withLeaveApplication(TLeaveApplication, false);

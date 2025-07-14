import React from "react";
import { LeaveCommonHeader } from "./Header";
import { Col, Row } from "antd";
import TLeaveApplicationForm from "./TLeaveApplicationForm";
import LeaveBalanceTable from "./LeaveBalanceTable";
import { LeaveApp_History } from "./LeaveHistory";
import { PModal } from "Components/Modal";

export const CommonView = ({
  employeeInfo,
  saveHandler,
  singleData,
  form,
  imageFile,
  setImageFile,

  isEdit,
  leaveTypeDDL,
  leaveBalanceData,
  medicalLvePunishment,
  casualLvePunishment,
  setLeaveHistoryData,
  leaveHistoryData,
  setSingleData,
  setIsEdit,
  isOfficeAdmin,
  getData,
  loadingForInfo,
  progress,
  historyBalanceData,
  showHistoryBalanceData,
  setShowHistoryBalanceData,
}: any) => {
  return (
    <div className="table-card">
      <LeaveCommonHeader
        employeeInfo={employeeInfo}
        loadingForInfo={loadingForInfo}
        progress={progress}
      />

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
      {showHistoryBalanceData && (
        <PModal
          open={showHistoryBalanceData}
          title={"History Balance Data"}
          width=""
          onCancel={() => {
            setShowHistoryBalanceData(false);
          }}
          maskClosable={false}
          components={
            <>
              <LeaveBalanceTable
                leaveBalanceData={historyBalanceData}
                isHistory={true}
                values={form.getFieldsValue(true)}
              />
            </>
          }
        />
      )}
    </div>
  );
};

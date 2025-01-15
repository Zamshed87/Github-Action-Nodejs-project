import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Spin, Modal } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "./index.css";
import { shallowEqual, useSelector } from "react-redux";
import {
  columnIncrement,
  columnOvertime,
  columnsAdvancedSalary,
  columnsBonusGenerate,
  columnsDefault,
  columnsExpense,
  columnsIOU,
  columnsIOUAdjustment,
  columnsLeave,
  columnsLoan,
  columnsLocationDevice,
  columnsManual,
  columnsMarketVisit,
  columnsMasterLocation,
  columnsMovement,
  columnsRemoteAttendance,
  columnsSalaryCertificate,
  columnsSalaryIncrement,
  columnsSeparation,
} from "./utils";
import { fetchPendingApprovals } from "./helper";
import { DataTable } from "Components";
import { useLocation } from "react-router";
import { Title } from "@mui/icons-material";
import ApproveRejectComp from "common/ApproveRejectComp";
import BackButton from "common/BackButton";

const CommonApprovalComponent = () => {
  const location = useLocation();
  const state = location.state;
  const id = state?.state?.applicationTypeId;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedRow, setSelectedRow] = useState([]);

  const { orgId, employeeId, wId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    fetchPendingApprovals({
      id,
      setLoading,
      orgId,
      buId,
      wgId,
      wId,
      employeeId,
      setData,
    });
  }, [id]);

  const handleApproveReject = async (isApprove) => {
    const payload = selectedRow.map((key) => {
      const row = data.find((item) => item.id === key?.key);
      return {
        configHeaderId: row.configHeaderId,
        approvalTransactionId: row.id,
        applicationId: row.applicationId,
        isApprove,
        isReject: !isApprove,
        actionBy: employeeId,
      };
    });

    try {
      await axios.post(`/Approval/ApproveApplications`, payload);
      toast.success(
        `Applications ${isApprove ? "approved" : "rejected"} successfully.`
      );
      fetchPendingApprovals({
        id,
        setLoading,
        orgId,
        buId,
        wgId,
        wId,
        employeeId,
        setData,
      });
      setSelectedRow([]);
    } catch (error) {
      toast.error("Failed to process approvals.");
    }
  };

  const showConfirmationModal = (action) => {
    setModalAction(action);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    handleApproveReject(modalAction === "approve");
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setModalAction(null);
  };

  return (
    <div className="approval-container mt-4">
      <div className="d-flex align-items-center">
        <BackButton title={`${state?.state?.applicationType} Approval`} />
        {selectedRow?.length > 0 ? (
          <ApproveRejectComp
            props={{
              className: "ml-3",
              onApprove: () => {
                showConfirmationModal("approve");
              },
              onReject: () => {
                showConfirmationModal("reject");
              },
            }}
          />
        ) : null}
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <DataTable
          scroll={{ x: 1500 }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRow.map((item) => item.key),
            preserveSelectedRowKeys: true,
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRow(selectedRows);
            },
          }}
          header={
            id == 8
              ? columnsLeave
              : id == 15
              ? columnOvertime
              : id == 4
              ? columnIncrement
              : id == 11
              ? columnsManual
              : id == 14
              ? columnsMovement
              : id == 21
              ? columnsSeparation
              : id == 26
              ? columnsAdvancedSalary
              : id == 3
              ? columnsExpense
              : id == 6
              ? columnsIOU
              : id == 9
              ? columnsLoan
              : id == 12
              ? columnsMarketVisit
              : id == 13
              ? columnsMasterLocation
              : id == 17
              ? columnsRemoteAttendance
              : id == 10
              ? columnsLocationDevice
              : id == 5
              ? columnsSalaryIncrement
              : id == 19
              ? columnsSalaryCertificate
              : id == 2
              ? columnsBonusGenerate
              : id == 7
              ? columnsIOUAdjustment
              : columnsDefault
          }
          bordered
          data={data.map((item) => ({ ...item, key: item.id }))}
        />
      )}
      <Modal
        title="Confirmation"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to {modalAction} the selected applications?</p>
      </Modal>
    </div>
  );
};

export default CommonApprovalComponent;

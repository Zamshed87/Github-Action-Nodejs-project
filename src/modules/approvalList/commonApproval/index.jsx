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
import { useParams } from "react-router-dom";
import { DataTable } from "Components";

const CommonApprovalComponent = () => {
  const { id } = useParams();
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
      <div
        className="action-buttons"
        style={{ marginBottom: "16px", display: "flex", gap: "8px" }}
      >
        <Button
          size="small"
          style={{
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
          onClick={() => window.history.back()}
          icon={<ArrowLeftOutlined />}
        >
          Back
        </Button>
        <Button
          size="small"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
          onClick={() => showConfirmationModal("approve")}
          disabled={selectedRow.length === 0}
          icon={<CheckOutlined />}
        >
          Approve
        </Button>
        <Button
          size="small"
          style={{
            backgroundColor: "#F44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
          onClick={() => showConfirmationModal("reject")}
          disabled={selectedRow.length === 0}
          icon={<CloseOutlined />}
        >
          Reject
        </Button>
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

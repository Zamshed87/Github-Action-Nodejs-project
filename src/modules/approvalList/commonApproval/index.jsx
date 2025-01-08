import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Spin, Table, Modal } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "./index.css";
import { shallowEqual, useSelector } from "react-redux";
import { columnsLeave } from "./utils";
import { fetchPendingApprovals } from "./helper";
import { useParams } from "react-router-dom";

const CommonApprovalComponent = () => {
  const {id} = useParams();
  console.log("id", id);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState(null);

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
    const payload = selectedRowKeys.map((key) => {
      const row = data.find((item) => item.id === key);
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
      setSelectedRowKeys([]);
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
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
          disabled={selectedRowKeys.length === 0}
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
          disabled={selectedRowKeys.length === 0}
          icon={<CloseOutlined />}
        >
          Reject
        </Button>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          rowKey="id"
          rowSelection={rowSelection}
          columns={columnsLeave}
          dataSource={data}
          pagination={{ pageSize: 10 }}
          scroll={{ x: "max-content" }}
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

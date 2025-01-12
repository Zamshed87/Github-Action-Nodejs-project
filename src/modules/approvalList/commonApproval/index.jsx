import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Spin, Table, Modal } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

import "./index.css";
import { shallowEqual, useSelector } from "react-redux";

const CommonApprovalComponent = ({ applicationTypeId }) => {
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
    fetchPendingApprovals(applicationTypeId);
  }, [applicationTypeId]);

  const fetchPendingApprovals = async (applicationTypeId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/Approval/GetAllPendingApplicationsForApproval`,
        {
          params: {
            accountId: orgId,
            businessUnitId: buId,
            workplaceGroupId: wgId,
            workplaceId: wId,
            applicationTypeId: 8,
            employeeId: employeeId,
          },
        }
      );
      setData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("Failed to fetch approvals.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (isApprove) => {
    const payload = selectedRowKeys.map((key) => {
      const row = data.find((item) => item.id === key);
      return {
        configHeaderId: row.configHeaderId,
        approvalTransactionId: row.id,
        applicationId: row.applicationId,
        isApprove,
        isReject: !isApprove,
        actionBy: employeeId, // Replace with actual user ID
      };
    });

    try {
      await axios.post(`/Approval/ApproveApplications`, payload);
      toast.success(
        `Applications ${isApprove ? "approved" : "rejected"} successfully.`
      );
      fetchPendingApprovals(applicationTypeId);
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

  const columns = [
    {
      title: "Employee Name",
      dataIndex: ["applicationInformation", "employeeName"],
      key: "employeeName",
    },
    {
      title: "Designation",
      dataIndex: ["applicationInformation", "designation"],
      key: "designation",
    },
    {
      title: "Department",
      dataIndex: ["applicationInformation", "department"],
      key: "department",
    },
    {
      title: "Application Date",
      dataIndex: ["applicationInformation", "applicationDate"],
      key: "applicationDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "From Date",
      dataIndex: ["applicationInformation", "fromDate"],
      key: "fromDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "To Date",
      dataIndex: ["applicationInformation", "toDate"],
      key: "toDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: ["applicationInformation", "status"],
      key: "status",
    },
  ];

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
          style={{ backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px" }}
          onClick={() => showConfirmationModal("approve")}
          disabled={selectedRowKeys.length === 0}
          icon={<CheckOutlined />}
        >
          Approve
        </Button>
        <Button
          size="small"
          style={{ backgroundColor: "#F44336", color: "white", border: "none", borderRadius: "4px" }}
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
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
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

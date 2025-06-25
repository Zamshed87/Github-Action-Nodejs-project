// components/AlertModal.tsx
import { Modal, Button } from "antd";
import React from "react";
import "./AlertModal.css";

export interface AlertModalProps {
  visible: boolean;
  type?: "info" | "success" | "error" | "warning";
  title?: string;
  content?: React.ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  width?: number;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  type = "info",
  title = "Are you sure?",
  content = "This action cannot be undone.",
  okText = "Yes",
  cancelText = "No",
  onOk,
  onCancel,
  loading = false,
  width = 350,
}) => {
  return (
    <Modal
      width={width}
      className={`alert-modal alert-modal-${type}`}
      title={
        <span className="alert-modal-title">
          <span className={`alert-modal-icon alert-modal-icon-${type}`} />
          {title}
        </span>
      }
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      footer={[
        <Button
          key="cancel"
          className="alert-modal-cancel-btn"
          onClick={onCancel}
        >
          {cancelText}
        </Button>,
        <Button
          key="ok"
          className={`alert-modal-ok-btn alert-modal-ok-btn-${type}`}
          onClick={onOk}
          loading={loading}
        >
          {okText}
        </Button>,
      ]}
      centered
    >
      <div className="alert-modal-content">{content}</div>
    </Modal>
  );
};

export default AlertModal;

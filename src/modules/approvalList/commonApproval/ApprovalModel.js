import React from "react";
import { Modal } from "antd";
import { Box } from "@mui/material";

const ApprovalModel = ({
  isModalVisible,
  handleModalOk,
  handleModalCancel,
  modalAction,
}) => {
  return (
    <Modal
      title="Confirmation"
      open={isModalVisible}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      okText="Yes"
      cancelText="No"
      centered
      style={{ borderRadius: "12px", overflow: "hidden" }}
      bodyStyle={{
        padding: "12px",
        fontSize: "14px",
        fontFamily: "'Poppins', sans-serif",
        color: "#444",
      }}
      okButtonProps={{
        style: {
          background:
            "linear-gradient(135deg, rgb(67 225 4), var(--primary-color))",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          color: "white",
        },
      }}
      cancelButtonProps={{
        style: {
          borderRadius: "8px",
          fontWeight: "bold",
          color: "var(--primary-color)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "5px",
        }}
      >
        Are you sure you want to {modalAction} the selected applications?
      </Box>
    </Modal>
  );
};

export default ApprovalModel;

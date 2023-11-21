import React from "react";
import { Modal, ModalProps } from "antd";
import { PButton, buttonType } from "Components/Button/PButton";
import "./style.scss";
type TModalType = {
  components: React.ReactNode;
  footerButtons?: {
    type: buttonType;
    content: string;
    onClick: () => void;
  }[];
};
type PModalType = TModalType & ModalProps;
export const PModal: React.FC<PModalType> = (property) => {
  const { components, wrapClassName, width } = property;

  return (
    <Modal
      {...property}
      wrapClassName={`peopleDeskModalWrapper ${
        wrapClassName ? wrapClassName : ""
      }`}
      footer={null}
      width={width || 800}
      destroyOnClose
    >
      {components}
    </Modal>
  );
};

type modalFooterType = {
  submitText?: string | boolean;
  cancelText?: string | boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitAction?: "submit" | "button";
};
export const ModalFooter: React.FC<modalFooterType> = ({
  cancelText,
  submitText,
  onSubmit,
  onCancel,
  submitAction,
}) => {
  const hideSubmitButton = submitText === false;
  const submitButtonText =
    typeof submitText === "string" ? submitText : "Submit";

  const hideCancelButton = submitText === false;
  const cancelButtonText =
    typeof cancelText === "string" ? cancelText : "Cancel";
  return (
    <div className="ant-modal-footer modal_footer_button_list">
      {!hideCancelButton ? (
        <PButton
          type="secondary"
          content={cancelButtonText}
          onClick={onCancel}
        />
      ) : undefined}
      {!hideSubmitButton ? (
        <PButton
          type="primary"
          content={submitButtonText}
          onClick={onSubmit}
          action={submitAction}
        />
      ) : undefined}
    </div>
  );
};

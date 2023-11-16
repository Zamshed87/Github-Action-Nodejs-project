import React from "react";
import { Modal, ModalProps } from "antd";
import { PButton, buttonType } from "Components/Button/PButton";
import "./style.scss";
type TModalType = {
  components: React.ReactNode | JSX.Element;
  footerButtons?: {
    type: buttonType;
    content: string;
    onClick: () => void;
  }[];
};
type PModalType = ModalProps & TModalType;
export const PModal: React.FC<PModalType> = (property) => {
  const { components, wrapClassName } = property;

  return (
    <Modal
      {...property}
      wrapClassName={`peopleDeskModalWrapper ${
        wrapClassName ? wrapClassName : ""
      }`}
      footer={null}
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
};
export const ModalFooter: React.FC<modalFooterType> = ({
  cancelText,
  submitText,
  onSubmit,
  onCancel,
}) => {
  const hideSubmitButton = submitText === false;
  const submitButtonText =
    typeof submitText === "string" ? submitText : "Submit";

  const hideCancelButton = submitText === false;
  const cancelButtonText =
    typeof cancelText === "string" ? cancelText : "Submit";
  return (
    <div className="modal_footer_button_list">
      {!hideCancelButton ? (
        <PButton
          type="secondary"
          content={cancelButtonText}
          onClick={onSubmit}
        />
      ) : undefined}
      {!hideSubmitButton ? (
        <PButton type="primary" content={submitButtonText} onClick={onCancel} />
      ) : undefined}
    </div>
  );
};

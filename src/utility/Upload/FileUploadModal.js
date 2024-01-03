/* eslint-disable no-unused-vars */
import React from "react";
import { Button, Modal, Upload } from "antd";
import { APIUrl } from "../../App";
import { toast } from "react-toastify";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getDownlloadFileView_Action } from "../../commonRedux/auth/actions";
import { UploadOutlined } from "@ant-design/icons";

const UploadModal = ({ propsObj, children }) => {
  const {
    isOpen,
    setIsOpen,
    height,
    width,
    destroyOnClose,
    backdrop,
    setAttachmentList,
    label,
    attachmentList,
    listType,
    onPreview,
    defaultFileList,
    maxCount,
    isHidden,
    fileList,
    isMargin,
    className,
    accept,
    accountId,
    tableReferrence,
    documentTypeId,
    buId,
    userId,
  } = propsObj;
  const { tokenData } = useSelector((state) => state?.auth, shallowEqual);
  let dispatch = useDispatch();
  const handleCancel = () => {
    setIsOpen(false);
  };

  const props = {
    name: "files",
    action: `${APIUrl}/Document/UploadFile?accountId=${accountId}&tableReferrence=${tableReferrence}&documentTypeId=${documentTypeId}&businessUnitId=${buId}&createdBy=${userId}`,
    headers: {
      authorization: `Bearer ${tokenData}`,
    },
    accept:
      accept ||
      "image/png, image/jpeg, image/jpg, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    onChange(info) {
      if (info.file.status === "uploading") {
        setAttachmentList(info.fileList);
      } else if (info.file.status === "done") {
        setAttachmentList(info.fileList);
        toast.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        toast.error(`${info.file.name} file upload failed.`);
      }
    },

    onRemove: (removedItem) => {
      const newAttachment = attachmentList?.filter(
        (item) => item?.uid !== removedItem?.uid
      );
      setAttachmentList(newAttachment);
    },
    listType: listType || "picture",
    onPreview: (file) => {
      if (file?.response) {
        dispatch(
          getDownlloadFileView_Action(file?.response?.[0]?.globalFileUrlId)
        );
        return;
      }
    },
    defaultFileList,
    maxCount: maxCount ? maxCount : 5,
    disabled: isHidden,
    fileList: attachmentList,
  };
  return (
    <Modal
      width={width || 400}
      title="Upload Attachment"
      open={isOpen}
      onCancel={handleCancel}
      bodyStyle={{
        height: height || "50vh",
        overflow: "scroll",
      }}
      footer={null}
      destroyOnClose={destroyOnClose}
      maskClosable={backdrop ? backdrop : false}
    >
      <Upload {...props}>
        <Button
          style={{ color: "green", border: "green 1px solid" }}
          icon={<UploadOutlined />}
        >
          Upload
        </Button>
      </Upload>
      <>
        {/* {imageId ? (
          <div style={{ border: "1px solid #cccccc61" }}>
            <div></div>
            <div>
              <img
                src={`${APIUrl}/Document/DownloadFile?id=${imageId}`}
                alt=""
                style={{ width: "100%" }}
              />
            </div>
          </div>
        ) : null} */}
      </>
    </Modal>
  );
};

export default UploadModal;

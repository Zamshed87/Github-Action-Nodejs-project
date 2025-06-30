import React from "react";
import { Button, Upload } from "antd";
import { APIUrl } from "../../App";
import { toast } from "react-toastify";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getDownlloadFileView_Action } from "../../commonRedux/auth/actions";
import { UploadOutlined } from "@ant-design/icons";
import { LightTooltip } from "common/LightTooltip";
import { InfoOutlined } from "@mui/icons-material";
import { failColor, gray900 } from "utility/customColor";

const FileUploadComponents = ({ propsObj }) => {
  const {
    title = "",
    setAttachmentList,
    attachmentList,
    listType,
    defaultFileList,
    maxCount,
    isHidden,
    accept,
    accountId,
    tableReferrence,
    documentTypeId,
    buId,
    userId,
    makeApiReq = true,
    isIcon = false,
    subText = "",
    isErrorInfo = false,
  } = propsObj;
  const { tokenData } = useSelector((state) => state?.auth, shallowEqual);
  const dispatch = useDispatch();
  let apiAction = {};
  if (makeApiReq) {
    apiAction = {
      action: `${APIUrl}/Document/UploadFile?accountId=${accountId}&tableReferrence=${tableReferrence}&documentTypeId=${documentTypeId}&businessUnitId=${buId}&createdBy=${userId}`,
      headers: {
        authorization: `Bearer ${tokenData}`,
      },
    };
  } else {
    apiAction = {
      customRequest: () => {},
    };
  }
  const props = {
    name: "files",
    ...apiAction,
    accept:
      accept ||
      "image/png, image/jpeg, image/jpg, application/pdf, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    onChange(info) {
      if (!makeApiReq) {
        const update = info.fileList?.map((item) => ({
          ...item,
          status: "done",
        }));
        setAttachmentList(update);
      }
      if (makeApiReq) {
        if (info.file.status === "uploading") {
          setAttachmentList(info.fileList);
        } else if (info.file.status === "done") {
          setAttachmentList(info.fileList);
          toast.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
          toast.error(`${info.file.name} file upload failed.`);
        }
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
      if (file?.response && makeApiReq) {
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
    <Upload {...props}>
      <Button
        style={{ color: "green", border: "green 1px solid" }}
        icon={<UploadOutlined />}
      >
        {title ? title : "Upload Attachment"}
      </Button>
      {isIcon ? (
        <LightTooltip title={subText} arrow>
          {" "}
          <InfoOutlined
            sx={{
              color: isErrorInfo ? failColor : gray900,
              width: 16,
              cursor: "pointer",
            }}
          />
        </LightTooltip>
      ) : subText ? (
        <sub style={{ margin: "0.5rem", color: "red" }}>({subText})</sub>
      ) : null}
    </Upload>
  );
};

export default FileUploadComponents;

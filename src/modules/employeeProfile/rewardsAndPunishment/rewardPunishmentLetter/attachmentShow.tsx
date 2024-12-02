import { VisibilityOutlined } from "@mui/icons-material";
import { Col, Tooltip } from "antd";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { Flex } from "Components";
import React from "react";
import { useDispatch } from "react-redux";

const AttachmentShow = ({ recordData }: any) => {
  const dispatch = useDispatch();

  return (
    <Flex
      justify="space-between"
      justify-content="space-between"
      style={{ marginTop: "18px", marginLeft: "10px" }}
    >
      {recordData?.issueAttachment && (
        <div style={{ display: "flex" }}>
          <p>Issue Attachment</p>

          <Tooltip title="Attachment View">
            {/* <button type="button" className="iconButton"> */}
            <VisibilityOutlined
              style={{ cursor: "pointer", marginLeft: "10px" }}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  getDownlloadFileView_Action(recordData?.issueAttachment)
                );
              }}
            />
            {/* </button> */}
          </Tooltip>
        </div>
      )}
      {recordData?.explanationAttachment && (
        <div style={{ marginLeft: "50px", display: "flex" }}>
          <p>Explanation Attachment</p>

          <Tooltip title="Attachment View">
            {/* <button type="button" className="iconButton"> */}
            <VisibilityOutlined
              style={{ cursor: "pointer", marginLeft: "10px" }}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  getDownlloadFileView_Action(recordData?.explanationAttachment)
                );
              }}
            />
            {/* </button> */}
          </Tooltip>
        </div>
      )}
    </Flex>
  );
};

export default AttachmentShow;

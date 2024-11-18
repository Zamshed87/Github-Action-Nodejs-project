import { VisibilityOutlined } from "@mui/icons-material";
import { Card, Typography, Divider, Tooltip } from "antd";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { useDispatch } from "react-redux";

const { Text, Title } = Typography;

const TemplateView = ({ singleData }: any) => {
  const dispatch = useDispatch();
  return (
    <Card
      style={{
        maxWidth: 800,
        margin: "20px auto",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Title level={4} style={{ textAlign: "center" }}>
        Letter Details
      </Title>
      <Divider />

      <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
        <div>
          <Text strong>Issued Type:</Text>{" "}
          <Text>{singleData?.issueTypeName || "N/A"}</Text>
        </div>
        <div>
          <Text strong>Letter Name:</Text>{" "}
          <Text>{singleData?.letterName || "N/A"}</Text>
        </div>
        <div>
          <Text strong>Letter Type:</Text>{" "}
          <Text>{singleData?.letterType || "N/A"}</Text>
        </div>
        <div>
          <Text strong>Issued To:</Text>{" "}
          <Text>{singleData?.issueForEmployeeName || "N/A"}</Text>
        </div>
        <div>
          <Text strong>Issued By:</Text>{" "}
          <Text>{singleData?.issueByEmployeeName || "N/A"}</Text>
        </div>
        {singleData?.issueAttachment && (
          <div style={{ display: "flex", marginTop: "10px" }}>
            <p>Issue Attachment</p>

            <Tooltip title="Attachment View">
              {/* <button type="button" className="iconButton"> */}
              <VisibilityOutlined
                style={{
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(
                    getDownlloadFileView_Action(singleData?.issueAttachment)
                  );
                }}
              />
              {/* </button> */}
            </Tooltip>
          </div>
        )}
      </div>
      {singleData?.isExplanation && (
        <>
          <Divider />
          <Title level={5}>Explanation Details</Title>
          <div>
            <Text strong>Explanation:</Text>{" "}
            <Text>{singleData?.explanation || "N/A"}</Text>
            {singleData?.explanationAttachment && (
              <div style={{ display: "flex", marginTop: "10px" }}>
                <p>Explanation Attachment</p>

                <Tooltip title="Attachment View">
                  {/* <button type="button" className="iconButton"> */}
                  <VisibilityOutlined
                    style={{
                      cursor: "pointer",
                      marginLeft: "10px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        getDownlloadFileView_Action(
                          singleData?.explanationAttachment
                        )
                      );
                    }}
                  />
                  {/* </button> */}
                </Tooltip>
              </div>
            )}
          </div>
        </>
      )}
      {singleData?.actionId && (
        <>
          <Divider />
          <Title level={5}>Actions Details</Title>
          <div>
            <Text strong>Actions:</Text>{" "}
            <Text>{singleData?.actionName || "N/A"}</Text>
          </div>
        </>
      )}

      <Divider />

      <Title level={5}>Letter Template</Title>
      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: "4px",
          padding: "12px",
          backgroundColor: "#fafafa",
          maxHeight: "300px",
          overflowY: "auto",
        }}
        dangerouslySetInnerHTML={{
          __html: singleData?.letterBody || "<p>No content available</p>",
        }}
      />
    </Card>
  );
};

export default TemplateView;

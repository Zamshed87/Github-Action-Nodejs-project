import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  InfoOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import React from "react";
import { TableButtonType, buttonList, buttonType } from "./types";
import { Popconfirm, Tooltip } from "antd";

export const TableButton: React.FC<TableButtonType> = (property) => {
  const { parentStyle, buttonsList } = property;

  const btnList: Record<buttonType, JSX.Element> = {
    edit: <EditOutlined />,
    delete: <DeleteOutlined />,
    view: <EyeOutlined />,
    info: <InfoOutlined />,
    plus: <PlusOutlined />,
  };

  const renderButton = (type: buttonType) => {
    return btnList[type];
  };

  return (
    <div
      className="PTableButton"
      style={parentStyle ? parentStyle : undefined}
      onClick={(e: any) => e.stopPropagation()}
    >
      {buttonsList?.map((button: buttonList, index: number) => {
        // Checking isActive is not false
        return (button?.isActive === undefined || button?.isActive) &&
          button.type ? (
          // Tooltip is used to show the prompt on hover

          <Tooltip
            title={
              button.prompt ||
              `${button.type[0].toUpperCase()}${button.type.slice(1)}`
            }
            overlayInnerStyle={{
              fontSize: "10px",
              minHeight: "20px",
              maxHeight: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6px",
            }}
            placement="bottom"
            key={index}
          >
            {/* Confirmation for Delete Icon */}
            {button.type === "delete" ? (
              <span>
                <Popconfirm
                  title="Do you really want to delete these record?"
                  okText="Delete"
                  icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                  okType="danger"
                  onConfirm={button?.onClick}
                  placement="topRight"
                  overlayClassName="table_delete_popover"
                >
                  {renderButton(button.type)}
                </Popconfirm>
              </span>
            ) : (
              // Span Tag is used for click event
              <span onClick={button?.onClick}>{renderButton(button.type)}</span>
            )}
          </Tooltip>
        ) : undefined;
      })}
    </div>
  );
};

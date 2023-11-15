import React from "react";
import "../style.scss";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { PInput } from "Components/PForm";
import { PButton, buttonType } from "Components/Button/PButton";
type PCardHeaderType = {
  title?: string | React.ReactNode;
  exportIcon?: boolean | React.ReactNode;
  backButton?: boolean | string;
  onSearch?: (value: string) => void;
  buttonList?: Array<{
    content: string;
    type: buttonType;
    onClick?: () => void;
    icon?: React.ReactNode | "plus";
  }>;
};
export const PCardHeader: React.FC<PCardHeaderType> = (props) => {
  const { title, exportIcon, backButton, onSearch, buttonList } = props;

  const isShowExportIcon = typeof exportIcon === "boolean" && exportIcon;
  const history = useHistory();
  return (
    <div className="people_desk_cardHeader">
      <div className="header_left">
        {/* Back Button */}
        {backButton ? (
          <div
            className="back_button"
            onClick={() => {
              typeof backButton === "string"
                ? history.push(backButton)
                : history.goBack();
            }}
          >
            <ArrowLeftOutlined />
          </div>
        ) : undefined}
        {/*Default Export Icon  */}
        {isShowExportIcon ? (
          <div className="export_icon">
            <DownloadOutlined />
          </div>
        ) : undefined}

        {title ? <div className="title">{title}</div> : undefined}
      </div>
      <div className="header_right">
        {/* Search Input */}
        {onSearch ? (
          <PInput
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={onSearch}
            onPressEnter={onSearch}
          />
        ) : undefined}
        {/* Button List */}
        {buttonList
          ? buttonList.map((button, index) => (
              <PButton
                key={index}
                content={button.content}
                type={button.type}
                onClick={button.onClick}
                icon={button.icon === "plus" ? <PlusOutlined /> : button.icon}
              />
            ))
          : undefined}
      </div>
    </div>
  );
};

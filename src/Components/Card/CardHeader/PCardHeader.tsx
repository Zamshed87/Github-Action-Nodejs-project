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
import { debounce } from "lodash";
type PCardHeaderType = {
  title?: string | React.ReactNode;
  text?: string | React.ReactNode;
  exportIcon?: boolean | React.ReactNode;
  onExport?: (e: any) => void;
  backButton?: boolean | string;
  onSearch?: (e: any) => void;
  submitText?: string;
  submitIcon?: React.ReactNode;
  buttonList?: Array<{
    content: string;
    type: buttonType;
    onClick?: () => void;
    disabled?: boolean;
    icon?: React.ReactNode | "plus";
  }>;
};
export const PCardHeader: React.FC<PCardHeaderType> = (props) => {
  const {
    title,
    text,
    exportIcon,
    onExport,
    backButton,
    onSearch,
    submitText,
    submitIcon,
    buttonList,
  } = props;

  const isShowExportIcon = typeof exportIcon === "boolean" && exportIcon;
  const history = useHistory();

  // for search
  // for search
  const debouncedOnSearch = onSearch ? debounce(onSearch, 300) : undefined;
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
          <div className="export_icon" onClick={onExport}>
            <DownloadOutlined />
          </div>
        ) : undefined}

        {title ? <div className="title">{title}</div> : undefined}
        {text ? <div className="text">{text}</div> : undefined}
      </div>
      <div className="header_right">
        {/* Search Input */}
        {onSearch ? (
          <PInput
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={debouncedOnSearch}
            type="text"
            onPressEnter={onSearch}
            // onPressEnter={onSearch}
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
                disabled={button.disabled}
              />
            ))
          : undefined}

        {/* Submit Button */}
        {submitText !== undefined ? (
          <PButton
            content={submitText || "Save"}
            type={"primary"}
            action="submit"
            icon={submitIcon}
          />
        ) : undefined}
      </div>
    </div>
  );
};

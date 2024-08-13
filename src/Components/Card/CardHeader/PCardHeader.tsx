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
import { MdPrint } from "react-icons/md";
import { LightTooltip } from "common/LightTooltip";
import { InfoOutlined } from "@mui/icons-material";
import { failColor } from "utility/customColor";
type PCardHeaderType = {
  title?: string | React.ReactNode;
  text?: string | React.ReactNode;
  exportIcon?: boolean | React.ReactNode;
  printIcon?: boolean | React.ReactNode;
  pdfExport?: (e: any) => void;
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
    info?: { isInfo?: boolean; infoTitle?: string; infoColor?: any };
  }>;
  children?: React.ReactNode;
};
export const PCardHeader: React.FC<PCardHeaderType> = (props) => {
  const {
    title,
    text,
    exportIcon,
    onExport,
    printIcon,
    pdfExport,
    backButton,
    onSearch,
    submitText,
    submitIcon,
    buttonList,
    children,
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
        {printIcon ? (
          <div
            className="export_icon"
            style={{
              background: "var(--gray200)",
              borderRadius: "50%",
              padding: "3px 6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={pdfExport}
          >
            <MdPrint />
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
              <div key={index} className="d-flex align-items-center">
                {button?.info?.isInfo && (
                  <LightTooltip title={button?.info?.infoTitle} arrow>
                    {" "}
                    <InfoOutlined
                      sx={{
                        color: button?.info?.infoColor || failColor,
                        width: 16,
                        cursor: "pointer",
                        mr: 1,
                      }}
                    />
                  </LightTooltip>
                )}
                <PButton
                  // key={index}
                  content={button.content}
                  type={button.type}
                  onClick={button.onClick}
                  icon={button.icon === "plus" ? <PlusOutlined /> : button.icon}
                  disabled={button.disabled}
                />
              </div>
            ))
          : undefined}
        {children}
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

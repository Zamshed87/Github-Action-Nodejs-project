import { Button } from "antd";
import React from "react";
import "./style.scss";

export type buttonType =
  | "primary"
  | "secondary"
  | "primary-outline"
  | "primary-text"
  | "secondary-text";
type PButtonType = {
  type: buttonType;
  action?: "submit" | "button" | "reset";
  content: string;
  color?: "primary" | "secondary";
  size?: "large" | "middle" | "small";
  className?: string;
  parentClassName?: string;
  icon?: React.ReactNode;
  href?: string;
  target?: "_blank" | "_self";
  onClick?: (event: object) => void;
  style?: {};
  loading?: boolean;
  disabled?: any;
};
export const PButton: React.FC<PButtonType> = (property) => {
  const {
    parentClassName,
    content,
    type,
    action,
    className,
    disabled,
    href,
    icon,
    loading,
    onClick,
    size,
    style,
    target,
  } = property;
  return (
    <div
      className={`people_dex_button ${parentClassName ? parentClassName : ""}`}
    >
      <Button
        htmlType={action ? action : "button"}
        // type={type === 'secondary' ? 'default' : type}
        type={
          type === "primary-outline"
            ? "dashed"
            : type === "secondary"
            ? "default"
            : type === "primary-text"
            ? "text"
            : type === "secondary-text"
            ? "text"
            : type
        }
        className={`${className ? className : ""} ${
          type === "primary-text"
            ? "color_primary"
            : type === "secondary-text"
            ? "color_secondary"
            : ""
        }`}
        icon={icon ? icon : ""}
        loading={loading ? loading : undefined}
        href={href ? href : undefined}
        target={target ? target : undefined}
        size={size ? size : "middle"}
        style={style ? style : undefined}
        onClick={onClick ? onClick : undefined}
        disabled={disabled}
      >
        {content}
      </Button>
    </div>
  );
};

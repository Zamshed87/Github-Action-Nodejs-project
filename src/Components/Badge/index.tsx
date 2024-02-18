import React from "react";
import "./style.scss";
import { Tag } from "antd";
type TPBadge = {
  type?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  text: string;
};
const PBadge: React.FC<TPBadge> = (property) => {
  const { type, text } = property;
  return <Tag className={`PBadge ${type}`}>{text}</Tag>;
};

export default PBadge;

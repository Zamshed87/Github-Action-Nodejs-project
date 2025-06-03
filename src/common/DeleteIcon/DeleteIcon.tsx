import { DeleteOutlined } from "@mui/icons-material";
import { Tooltip } from "antd";
import { Flex } from "Components";

const DeleteIcon = ({ onClick, tooltipPosition = 'top' }: { onClick: () => void, tooltipPosition?: 'top' | 'bottom' }) => {
  return (
    <Flex justify="center">
      <Tooltip placement={tooltipPosition} title="Delete">
        <DeleteOutlined
          style={{
            color: "red",
            fontSize: "1.2rem",
            cursor: "pointer",
            margin: "0 5px",
          }}
          onClick={onClick}
        />
      </Tooltip>
    </Flex>
  );
};

export default DeleteIcon;

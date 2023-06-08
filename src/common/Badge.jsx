import CloseIcon from "@mui/icons-material/Close";
import { Chip, IconButton } from "@mui/material";
import { gray700 } from "../utility/customColor";

const BadgeComponent = ({ onClick, label, ...rest }) => {
  return (
    <Chip
      label={label}
      deleteIcon={
        <IconButton size="small" style={{ fontSize: "18px", padding: "0px" }}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
      sx={{
        padding: "2px 0px 2px 0px",
        background: "#FFFFFF",
        boxShadow:
          "0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)",
        borderRadius: "8px",
        fontSize: "12px",
        textAlign: "center",
        color: gray700,
        fontWeight: 500,
        height: "30px",
        "& .MuiChip-label": {
          paddingLeft: "7px",
          color: gray700,
        },
        "& .MuiSvgIcon-root": {
          color: gray700,
          fontWeight: 500,
          fontSize: "15px",
          // marginRight:"4px"
        },
      }}
      onDelete={onClick}
      {...rest}
    />
  );
};

export default BadgeComponent;

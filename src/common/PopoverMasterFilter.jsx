import { Clear } from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import { gray300, gray900 } from "../utility/customColor";


const PopOverMasterFilter = ({ propsObj, children }) => {
  const {
    id,
    open,
    anchorEl,
    handleClose,
    values,
    handleSearch,
    dirty,
    initData,
    resetForm,
    clearFilter,
    size,
    sx,
  } = propsObj;
  return (
    <Popover
      sx={{
        ...sx,
        "& .MuiPaper-root": {
          width:
            size === "sm"
              ? "550px"
              : size === "md"
              ? "650px"
              : size === "lg"
              ? "750px"
              : "850px",
          height: "auto",
          borderRadius: "4px",
          marginTop: "3px",
        },
      }}
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <div className="master-filter-modal-container">
        <div className="master-filter-header">
          <h3>Advanced Filter</h3>
          <IconButton
            onClick={(e) => {
              handleClose();
              resetForm(initData);
              clearFilter();
            }}
            className="btn btn-cross"
          >
            <Clear
              sx={{ fontSize: "18px", color: gray900 }}
            />
          </IconButton>
        </div>
        <div
          className="master-filter-body"
          style={{ borderTop: `1px solid ${gray300}` }}
        >
          {children}
        </div>
        <div className="master-filter-bottom">
          <div></div>
          <div className="master-filter-btn-group">
            <button
              type="button"
              className="btn btn-cancel"
              disabled={!dirty}
              onClick={() => {
                resetForm(initData);
                clearFilter();
              }}
              style={{
                marginRight: "10px",
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn btn-green"
              disabled={!dirty}
              onClick={() => {
                handleSearch(values);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default PopOverMasterFilter;

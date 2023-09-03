import React from "react";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { gray900 } from "../utility/customColor";

const SortingIcon = ({ viewOrder }) => {
  return (
    <div className="sorting-icons">

      {viewOrder === "desc" ? (
        <>
          <ArrowDownward
            className="downIcon"
            sx={{ fontSize: '14px', color: gray900 }}
          />
        </>
      ) : (
        <>
          <ArrowUpward
            className="upIcon"
            sx={{ fontSize: '14px', color: gray900 }}
          />
        </>
      )}

      {/* <ArrowDropUpIcon
        className={`upIcon ${viewOrder === "desc" ? "disable" : ""}`}
        sx={{ fontSize: '22px' }}
      />
      <ArrowDropDownIcon
        className={`downIcon ${viewOrder === "asc" ? "disable" : ""}`}
        sx={{ fontSize: '22px' }}
      /> */}
    </div>
  );
};

export default SortingIcon;
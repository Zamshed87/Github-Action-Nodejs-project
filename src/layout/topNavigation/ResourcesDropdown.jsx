import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getBuDDLAction,
  getWDDLAction,
  getWGDDLAction,
  updateBuAction,
  updateWAction,
  updateWgAction,
} from "../../commonRedux/auth/actions";

const style = {
  marginTop: "3px",
  marginRight: "15px",
  minWidth: 120,
  "& .MuiOutlinedInput-root fieldset": {
    borderWidth: "0",
  },
  "& .MuiOutlinedInput-root .MuiSelect-select": {
    fontWeight: "500",
    fontSize: "12px",
    lineHeight: "19px",
    letterSpacing: "0.2px",
    color: "rgba(0, 0, 0, 0.7)",
    padding: "0px 30px 0 0px",
    textAlign: "right",
  },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    borderWidth: "0",
  },
  "& .MuiSvgIcon-root": {
    top: "-4px",
  },
  "& .MuiMenuItem-root": {
    fontSize: ".8rem",
  },
};

export default function ResourcesDropdown() {
  const {
    profileData: { orgId, buId, employeeId, wgId, wId },
    businessUnitDDL,
    workplaceGroupDDL,
    workplaceDDL,
  } = useSelector((state) => state?.auth, shallowEqual);
  const [workPlaceWouldChange, setWorkPlaceWouldChange] = useState("");
  const dispatch = useDispatch();

  const handleResources = (event) => {
    const filterData = businessUnitDDL?.filter(
      (item) => item?.BusinessUnitId === event.target.value
    );

    // if (event.target.value !== 17) {
    //   dispatch(updateVesselAction(null, null));
    // }

    dispatch(
      updateBuAction(
        filterData?.[0]?.BusinessUnitId,
        filterData?.[0]?.BusinessUnitName,
        filterData?.[0]?.intLogoUrlId
      )
    );
  };

  const handleWgResources = (event) => {
    const filterData = workplaceGroupDDL?.filter(
      (item) => item?.WorkplaceGroupId === event.target.value
    );
    setWorkPlaceWouldChange("workplaceWillChange");
    dispatch(
      updateWgAction(
        filterData?.[0]?.WorkplaceGroupId,
        filterData?.[0]?.WorkplaceGroupName
      )
    );
  };
  const handleWResources = (event) => {
    const filterData = workplaceDDL?.filter(
      (item) => item?.WorkplaceId === event.target.value
    );
    dispatch(
      updateWAction(
        filterData?.[0]?.WorkplaceId,
        filterData?.[0]?.WorkplaceName
      )
    );
  };

  useEffect(() => {
    dispatch(getBuDDLAction(orgId, buId, employeeId));
    dispatch(getWGDDLAction(buId, wgId, employeeId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    dispatch(getWDDLAction(buId, wgId, employeeId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wgId, buId]);

  useEffect(() => {
    if (workPlaceWouldChange === "workplaceWillChange") {
      dispatch(
        updateWAction(
          workplaceDDL?.[0]?.WorkplaceId,
          workplaceDDL?.[0]?.WorkplaceName
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workplaceDDL]);

  return (
    <div className="d-flex">
      <FormControl sx={style}>
        <Select
          value={buId}
          onChange={handleResources}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          {businessUnitDDL?.map((item, index) => (
            <MenuItem value={item?.BusinessUnitId} key={index}>
              {item?.BusinessUnitName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={style}>
        <Select
          value={wgId}
          onChange={handleWgResources}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          {workplaceGroupDDL?.map((item, index) => (
            <MenuItem value={item?.WorkplaceGroupId} key={index}>
              {item?.WorkplaceGroupName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={style}>
        <Select
          value={wId}
          onChange={handleWResources}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          {workplaceDDL?.map((item, index) => (
            <MenuItem value={item?.WorkplaceId} key={index}>
              {item?.WorkplaceName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getBuDDLAction,
  getWDDLAction,
  getWGDDLAction,
  updateBuAction,
  updateWAction,
  updateWgAction,
} from "../../commonRedux/auth/actions";
import { Autocomplete, TextField, Tooltip } from "@mui/material";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    dispatch(updateWAction(0, ""));
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
    dispatch(getWGDDLAction(orgId, buId, wgId, employeeId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    dispatch(getWDDLAction(orgId, buId, wgId, employeeId));
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
    <div className="d-flex ml-2">
      <Tooltip
        title={
          businessUnitDDL?.find((i) => i.BusinessUnitId === buId)
            ?.BusinessUnitName || ""
        }
      >
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
      </Tooltip>
      <Tooltip
        title={
          workplaceGroupDDL?.find((i) => i.WorkplaceGroupId === wgId)
            ?.WorkplaceGroupName || ""
        }
      >
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
      </Tooltip>
      <Tooltip
        title={
          workplaceDDL?.find((i) => i.WorkplaceId === wId)?.WorkplaceName || ""
        }
      >
        <FormControl
          sx={{
            minWidth: 150,
            marginRight: "10px",
            "& .MuiOutlinedInput-root fieldset": {
              borderWidth: 0,
            },
            "& .MuiOutlinedInput-root.Mui-focused fieldset": {
              borderWidth: 0,
            },
            "& .MuiSvgIcon-root": {
              top: "-4px",
            },
          }}
        >
          <Autocomplete
            size="small"
            open={isSearchOpen}
            onOpen={() => setIsSearchOpen(true)}
            onClose={() => setIsSearchOpen(false)}
            disableClearable
            options={workplaceDDL || []}
            getOptionLabel={(option) => option?.WorkplaceName || ""}
            value={
              workplaceDDL?.find((item) => item?.WorkplaceId === wId) || null
            }
            onChange={(event, newValue) => {
              if (newValue) {
                dispatch(
                  updateWAction(newValue?.WorkplaceId, newValue?.WorkplaceName)
                );
              }
            }}
            componentsProps={{
              paper: {
                sx: {
                  fontSize: "14px",
                  minWidth: "180px",
                  mt: "2px",
                  "& .MuiAutocomplete-option": {
                    paddingY: "0px", // ⬅️ slightly taller spacing
                    fontSize: "14px", // ⬅️ increase font size here too
                    minHeight: "30px", // ⬅️ optional for larger click targets
                  },
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                // variant="outlined"
                placeholder="Select workplace"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: isSearchOpen && (
                    <InputAdornment position="end">
                      <SearchIcon
                        sx={{ fontSize: 16, color: "rgba(0,0,0,0.5)" }}
                      />
                    </InputAdornment>
                  ),
                  sx: {
                    padding: "0px !important",
                    fontSize: "12px",
                    fontWeight: 200,
                    lineHeight: "5px",
                    color: "rgba(0, 0, 0, 0.7)",
                  },
                }}
                inputProps={{
                  ...params.inputProps,
                  sx: {
                    padding: "2px 2px !important",
                    fontSize: "12px",
                    textAlign: "left",
                    width: "100%",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    paddingRight: "25px !important",
                    fontSize: "12px",
                    minHeight: "10px", // Matches compact Select height
                  },
                  "& input": {
                    padding: "2px 4px",
                  },
                }}
              />
            )}
          />
        </FormControl>
      </Tooltip>
    </div>
  );
}

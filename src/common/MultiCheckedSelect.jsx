import {
  Avatar,
  Checkbox,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { gray200, gray25, gray400, gray800 } from "../utility/customColor";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultiCheckedSelect = ({
  id,
  size = "small",
  name,
  value = [],
  styleObj,
  label = "",
  options = [],
  onChange,
  errors,
  touched,
  disabled,
  onBlur,
  setFieldValue,
  isAvatar = false,
  searchFieldPlaceholder = "Search",
  isShowAllSelectedItem = true,
}) => {
  const [allChecked, setAllChecked] = useState(false);
  const [searchString, setSearchString] = useState("");

  const onChangeHandler = (e) => {
    const {
      target: { value },
    } = e;

    onChange(value ? value : []);
    if (value?.length !== options?.length) {
      setAllChecked(false);
    }
  };

  const handleDelete = (e, option) => {
    e.preventDefault();
    const filtered = value?.filter((item) => item.value !== option.value);
    setFieldValue(name, filtered);
    setAllChecked(false);
  };

  const handleSelectAllClick = (e) => {
    // e.stopPropagation();
    if (allChecked) {
      setFieldValue(name, []);
    } else {
      setFieldValue(name, options);
    }
    setAllChecked(!allChecked);
    setSearchString("");
  };

  useEffect(() => {
    if (
      value?.length > 0 &&
      options?.length > 0 &&
      value?.length === options?.length
    )
      setAllChecked(true);
  }, [value?.length, options?.length]);

  const filteredData = options?.filter((item) =>
    item?.label?.toLowerCase()?.includes(searchString?.toLowerCase())
  );

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <FormControl
        key={id}
        id={id}
        size={size}
        style={styleObj ? { ...styleObj, width: "100%" } : { width: "100%" }}
        error={errors[name] && touched[name] ? true : false}
        disabled={disabled}
        className="h_select-field"
        sx={{ m: 0, minWidth: 120 }}
      >
        <label>{label}</label>
        <Select
          sx={{
            maxWidth: "100%",
            "& .MuiSelect-select": {
              padding: "5px 14px !important",
            },
            "&.MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: gray400,
              },
              "&.Mui-focused fieldset": {
                border: `1px solid ${gray400}`,
              },
            },
          }}
          labelId="multi-select-label"
          id={id}
          name={name}
          multiple
          value={value}
          onBlur={onBlur}
          onChange={onChangeHandler}
          input={<OutlinedInput />}
          renderValue={(selected) =>
            (value.length > 0 &&
              options.length > 0 &&
              options.length === value.length) ||
            !isShowAllSelectedItem ? (
              <p>{value.length} items Selected</p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {selected?.map((item, index) => (
                  <Chip
                    sx={{
                      m: 0.5,
                      color: gray800,
                      fontWeight: 400,
                      fontSize: "13px",
                      padding: "6px 3px",
                      backgroundColor: gray200,
                      ".MuiChip-avatar": {
                        width: "24px!important",
                        height: "24px!important",
                        color: gray25,
                        marginLeft: "0px",
                        backgroundColor: "#78909C",
                      },
                      ".MuiChip-deleteIcon": {
                        color: "white",
                        fontSize: "20px!important",
                        backgroundColor: "rgba(0, 0, 0, 0.23)",
                        borderRadius: "50px",
                        padding: "2px",
                      },
                    }}
                    avatar={
                      isAvatar && (
                        <Avatar alt="image">{item?.label?.charAt(0)}</Avatar>
                      )
                    }
                    key={index}
                    label={item.label}
                    clickable
                    deleteIcon={
                      <CloseIcon
                        onMouseDown={(event) => event.stopPropagation()}
                      />
                    }
                    onDelete={(e) => handleDelete(e, item)}
                  />
                ))}
              </div>
            )
          }
          MenuProps={MenuProps}
        >
          <MenuItem
            onKeyDown={(e) => stopPropagation(e)}
            sx={{
              "&.Mui-focusVisible": {
                backgroundColor: "white",
              },
              "&:focus": {
                backgroundColor: "white",
              },
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            <OutlinedInput
              inputProps={{
                style: {
                  paddingTop: "5px",
                  paddingBottom: "5px",
                },
              }}
              sx={{
                "&.MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: gray400,
                  },
                  "&.Mui-focused fieldset": {
                    border: `1px solid ${gray400}`,
                  },
                },
                width: "100%",
              }}
              value={searchString}
              onClick={(e) => stopPropagation(e)}
              onKeyDown={(e) => stopPropagation(e)}
              onChange={(e) => {
                stopPropagation(e);
                setSearchString(e.target.value);
              }}
              size="small"
              placeholder={searchFieldPlaceholder}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                  >
                    <SearchIcon sx={{ width: "18px", padding: 0 }} />
                  </IconButton>
                </InputAdornment>
              }
            />
          </MenuItem>
          {options?.length > 0 && (
            <li
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0px",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={(e) => handleSelectAllClick(e)}
            >
              <Checkbox
                onClick={(e) => handleSelectAllClick(e)}
                color="success"
                sx={{ "& .MuiSvgIcon-root": { fontSize: 15 } }}
                checked={allChecked}
              />
              <p style={{ color: "black" }}>Select All</p>
            </li>
          )}
          {filteredData?.length ? (
            filteredData.map((option, index) => (
              <MenuItem sx={{ padding: 0 }} key={option?.value} value={option}>
                <Checkbox
                  color="success"
                  sx={{ "& .MuiSvgIcon-root": { fontSize: 15 } }}
                  checked={value.some((item) => item.value === option.value)}
                />
                <ListItemText
                  primaryTypographyProps={{ fontSize: "12px" }}
                  primary={option.label}
                />
              </MenuItem>
            ))
          ) : (
            <MenuItem sx={{ paddingTop: 0, paddingBottom: 0 }}>
              <small>No Data Found</small>
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </>
  );
};

export default MultiCheckedSelect;

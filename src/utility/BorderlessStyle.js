import {
  disableColor,
  gray100,
  gray300,
  gray700,
  whiteColor,
} from "./customColor";

export const borderlessSelectStyle = {
  control: (provided) => ({
    ...provided,
    minHeight: "30px",
    height: "30px",
    border: "none",
    borderBottom: `1px solid ${gray300}`,
    "&:hover": {
      borderColor: "unset",
      borderBottom: `1px solid ${gray300}`,
    },
    boxShadow: "unset",
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "30px",
    padding: "0 6px",
    fontSize: "12px",
  }),
  valueOption: (provided) => ({
    ...provided,
    zIndex: 999999,
  }),

  input: (provided) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: "0px",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "0px",
    paddingRight: "3px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "30px",
  }),
  option: (provided, { isDisabled, isFocused, isSelected }) => ({
    ...provided,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "18px",
    paddingLeft: 18,
    color: isDisabled ? disableColor : isSelected ? gray700 : gray700,
    backgroundColor: isDisabled
      ? disableColor
      : isSelected
      ? gray100
      : isFocused
      ? gray100
      : whiteColor,
    ":active": {
      backgroundColor: !isDisabled
        ? isSelected
          ? gray100
          : whiteColor
        : whiteColor,
    },
    zIndex: 99999999,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 14,
    textOverflow: "ellipsis",
    maxWidth: "95%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    color: gray700,
  }),
};

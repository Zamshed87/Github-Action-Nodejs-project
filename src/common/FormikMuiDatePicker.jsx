import { TextField } from "@mui/material";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
  MobileDatePicker,
  MonthPicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import FormikError from "./login/FormikError";
const FormikMuiDatePicker = ({
  type,
  formate,
  value,
  onChange,
  label,
  className,
  maxDate,
  minDate,
  errors,
  touched,
  name,
  clearable
}) => {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        {type === "date-time" ? (
          <DateTimePicker
            clearable={clearable}
            clearText="Clear"
            className={className || "formik_mui_date_field"}
            label={label}
            value={value}
            maxDate={maxDate}
            minDate={minDate}
            onChange={(value) => {
             value ? onChange(moment(value).format()) : onChange(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={
                  errors && touched && name && errors[name] && touched[name]
                    ? true
                    : false
                }
              />
            )}
          />
        ) : type === "time" ? (
          <TimePicker
            clearable={clearable}
            clearText="Clear"
            className={className || "formik_mui_date_field"}
            label={label}
            value={value}
            onChange={(value) => {
             value ? onChange(moment(value).format()) : onChange(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                error={
                  errors && touched && name && errors[name] && touched[name]
                    ? true
                    : false
                }
              />
            )}
          />
        ) : type === "mobile-date" ? (
          <MobileDatePicker
            clearable={clearable}
            clearText="Clear"
            className={className || "formik_mui_date_field"}
            label={label}
            value={value}
            onChange={(value) => {
              value ? onChange(moment(value).format()) : onChange(null);
            }}
            maxDate={maxDate}
            minDate={minDate}
            renderInput={(params) => (
              <TextField
                {...params}
                error={
                  errors && touched && name && errors[name] && touched[name]
                    ? true
                    : false
                }
              />
            )}
            inputFormat={formate || "DD/MM/YYYY"}
          />
        ) : type === "month" ? (
          <MonthPicker
            clearable={clearable}
            clearText="Clear"
            onChange={(value) => {
              value ? onChange(moment(value).format()) : onChange(null);
            }}
            date={value}
            className={className || "formik_mui_date_field"}
          />
        ) : type === "date" || !type ? (
          <DatePicker
            clearable={clearable}
            clearText="Clear"
            className={className || "formik_mui_date_field"}
            label={label}
            value={value}
            onChange={(value) => {
              value ? onChange(moment(value).format()) : onChange(null);
            }}
            maxDate={maxDate}
            minDate={minDate}
            renderInput={(params) => (
              <TextField
                {...params}
                error={
                  errors && touched && name && errors[name] && touched[name]
                    ? true
                    : false
                }
              />
            )}
            inputFormat={formate || "DD/MM/YYYY"}
          />
        ) : (
          <></>
        )}
      </LocalizationProvider>
      <FormikError errors={errors} touched={touched} name={name} />
    </>
  );
};

export default FormikMuiDatePicker;

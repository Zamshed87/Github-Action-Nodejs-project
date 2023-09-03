import React from "react";
import { Popover } from "@mui/material";
import { CloseOutlined, DateRange } from '@mui/icons-material';
import FormikInput from "../../../../common/FormikInput";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { blackColor90 } from './../../../../utility/customColor';
import { DateRangePicker } from 'materialui-daterange-picker';

const DateFilter = ({ propsObj, isOnlyDate }) => {
   const {
      id,
      open,
      anchorEl,
      handleClose,
      setFieldValue,
      values,
      errors,
      touched,
      setDateOpen,
      dateOpen,
   } = propsObj;
   const dataRanges = [{ label: "" }];
   const toggle = () => setDateOpen(false);
   return (
      <Popover
         sx={{
            "&.MuiModal-root": {
               background: "rgba(0,0,0,.5)!important"
            },
            "& .MuiPaper-root": {
               minWidth: isOnlyDate ? "512px" : "700px",
               padding: isOnlyDate ? "0 0 30px" : "20px",

            },
         }}
         id={id}
         open={open}
         anchorEl={anchorEl}
         // onClose={handleClose}
         onClose={() => { }}
         anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
         }}
      >

         {
            isOnlyDate && <div className="filter-date-wrapper">
               <div className="filter-date-wrapper-title">
                  <h2>Filter by date</h2>
                  <div onClick={() => handleClose()}>
                     <CloseOutlined
                        sx={{ fontSize: "18px", color: blackColor90, cursor: "pointer" }}
                     />
                  </div>
               </div>
               <div style={{ padding: "10px 16px 13px" }}>
                  <div onClick={() => setDateOpen(!dateOpen)}>
                     <FormikInput
                        classes="search-input"
                        inputClasses="search-inner-input"
                        placeholder="Select Date Range"
                        value={`${values?.dateRange?.startDate || "Start Date"} - ${values?.dateRange?.endDate || "End Date"
                           }`}
                        name="dateRange"
                        type="text"
                        onChange={(e) => setFieldValue("dateRange", "")}
                        trailicon={<DateRange sx={{ color: "#323232" }} />}
                        errors={errors}
                        touched={touched}
                     />
                  </div>
                  <DateRangePicker
                     open={dateOpen}
                     definedRanges={dataRanges}
                     toggle={toggle}
                     wrapperClassName="date-rang-picker simple-date-rang-picker"
                     onChange={(range) => {
                        if (range) {
                           setFieldValue("dateRange", {
                              startDate: dateFormatter(range?.startDate),
                              endDate: dateFormatter(range?.endDate),
                           });
                           setDateOpen(true);
                        }
                     }}
                  />
               </div>
            </div>
         }

         <div onClick={(e) => handleClose()} className=" apply-btn-wrapper text-right">
            <button type="button" className="btn btn-date-apply">
               Apply
            </button>
         </div>


      </Popover>
   );
};

export default DateFilter;

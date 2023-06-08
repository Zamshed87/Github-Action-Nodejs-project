import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Popover } from "@mui/material";
import { getPeopleDeskAllLanding } from "../../../../../common/api";
import { dateFormatter } from "../../../../../utility/dateFormatter";

const RoasterInfoPopover = ({ propsObj, isOnlyDate }) => {
   const {
      id,
      open,
      anchorEl,
      handleClose,
      item
   } = propsObj;

   const [singleData, setSingleData] = useState("");

   const { orgId, buId } = useSelector(
      (state) => state?.auth?.profileData,
      shallowEqual
   );
   useEffect(() => {
      if(item?.EmployeeId){
         getPeopleDeskAllLanding(
            "EmployeeRosterInfo",
            orgId,
            buId,
            item?.EmployeeId,
            setSingleData,
            "",
            ""
         );
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [orgId, item]);


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
         onClose={() => {
            handleClose()
         }}
         anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
         }}
      >
         {
            singleData?.length > 0 && (
               <table className="table table-borderless mb-0">
                  <thead>
                     <tr>
                        <th>Generate Date</th>
                        <th className="text-center">Calendar/Roster</th>
                        <th>Name</th>
                        <th className="text-center">Starting Calendar</th>
                        <th className="text-center">Next Calendar</th>
                     </tr>
                  </thead>
                  <tbody>
                     {
                        singleData?.map((item, index) => {
                           return <tr key={index}>
                              <td style={{fontSize: "12px", fontWeight: "500", color: "rgba(0, 0, 0, 0.6)"}}>{dateFormatter(item?.GenerateDate)}</td>
                              <td className="text-center" style={{fontSize: "12px", fontWeight: "500", color: "rgba(0, 0, 0, 0.6)"}}>{item?.CalenderOrRoster}</td>
                              <td style={{fontSize: "12px", fontWeight: "500", color: "rgba(0, 0, 0, 0.6)"}}>{item?.Name}</td>
                              <td className="text-center" style={{fontSize: "12px", fontWeight: "500", color: "rgba(0, 0, 0, 0.6)"}}>
                                 {item?.StartingCalendar}
                              </td>
                              <td className="text-center" style={{fontSize: "12px", fontWeight: "500", color: "rgba(0, 0, 0, 0.6)"}}>
                                 {item?.NextCalendar}
                              </td>
                           </tr>
                        })
                     }

                  </tbody>
               </table>
            )
         }




      </Popover>
   );
};

export default RoasterInfoPopover;

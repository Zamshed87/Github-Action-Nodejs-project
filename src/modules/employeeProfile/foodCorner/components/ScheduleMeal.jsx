import { DeleteOutlineOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { shallowEqual, useSelector } from "react-redux";
import { createCafeteriaEntry } from "../helper";


const ScheduleMeal = ({scheduleMeal, getLandingData}) => {
  const { employeeId } = useSelector((state) => state?.auth?.profileData, shallowEqual);
  return (
    <>
      <div className="leave-movement-FormCard">
        <div className="card-style mt-2 p-0">
          <div className="card-body" style={{padding:"12px"}}>
            <div className="table-card-styled">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th className="text-center">Date</th>
                    <th className="text-center">No of Meal</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleMeal?.length > 0 &&
                    scheduleMeal?.map((item, index) => {
                      return (
                        <tr key={index}>
                          {/* <td className="text-center">{dateFormatter(item?.dteMeal)}</td> */}
                          <td className="text-center">{item?.formatedDate}</td>
                          <td className="text-center">{item?.MealNo}</td>
                          <td className="text-center">
                            <Tooltip title="Delete" arrow placement="top">
                              <IconButton>
                                <DeleteOutlineOutlined sx ={{color:"red"}} onClick={() => {
                                  createCafeteriaEntry(2, item?.dteMeal, employeeId, 0, 0, 0, 0, 0, 0, "N/A", 0, "", "", getLandingData);
                                }}/>
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleMeal;

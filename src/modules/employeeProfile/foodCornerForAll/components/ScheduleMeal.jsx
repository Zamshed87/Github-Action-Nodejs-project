import { DeleteOutlineOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { dateFormatter } from "../../../../utility/dateFormatter";
import { createCafeteriaEntry } from "../helper";

const ScheduleMeal = ({ scheduleMeal, getLandingData, values }) => {
  // const { employeeId } = useSelector(
  //   (state) => state?.auth?.profileData,
  //   shallowEqual
  // );
  return (
    <>
      <div className="leave-movement-FormCard">
        <div className="card">
          <div className="card-body">
            <div className="table-card-styled">
              <table className="table">
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
                          <td className="text-center">
                            {dateFormatter(item?.dteMeal)}
                          </td>
                          <td className="text-center">{item?.MealNo}</td>
                          <td className="text-center">
                            <Tooltip title="Delete" arrow placement="top">
                              <IconButton>
                                <DeleteOutlineOutlined
                                  type="button"
                                  sx={{ color: "red" }}
                                  onClick={() => {
                                    createCafeteriaEntry(
                                      2,
                                      item?.dteMeal,
                                      item?.intEnroll,
                                      0,
                                      0,
                                      0,
                                      0,
                                      0,
                                      0,
                                      "N/A",
                                      0,
                                      "",
                                      "",
                                      () => {
                                        getLandingData(values);
                                      }
                                    );
                                  }}
                                />
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

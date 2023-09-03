import React from 'react'
import { dateFormatter } from '../../../../utility/dateFormatter';


const ConsumeMeal = ({consumeMeal}) => {
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
                  </tr>
                </thead>
                <tbody>
                  {consumeMeal?.length > 0 &&
                    consumeMeal?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="text-center">{dateFormatter(item?.dteMeal)}</td>
                          <td className="text-center">{item?.MealNo}</td>
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
  )
}

export default ConsumeMeal

import React from 'react'
import { dateFormatter } from '../../../../utility/dateFormatter';


const ConsumeMeal = ({consumeMeal}) => {
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

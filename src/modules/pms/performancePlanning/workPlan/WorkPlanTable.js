import React from 'react';
import "./workPlanTable.css"
export const WorkPlanTable = ({ planList, planListRow, userName, employeeId }) => {
    return (
        <>
            <div className="text-center mb-5">
                <strong>Work Plan</strong>
            </div>
            <div className="row mt-2 mb-2">
                <div className="col-lg-4 ml-3">
                    <div>
                        <strong>Name</strong>: <span>{userName}</span>
                    </div>
                    <div>
                        <strong>Enroll</strong>: <span>{employeeId}</span>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div>
                        <strong>Designation</strong>:{' '}
                        <span>{planList?.designation || ''}</span>
                    </div>
                    <div>
                        <strong>Location</strong>:{' '}
                        <span>{planList?.workplaceGroup || ''}</span>
                    </div>
                </div>
                <div className="col-lg-3">
                    <div>
                        <strong>Year</strong>:{' '}
                        <span>{planList?.year || ''}</span>
                    </div>
                    <div>
                        <strong>Quarter</strong>:{' '}
                        <span>{planList?.quarter || ''}</span>
                    </div>
                </div>
            </div>
            <table className='pms-workplan-global-table'>
                <tbody>
                    <tr>
                        <td colSpan="4" className="text-center font-weight-bold">Task List Worksheet</td>
                    </tr>
                    <tr>
                        <td className="text-center font-weight-bold" id="serial-numnber">SL</td>
                        <td className="text-center font-weight-bold">Activity</td>
                        <td className="text-center font-weight-bold">Frequency</td>
                        <td className="text-center font-weight-bold">Priority</td>
                    </tr>
                </tbody>
                <tbody>
                    {planListRow?.map((item, index) => (
                        <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">{item?.activity}</td>
                            <td className="text-center">{item?.frequency}</td>
                            <td className="text-center">{item?.priority}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

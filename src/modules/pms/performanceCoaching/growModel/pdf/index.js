import React from 'react';
import './styles.css'
const GrowModelPdf = pdfData => {
   return (
      <>
         <div className="text-center mb-5">
            <strong>GROW Coaching Model Worksheet</strong>
         </div>

         <div className="row">
            <div className="col-lg-4 ml-3">
               <div>
                  <strong>Name</strong>:{' '}
                  <span>{pdfData?.singleData?.employeeName}</span>
               </div>
               <div>
                  <strong>Enroll</strong>:{' '}
                  <span>{pdfData?.singleData?.employeeId}</span>
               </div>
            </div>
            <div className="col-lg-4">
               <div>
                  <strong>Designation</strong>:{' '}
                  <span>{pdfData?.singleData?.designation || ''}</span>
               </div>
               <div>
                  <strong>Location</strong>:{' '}
                  <span>{pdfData?.singleData?.workplaceGroup || ''}</span>
               </div>
            </div>
            <div className="col-lg-3">
               <div>
                  <strong>Year</strong>:{' '}
                  <span>{pdfData?.singleData?.year || ''}</span>
               </div>
               <div>
                  <strong>Quarter</strong>:{' '}
                  <span>{pdfData?.singleData?.quarter || ''}</span>
               </div>
            </div>
         </div>
         <div className="mb-5">
            <table className="pms-global-table">
               <tr>
                  <td className="w-25 p-2">
                     <strong>Goal</strong>
                     <br />
                     <span>
                        What do you want to accomplish?How will you know when it
                        isachieved?
                     </span>
                  </td>
                  <td>
                     <span className="p-2">{pdfData?.singleData?.goal}</span>
                  </td>
               </tr>
               <tr>
                  <td className="p-2">
                     <strong>Reality</strong>
                     <br />
                     <span>
                        What’s happening now in terms of the goal?How far am I
                        away from the goal?
                     </span>
                  </td>
                  <td>
                     <span className="p-2">{pdfData?.singleData?.reality}</span>
                  </td>
               </tr>
               <tr>
                  <td className="p-2">
                     <strong>Obstacles</strong>
                     <br />
                     <span>
                        What is standing in the way –Me? Other people?Lack of
                        skills, knowledge, expertise? Physical environment?
                     </span>
                  </td>
                  <td>
                     <span className="p-2">
                        {pdfData?.singleData?.obstacles}
                     </span>
                  </td>
               </tr>
               <tr>
                  <td className="p-2">
                     <strong>Options</strong>
                     <br />
                     <span>
                        What options do I have to resolve the issues or
                        obstacles?", field: "options
                     </span>
                  </td>
                  <td>
                     <span className="p-2">{pdfData?.singleData?.options}</span>
                  </td>
               </tr>
               <tr>
                  <td className="p-2">
                     <strong>Way Forward/Will</strong>
                     <br />
                     <span>Which option will I commit to?</span>
                  </td>
                  <td>
                     <span className="p-2">
                        {pdfData?.singleData?.wayForward}
                     </span>
                  </td>
               </tr>
            </table>
         </div>
      </>
   );
};

export default GrowModelPdf;

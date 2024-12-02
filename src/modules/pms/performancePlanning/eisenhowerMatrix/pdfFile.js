import React from 'react';
const EisenHowerPdfFile = ({ singleData }) => {
   return (
      <>
         <h3 className="text-center">
            <strong>Eisenhower Matrix Worksheet</strong>
         </h3>
         <div className="row">
            <div className="col-lg-4 mt-2 ml-3">
               <div className=" py-2 d-flex align-item-center">
                  <p><span style={{ fontWeight: "bold" }}>Name: </span> {singleData?.header?.employeeName}</p>
               </div>
               <div className=" py-2 d-flex align-item-center">
                  <p > <span style={{ fontWeight: "bold" }}>Enroll: </span>{singleData?.header?.employeeId}</p>
               </div>
            </div>
            <div className="col-lg-4 mt-2">
               <div className="py-2 d-flex align-item-center">
                  <p> <span style={{ fontWeight: "bold" }}>Designation:{' '}</span>
                     {singleData?.header?.designation || ''}
                  </p>
               </div>
               <div className="py-2 d-flex align-item-center">
                  <p><span style={{ fontWeight: "bold" }}>Location:{' '} </span>
                     {singleData?.header?.workplaceGroup || ''}</p>
               </div>
            </div>
            <div className="col-lg-3 mt-2">
               <div className=" py-2 d-flex align-item-center">
                  <p > <span style={{ fontWeight: "bold" }}>Year:{' '}</span>
                     {singleData?.header?.year || ''}</p>
               </div>
               <div className="py-2 d-flex align-item-center">
                  <p> <span style={{ fontWeight: "bold" }}>Quarter:{' '}</span>
                     {singleData?.header?.quarter || ''}</p>
               </div>
            </div>
         </div>
         <div className="rounded p-2 mb-5">
            <div>
               <div className="d-flex">
                  <div className="w-100 border border-bottom-0 border-dark">
                     <div className="card card-height">
                        <strong className="p-2">1. Do First</strong>
                        <ol style={{ marginLeft: "40px" }}>
                           {singleData?.rowDto?.doFirst?.map((data) => (
                              <li>{data?.strActivity}</li>
                           ))}
                        </ol>
                     </div>
                  </div>
                  <div className="w-100 border border-start-0 border-dark">
                     <div className="card card-height">
                        <div className="p-2">
                           <strong>2. Schedule</strong>
                           <ol style={{ marginLeft: "40px" }}>
                              {singleData?.rowDto?.schedule?.map((item) => (
                                 <li>{item?.strActivity}</li>
                              ))}
                           </ol>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="d-flex">
                  <div className="w-100 border border-end-0 border-dark">
                     <div className="card card-height">
                        <div className="p-2">
                           <strong >3. Delegate</strong>
                           <ol style={{ marginLeft: "40px" }}>
                              {singleData?.rowDto?.delegate?.map((data) => (
                                 <li>{data?.strActivity}</li>
                              ))}
                           </ol>
                        </div>
                     </div>
                  </div>
                  <div className="w-100 border border-top-0 border-dark">
                     <div className="card card-height">
                        <div className="p-2">
                           <strong>4. Don't Do</strong>
                           <ol style={{ marginLeft: "40px" }}>
                              {singleData?.rowDto?.dontDo?.map((data) => (
                                 <li>{data?.strActivity}</li>
                              ))}
                           </ol>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default EisenHowerPdfFile;

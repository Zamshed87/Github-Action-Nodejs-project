// import PeopleDeskTable, { paginationSize } from "common/peopleDeskTable";
// import React, { useEffect, useState } from "react";
// import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { useHistory, useLocation } from "react-router-dom";
// import {
//   columns,
//   getData,
//   handleChangePage,
//   handleChangeRowsPerPage,
//   initHeaderList,
//   validationSchema,
// } from "./helper";
// import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
// import { useFormik } from "formik";
// import Loading from "common/loading/Loading";
// import NotPermittedPage from "common/notPermitted/NotPermittedPage";
// import NoResult from "common/NoResult";
// import { toast } from "react-toastify";
// import { customStyles } from "utility/selectCustomStyle";
// import FormikSelect from "common/FormikSelect";
// import MasterFilter from "common/MasterFilter";
// import { PModal } from "Components/Modal";
// import AddEditForm from "./component";

// const LatePunishment = () => {
//   let permission = null;
//   const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
//   const { orgId, buId, wgId, wgName, wId } = useSelector(
//     (state) => state?.auth?.profileData,
//     shallowEqual
//   );

//   permissionList.forEach((item) => {
//     if (item?.menuReferenceId === 30432) {
//       permission = item;
//     }
//   });
//   const dispatch = useDispatch();
//   const { state } = useLocation();

//   // row Data
//   const [rowDto, setRowDto] = useState([]);
//   const [singleData, setSingleData] = useState([]);
//   const [open, setOpen] = useState(false);

//   // pagination
//   const [pages, setPages] = useState({
//     current: 1,
//     pageSize: paginationSize,
//     total: 0,
//   });

//   const [landingLoading, setLandingLoading] = useState(false);
//   const [filterOrderList, setFilterOrderList] = useState([]);
//   const [initialHeaderListData, setInitialHeaderListData] = useState({});
//   const [headerList, setHeaderList] = useState({});
//   const [checkedHeaderList, setCheckedHeaderList] = useState({
//     ...initHeaderList,
//   });
//   const [checkedList, setCheckedList] = useState([]);
//   const [empIDString, setEmpIDString] = useState([]);
//   const [isAssignAll, setIsAssignAll] = useState(false);

//   // sidebar
//   useEffect(() => {
//     dispatch(setFirstLevelNameAction("Administration"));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     document.title = "Late Punishment Assign";
//   }, []);
//   useEffect(() => {
//     getData(
//       { current: 1, pageSize: paginationSize, total: 0 },
//       setLandingLoading,
//       buId,
//       wgId,
//       wId,
//       headerList,
//       setHeaderList,
//       setFilterOrderList,
//       initialHeaderListData,
//       setInitialHeaderListData,
//       setPages,
//       setEmpIDString,
//       setRowDto,
//       "",
//       [],
//       -1,
//       [],
//       initHeaderList,
//       true,
//       setCheckedList
//     );
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [buId, wgId, wId]);

//   const { handleSubmit, values, setFieldValue } = useFormik({
//     enableReinitialize: true,
//     validationSchema,
//     initialValues: { assigned: { value: true, label: "Not Assigned" } },

//     onSubmit: (values, { resetForm }) => {
//       resetForm();
//     },
//   });
//   return (
//     <>
//       {landingLoading && <Loading />}
//       <form onSubmit={handleSubmit}>
//         {permission?.isView ? (
//           <div className="table-card">
//             <>
//               <div className="table-card-heading">
//                 <div style={{ paddingLeft: "6px" }}>
//                   {checkedList.length > 0 ? (
//                     <h6 className="count">
//                       Total {checkedList.length}{" "}
//                       {`employee${checkedList.length > 1 ? "s" : ""}`} selected
//                       from {pages?.total}
//                     </h6>
//                   ) : (
//                     <h6 className="count">
//                       {" "}
//                       Total {rowDto?.length > 0 ? pages?.total : 0} Employees
//                     </h6>
//                   )}
//                 </div>
//                 <div className="table-card-head-right">
//                   <ul>
//                     <li>
//                       {rowDto?.length > 0 && (
//                         <div className="d-flex">
//                           <button
//                             className="btn btn-green"
//                             style={{
//                               marginRight: "10px",
//                               height: "30px",
//                               minWidth: "120px",
//                               fontSize: "12px",
//                             }}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               if (!permission?.isCreate)
//                                 return toast.warn("You don't have permission");
//                               const cb = () => {
//                                 getData(
//                                   {
//                                     current: 1,
//                                     pageSize: paginationSize,
//                                     total: 0,
//                                   },
//                                   setLandingLoading,
//                                   buId,
//                                   wgId,
//                                   wId,
//                                   headerList,
//                                   setHeaderList,
//                                   setFilterOrderList,
//                                   initialHeaderListData,
//                                   setInitialHeaderListData,
//                                   setPages,
//                                   setEmpIDString,
//                                   setRowDto,
//                                   "",
//                                   [],
//                                   -1,
//                                   [],
//                                   initHeaderList,
//                                   true,
//                                   setCheckedList
//                                 );
//                               };
//                               // demoPopup(
//                               //   "assign",
//                               //   empIDString,
//                               //   cb,
//                               //   setLandingLoading,
//                               //   history
//                               // );
//                               setOpen(true);
//                             }}
//                           >
//                             Assign {pages?.total}
//                           </button>
//                           {rowDto?.filter((item) => item?.isSelected).length >
//                           0 ? (
//                             <button
//                               className="btn btn-green"
//                               style={{
//                                 height: "30px",
//                                 minWidth: "120px",
//                                 fontSize: "12px",
//                               }}
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 if (!permission?.isCreate)
//                                   return toast.warn(
//                                     "You don't have permission"
//                                   );

//                                 let payload = [];
//                                 checkedList?.forEach((item) => {
//                                   if (item?.isSelected) {
//                                     payload.push(item?.employeeId);
//                                   }
//                                 });
//                                 const cb = () => {
//                                   getData(
//                                     {
//                                       current: 1,
//                                       pageSize: paginationSize,
//                                       total: 0,
//                                     },
//                                     setLandingLoading,
//                                     buId,
//                                     wgId,
//                                     wId,
//                                     headerList,
//                                     setHeaderList,
//                                     setFilterOrderList,
//                                     initialHeaderListData,
//                                     setInitialHeaderListData,
//                                     setPages,
//                                     setEmpIDString,
//                                     setRowDto,
//                                     "",
//                                     [],
//                                     -1,
//                                     [],
//                                     initHeaderList,
//                                     true,

//                                     setCheckedList
//                                   );
//                                 };
//                                 setEmpIDString(payload);
//                                 setOpen(true);
//                                 // demoPopup(
//                                 //   "assign",
//                                 //   payload,
//                                 //   cb,
//                                 //   setLandingLoading,
//                                 //   history
//                                 // );
//                               }}
//                             >
//                               Assign {checkedList?.length}
//                             </button>
//                           ) : (
//                             ""
//                           )}
//                         </div>
//                       )}
//                     </li>
//                     {/* <li className="mr-3" style={{ width: "150px" }}>
//                       <FormikSelect
//                         name="salaryStatus"
//                         options={[
//                           { value: "unassigned", label: "unassigned" },
//                           { value: "assigned", label: "assigned" },
//                         ]}
//                         value={values?.salaryStatus}
//                         onChange={(valueOption) => {
//                           setFieldValue("salaryStatus", valueOption);
//                           setFieldValue("searchString", "");
//                           getData(
//                             { current: 1, pageSize: paginationSize },
//                             setLandingLoading,
//                             buId,
//                             wgId,
//                             wId,
//                             headerList,
//                             setHeaderList,
//                             setFilterOrderList,
//                             initialHeaderListData,
//                             setInitialHeaderListData,
//                             setPages,
//                             setEmpIDString,
//                             setRowDto,
//                             "",
//                             checkedList,
//                             -1,
//                             filterOrderList,
//                             checkedHeaderList,
//                             valueOption?.value,
//                             [],
//                             values?.year?.value
//                           );
//                         }}
//                         styles={customStyles}
//                         isClearable={false}
//                       />
//                     </li> */}
//                     <li className="mr-3 " style={{ width: "150px" }}>
//                       <FormikSelect
//                         name="assigned"
//                         options={[
//                           { value: true, label: "Not Assigned" },
//                           { value: false, label: "Assigned" },
//                         ]}
//                         value={values?.assigned}
//                         onChange={(valueOption) => {
//                           getData(
//                             { current: 1, pageSize: paginationSize },
//                             setLandingLoading,
//                             buId,
//                             wgId,
//                             wId,
//                             headerList,
//                             setHeaderList,
//                             setFilterOrderList,
//                             initialHeaderListData,
//                             setInitialHeaderListData,
//                             setPages,
//                             setEmpIDString,
//                             setRowDto,
//                             "",
//                             checkedList,
//                             -1,
//                             filterOrderList,
//                             checkedHeaderList,
//                             valueOption?.value
//                           );
//                           setFieldValue("assigned", valueOption);
//                         }}
//                         styles={customStyles}
//                         isClearable={false}
//                       />
//                     </li>
//                     <li>
//                       <MasterFilter
//                         isHiddenFilter
//                         value={values?.searchString}
//                         setValue={(value) => {
//                           setFieldValue("searchString", value);
//                           if (value) {
//                             getData(
//                               { current: 1, pageSize: paginationSize },
//                               setLandingLoading,
//                               buId,
//                               wgId,
//                               wId,
//                               headerList,
//                               setHeaderList,
//                               setFilterOrderList,
//                               initialHeaderListData,
//                               setInitialHeaderListData,
//                               setPages,
//                               setEmpIDString,
//                               setRowDto,
//                               value,
//                               checkedList,
//                               -1,
//                               filterOrderList,
//                               checkedHeaderList,
//                               values?.assigned?.value,

//                               setCheckedList
//                             );
//                           } else {
//                             getData(
//                               { current: 1, pageSize: paginationSize },
//                               setLandingLoading,
//                               buId,
//                               wgId,
//                               wId,
//                               headerList,
//                               setHeaderList,
//                               setFilterOrderList,
//                               initialHeaderListData,
//                               setInitialHeaderListData,
//                               setPages,
//                               setEmpIDString,
//                               setRowDto,
//                               "",
//                               [],
//                               -1,
//                               filterOrderList,
//                               checkedHeaderList,
//                               values?.assigned?.value
//                             );
//                           }
//                         }}
//                         cancelHandler={() => {
//                           setFieldValue("searchString", "");
//                           getData(
//                             { current: 1, pageSize: paginationSize },
//                             setLandingLoading,
//                             buId,
//                             wgId,
//                             wId,
//                             headerList,
//                             setHeaderList,
//                             setFilterOrderList,
//                             initialHeaderListData,
//                             setInitialHeaderListData,
//                             setPages,
//                             setEmpIDString,
//                             setRowDto,
//                             "",
//                             [],
//                             -1,
//                             filterOrderList,
//                             checkedHeaderList,
//                             values?.assigned?.value
//                           );
//                         }}
//                         width="200px"
//                         inputWidth="200px"
//                       />
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//               {rowDto?.length > 0 ? (
//                 <PeopleDeskTable
//                   columnData={columns(
//                     pages,
//                     permission,
//                     rowDto,
//                     setRowDto,
//                     checkedList,
//                     setCheckedList,
//                     setSingleData,
//                     headerList,
//                     wgName
//                   )}
//                   pages={pages}
//                   rowDto={rowDto}
//                   setRowDto={setRowDto}
//                   checkedList={checkedList}
//                   setCheckedList={setCheckedList}
//                   checkedHeaderList={checkedHeaderList}
//                   setCheckedHeaderList={setCheckedHeaderList}
//                   handleChangePage={(e, newPage) =>
//                     handleChangePage(
//                       e,
//                       newPage,
//                       values?.search,
//                       setLandingLoading,
//                       buId,
//                       wgId,
//                       wId,
//                       headerList,
//                       setHeaderList,
//                       setFilterOrderList,
//                       initialHeaderListData,
//                       setInitialHeaderListData,
//                       setPages,
//                       setEmpIDString,
//                       setRowDto,
//                       checkedList,
//                       pages,
//                       filterOrderList,
//                       checkedHeaderList,
//                       values?.assigned?.value
//                     )
//                   }
//                   handleChangeRowsPerPage={(e) =>
//                     handleChangeRowsPerPage(
//                       e,
//                       values?.search,
//                       setLandingLoading,
//                       buId,
//                       wgId,
//                       wId,
//                       headerList,
//                       setHeaderList,
//                       setFilterOrderList,
//                       initialHeaderListData,
//                       setInitialHeaderListData,
//                       setPages,
//                       setEmpIDString,
//                       setRowDto,
//                       checkedList,
//                       pages,
//                       filterOrderList,
//                       checkedHeaderList,
//                       true
//                     )
//                   }
//                   filterOrderList={filterOrderList}
//                   setFilterOrderList={setFilterOrderList}
//                   uniqueKey="employeeId"
//                   getFilteredData={(
//                     currentFilterSelection,
//                     updatedFilterData,
//                     updatedCheckedHeaderData
//                   ) => {
//                     getData(
//                       {
//                         current: 1,
//                         pageSize: paginationSize,
//                         total: 0,
//                       },
//                       setLandingLoading,
//                       buId,
//                       wgId,
//                       wId,
//                       headerList,
//                       setHeaderList,
//                       setFilterOrderList,
//                       initialHeaderListData,
//                       setInitialHeaderListData,
//                       setPages,
//                       setEmpIDString,
//                       setRowDto,
//                       "",
//                       [],
//                       currentFilterSelection,
//                       updatedFilterData,
//                       updatedCheckedHeaderData,
//                       true,
//                       setCheckedList
//                     );
//                   }}
//                   isCheckBox={true}
//                   isScrollAble={true}
//                 />
//               ) : (
//                 !landingLoading && <NoResult title="No Result Found" para="" />
//               )}
//             </>
//           </div>
//         ) : (
//           <NotPermittedPage />
//         )}

//         <PModal
//           open={open}
//           title={"Assign Late Punishment Policy"}
//           width=""
//           onCancel={() => {
//             setOpen(false);
//           }}
//           maskClosable={false}
//           components={
//             <>
//               <AddEditForm
//                 getData={() => {
//                   getData(
//                     { current: 1, pageSize: paginationSize, total: 0 },
//                     setLandingLoading,
//                     buId,
//                     wgId,
//                     wId,
//                     headerList,
//                     setHeaderList,
//                     setFilterOrderList,
//                     initialHeaderListData,
//                     setInitialHeaderListData,
//                     setPages,
//                     setEmpIDString,
//                     setRowDto,
//                     "",
//                     [],
//                     -1,
//                     [],
//                     initHeaderList,
//                     true,
//                     setCheckedList
//                   );
//                 }}
//                 empIDString={empIDString}
//                 setIsAddEditForm={setOpen}
//                 setCheckedList={setCheckedList}
//               />
//             </>
//           }
//         />
//       </form>
//     </>
//   );
// };

// export default LatePunishment;

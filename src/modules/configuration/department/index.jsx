// import {
//   AddOutlined,
//   SearchOutlined,
//   SettingsBackupRestoreOutlined,
// } from "@mui/icons-material";
// import { Form, Formik } from "formik";
// import React, { useEffect, useState } from "react";
// import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import * as Yup from "yup";
// // import AntTable from "../../../common/AntTable";
// import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
// import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
// import FormikInput from "./../../../common/FormikInput";
// import Loading from "./../../../common/loading/Loading";
// import NoResult from "./../../../common/NoResult";
// import PrimaryButton from "./../../../common/PrimaryButton";
// import ResetButton from "./../../../common/ResetButton";
// import AddEditFormComponent from "./addEditForm/index";
// import { depertmentDtoCol, filterData, getAllEmpDepartment } from "./helper";
// import ViewFormComponent from "./viewForm";
// import PeopleDeskTable from "../../../common/peopleDeskTable";
// const initData = {
//   search: "",
//   status: "",
// };

// const validationSchema = Yup.object({});

// function Department() {
//   // row Data
//   const [rowDto, setRowDto] = useState([]);
//   const [allData, setAllData] = useState([]);

//   // filter
//   const [status, setStatus] = useState("");
//   // for create state
//   const [open, setOpen] = useState(false);
//   // for view state
//   const [viewModal, setViewModal] = useState(false);
//   // for create Modal
//   const handleOpen = () => {
//     setViewModal(false);
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setViewModal(false);
//     setOpen(false);
//   };

//   // for view Modal
//   const handleViewClose = () => setViewModal(false);
//   const { orgId, buId, wId } = useSelector(
//     (state) => state?.auth?.profileData,
//     shallowEqual
//   );

//   const [loading, setLoading] = useState(false);
//   const [singleData, setSingleData] = useState("");
//   const saveHandler = (values) => {};
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(setFirstLevelNameAction("Administration"));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     document.title = "Department";
//   }, []);

//   useEffect(() => {
//     getAllEmpDepartment(orgId, buId, setRowDto, setAllData, setLoading, wId);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [orgId, buId, wId]);

//   const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

//   let permission = null;
//   permissionList.forEach((item) => {
//     if (item?.menuReferenceId === 50) {
//       permission = item;
//     }
//   });

//   return (
//     <>
//       <Formik
//         enableReinitialize={true}
//         initialValues={initData}
//         validationSchema={validationSchema}
//         onSubmit={(values, { setSubmitting, resetForm }) => {
//           saveHandler(values, () => {
//             resetForm(initData);
//           });
//         }}
//       >
//         {({ handleSubmit, values, errors, touched, setFieldValue }) => (
//           <>
//             {loading && <Loading />}
//             <Form onSubmit={handleSubmit}>
//               {permission?.isView ? (
//                 <div className="table-card businessUnit-wrapper">
//                   <div className="table-card-heading">
//                     <div></div>
//                     <ul className="d-flex flex-wrap">
//                       {(values?.search || status) && (
//                         <li>
//                           <ResetButton
//                             classes="btn-filter-reset"
//                             title="reset"
//                             icon={
//                               <SettingsBackupRestoreOutlined
//                                 sx={{ marginRight: "10px", fontSize: "16px" }}
//                               />
//                             }
//                             styles={{
//                               marginRight: "16px",
//                             }}
//                             onClick={() => {
//                               setRowDto(allData);
//                               setFieldValue("search", "");
//                               setStatus("");
//                             }}
//                           />
//                         </li>
//                       )}
//                       <li style={{ marginRight: "24px" }}>
//                         <FormikInput
//                           classes="search-input fixed-width mt-2 mt-md-0 mb-2 mb-md-0 tableCardHeaderSeach"
//                           inputClasses="search-inner-input"
//                           placeholder="Search"
//                           value={values?.search}
//                           name="search"
//                           type="text"
//                           trailicon={
//                             <SearchOutlined sx={{ color: "#323232" }} />
//                           }
//                           onChange={(e) => {
//                             filterData(e.target.value, allData, setRowDto);
//                             setFieldValue("search", e.target.value);
//                           }}
//                           errors={errors}
//                           touched={touched}
//                         />
//                       </li>
//                       <li>
//                         <PrimaryButton
//                           type="button"
//                           className="btn btn-default flex-center"
//                           label={"Department"}
//                           icon={
//                             <AddOutlined
//                               sx={{
//                                 marginRight: "0px",
//                                 fontSize: "15px",
//                               }}
//                             />
//                           }
//                           onClick={(e) => {
//                             if (!permission?.isCreate)
//                               return toast.warn("You don't have permission");
//                             e.stopPropagation();
//                             setOpen(true);
//                           }}
//                         />
//                       </li>
//                     </ul>
//                   </div>
//                   {/* table body */}
//                   <div className="table-card-body">
//                     {rowDto?.length > 0 ? (
//                       <>
//                         <div className="table-card-styled employee-table-card tableOne  table-responsive mt-3">
//                           <PeopleDeskTable
//                             columnData={depertmentDtoCol()}
//                             // pages={pages}
//                             rowDto={rowDto}
//                             setRowDto={setRowDto}
//                             uniqueKey="intDepartmentId"
//                             isCheckBox={false}
//                             isScrollAble={false}
//                             isPagination={false}
//                             onRowClick={(item) => {
//                               if (!permission?.isEdit)
//                                 return toast.warn("You don't have permission");
//                               setViewModal(true);
//                               setSingleData(item);
//                             }}
//                           />
//                           {/* <AntTable
//                             data={rowDto}
//                             removePagination
//                             columnsData={depertmentDtoCol()}
//                             onRowClick={(item) => {
//                               if (!permission?.isEdit)
//                                 return toast.warn("You don't have permission");
//                               setViewModal(true);
//                               setSingleData(item);
//                             }}
//                           /> */}
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         {!loading && (
//                           <NoResult title="No Result Found" para="" />
//                         )}
//                       </>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <NotPermittedPage />
//               )}

//               {/* View Form Modal */}
//               <ViewFormComponent
//                 show={viewModal}
//                 title={"Department Details"}
//                 onHide={handleViewClose}
//                 size="lg"
//                 backdrop="static"
//                 classes="default-modal"
//                 handleOpen={handleOpen}
//                 orgId={orgId}
//                 buId={buId}
//                 singleData={singleData}
//                 setSingleData={setSingleData}
//               />

//               {/* addEdit form Modal */}
//               <AddEditFormComponent
//                 show={open}
//                 title={
//                   singleData?.strDepartment
//                     ? "Edit Department"
//                     : "Create Department"
//                 }
//                 onHide={handleClose}
//                 size="lg"
//                 backdrop="static"
//                 classes="default-modal"
//                 orgId={orgId}
//                 buId={buId}
//                 setRowDto={setRowDto}
//                 setAllData={setAllData}
//                 singleData={singleData}
//                 setSingleData={setSingleData}
//               />
//             </Form>
//           </>
//         )}
//       </Formik>
//     </>
//   );
// }

// export default Department;

// /*

//   <table className="table">
//                             <thead>
//                               <tr>
//                                 <th style={{ width: "30px" }}>
//                                   <div>SL</div>
//                                 </th>
//                                 <th>
//                                   <div
//                                     className="sortable"
//                                     onClick={() => {
//                                       setViewOrder(
//                                         viewOrder === "desc" ? "asc" : "desc"
//                                       );
//                                       commonSortByFilter(
//                                         viewOrder,
//                                         "strDepartment"
//                                       );
//                                     }}
//                                   >
//                                     <span>Department</span>
//                                     <div>
//                                       <SortingIcon
//                                         viewOrder={viewOrder}
//                                       ></SortingIcon>
//                                     </div>
//                                   </div>
//                                 </th>
//                                 <th>
//                                   <div className="table-th">
//                                     Department Section
//                                   </div>
//                                 </th>
//                                 <th>
//                                   <div className="table-th">Business Unit</div>
//                                 </th>
//                                 <th>
//                                   <div className="table-th d-flex align-items-center">
//                                     Status
//                                     <span>
//                                       <Select
//                                         sx={{
//                                           "& .MuiOutlinedInput-notchedOutline":
//                                             {
//                                               border: "none !important",
//                                             },
//                                           "& .MuiSelect-select": {
//                                             paddingRight: "22px !important",
//                                             marginTop: "-15px",
//                                           },
//                                         }}
//                                         className="selectBtn"
//                                         name="status"
//                                         IconComponent={
//                                           status && status !== "Active"
//                                             ? ArrowDropUp
//                                             : ArrowDropDown
//                                         }
//                                         value={values?.status}
//                                         onChange={(e) => {
//                                           setFieldValue("status", "");
//                                           setStatus(e.target.value?.label);
//                                           statusTypeFilter(
//                                             e.target.value?.label
//                                           );
//                                         }}
//                                       >
//                                         {statusDDL?.length > 0 &&
//                                           statusDDL?.map((item, index) => {
//                                             return (
//                                               <MenuItem
//                                                 key={index}
//                                                 value={item}
//                                               >
//                                                 {item?.label}
//                                               </MenuItem>
//                                             );
//                                           })}
//                                       </Select>
//                                     </span>
//                                   </div>
//                                 </th>
//                                 <th></th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {rowDto?.map((item, index) => {
//                                 return (
//                                   <DepartmentTableItem
//                                     {...item}
//                                     item={item}
//                                     handleOpen={handleOpen}
//                                     handleClose={handleClose}
//                                     setOpen={setOpen}
//                                     setViewModal={setViewModal}
//                                     orgId={orgId}
//                                     buId={buId}
//                                     setLoading={setLoading}
//                                     setSingleData={setSingleData}
//                                     permission={permission}
//                                     index={index}
//                                     key={index}
//                                   />
//                                 );
//                               })}
//                             </tbody>
//                           </table>

// */

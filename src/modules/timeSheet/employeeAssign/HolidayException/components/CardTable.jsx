// import { CreateOutlined, InfoOutlined } from "@mui/icons-material";
// import { toast } from "react-toastify";
// import AntTable from "../../../../../common/AntTable";
// import AvatarComponent from "../../../../../common/AvatarComponent";
// import FormikCheckBox from "../../../../../common/FormikCheckbox";
// import { LightTooltip } from "../../../../../common/LightTooltip";
// import { gray900, greenColor } from "../../../../../utility/customColor";
// import { dateFormatterForInput } from "../../../../../utility/dateFormatter";
// import "../holidayException.css";
// import NoResult from "../../../../../common/NoResult";
// import { useState } from "react";
// import PeopleDeskTable, {
//   paginationSize,
// } from "../../../../../common/peopleDeskTable";

// const CardTable = ({ objProps }) => {
//   const {
//     setShow,
//     singleData,
//     setSingleData,
//     setIsMulti,
//     setIsEdit,
//     permission,
//     rowDto,
//     setRowDto,
//     checked,
//     setChecked,
//     isAlreadyPresent,
//     pages,
//     handleTableChange,
//     landingLoading,
//     setPages,
//     getData,
//     values,
//     wgName,
//     initHeaderList,
//     filterOrderList,
//     setFilterOrderList,
//     initialHeaderListData,
//     setInitialHeaderListData,
//     headerList,
//     setHeaderList,
//     checkedHeaderList,
//     setCheckedHeaderList,
//     checkedList,
//     setCheckedList,
//   } = objProps;

//   // const initHeaderList = {
//   //   strDepartmentList: [],
//   //   strDesignationList: [],
//   //   strSupervisorNameList: [],
//   //   strEmploymentTypeList: [],
//   //   strLinemanagerList: [],
//   //   wingNameList: [],
//   //   soleDepoNameList: [],
//   //   regionNameList: [],
//   //   areaNameList: [],
//   //   territoryNameList: [],
//   // };

//   // const [filterOrderList, setFilterOrderList] = useState([]);
//   // const [initialHeaderListData, setInitialHeaderListData] = useState({});
//   // const [headerList, setHeaderList] = useState({});
//   // const [checkedHeaderList, setCheckedHeaderList] = useState({
//   //   ...initHeaderList,
//   // });
//   // const [checkedList, setCheckedList] = useState([]);

//   const handleChangePage = (_, newPage, searchText) => {
//     setPages((prev) => {
//       return { ...prev, current: newPage };
//     });

//     getData(
//       {
//         current: newPage,
//         pageSize: pages?.pageSize,
//         total: pages?.total,
//       },
//       searchText,
//       checkedList,
//       -1,
//       filterOrderList,
//       checkedHeaderList
//     );
//   };

//   const handleChangeRowsPerPage = (event, searchText) => {
//     setPages((prev) => {
//       return { current: 1, total: pages?.total, pageSize: +event.target.value };
//     });
//     getData(
//       {
//         current: 1,
//         pageSize: +event.target.value,
//         total: pages?.total,
//       },
//       searchText,
//       checkedList,
//       -1,
//       filterOrderList,
//       checkedHeaderList
//     );
//   };

//   return (
//     <>
//       <div className="table-card-body">
//         <div className="table-card-styled tableOne">
//           {rowDto?.length > 0 ? (
//             <>
//               <PeopleDeskTable
//                 columnData={columns(
//                   pages?.current,
//                   pages?.pageSize,
//                   headerList
//                 )}
//                 pages={pages}
//                 rowDto={rowDto}
//                 setRowDto={setRowDto}
//                 checkedList={checkedList}
//                 setCheckedList={setCheckedList}
//                 checkedHeaderList={checkedHeaderList}
//                 setCheckedHeaderList={setCheckedHeaderList}
//                 handleChangePage={(e, newPage) =>
//                   handleChangePage(e, newPage, values?.search)
//                 }
//                 handleChangeRowsPerPage={(e) =>
//                   handleChangeRowsPerPage(e, values?.search)
//                 }
//                 filterOrderList={filterOrderList}
//                 setFilterOrderList={setFilterOrderList}
//                 uniqueKey="employeeCode"
//                 getFilteredData={(
//                   currentFilterSelection,
//                   updatedFilterData,
//                   updatedCheckedHeaderData
//                 ) => {
//                   getData(
//                     {
//                       current: 1,
//                       pageSize: paginationSize,
//                       total: 0,
//                     },
//                     "",
//                     currentFilterSelection,
//                     updatedFilterData,
//                     updatedCheckedHeaderData
//                   );
//                 }}
//                 isCheckBox={true}
//                 isScrollAble={false}
//               />
//               {/* <AntTable
//                 data={resHolidayLanding}
//                 columnsData={columns()}
//                 onRowClick={(dataRow) => {}}
//                 pages={pages?.pageSize}
//                 pagination={pages}
//                 handleTableChange={handleTableChange}
//                 rowKey={(record) => record?.EmployeeCode}
//               /> */}
//             </>
//           ) : (
//             !landingLoading && <NoResult />
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default CardTable;

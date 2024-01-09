import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";
import { IconButton, Tooltip, Alert } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { labelChangeByOrgId } from "utility/strLabelChange";
import { DataTable, TableButton } from "Components";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  const dispatch = useDispatch();
  // const debounce = useDebounce();
  const [tableData, setTableData] = useState([]);
  const [deletedRow, setDeletedRow] = useState([]);

  const savePipeline = useApiRequest({});
  const getPipelineDetails = useApiRequest({});
  const getWgDDL = useApiRequest({});
  const getWDDL = useApiRequest({});
  const getPipelineDDL = useApiRequest({});
  const getUserGroupDDL = useApiRequest({});
  const { supervisor } = useSelector(
    (state) => state?.auth?.keywords,
    shallowEqual
  );
  const approverDDL = (orgId) => {
    switch (orgId) {
      case 10015:
        return [
          { value: 1, label: supervisor || "Reporting Line" },
          { value: 2, label: "Team Leader" },
          { value: 3, label: "User Group" },
        ];
      default:
        return [
          { value: 1, label: supervisor || "Supervisor" },
          { value: 2, label: "Line Manager" },
          { value: 3, label: "User Group" },
        ];
    }
  };
  const { orgId, buId, employeeId, wgId, wId, wName, wgName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // ddls
  useEffect(() => {
    getWgDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        // id: singleData?.intBusinessUnitId,
        DDLType: "WorkplaceGroup",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: employeeId || 0,
        // intWorkplaceId: wId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
    getWDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        // id: singleData?.intBusinessUnitId,
        DDLType: "Workplace",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: employeeId || 0,
        // intWorkplaceId: wId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
    getUserGroupDDL.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        // id: singleData?.intBusinessUnitId,
        DDLType: "usergroup",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: employeeId || 0,
        // intWorkplaceId: wId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.UserGroupName;
          res[i].value = item?.UserGroupId;
        });
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, wgId]);
  useEffect(() => {
    getPipelineDDL.action({
      urlKey: "ApprovalPipelineDDL",
      method: "GET",
      params: {
        employeeId: employeeId || 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strDisplayName;
          res[i].value = item?.strApplicationType;
        });
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);
  // states

  // Pages Start From Here code from above will be removed soon

  // Form Instance
  const [form] = Form.useForm();
  // submit
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    if (!tableData?.length)
      return toast.warn(
        `Please add at least one approver to save ${values?.pipelineName?.label} pipeline`
      );
    let payload = {
      isActive: true,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
      intPipelineHeaderId: singleData?.intPipelineHeaderId || 0,
      strPipelineName: values?.pipelineName?.label,
      strApplicationType: values?.pipelineName?.value,
      strRemarks: values?.remarks || "",
      intAccountId: orgId,
      intBusinessUnitId: buId,
      intWorkplaceGroupId: values?.orgName?.value || wgId,
      intWorkplaceId: values?.workplace?.value || wId,
      isValidate: true,
      approvalPipelineRowViewModelList: [...tableData, ...deletedRow],
    };
    savePipeline.action({
      urlKey: "ApprovalPipelineCreateNUpdate",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };

  useEffect(() => {
    if (singleData) {
      form.setFieldsValue({
        ...singleData,
        pipelineName: {
          value: singleData?.strApplicationType,
          label: singleData?.strPipelineName,
        },
      });
    }
    if (singleData?.intPipelineHeaderId) {
      getPipelineDetails.action({
        urlKey: "ApprovalPipelineHeaderDetailsById",
        method: "GET",
        params: {
          // id: singleData?.intBusinessUnitId,
          headerId: singleData?.intPipelineHeaderId,
          intWorkplaceGroupId: wgId,
          BusinessUnitId: buId,
          intBusinessUnitId: buId,
        },
        onSuccess: (data) => {
          const newdata = data?.globalPipelineRowList?.map((item) => ({
            approver: item?.globalPipelineRow?.isSupervisor
              ? supervisor || labelChangeByOrgId(orgId, "Supervisor")
              : item?.globalPipelineRow?.isLineManager
              ? labelChangeByOrgId(orgId, "Line Manager")
              : "User Group",
            userGroup: item?.userGroupHeader?.strUserGroup || "",
            intPipelineRowId: item?.globalPipelineRow?.intPipelineRowId,
            intPipelineHeaderId: item?.globalPipelineRow?.intPipelineHeaderId,
            isSupervisor: item?.globalPipelineRow?.isSupervisor,
            isLineManager: item?.globalPipelineRow?.isLineManager,
            intUserGroupHeaderId: item?.globalPipelineRow?.intUserGroupHeaderId,
            intShortOrder: item?.globalPipelineRow?.intShortOrder,
            isCreate: false,
            isDelete: false,
            strStatusTitle: item?.globalPipelineRow?.strStatusTitle,
          }));
          setTableData(newdata);
        },
      });
    }
  }, [singleData]);
  const remover = (payload) => {
    const filterArr = tableData.filter((itm, idx) => idx !== payload);
    setTableData(filterArr);
  };
  // Header
  const header = [
    {
      title: "SL",
      render: (_, rec, index) => index + 1,
      align: "center",
      width: 50,
    },
    {
      title: "Approver",
      dataIndex: "approver",
      sorter: true,
    },
    {
      title: "Sequence Order",
      dataIndex: "intShortOrder",
      sorter: true,
    },
    {
      title: "Status Title",
      dataIndex: "strStatusTitle",
      sorter: true,
    },
    {
      title: "User Group",
      dataIndex: "userGroup",
      sorter: true,
    },

    {
      width: 50,
      align: "center",
      render: (_, rec, index) => (
        <>
          <TableButton
            buttonsList={[
              {
                type: "delete",
                onClick: (e) => {
                  e.stopPropagation();
                  // store deleted data,we have to send it to back end for edit
                  const data = [...deletedRow];
                  data.push({
                    ...rec,
                    isCreate: false,
                    isDelete: true,
                  });
                  setDeletedRow(data);
                  remover(index);
                },
              },
            ]}
          />
        </>
      ),
    },
  ];
  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          submitHandler({
            values,
            getData,
            resetForm: form.resetFields,
            setIsAddEditForm,
            isEdit,
          });
        }}
        initialValues={{
          orgName: { value: wgId, label: wgName },
          workplace: { value: wId, label: wName },
        }}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PSelect
              options={getWgDDL?.data?.length > 0 ? getWgDDL?.data : []}
              name="orgName"
              label="Workplace Group"
              showSearch
              filterOption={true}
              placeholder="Workplace Group"
              onChange={(value, op) => {
                form.setFieldsValue({
                  orgName: op,
                  workplace: undefined,
                });
                getWDDL.action({
                  urlKey: "PeopleDeskAllDDL",
                  method: "GET",
                  params: {
                    // id: singleData?.intBusinessUnitId,
                    DDLType: "Workplace",
                    WorkplaceGroupId: op?.value,
                    BusinessUnitId: buId,
                    intId: employeeId || 0,
                    // intWorkplaceId: wId,
                  },
                  onSuccess: (res) => {
                    res.forEach((item, i) => {
                      res[i].label = item?.strWorkplace;
                      res[i].value = item?.intWorkplaceId;
                    });
                  },
                });
              }}
              rules={[
                { required: true, message: "Workplace Group is required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={getWDDL?.data?.length > 0 ? getWDDL?.data : []}
              name="workplace"
              label="Workplace"
              showSearch
              filterOption={true}
              placeholder="Workplace"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplace: op,
                });
              }}
              rules={[{ required: true, message: "Workplace is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={
                getPipelineDDL?.data?.length > 0 ? getPipelineDDL?.data : []
              }
              name="pipelineName"
              label="Pipeline Name"
              showSearch
              filterOption={true}
              placeholder="Pipeline Name"
              onChange={(value, op) => {
                form.setFieldsValue({
                  pipelineName: op,
                });
              }}
              rules={[{ required: true, message: "Pipeline Name is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="remarks"
              label="Remarks"
              placeholder="Remarks"
              // rules={[{ required: true, message: "remarks is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PSelect
              options={approverDDL(orgId)}
              name="approver"
              label="Approver"
              showSearch
              filterOption={true}
              placeholder="Approver"
              onChange={(value, op) => {
                form.setFieldsValue({
                  approver: op,
                  strTitle: `Approve By ${op?.label}`,
                  userGroup: undefined,
                });
              }}
              // rules={[{ required: true, message: "Approver is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="text"
              name="strTitle"
              label="Approve Status"
              placeholder="Approve Status"
              // rules={[{ required: true, message: "remarks is required" }]}
            />
          </Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { approver } = form.getFieldsValue();

              // const empType = employeeType?.label;

              return (
                <>
                  {approver?.value === 3 ? (
                    <Col md={24} sm={24}>
                      <PSelect
                        options={
                          getUserGroupDDL?.data?.length > 0
                            ? getUserGroupDDL?.data
                            : []
                        }
                        name="userGroup"
                        label="User Group"
                        showSearch
                        filterOption={true}
                        placeholder="User Group"
                        onChange={(value, op) => {
                          form.setFieldsValue({
                            userGroup: op,
                          });
                        }}
                        rules={[
                          { required: true, message: "User Group is required" },
                        ]}
                      />
                    </Col>
                  ) : null}
                </>
              );
            }}
          </Form.Item>
          <Col md={12} sm={24}>
            <PSelect
              options={[
                { value: 1, label: "1" },
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
                { value: 5, label: "5" },
                { value: 6, label: "6" },
                { value: 7, label: "7" },
                { value: 8, label: "8" },
                { value: 9, label: "9" },
                { value: 10, label: "10" },
                { value: 11, label: "11" },
                { value: 12, label: "12" },
                { value: 13, label: "13" },
                { value: 14, label: "14" },
                { value: 15, label: "15" },
                { value: 16, label: "16" },
                { value: 17, label: "17" },
                { value: 18, label: "18" },
                { value: 19, label: "19" },
                { value: 20, label: "20" },
              ]}
              name="sequence"
              label="Sequence Order"
              showSearch
              filterOption={true}
              placeholder="Sequence Order"
              onChange={(value, op) => {
                form.setFieldsValue({
                  sequence: op,
                });
              }}
              rules={
                [
                  // { required: true, message: "Sequence Order is required" },
                ]
              }
            />
          </Col>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { orgName, userGroup, strTitle, sequence, approver } =
                form.getFieldsValue();

              // const empType = employeeType?.label;

              return (
                <>
                  <Col span={2} className="mt-1">
                    <button
                      type="button"
                      className="mt-4  btn add-ddl-btn "
                      style={{
                        margin: "0.4em 0 0 0.7em",
                        padding: "0.2em",
                      }}
                      onClick={() => {
                        if (sequence === undefined || approver === undefined) {
                          return toast.warn(
                            "Please fill up the sequence and approver field"
                          );
                        }
                        if (approver?.value === 3 && userGroup === undefined) {
                          return toast.warn(
                            "Please fill up the User Group field"
                          );
                        }
                        let exists = tableData.filter(
                          (item) =>
                            item?.approver === approver?.label &&
                            approver?.label !== "User Group"
                        );

                        let sequenceExists = tableData.filter(
                          (item) => item?.intShortOrder === sequence?.value
                        );

                        let userGroupExists = tableData.filter(
                          (item) =>
                            item?.intUserGroupHeaderId === userGroup?.value
                        );

                        if (exists?.length > 0)
                          return toast.warn("Already exists approver");
                        if (sequenceExists?.length > 0)
                          return toast.warn("Already exists sequence");
                        if (userGroupExists?.length > 0)
                          return toast.warn("Already exists user group");

                        const data = [...tableData];
                        const obj = {
                          approver: approver?.label,
                          userGroup: userGroup?.label || "",
                          intPipelineRowId: 0,
                          intPipelineHeaderId: 0,
                          isSupervisor: approver?.value === 1,
                          isLineManager: approver?.value === 2,
                          intUserGroupHeaderId: userGroup?.value || 0,
                          intShortOrder: sequence?.value,
                          isCreate: true,
                          isDelete: false,
                          strStatusTitle: strTitle,
                        };
                        data.push(obj);

                        setTableData(data);
                        form.setFieldsValue({
                          sequence: undefined,
                          approver: undefined,
                          strTitle: undefined,
                          userGroup: undefined,
                        });
                      }}
                    >
                      <IoMdAddCircleOutline sx={{ fontSize: "16px" }} />
                    </button>
                  </Col>
                </>
              );
            }}
          </Form.Item>
          <Col md={24} sm={24} style={{ marginTop: "1rem" }}>
            {tableData?.length > 0 && (
              <DataTable
                bordered
                data={tableData?.length > 0 ? tableData : []}
                // loading={landingApi?.loading}
                header={header}
              />
              // <div
              //   className="table-card-body pt-3 "
              //   style={{ marginLeft: "-1em" }}
              // >
              //   <div
              //     className=" table-card-styled tableOne"
              //     style={{ padding: "0px 12px" }}
              //   >
              //     {/* <table className="table align-middle">
              //       <thead style={{ color: "#212529" }}>
              //         <tr>
              //           <th>
              //             <div className="d-flex align-items-center">
              //               Approver
              //             </div>
              //           </th>
              //           <th>
              //             <div className="d-flex align-items-center">
              //               Sequence Order
              //             </div>
              //           </th>
              //           <th>
              //             <div className="d-flex align-items-center">
              //               Status Title
              //             </div>
              //           </th>
              //           <th>
              //             <div className="d-flex align-items-center">
              //               User Group
              //             </div>
              //           </th>
              //           <th>
              //             <div className="d-flex align-items-center justify-content-end">
              //               Action
              //             </div>
              //           </th>
              //         </tr>
              //       </thead>
              //       <tbody>
              //         {tableData?.length > 0 && (
              //           // <>
              //           //   {tableData.map((item, index) => {
              //           //     return (
              //           //       <tr key={index}>
              //           //         <td>{item?.approver}</td>
              //           //         <td>{item?.intShortOrder}</td>
              //           //         <td>{item?.strStatusTitle}</td>
              //           //         <td>{item?.userGroup || "N/A"}</td>
              //           //         <td>
              //           //           <div className="d-flex align-items-end justify-content-end">
              //           //             <IconButton
              //           //               type="button"
              //           //               style={{
              //           //                 height: "25px",
              //           //                 width: "25px",
              //           //               }}
              //           //               onClick={(e) => {
              //           //                 e.stopPropagation();
              //           //                 remover(index);
              //           //                 // deleteRow(item?.intWorkplaceId);
              //           //               }}
              //           //             >
              //           //               <Tooltip title="Delete">
              //           //                 <DeleteOutline
              //           //                   sx={{
              //           //                     height: "25px",
              //           //                     width: "25px",
              //           //                   }}
              //           //                 />
              //           //               </Tooltip>
              //           //             </IconButton>
              //           //           </div>
              //           //         </td>
              //           //       </tr>
              //           //     );
              //           //   })}
              //           // </>

              //         )}
              //       </tbody>
              //     </table> */}
              //   </div>
              // </div>
            )}
          </Col>
        </Row>
        <ModalFooter
          onCancel={() => {
            setId("");
            setIsAddEditForm(false);
          }}
          submitAction="submit"
          loading={loading}
        />
      </PForm>
    </>
  );
}
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// import { Close, DeleteOutline } from "@mui/icons-material";
// import { IconButton, Tooltip } from "@mui/material";
// import { Form, Formik } from "formik";
// import { useEffect, useState } from "react";
// import { Modal } from "react-bootstrap";
// import { shallowEqual, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import {
//   getPeopleDeskAllDDL,
//   getPeopleDeskWithoutAllDDL,
// } from "../../../../common/api";
// import FormikInput from "../../../../common/FormikInput";
// import FormikSelect from "../../../../common/FormikSelect";
// import Loading from "../../../../common/loading/Loading";
// import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
// import useAxiosPost from "../../../../utility/customHooks/useAxiosPost";
// import { customStyles } from "../../../../utility/selectCustomStyle";
// import { labelChangeByOrgId } from "../../../../utility/strLabelChange";
// import { todayDate } from "../../../../utility/todayDate";
// import { organizationTypeList, setOrganizationDDLFunc } from "../helper";

// const initData = {
//   pipelineName: "",
//   remarks: "",
//   sequence: "",
//   approver: "",
//   userGroup: "",
//   orgName: "",
//   workplace: "",
//   // wing: "",
//   // soleDepo: "",
//   // region: "",
//   // area: "",
//   // territory: "",
// };

// export default function AddEditFormComponent({
//   id,
//   show,
//   setOpenModal,
//   size,
//   backdrop,
//   classes,
//   isVisibleHeading = true,
//   fullscreen,
//   title,
//   getData,
//   singleData,
//   setSingleData,
//   pages,
// }) {
//   const [loading, setLoading] = useState(false);
//   const [loader, setLoader] = useState(false);
//   const [userGroupDDL, setUserGroupDDL] = useState([]);
//   const [pipelineDDL, setPipelineDDL] = useState([]);
//   const [rowDto, setRowDto] = useState([]);
//   const [, saveAction, saveLoading] = useAxiosPost();
//   const [, getRowDto, apiLoading, setterRow] = useAxiosGet();
//   const [deletedRow, setDeletedRow] = useState([]);
//   const [organizationDDL, setOrganizationDDL] = useState([]);
//   const [workPlaceDDL, setWorkPlaceDDL] = useState([]);

//   // const [wingDDL, setWingDDL] = useState([]);
//   // const [soleDepoDDL, setSoleDepoDDL] = useState([]);
//   // const [regionDDL, setRegionDDL] = useState([]);
//   // const [areaDDL, setAreaDDL] = useState([]);
//   // const [territoryDDL, setTerritoryDDL] = useState([]);
//   const [singlePermission, setSinglePermission] = useState({});
//   const [isEdit, setIsEdit] = useState(false);

//   const { orgId, buId, employeeId, wgId, wId, wgName, wName } =
//     useSelector((state) => state?.auth?.profileData, shallowEqual);
//   const { supervisor } = useSelector(
//     (state) => state?.auth?.keywords,
//     shallowEqual
//   );

//   // handler
//   const addHandler = (values) => {
//     // if (!values?.workplace) return toast.warn("Please select workplace type");
//     // if (!values?.orgName) return toast.warn("Please select workplaceGroup ");
//     // if (values?.orgName?.label === "Marketing" && !values?.wing)
//     //   return toast.warn("Please select wing");
//     // if (values?.wing?.value > 0 && !values?.soleDepo)
//     //   return toast.warn("Please select soleDepo");
//     // if (values?.soleDepo?.value > 0 && !values?.region)
//     //   return toast.warn("Please select region");
//     // if (values?.region?.value > 0 && !values?.area)
//     //   return toast.warn("Please select area");
//     // if (values?.area?.value > 0 && !values?.territory)
//     //   return toast.warn("Please select territory");
//     if (!values?.approver) return toast.warn("Please select approver");
//     if (!values?.sequence) return toast.warn("Please select sequence");
//     if (!values?.strTitle) return toast.warn("Please enter status title");
//     if (values?.approver?.label === "User Group" && !values?.userGroup)
//       return toast.warn("Please select user group");

//     let exists = rowDto.filter(
//       (item) =>
//         item?.approver === values?.approver?.label &&
//         values?.approver?.label !== "User Group"
//     );

//     let sequenceExists = rowDto.filter(
//       (item) => item?.intShortOrder === values?.sequence?.value
//     );

//     let userGroupExists = rowDto.filter(
//       (item) => item?.intUserGroupHeaderId === values?.userGroup?.value
//     );

//     if (exists?.length > 0) return toast.warn("Already exists approver");
//     if (sequenceExists?.length > 0)
//       return toast.warn("Already exists sequence");
//     if (userGroupExists?.length > 0)
//       return toast.warn("Already exists user group");

//     const data = [...rowDto];
//     const obj = {
//       approver: values?.approver?.label,
//       userGroup: values?.userGroup?.label || "",
//       intPipelineRowId: 0,
//       intPipelineHeaderId: 0,
//       isSupervisor: values?.approver?.value === 1,
//       isLineManager: values?.approver?.value === 2,
//       intUserGroupHeaderId: values?.userGroup?.value || 0,
//       intShortOrder: values?.sequence?.value,
//       isCreate: true,
//       isDelete: false,
//       strStatusTitle: values?.strTitle,
//     };
//     data.push(obj);
//     setRowDto(data);
//   };
//   const deleteHandler = (index) => {
//     const newData = rowDto.filter((item, ind) => ind !== index);
//     setRowDto(newData);
//   };

//   useEffect(() => {
//     getPeopleDeskAllDDL(
//       `/ApprovalPipeline/ApprovalPipelineDDL?employeeId=${employeeId}`,
//       "strApplicationType",
//       "strDisplayName",
//       setPipelineDDL
//     );
//     getPeopleDeskAllDDL(
//       `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=usergroup&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=0`,
//       "UserGroupId",
//       "UserGroupName",
//       setUserGroupDDL
//     );
//   }, [orgId, buId]);

//   const saveHandler = (values, cb) => {
//     if (!values?.pipelineName) return toast.warn("Please enter pipeline name");
//     if (!rowDto?.length)
//       return toast.warn(
//         `Please add at least one approver to save ${values?.pipelineName?.label} pipeline`
//       );
//     let payload = {
//       isActive: true,
//       dteCreatedAt: todayDate(),
//       intCreatedBy: employeeId,
//       dteUpdatedAt: todayDate(),
//       intUpdatedBy: employeeId,
//       intPipelineHeaderId: singleData?.intPipelineHeaderId || 0,
//       strPipelineName: values?.pipelineName?.label,
//       strApplicationType: values?.pipelineName?.value,
//       strRemarks: values?.remarks || "",
//       intAccountId: orgId,
//       intBusinessUnitId: buId,
//       intWorkplaceGroupId: values?.orgName?.value || wgId,
//       intWorkplaceId: values?.workplace?.value || wId,
//       // intWorkplaceGroupId: values?.orgName?.value || 0,
//       // intWorkplaceId: values?.workplace?.value,
//       // intTerritoryId: values?.territory?.value,
//       // intAreaId: values?.area?.value,
//       // intRegionId: values?.region?.value,
//       // intSoleDepoId: values?.soleDepo?.value,
//       // intWingId: values?.wing?.value,

//       isValidate: true,
//       approvalPipelineRowViewModelList: [...rowDto, ...deletedRow],
//     };
//     saveAction(
//       `/ApprovalPipeline/ApprovalPipelineCreateNUpdate`,
//       payload,
//       cb,
//       true
//     );
//   };
//   useEffect(() => {
//     // empty row first for create and edit,then fill up data if it is edit
//     setSinglePermission({});
//     setRowDto([]);
//     setIsEdit(false);
//     setDeletedRow([]);
//     setLoader(false);
//     if (singleData?.intPipelineHeaderId) {
//       setIsEdit(true);
//       setLoader(true);

//       getRowDto(
//         `/ApprovalPipeline/ApprovalPipelineHeaderDetailsById?headerId=${singleData?.intPipelineHeaderId}&intBusinessUnitId=${buId}&intWorkplaceGroupId=${wgId}`,
//         (data) => {
//           setSinglePermission({
//             pipelineName: {
//               value: singleData?.pipelineName?.value,
//               label: singleData?.pipelineName?.label,
//             },

//             remarks: singleData?.remarks,
//             intPipelineHeaderId: singleData?.intPipelineHeaderId,
//             orgName: {
//               value: data?.globalPipelineHeader?.intWorkplaceGroupId,
//               label: data?.globalPipelineHeader?.strWorkPlaceGroupName,
//             },
//             workplace: {
//               value: data?.globalPipelineHeader?.intWorkplaceId,
//               label: data?.globalPipelineHeader?.strWorkPlaceName,
//             },
//             // wing: {
//             //   value: data?.globalPipelineHeader?.intWingId,
//             //   label: data?.globalPipelineHeader?.wing,
//             // },
//             // soleDepo: {
//             //   value: data?.globalPipelineHeader?.intSoleDepoId,
//             //   label: data?.globalPipelineHeader?.soleDepo,
//             // },
//             // region: {
//             //   value: data?.globalPipelineHeader?.intRegionId,
//             //   label: data?.globalPipelineHeader?.reagion,
//             // },
//             // area: {
//             //   value: data?.globalPipelineHeader?.intAreaId,
//             //   label: data?.globalPipelineHeader?.area,
//             // },
//             // territory: {
//             //   value: data?.globalPipelineHeader?.intTerritoryId,
//             //   label: data?.globalPipelineHeader?.territory,
//             // },
//           });

//           const newdata = data?.globalPipelineRowList?.map((item) => ({
//             approver: item?.globalPipelineRow?.isSupervisor
//               ? supervisor || labelChangeByOrgId(orgId, "Supervisor")
//               : item?.globalPipelineRow?.isLineManager
//               ? labelChangeByOrgId(orgId, "Line Manager")
//               : "User Group",
//             userGroup: item?.userGroupHeader?.strUserGroup || "",
//             intPipelineRowId: item?.globalPipelineRow?.intPipelineRowId,
//             intPipelineHeaderId: item?.globalPipelineRow?.intPipelineHeaderId,
//             isSupervisor: item?.globalPipelineRow?.isSupervisor,
//             isLineManager: item?.globalPipelineRow?.isLineManager,
//             intUserGroupHeaderId: item?.globalPipelineRow?.intUserGroupHeaderId,
//             intShortOrder: item?.globalPipelineRow?.intShortOrder,
//             isCreate: false,
//             isDelete: false,
//             strStatusTitle: item?.globalPipelineRow?.strStatusTitle,
//           }));
//           setRowDto(newdata);
//           setLoader(false);
//         }
//       );
//     }
//   }, [singleData]);
//   const approverDDL = (orgId) => {
//     switch (orgId) {
//       case 10015:
//         return [
//           { value: 1, label: supervisor || "Reporting Line" },
//           { value: 2, label: "Team Leader" },
//           { value: 3, label: "User Group" },
//         ];
//       default:
//         return [
//           { value: 1, label: supervisor || "Supervisor" },
//           { value: 2, label: "Line Manager" },
//           { value: 3, label: "User Group" },
//         ];
//     }
//   };
//   useEffect(() => {
//     getPeopleDeskAllDDL(
//       `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=WorkplaceGroup&WorkplaceGroupId=${wgId}&BusinessUnitId=${buId}&intId=${employeeId}`,
//       "intWorkplaceGroupId",
//       "strWorkplaceGroup",
//       setOrganizationDDL
//     );
//   }, [buId]);
//   useEffect(() => {}, [buId]);
//   return (
//     <>
//       <Formik
//         enableReinitialize={true}
//         initialValues={
//           singleData?.intPipelineHeaderId
//             ? singlePermission
//             : { initData, orgName: { value: wgId, label: wgName }, workplace:{value:wId, label: wName} }
//         }
//         onSubmit={(values, { setSubmitting, resetForm }) => {
//           saveHandler(values, () => {
//             getData(pages);
//             resetForm(initData);
//             setOpenModal(false);
//             setRowDto([]);
//             setSingleData(null);
//           });
//         }}
//       >
//         {({
//           handleSubmit,
//           resetForm,
//           values,
//           errors,
//           touched,
//           setFieldValue,
//           isValid,
//           setValues,
//         }) => (
//           <>
//             {(loading || saveLoading) && <Loading />}
//             <div className="viewModal">
//               <Modal
//                 show={show}
//                 onHide={() => {
//                   setOpenModal(false);
//                   setRowDto([]);
//                   setDeletedRow([]);
//                   setSingleData(null);
//                 }}
//                 size={size}
//                 backdrop={backdrop}
//                 aria-labelledby="example-modal-sizes-title-xl"
//                 className={classes}
//                 fullscreen={fullscreen && fullscreen}
//               >
//                 <Form>
//                   {loader && <Loading />}
//                   {isVisibleHeading && (
//                     <Modal.Header className="bg-custom">
//                       <div className="d-flex w-100 justify-content-between align-items-center">
//                         <Modal.Title className="text-center">
//                           {title}
//                         </Modal.Title>
//                         <div>
//                           <IconButton
//                             onClick={() => {
//                               resetForm(initData);
//                               setOpenModal(false);
//                             }}
//                           >
//                             <Close />
//                           </IconButton>
//                         </div>
//                       </div>
//                     </Modal.Header>
//                   )}

//                   <Modal.Body id="example-modal-sizes-title-xl">
//                     <div className="pipeLineModal">
//                       <div className="modalBody px-0">
//                         <div className="row mx-0">
//                           {/* orgType */}
//                           {/* <div className="col-md-6">
//                             <label className="mb-2">Organization Type</label>
//                             <FormikSelect
//                               classes="input-sm"
//                               styles={customStyles}
//                               name="businessUnit"
//                               options={organizationTypeList || []}
//                               value={values?.orgType}
//                               onChange={(valueOption) => {
//                                 setFieldValue("orgName", "");
//                                 setFieldValue("orgType", valueOption);
//                                 setOrganizationDDLFunc(
//                                   orgId,
//                                   buId,
//                                   employeeId,
//                                   valueOption,
//                                   setOrganizationDDL
//                                 );
//                               }}
//                               errors={errors}
//                               touched={touched}
//                               placeholder=" "
//                             />
//                           </div> */}
//                           {/* workPlaceGroup */}
//                           <div className="col-md-6">
//                             <label className="mb-2">Workplace Group </label>
//                             <FormikSelect
//                               isDisabled={isEdit}
//                               classes="input-sm"
//                               styles={customStyles}
//                               name="orgName"
//                               options={organizationDDL || []}
//                               value={values?.orgName}
//                               onChange={(valueOption) => {
//                                 setLoader(true);
//                                 setFieldValue("orgName", valueOption);
//                                 setFieldValue("workplace", "");

//                                 getPeopleDeskAllDDL(
//                                   `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=Workplace&BusinessUnitId=${buId}&WorkplaceGroupId=${valueOption.value}&intId=${employeeId}`,
//                                   "intWorkplaceId",
//                                   "strWorkplace",
//                                   setWorkPlaceDDL
//                                 );
//                                 setLoader(false);
//                               }}
//                               errors={errors}
//                               touched={touched}
//                               placeholder=" "
//                               isClearable={false}
//                             />
//                           </div>
//                           {/* workPlace */}
//                           <div className="col-md-6">
//                             <label className="mb-2">Workplace </label>
//                             <FormikSelect
//                               isDisabled={isEdit}
//                               classes="input-sm"
//                               styles={customStyles}
//                               name="workplace"
//                               options={
//                                 [
//                                   {
//                                     value: 0,
//                                     label: "All",
//                                   },
//                                   ...workPlaceDDL,
//                                 ] || []
//                               }
//                               value={
//                                 values?.workplace || { value: -1, label: "" }
//                               }
//                               onChange={(valueOption) => {
//                                 setFieldValue("workplace", valueOption);
//                               }}
//                               errors={errors}
//                               touched={touched}
//                               placeholder=" "
//                               isClearable={true}
//                             />
//                           </div>

//                           {/* pipeline Name */}
//                           <div className="col-md-6">
//                             <label>Pipeline Name</label>
//                             <FormikSelect
//                               name="pipelineName"
//                               options={pipelineDDL || []}
//                               isDisabled={isEdit}
//                               value={values?.pipelineName}
//                               onChange={(valueOption) => {
//                                 setFieldValue("pipelineName", valueOption);
//                               }}
//                               menuPosition="fixed"
//                               placeholder=""
//                               styles={customStyles}
//                               errors={errors}
//                               touched={touched}
//                             />
//                           </div>
//                           <div className="col-md-6">
//                             <label>Remarks</label>
//                             <FormikInput
//                               classes="input-sm"
//                               value={values?.remarks}
//                               disabled={isEdit}
//                               name="remarks"
//                               type="text"
//                               className="form-control"
//                               placeholder=""
//                               onChange={(e) => {
//                                 setFieldValue("remarks", e.target.value);
//                               }}
//                               // disabled={id}
//                               errors={errors}
//                               touched={touched}
//                             />
//                           </div>
//                           <div className="col-md-6">
//                             <label>Approver</label>
//                             <FormikSelect
//                               name="approver"
//                               options={approverDDL(orgId) || []}
//                               value={values?.approver}
//                               onChange={(valueOption) => {
//                                 if (valueOption?.value) {
//                                   setFieldValue(
//                                     "strTitle",
//                                     `Approve By ${valueOption?.label}`
//                                   );
//                                 } else {
//                                   setFieldValue("strTitle", "");
//                                 }
//                                 setFieldValue("userGroup", "");
//                                 setFieldValue("approver", valueOption);
//                               }}
//                               placeholder=""
//                               menuPosition="fixed"
//                               styles={customStyles}
//                               errors={errors}
//                               touched={touched}
//                             />
//                           </div>
//                           <div className="col-md-6">
//                             <label>Approve Status</label>
//                             <FormikInput
//                               classes="input-sm"
//                               value={values?.strTitle}
//                               name="strTitle"
//                               // isDisabled={isEdit}
//                               type="text"
//                               className="form-control"
//                               placeholder=""
//                               onChange={(e) => {
//                                 // setFieldValue("strTitle", e.target.value);
//                               }}
//                               // disabled
//                               errors={errors}
//                               touched={touched}
//                             />
//                           </div>
//                           {values?.approver?.value === 3 && (
//                             <div className="col-md-6">
//                               <label>User Group</label>
//                               <FormikSelect
//                                 name="userGroup"
//                                 options={userGroupDDL || []}
//                                 value={values?.userGroup}
//                                 onChange={(valueOption) => {
//                                   setFieldValue("userGroup", valueOption);
//                                 }}
//                                 menuPosition="fixed"
//                                 placeholder=""
//                                 styles={customStyles}
//                                 errors={errors}
//                                 touched={touched}
//                               />
//                             </div>
//                           )}
//                           <div className="col-md-6">
//                             <div className="row">
//                               <div className="col-md-6">
//                                 <label>Sequence Order</label>
//                                 <FormikSelect
//                                   name="sequence"
//                                   options={[
//                                     { value: 1, label: "1" },
//                                     { value: 2, label: "2" },
//                                     { value: 3, label: "3" },
//                                     { value: 4, label: "4" },
//                                     { value: 5, label: "5" },
//                                     { value: 6, label: "6" },
//                                     { value: 7, label: "7" },
//                                     { value: 8, label: "8" },
//                                     { value: 9, label: "9" },
//                                     { value: 10, label: "10" },
//                                     { value: 11, label: "11" },
//                                     { value: 12, label: "12" },
//                                     { value: 13, label: "13" },
//                                     { value: 14, label: "14" },
//                                     { value: 15, label: "15" },
//                                     { value: 16, label: "16" },
//                                     { value: 17, label: "17" },
//                                     { value: 18, label: "18" },
//                                     { value: 19, label: "19" },
//                                     { value: 20, label: "20" },
//                                   ]}
//                                   value={values?.sequence}
//                                   onChange={(valueOption) => {
//                                     setFieldValue("sequence", valueOption);
//                                   }}
//                                   menuPosition="fixed"
//                                   placeholder=""
//                                   styles={customStyles}
//                                   errors={errors}
//                                   touched={touched}
//                                 />
//                               </div>
//                               <div
//                                 style={{
//                                   marginTop: "25px",
//                                 }}
//                                 className="col-md-6"
//                               >
//                                 <button
//                                   type="button"
//                                   className="btn btn-green btn-green-disable"
//                                   style={{ width: "auto" }}
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     addHandler(values);
//                                   }}
//                                 >
//                                   Add
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="table-card-body px-3">
//                             <div className="table-card-styled tableOne">
//                               <table className="table">
//                                 <thead>
//                                   <tr>
//                                     <th>
//                                       <div>Approver</div>
//                                     </th>
//                                     <th>
//                                       <div>Sequence Order</div>
//                                     </th>
//                                     <th>
//                                       <div>Status Title</div>
//                                     </th>
//                                     <th>
//                                       <div>User Group</div>
//                                     </th>
//                                     <th className="text-center">
//                                       <div>Action</div>
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {rowDto?.length > 0 &&
//                                     rowDto?.map((item, index) => (
//                                       <tr key={index}>
//                                         <td>
//                                           {" "}
//                                           <div className="tableBody-title">
//                                             {item?.approver}
//                                           </div>
//                                         </td>
//                                         <td>
//                                           {" "}
//                                           <div className="tableBody-title">
//                                             {item?.intShortOrder}
//                                           </div>
//                                         </td>
//                                         <td>
//                                           <div className="tableBody-title">
//                                             {item?.strStatusTitle}
//                                           </div>
//                                         </td>
//                                         <td>
//                                           <div className="tableBody-title">
//                                             {" "}
//                                             {item?.userGroup || "N/A"}
//                                           </div>
//                                         </td>
//                                         <td>
//                                           <div className="text-center tableBody-title">
//                                             <Tooltip title="Delete" arrow>
//                                               <IconButton
//                                                 type="button"
//                                                 style={{
//                                                   border: "none",
//                                                   padding: "5px",
//                                                 }}
//                                                 onClick={(e) => {
//                                                   // store deleted data,we have to send it to back end for edit
//                                                   e.stopPropagation();
//                                                   if (
//                                                     singleData?.intPipelineHeaderId &&
//                                                     item?.intPipelineRowId
//                                                   ) {
//                                                     const data = [
//                                                       ...deletedRow,
//                                                     ];
//                                                     data.push({
//                                                       ...item,
//                                                       isCreate: false,
//                                                       isDelete: true,
//                                                     });
//                                                     setDeletedRow(data);
//                                                   }
//                                                   deleteHandler(index);
//                                                 }}
//                                               >
//                                                 <DeleteOutline className="edit-icon-btn" />
//                                               </IconButton>
//                                             </Tooltip>
//                                           </div>
//                                         </td>
//                                       </tr>
//                                     ))}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </Modal.Body>
//                   <Modal.Footer className="form-modal-footer">
//                     <button
//                       type="button"
//                       className="btn btn-cancel"
//                       onClick={() => {
//                         resetForm(initData);
//                         setOpenModal(false);
//                         setSingleData(null);
//                         setRowDto([]);
//                         setDeletedRow([]);
//                       }}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="btn btn-green btn-green-disable"
//                       style={{ width: "auto" }}
//                       type="submit"
//                       onSubmit={() => handleSubmit()}
//                     >
//                       Save
//                     </button>
//                   </Modal.Footer>
//                 </Form>
//               </Modal>
//             </div>
//           </>
//         )}
//       </Formik>
//     </>
//   );
// }

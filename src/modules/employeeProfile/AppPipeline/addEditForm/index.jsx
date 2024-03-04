import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";
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
    const payload = {
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
      intWorkplaceId: values?.workplace?.value ? values?.workplace?.value : 0, //  || wId,
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
      toast: true,
    });
  };

  useEffect(() => {
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
          form.setFieldsValue({
            ...singleData,
            orgName: {
              value: data?.globalPipelineHeader?.intWorkplaceGroupId,
              label: data?.globalPipelineHeader?.strWorkPlaceGroupName,
            },
            workplace: {
              value: data?.globalPipelineHeader?.intWorkplaceId,
              label: data?.globalPipelineHeader?.strWorkPlaceName,
            },
            pipelineName: {
              value: singleData?.strApplicationType,
              label: singleData?.strPipelineName,
            },
            remarks: data?.globalPipelineHeader?.strRemarks,
          });
          const rowData = data?.globalPipelineRowList?.map((item) => ({
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
          setTableData(rowData);
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
        // workplace: { value: wId, label: wName },
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
            rules={[{ required: true, message: "Workplace Group is required" }]}
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
            // rules={[{ required: true, message: "Workplace is required" }]}
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
            const { userGroup, strTitle, sequence, approver } =
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
                      const exists = tableData.filter(
                        (item) =>
                          item?.approver === approver?.label &&
                          approver?.label !== "User Group"
                      );

                      const sequenceExists = tableData.filter(
                        (item) => item?.intShortOrder === sequence?.value
                      );

                      const userGroupExists = tableData.filter(
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
  );
}

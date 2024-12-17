import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Checkbox, Col, Form, InputNumber, Row } from "antd";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { labelChangeByOrgId } from "utility/strLabelChange";
import { DataTable } from "Components";
import { approverDDL, header, sequence, submitHandler } from "./helper";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  isEdit,
  singleData,
  setId,
}) {
  const [tableData, setTableData] = useState([]);
  const [deletedRow, setDeletedRow] = useState([]);
  const [isStrStatus, setIsStrStatus] = useState(false);
  const [randomCount, setRandomCount] = useState(false);

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

  const { orgId, buId, employeeId, wgId, wId, wName, wgName } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getWgDDL.action({
      urlKey: "WorkplaceGroupIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
    getWDDL.action({
      urlKey: "WorkplaceIdAll",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: wgId,
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
        DDLType: "usergroup",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: employeeId || 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.UserGroupName;
          res[i].value = item?.UserGroupId;
        });
      },
    });
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
  }, [orgId, buId]);

  // Form Instance
  const [form] = Form.useForm();
  // submit

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
          tableData,
          employeeId,
          singleData,
          orgId,
          buId,
          wgId,
          deletedRow,
          savePipeline,
        });
      }}
      initialValues={{
        orgName: { value: wgId, label: wgName },
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
                urlKey: "WorkplaceIdAll",
                method: "GET",
                params: {
                  accountId: orgId,
                  businessUnitId: buId,
                  workplaceGroupId: value,
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
            allowClear
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
          />
        </Col>
        <Col md={12} sm={24}>
          <PSelect
            options={approverDDL(orgId, supervisor)}
            name="approver"
            label="Approver"
            showSearch
            filterOption={true}
            placeholder="Approver"
            onChange={(value, op) => {
              form.setFieldsValue({
                approver: op,
                strTitle: `${op?.label}`,
                // strTitlePending: `${op?.label}`,
                userGroup: undefined,
              });
              setIsStrStatus(true);
            }}
          />
        </Col>
        <Col md={12} sm={24}>
          <PInput
            type="text"
            addOnBefore={isStrStatus && "Pre-Approved By"}
            name="strTitle"
            label="Pre-Approval Status"
            placeholder="Pre-Approval Status"
            disabled={!form.getFieldValue("approver")}
          />
        </Col>
        <Col md={12} sm={24}>
          <PInput
            type="text"
            addOnBefore={isStrStatus && "Pending Approval By"}
            name="strTitlePending"
            label="Pending Approval Status"
            placeholder="Pending Approval Status"
            disabled={!form.getFieldValue("approver")}
          />
        </Col>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { approver } = form.getFieldsValue();
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
        {/* <Col md={12} sm={24}>
          <PSelect
            options={sequence}
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
          />
        </Col> */}
        <Col md={4} sm={24} className="mt-4">
          <Form.Item name="randomCount" valuePropName="checked">
            <Checkbox
              onChange={(e) => {
                const checked = e.target.checked;
                form.setFieldsValue({
                  randomCount: checked,
                  randomCountValue: undefined,
                });
                setRandomCount(checked);
              }}
            >
              Random Count
            </Checkbox>
          </Form.Item>
        </Col>

        <Form.Item
          name="randomCountValue"
          className="mt-4"
          style={{
            display: randomCount ? "block" : "none",
            marginRight:"10px"
          }}
          rules={[
            {
              required: true,
              message: "Please enter a count",
            },
            {
              validator: (_, value) => {
                if (value > tableData.length) {
                  return Promise.reject(
                    "Count cannot be greater than table length"
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={1}
            max={tableData.length}
            placeholder="Enter Count"
            onChange={(value) =>
              form.setFieldsValue({ randomCountValue: value })
            }
          />
        </Form.Item>

        <Form.Item shouldUpdate noStyle>
          {() => {
            const { approver, userGroup, strTitle } = form.getFieldsValue();
            return (
              <>
                <Col span={2} className="mt-1">
                  <button
                    type="button"
                    className="mt-3 btn btn-green"
                    style={{
                      width: "auto",
                      height: "auto",
                    }}
                    onClick={() => {
                      if (approver === undefined) {
                        return toast.warn("Please fill up the approver field");
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

                      const userGroupExists = tableData.filter(
                        (item) =>
                          item?.intUserGroupHeaderId === userGroup?.value
                      );

                      if (exists?.length > 0)
                        return toast.warn("Already exists approver");
                      if (userGroupExists?.length > 0)
                        return toast.warn("Already exists user group");

                      // Dynamic Sequence (based on tableData length)
                      const newSequence = tableData.length + 1;

                      const data = [...tableData];
                      const obj = {
                        approver: approver?.label,
                        userGroup: userGroup?.label || "",
                        intPipelineRowId: 0,
                        intPipelineHeaderId: 0,
                        isSupervisor: approver?.value === 1,
                        isLineManager: approver?.value === 2,
                        intUserGroupHeaderId: userGroup?.value || 0,
                        intShortOrder: newSequence,
                        isCreate: true,
                        isDelete: false,
                        strStatusTitle: `Approved By ${strTitle}`,
                      };
                      data.push(obj);

                      setTableData(data);
                      form.setFieldsValue({
                        approver: undefined,
                        strTitle: undefined,
                        strTitlePending: undefined,
                        userGroup: undefined,
                      });
                    }}
                  >
                    Add
                  </button>
                </Col>
              </>
            );
          }}
        </Form.Item>
{console.log("tableData",tableData)}
        <Col md={24} sm={24} style={{ marginTop: "1rem" }}>
          {tableData?.length > 0 && (
            <DataTable
              bordered
              data={tableData?.length > 0 ? tableData : []}
              header={header(deletedRow, setDeletedRow, remover)}
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

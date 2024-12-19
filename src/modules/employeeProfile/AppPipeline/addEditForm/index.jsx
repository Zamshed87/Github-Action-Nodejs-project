import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Checkbox, Col, Form, InputNumber, Row } from "antd";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { labelChangeByOrgId } from "utility/strLabelChange";
import { DataTable } from "Components";
import { approverDDL, header, submitHandler } from "./helper";
import DraggableTable from "./Draggabletable";

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
  const [random, setRandom] = useState(false);
  const [isSequence, setIsSequence] = useState(true);

  const savePipeline = useApiRequest({});
  const getPipelineDetails = useApiRequest({});
  const CommonEmployeeDDL = useApiRequest([]);
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

  const getEmployee = (value) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        // workplaceId: wId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };

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
            randomCount: item?.globalPipelineRow?.randomCount || false,
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
          isSequence,
          random,
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
        {/* <Col md={12} sm={24}>
          <PInput
            type="text"
            name="remarks"
            label="Remarks"
            placeholder="Remarks"
          />
        </Col> */}
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
                strTitlePending: `${op?.label}`,
                userGroup: undefined,
              });
              setIsStrStatus(true);
            }}
          />
        </Col>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const { approver } = form.getFieldsValue();
            return (
              approver?.label === "Individual Employee" && (
                <Col md={12} sm={24} xs={24}>
                  <PSelect
                    name="employee"
                    label="Select a Employee"
                    placeholder="Search Min 2 char"
                    allowClear={true}
                    options={CommonEmployeeDDL?.data || []}
                    loading={CommonEmployeeDDL?.loading}
                    onChange={(value, op) => {
                      console.log("op", op);
                      form.setFieldsValue({
                        employee: op,
                      });
                    }}
                    onSearch={(value) => {
                      getEmployee(value);
                    }}
                    showSearch
                    filterOption={false}
                  />
                </Col>
              )
            );
          }}
        </Form.Item>
        <Col md={12} sm={24}>
          <PInput
            type="text"
            addOnBefore={isStrStatus && "Pending For"}
            name="strTitle"
            label="Before Approval Status"
            placeholder="Pending For"
            // disabled={!form.getFieldValue("approver")}
          />
        </Col>
        <Col md={12} sm={24}>
          <PInput
            type="text"
            addOnBefore={isStrStatus && "Approved By"}
            name="strTitlePending"
            label="After Approval Status"
            placeholder="Approved By"
            // disabled={!form.getFieldValue("approver")}
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

        <Col md={4} sm={24} className="mt-4">
          <Form.Item
            name="isSequence"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox
              onChange={(e) => {
                const checked = e.target.checked;
                if (checked) {
                  form.setFieldsValue({
                    isSequence: true,
                    randomCount: false,
                  });
                  setIsSequence(true);
                  setRandomCount(false);
                  setRandom(false);
                } else {
                  form.setFieldsValue({
                    isSequence: false,
                  });
                  setIsSequence(false);
                }
              }}
            >
              Sequence
            </Checkbox>
          </Form.Item>
        </Col>

        <Col md={4} sm={24} className="mt-4">
          <Form.Item
            name="randomCount"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox
              onChange={(e) => {
                const checked = e.target.checked;
                if (checked) {
                  form.setFieldsValue({
                    randomCount: true,
                    isSequence: false,
                  });
                  setRandomCount(true);
                  setIsSequence(false);
                  setRandom(true);
                } else {
                  form.setFieldsValue({
                    randomCount: false,
                  });
                  setRandomCount(false);
                }
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
            marginRight: "10px",
          }}
          rules={[
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
            const { approver, userGroup, strTitle, strTitlePending, employee } =
              form.getFieldsValue();
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
                        userGroup:
                          userGroup?.label ||
                          employee?.employeeNameWithCode ||
                          "",
                        intPipelineRowId: 0,
                        intPipelineHeaderId: 0,
                        isSupervisor: approver?.value === 1,
                        isLineManager: approver?.value === 2,
                        intUserGroupHeaderId: userGroup?.value || 0,
                        intShortOrder: newSequence,
                        isCreate: true,
                        isDelete: false,
                        strStatusTitle: `Approved By ${strTitle}`,
                        strStatusTitlePending: `Pending For ${strTitlePending}`,
                      };
                      data.push(obj);

                      setTableData(data);
                      form.setFieldsValue({
                        approver: undefined,
                        strTitle: undefined,
                        strTitlePending: undefined,
                        userGroup: undefined,
                        employee: undefined,
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
        <Col md={24} sm={24}>
          {tableData.length > 0 && (
            <DraggableTable
              tableData={tableData}
              setTableData={setTableData}
              header={header(
                deletedRow,
                setDeletedRow,
                remover,
                random,
                isSequence
              )}
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

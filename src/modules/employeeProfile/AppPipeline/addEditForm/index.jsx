import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Checkbox, Col, Form, InputNumber, message, Row } from "antd";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchApproverData,
  fetchPipelineData,
  header,
  submitHandler,
} from "./helper";
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
  const [pipelineDDL, setPipelineDDL] = useState([]);
  const [approverDDL, setApproverDDL] = useState([]);

  const savePipeline = useApiRequest({});
  const getPipelineDetails = useApiRequest({});
  const CommonEmployeeDDL = useApiRequest([]);
  const getWgDDL = useApiRequest({});
  const getWDDL = useApiRequest({});
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

  const getWorkplace = () => {
    const values = form.getFieldsValue();
    getWDDL.action({
      urlKey: "GetWorkplaceWisePipelineStatusDdl",
      method: "GET",
      params: {
        accountId: orgId,
        businessUnitId: buId,
        workplaceGroupId: values?.orgName?.intWorkplaceGroupId || wgId,
        applicationTypeId:
          values?.pipelineName?.value || singleData?.applicationTypeId,
      },
      onSuccess: (res) => {
        // Add "All" option without status label
        if (res.length > 1) {
          res.unshift({
            label: "All",
            value: -1,
            customLabel: "All",
          });
        }

        res.forEach((item, i) => {
          // Skip the "All" option when adding status labels
          if (item.value !== -1) {
            res[i].isNotSetup = true;

            let statusLabel = " 🔴 (Not Setup)";
            if (item.isIndividualSetup) {
              statusLabel = " 🟢 (Individual Setup)";
            } else if (item.isAllSetup) {
              statusLabel = " 🔵 (All Setup)";
            }

            res[i].label = `${item?.label} ${statusLabel}`;
          }

          res[i].customLabel = `${item?.label}`;
          res[i].value = item?.value;
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
    // getWDDL.action({
    //   urlKey: "WorkplaceIdAll",
    //   method: "GET",
    //   params: {
    //     accountId: orgId,
    //     businessUnitId: buId,
    //     workplaceGroupId: wgId,
    //   },
    //   onSuccess: (res) => {
    //     res.forEach((item, i) => {
    //       res[i].label = item?.strWorkplace;
    //       res[i].value = item?.intWorkplaceId;
    //     });
    //   },
    // });
    getWorkplace();

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
    fetchPipelineData(setPipelineDDL);
    fetchApproverData(setApproverDDL);
  }, [orgId, buId]);

  // Form Instance
  const [form] = Form.useForm();
  useEffect(() => {
    if (singleData?.id) {
      getPipelineDetails.action({
        urlKey: "ApprovalPipelineHeaderDetailsById",
        method: "GET",
        params: {
          configHeaderId: singleData?.id,
          accountId: orgId,
          workplaceGroupId: wgId,
          businessUnitId: buId,
          workplaceId: wId,
        },
        onSuccess: (data) => {
          const isExtendType = singleData?.type === "extend";
          form.setFieldsValue({
            ...singleData,
            orgName: {
              value:
                data?.header?.workplaceGroupId || singleData?.workplaceGroupId,
              label:
                data?.header?.workplaceGroupName ||
                singleData?.workplaceGroupName,
            },
            ...(isExtendType
              ? {}
              : {
                  workplace: {
                    value: data?.header?.workplaceId,
                    label: data?.header?.workplaceName,
                  },
                }),
            pipelineName: {
              value:
                data?.header?.applicationTypeId ||
                singleData?.applicationTypeId,
              label:
                data?.header?.applicationType || singleData?.applicationType,
            },
            remarks: data?.header?.strRemarks || "",
            randomCountValue: data?.header?.randomApproverCount || 0,
            isSequence: data?.header?.isInSequence || false,
            randomCount: !data?.header?.isInSequence,
            id: data?.header?.id || 0,
          });

          setIsSequence(data?.header?.isInSequence);
          setRandomCount(!data?.header?.isInSequence);
          setRandom(!data?.header?.isInSequence);
          const rowData = data?.row?.map((item, index) => ({
            approver: item?.approverType || "User Group",
            approverId: item?.approverTypeId || 0,
            userGroup: item?.userGroupOrEmployeeId || "",
            intPipelineRowId: item?.id || null,
            configHeaderId: data?.header?.id || 0,
            id: item?.id,
            isSupervisor: item?.approverType === "Supervisor",
            isLineManager: item?.approverType === "Line Manager",
            intUserGroupHeaderId: item?.userGroupOrEmployeeId || null,
            userGroupOrEmployeeName: item?.userGroupOrEmployeeName || "",
            intShortOrder: item?.sequenceId || index + 1,
            isCreate: false,
            isDelete: false,
            strStatusTitle: item?.afterApproveStatus || "",
            strStatusTitlePending: item?.beforeApproveStatus || "",
            randomCount: false,
          }));

          setTableData(rowData);
        },
      });
    }
  }, [singleData]);
  const remover = (payload) => {
    const filterArr = tableData
      .filter((itm, idx) => idx !== payload)
      .map((item, index) => ({
        ...item,
        intShortOrder: index + 1, // Update sequence based on new position
      }));
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
            options={pipelineDDL || []}
            name="pipelineName"
            label="Pipeline Name"
            showSearch
            filterOption={true}
            placeholder="Pipeline Name"
            onChange={(value, op) => {
              form.setFieldsValue({
                pipelineName: op,
              });
              getWorkplace();
            }}
            rules={[{ required: true, message: "Pipeline Name is required" }]}
          />
        </Col>
        <Col md={12} sm={24}>
          <PSelect
            disabled={
              singleData?.type === "extend" ? false : singleData ? true : false
            }
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
              getWorkplace();
            }}
            rules={[{ required: true, message: "Workplace Group is required" }]}
          />
        </Col>

        <Col md={12} sm={24}>
          <PSelect
            disabled={
              singleData?.type === "extend" ? false : singleData ? true : false
            }
            maxTagCount="responsive"
            mode="multiple"
            options={getWDDL?.data?.length > 0 ? getWDDL?.data : []}
            name="workplace"
            label="Workplace"
            showSearch
            filterOption={true}
            placeholder="Workplace"
            onChange={(value, options) => {
              let selectedValues = value;
              let selectedOptions = options;

              const isSelectingAll = selectedValues.includes(-1);
              const isSelectingIndividual = selectedOptions.some((opt) =>
                opt.label.includes("🟢 (Individual Setup)")
              );
              const isSelectingAllSetup = selectedOptions.some((opt) =>
                opt.label.includes("🔵 (All Setup)")
              );

              if (isSelectingAll) {
                selectedValues = [-1];
                selectedOptions = options.filter((opt) => opt.value === -1);
              } else if (isSelectingIndividual) {
                selectedValues = [
                  selectedOptions.find((opt) =>
                    opt.label.includes("🟢 (Individual Setup)")
                  )?.value,
                ];
                selectedOptions = [
                  selectedOptions.find((opt) =>
                    opt.label.includes("🟢 (Individual Setup)")
                  ),
                ];
              } else {
                selectedValues = selectedValues.filter((val) => val !== -1);
                selectedOptions = selectedOptions.filter(
                  (opt) => opt.value !== -1
                );
              }

              if (isSelectingAllSetup) {
                message.warning(
                  "This workplace is already set up inside All Setup."
                );
              }

              form.setFieldsValue({
                workplace: selectedOptions,
              });
            }}
          />
        </Col>

        <Col md={12} sm={24}>
          <PSelect
            options={approverDDL || []}
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
                {approver?.value == 3 ? (
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
                  const randomCount = form.getFieldValue("randomCount");
                  if (!randomCount) {
                    form.setFieldsValue({ isSequence: true });
                    setIsSequence(true);
                    toast.warn("At least one option must be selected!", {
                      toastId: "isSequence",
                    });
                  } else {
                    form.setFieldsValue({ isSequence: false });
                    setIsSequence(false);
                  }
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
                  const isSequence = form.getFieldValue("isSequence");
                  if (!isSequence) {
                    form.setFieldsValue({ randomCount: true });
                    setRandomCount(true);
                    toast.warn("At least one option must be selected!", {
                      toastId: "randomCount",
                    });
                  } else {
                    form.setFieldsValue({ randomCount: false });
                    setRandomCount(false);
                  }
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
                        approver: approver?.label || "",
                        approverId: approver?.value || 0,
                        userGroupOrEmployeeName:
                          userGroup?.label ||
                          employee?.employeeNameWithCode ||
                          "",
                        intPipelineRowId: 0,
                        id: 0,
                        isSupervisor: approver?.value === 1,
                        isLineManager: approver?.value === 2,
                        intUserGroupHeaderId:
                          userGroup?.value || employee?.value || 0,
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

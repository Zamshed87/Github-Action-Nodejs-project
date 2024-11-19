import { PlusCircleOutlined } from "@ant-design/icons";
import { APIUrl } from "App";
import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

import { shallowEqual, useSelector } from "react-redux";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import { todayDate } from "utility/todayDate";
import ExpenseTypeCreate from "./ExpenseTypeCreate";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  const createEditExpense = useApiRequest({});
  const getById = useApiRequest({});
  const getDocList = useApiRequest({});
  const CommonEmployeeDDL = useApiRequest([]);
  const expenseTypeDDL = useApiRequest([]);

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [isOpen, setIsOpen] = useState(false);
  const [attachmentList, setAttachmentList] = useState([]);
  // Form Instance
  const [form] = Form.useForm();
  // submit
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    const responses = attachmentList?.map((i) => i.response).flat();
    const modifyImageArray = responses?.map((j) => {
      return {
        intDocURLId: j?.globalFileUrlId,
      };
    });
    const payload = {
      intExpenseId: singleData?.expenseId ? singleData?.expenseId : 0,
      intAccontId: orgId,
      intEmployeeId: values?.employee?.value,
      intExpenseTypeId: values?.expenseTypeDDL?.value,
      strEntryType: singleData?.expenseId ? "Update" : "Create",
      dteExpenseFromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      dteExpenseToDate: moment(values?.toDate).format("YYYY-MM-DD"),
      strDiscription: values?.description,
      numExpenseAmount: +values?.amount,
      isActive: true,
      intCreatedBy: employeeId,
      dteCreatedBy: todayDate(),

      intBusinessUnitId: buId,
      intWorkplaceGroupId: wgId,
      urlIdViewModelList: modifyImageArray?.length > 0 ? modifyImageArray : [],
    };
    createEditExpense.action({
      urlKey: "ExpenseApplicationCreateEdit",
      method: "POST",
      payload: payload,
      toast: true,
      onSuccess: () => {
        cb();
      },
    });
  };
  const getExpenseTypeDDL = () => {
    expenseTypeDDL?.action({
      urlKey: "GetAllEmpExpenseType",
      method: "GET",
      params: {
        IntAccountId: orgId,
        workplaceId: wId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strExpenseType;
          res[i].value = item?.intExpenseTypeId;
        });
      },
    });
  };
  useEffect(() => {
    getExpenseTypeDDL();
  }, []);
  useEffect(() => {
    if (singleData?.expenseId) {
      getById.action({
        urlKey: "GetExpenseById",
        method: "GET",
        params: {
          intExpenseId: singleData?.expenseId,
          businessUnitId: buId,
        },
        onSuccess: (res) => {
          form.setFieldsValue({
            employee: {
              value: res?.intEmployeeId,
              label: res?.employeeName,
            },
            expenseTypeDDL: {
              value: res?.intExpenseTypeId,
              label: res?.strExpenseType,
            },
            amount: res?.numExpenseAmount,
            fromDate: moment(res?.dteExpenseFromDate),
            toDate: moment(res?.dteExpenseToDate),
            description: res?.strDiscription,
          });
        },
      });

      getDocList.action({
        urlKey: "GetExpenseDocList",
        method: "GET",
        params: {
          intExpenseId: singleData?.expenseId,
        },
        onSuccess: (res) => {
          const modifyResponse = res?.map((i) => {
            return {
              name: `Attachment`,
              url: `${APIUrl}/Document/DownloadFile?id=${i?.intDocUrlid}`,
              response: [
                {
                  ...i,
                  globalFileUrlId: i?.intDocUrlid,
                },
              ],
            };
          });
          setAttachmentList(modifyResponse);
        },
      });
    }
  }, [singleData]);
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
  const disabledDate = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };

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
          fromDate: moment(todayDate()),
          toDate: moment(todayDate()),
          typeCreate: false,
        }}
      >
        <Row gutter={[10, 2]}>
          <Form.Item shouldUpdate noStyle>
            {() => {
              const { typeCreate } = form.getFieldsValue(true);
              if (typeCreate) {
                return (
                  <Col span={24}>
                    <ExpenseTypeCreate
                      getData={() => {
                        getExpenseTypeDDL();
                        form.setFieldsValue({
                          typeCreate: false,
                        });
                      }}
                    />
                  </Col>
                );
              } else
                return (
                  <>
                    <Col md={12} sm={24}>
                      <PSelect
                        name="expenseTypeDDL"
                        label="Expense Type"
                        placeholder="Select Expense Type"
                        options={
                          expenseTypeDDL?.data?.length > 0
                            ? expenseTypeDDL?.data?.filter((i) => i?.isActive)
                            : []
                        }
                        loading={CommonEmployeeDDL?.loading}
                        onChange={(value, op) => {
                          form.setFieldsValue({
                            expenseTypeDDL: op,
                          });
                        }}
                        filterOption={false}
                        rules={[
                          {
                            required: true,
                            message: "Expense Type is required",
                          },
                        ]}
                      />
                    </Col>
                    <Col span={2}>
                      <button
                        type="button"
                        className="mt-4  btn add-ddl-btn "
                        style={{
                          margin: "0.4em 0 0 0.7em",
                          padding: "0.2em",
                        }}
                        onClick={() => {
                          form.setFieldsValue({
                            typeCreate: true,
                          });
                        }}
                      >
                        <PlusCircleOutlined style={{ fontSize: "16px" }} />
                      </button>
                    </Col>
                  </>
                );
            }}
          </Form.Item>
        </Row>
        <hr />
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PSelect
              name="employee"
              disabled={singleData?.expenseId}
              label="Select Employee"
              placeholder="Search Min 2 char"
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
              rules={[{ required: true, message: "Employee is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="number"
              name="amount"
              label="Expense Amount"
              min={0}
              placeholder="Expense Amount"
              rules={[
                { required: true, message: "Expense Amount is required" },
              ]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="date"
              name="fromDate"
              label="From Date"
              placeholder="From Date"
              onChange={(value) => {
                form.setFieldsValue({
                  fromDate: value,
                });
              }}
              rules={[{ required: true, message: "From Date is required" }]}
            />
          </Col>
          <Col md={12} sm={24}>
            <PInput
              type="date"
              name="toDate"
              label="To Date"
              placeholder="To Date"
              disabledDate={disabledDate}
              onChange={(value) => {
                form.setFieldsValue({
                  toDate: value,
                });
              }}
              rules={[{ required: true, message: "To Date is required" }]}
            />
          </Col>

          <Col md={24} sm={24}>
            <PInput
              type="textarea"
              rows={5}
              maxLength={250}
              showCount={true}
              name="description"
              label="Description"
              placeholder="Description"
              //   rules={[{ required: true, message: "Description is required" }]}
            />
          </Col>
          <Col md={24} style={{ marginTop: "1.4rem" }}>
            <div>
              <>
                <FileUploadComponents
                  propsObj={{
                    isOpen,
                    setIsOpen,
                    destroyOnClose: false,
                    attachmentList,
                    setAttachmentList,
                    accountId: orgId,
                    tableReferrence: "IOU",
                    documentTypeId: 24,
                    userId: employeeId,
                    buId,
                    maxCount: 20,
                    isIcon: true,
                    isErrorInfo: true,
                    subText:
                      "Recommended file formats are: PDF, JPG and PNG. Maximum file size is 2 MB",
                  }}
                />
              </>
            </div>
          </Col>
        </Row>
        <ModalFooter
          onCancel={() => {
            setId("");
            setIsAddEditForm(false);
          }}
          submitAction="submit"
          loading={createEditExpense.loading}
        />
      </PForm>
    </>
  );
}

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

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  const createEditIOU = useApiRequest({});
  const getById = useApiRequest({});
  const getDocList = useApiRequest({});
  const CommonEmployeeDDL = useApiRequest([]);

  const { orgId, buId, employeeId, wgId } = useSelector(
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
      strEntryType: singleData?.iouId ? "EDIT" : "ENTRY",
      intIOUId: singleData?.iouId ? singleData?.iouId : 0,
      intEmployeeId: values?.employee?.value,
      intBusinessUnitId: buId,
      intWorkplaceGroupId: singleData?.iouId
        ? singleData?.workplaceGroupId
        : wgId,
      dteFromDate: moment(values?.fromDate).format("YYYY-MM-DD"),
      dteToDate: moment(values?.toDate).format("YYYY-MM-DD"),
      numIOUAmount: values?.amount,
      numAdjustedAmount: 0,
      numPayableAmount: 0,
      numReceivableAmount: 0,
      strDiscription: values?.description,
      isActive: true,
      isAdjustment: false,
      intIOUAdjustmentId: 0,
      urlIdViewModelList: modifyImageArray?.length > 0 ? modifyImageArray : [],
    };
    createEditIOU.action({
      urlKey: "IOUApplicationCreateEdit",
      method: "POST",
      payload: payload,
      toast: true,
      onSuccess: () => {
        cb();
      },
    });
  };

  useEffect(() => {
    if (singleData?.iouId) {
      getById.action({
        urlKey: "IOULandingById",
        method: "GET",
        params: {
          intIOUId: singleData?.iouId,
        },
        onSuccess: (res) => {
          form.setFieldsValue({
            employee: {
              value: res?.employeeId,
              label: res?.employeeName,
            },
            amount: res?.numIouAmount,
            fromDate: moment(res?.dteFromDate),
            toDate: moment(res?.dteToDate),
            description: res?.discription,
          });
        },
      });

      getDocList.action({
        urlKey: "IouDocList",
        method: "GET",
        params: {
          intIOUId: singleData?.iouId,
          strDocFor: "ADVANCE",
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
        }}
      >
        <Row gutter={[10, 2]}>
          <Col md={12} sm={24}>
            <PSelect
              name="employee"
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
              label="IOU Amount"
              min={0}
              placeholder="IOU Amount"
              rules={[{ required: true, message: "IOU Amount is required" }]}
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
          loading={createEditIOU.loading}
        />
      </PForm>
    </>
  );
}

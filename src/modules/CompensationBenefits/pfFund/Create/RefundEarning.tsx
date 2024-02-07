import { PForm, PInput } from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";

type TAddEditForm = {
  setOpen: any;
  data: any;
  landingApi: () => void;
  setsSelectedRows: any;
  setCheckRowKeys: any;
};
const RefundEarning: React.FC<TAddEditForm> = ({
  setOpen,
  data,
  landingApi,
  setsSelectedRows,
  setCheckRowKeys,
}) => {
  const [isEarningChecked, setIsEarningChecked] = useState(false);
  // Data From Store
  const { buId, wgId, wId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const [form] = Form.useForm();

  // Api Actions
  const createRefundEarningApi = useApiRequest({});

  // Life Cycle Hooks
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  return (
    <PForm
      form={form}
      initialValues={{
        refundEarningDate: moment(),
        remarks: "",
        amount: data[0]?.numAmount,
        interestRate: "",
        earning: false,
      }}
      onFinish={() => {
        const values = form.getFieldsValue();
        createRefundEarningApi.action({
          method: "post",
          urlKey: "SavePFRefundEarning",
          payload: {
            partName: "Create",
            pfId: 0,
            intAmount: values?.amount || 0,
            intInterestRate: values?.interestRate || 0,
            dteInvestmentDate: moment(values.refundEarningDate).format(
              "YYYY-MM-DD"
            ),
            strRemark: values?.remarks || "",
            isEarning: values?.earning || false,
            salaryCode: data[0]?.code || "",
            referenceId: {
              intReferenceId: data[0]?.intPfLedgerId || 0,
            },
          },
          toast: true,
          onSuccess: () => {
            setOpen(false);
            landingApi();
            setsSelectedRows([]);
            setCheckRowKeys([]);
          },
        });
      }}
    >
      <Row gutter={[10, 2]}>
        <Col md={8} sm={24}>
          <PInput
            type="number"
            name="amount"
            placeholder="Amount"
            label="Amount"
            rules={[{ required: true, message: "Amount Is Required" }]}
            disabled={!isEarningChecked}
          />
        </Col>
        <Col md={16} sm={24}>
          <div style={{ marginTop: "15px" }}>
            <PInput
              type="checkbox"
              name="earning"
              layout="horizontal"
              label="Earning"
              onChange={(e: any) => {
                setIsEarningChecked(e.target.checked);
                if (!e.target.checked) {
                  form.setFieldsValue({ amount: data[0]?.numAmount });
                } else {
                  form.setFieldsValue({ interestRate: "" });
                }
              }}
            />
          </div>
        </Col>

        <Col md={8} sm={24}>
          <PInput
            type="number"
            name="interestRate"
            placeholder="Interest Amount"
            label="Interest Amount"
            rules={[{ required: false }]}
            disabled={isEarningChecked}
          />
        </Col>
        <Col md={8} sm={24}>
          <PInput
            type="date"
            name="refundEarningDate"
            placeholder="Date"
            label="Date"
            allowClear={true}
            rules={[{ required: false }]}
          />
        </Col>
        <Col md={8} sm={24}>
          <PInput
            type="text"
            name="remarks"
            label="Remarks"
            placeholder="Remarks"
            rules={[{ required: false }]}
          />
        </Col>
      </Row>
      <ModalFooter
        submitAction="submit"
        onCancel={() => {
          setOpen(false);
          setsSelectedRows([]);
          setCheckRowKeys([]);
        }}
        loading={createRefundEarningApi?.loading}
      />
    </PForm>
  );
};

export default RefundEarning;

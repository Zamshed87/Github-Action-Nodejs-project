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
  const createInvestmentApi = useApiRequest({});

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
        createInvestmentApi.action({
          method: "post",
          urlKey: "SavePFInvestment",
          payload: {
            // headerDTO: {
            //   intPfLedgerId: 0,
            //   intPfLedgerCode: "",
            //   intTypeId: 1,
            //   strType: "Investment",
            //   intReferenceId: 0,
            //   strReferenceNo: "",
            //   intInvestmentBankId: values?.bank?.BankID,
            //   intInvestmentBankBranchId: values?.branch?.value,
            //   dteTransactionDate: moment(values.invstDate).format("YYYY-MM-DD"),
            //   numAmount: totalAmount,
            //   isActive: true,
            //   isComplete: true,
            //   numRate: values?.rate,
            //   intMaturityMonth: 0,
            //   code: values?.investReffNo,
            //   strMaturityDate: moment(values?.maturityMonth).format(
            //     "YYYY-MM-DD"
            //   ),
            // },
            refernceDTO: data?.map((item: any) => ({
              intReferenceId: item?.intPfLedgerId,
              strReferenceCode: item?.intPfLedgerCode,
            })),
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
                }
              }}
            />
          </div>
        </Col>

        <Col md={8} sm={24}>
          <PInput
            type="number"
            name="interestRate"
            placeholder="Interest Rate"
            label="Interest Rate"
            rules={[{ required: false }]}
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
        loading={createInvestmentApi?.loading}
      />
    </PForm>
  );
};

export default RefundEarning;

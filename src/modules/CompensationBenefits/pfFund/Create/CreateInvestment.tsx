import { PForm, PInput, PSelect } from "Components";
import { ModalFooter } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { calculateTotalAmount } from "../utility/utils";

type TAddEditForm = {
  setOpen: any;
  data: any;
  landingApi: () => void;
  setsSelectedRows: any;
  setCheckRowKeys: any;
};
const CreateInvestment: React.FC<TAddEditForm> = ({
  setOpen,
  data,
  landingApi,
  setsSelectedRows,
  setCheckRowKeys,
}) => {
  // Data From Store
  const { buId, wgId, wId, orgId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const [form] = Form.useForm();

  // Api Actions
  const bankDDLApi = useApiRequest([]);
  const bankBranchDDLApi = useApiRequest([]);
  const createInvestmentApi = useApiRequest({});

  const bankDDL = () => {
    bankDDLApi.action({
      method: "get",
      urlKey: "PeopleDeskAllDDL",
      params: {
        DDLType: "Bank",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
      },
      onSuccess: (res) => {
        res?.forEach((item: any, idx: number) => {
          res[idx].label = item?.BankName;
          res[idx].value = item?.BankID;
        });
      },
    });
  };

  const totalAmount: number = calculateTotalAmount(data);

  // Life Cycle Hooks
  useEffect(() => {
    bankDDL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  return (
    <PForm
      form={form}
      initialValues={{
        invstDate: moment(),
        maturityMonth: moment(),
        amount: totalAmount,
      }}
      onFinish={() => {
        const values = form.getFieldsValue();
        createInvestmentApi.action({
          method: "post",
          urlKey: "SavePFInvestment",
          payload: {
            headerDTO: {
              intPfLedgerId: 0,
              intPfLedgerCode: "",
              intTypeId: 1,
              strType: "Investment",
              intReferenceId: 0,
              strReferenceNo: "",
              intInvestmentBankId: values?.bank?.BankID,
              intInvestmentBankBranchId: values?.branch?.value,
              dteTransactionDate: moment(values.invstDate).format("YYYY-MM-DD"),
              numAmount: totalAmount,
              isActive: true,
              isComplete: false,
              numRate: values?.rate,
              intMaturityMonth: 0,
              code: values?.investReffNo,
              strMaturityDate: moment(values?.maturityMonth).format(
                "YYYY-MM-DD"
              ),
            },
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
            disabled={true}
          />
        </Col>
        <Col md={8} sm={24}>
          <PSelect
            name="bank"
            placeholder="Bank"
            allowClear={true}
            rules={[{ required: true, message: "Bank Is Required" }]}
            options={bankDDLApi?.data}
            label="Bank"
            showSearch={true}
            onChange={(value: any, option: any) => {
              form.setFieldsValue({
                bank: option,
              });
              if (value) {
                bankBranchDDLApi.action({
                  method: "get",
                  urlKey: "BankBranchDDL",
                  params: {
                    BankId: value,
                    AccountID: orgId,
                    DistrictId: 0,
                  },
                });
              } else {
                bankBranchDDLApi.reset();
                form.setFieldsValue({
                  branch: undefined,
                });
              }
            }}
          />
        </Col>
        <Col md={8} sm={24}>
          <PSelect
            name="branch"
            placeholder="Branch"
            allowClear={true}
            showSearch={true}
            rules={[{ required: true, message: "Branch Is Required" }]}
            options={bankBranchDDLApi?.data}
            label="Branch"
            onChange={(value: any, option: any) => {
              form.setFieldsValue({
                branch: option,
              });
            }}
          />
        </Col>
        <Col md={8} sm={24}>
          <PInput
            type="number"
            name="rate"
            placeholder="Investment Rate"
            label="Investment Rate"
            rules={[{ required: true, message: "Investment Rate Is Required" }]}
          />
        </Col>
        <Col md={8} sm={24}>
          <PInput
            type="date"
            name="invstDate"
            placeholder="Invst. Date"
            label="Invst. Date"
            allowClear={true}
            rules={[{ required: true, message: "Invst. Date Is Required" }]}
          />
        </Col>
        <Col md={8} sm={24}>
          <PInput
            type="date"
            name="maturityMonth"
            placeholder="Maturity Date"
            label="Maturity Date"
            allowClear={true}
            rules={[
              { required: true, message: "Maturity Date Is Required" },
            ]}
          />
        </Col>
        <Col md={8} sm={24}>
          <PInput
            type="text"
            name="investReffNo"
            placeholder="Reff. No"
            label="Reff. No"
            rules={[{ required: true, message: "Reff. Bo Is Required" }]}
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

export default CreateInvestment;

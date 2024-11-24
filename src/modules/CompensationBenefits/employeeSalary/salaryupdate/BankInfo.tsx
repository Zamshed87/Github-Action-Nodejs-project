import { Col, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import { useApiRequest } from "Hooks";

export const BankInfo = ({ form, bankDDL, orgId, accountsDto }: any) => {
  const branchDDL = useApiRequest([]);
  const getBranchDDL = () => {
    const { bank } = form.getFieldsValue(true);
    branchDDL?.action({
      urlKey: "BankBranchDDL",
      method: "GET",
      params: {
        BankId: bank?.value,
        AccountID: orgId,
        DistrictId: 0,
      },
    });
  };

  return (
    <Form.Item shouldUpdate noStyle>
      {() => {
        const { transferType } = form.getFieldsValue(true);
        return (
          <Row gutter={[10, 2]}>
            <Col md={3} className="mt-2">
              Bank Name
            </Col>
            <Col md={12} className="mt-2">
              {" "}
              <PSelect
                options={bankDDL?.data?.length > 0 ? bankDDL?.data : []}
                name="bank"
                placeholder="Bank"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    bank: op,
                  });
                  getBranchDDL();
                }}
                rules={[
                  {
                    required:
                      transferType?.value === 1 ||
                      transferType === 1 ||
                      accountsDto[0].numAmount > 0,
                    message: "Bank is required",
                  },
                ]}
              />
            </Col>
            <Col md={7}></Col>
            <Col md={3} className="mt-2">
              Branch Name
            </Col>
            <Col md={12} className="mt-2">
              {" "}
              <PSelect
                options={branchDDL?.data?.length > 0 ? branchDDL?.data : []}
                name="branch"
                placeholder="Branch"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    branch: op,
                    routing: (op as any)?.name,
                  });
                }}
                rules={[
                  {
                    required:
                      transferType?.value === 1 ||
                      transferType === 1 ||
                      accountsDto[0].numAmount > 0,
                    message: "Branch is required",
                  },
                ]}
              />
            </Col>
            <Col md={7}></Col>
            <Col md={3} className="mt-2">
              Routing No
            </Col>
            <Col md={12} className="mt-2">
              <PInput
                type="number"
                name="routing"
                placeholder="Routing"
                disabled={true}

                // rules={[
                //   {
                //     // required: basedOn?.value === 2,
                //     message: "Basic is required",
                //   },
                // ]}
              />
            </Col>
            <Col md={7}></Col>
            <Col md={3} className="mt-2">
              Swift Code
            </Col>
            <Col md={12} className="mt-2">
              {" "}
              <PInput
                type="number"
                name="swift"
                disabled={true}
                placeholder="Swift Code"
                // rules={[
                //   {
                //     // required: basedOn?.value === 2,
                //     message: "Basic is required",
                //   },
                // ]}
              />
            </Col>
            <Col md={7}></Col>
            <Col md={3} className="mt-2">
              Account Name
            </Col>
            <Col md={12} className="mt-2">
              {" "}
              <PInput
                type="text"
                name="account"
                placeholder="Account Name"
                rules={[
                  {
                    required:
                      transferType?.value === 1 ||
                      transferType === 1 ||
                      accountsDto[0].numAmount > 0,
                    message: "Account Name is required",
                  },
                ]}
              />
            </Col>
            <Col md={7}></Col>
            <Col md={3} className="mt-2">
              Account No
            </Col>
            <Col md={12} className="mt-2">
              <PInput
                type="number"
                name="accountNo"
                placeholder="Account No"
                rules={[
                  {
                    required:
                      transferType?.value === 1 ||
                      transferType === 1 ||
                      accountsDto[0].numAmount > 0,
                    message: "Account No is required",
                  },
                ]}
              />
            </Col>
            <Col md={7}></Col>
          </Row>
        );
      }}
    </Form.Item>
  );
};

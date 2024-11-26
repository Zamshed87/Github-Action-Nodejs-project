import { Col, Form, Row } from "antd";
import { PInput, PSelect } from "Components";
import { useApiRequest } from "Hooks";
import { useEffect } from "react";

export const DigitalMFS = ({ form, wgId, buId, accountsDto }: any) => {
  const paymentGatwayDDL = useApiRequest([]);
  const getGateWayDDL = () => {
    paymentGatwayDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "PaymentGateway",
        WorkplaceGroupId: wgId,
        BusinessUnitId: buId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.DigitalBankName;
          res[i].value = item?.DigitalBankId;
        });
      },
    });
  };
  useEffect(() => {
    getGateWayDDL();
  }, [wgId]);

  return (
    <Form.Item shouldUpdate noStyle>
      {() => {
        const { transferType } = form.getFieldsValue(true);
        return (
          <Row gutter={[10, 2]}>
            <Col md={3} className="mt-2">
              Gateway
            </Col>
            <Col md={12} className="mt-2">
              {" "}
              <PSelect
                options={
                  paymentGatwayDDL?.data?.length > 0
                    ? paymentGatwayDDL?.data
                    : []
                }
                name="gateway"
                placeholder="Gateway"
                onChange={(value, op) => {
                  form.setFieldsValue({
                    gateway: op,
                  });
                }}
                // rules={[
                //   {
                //     required:
                //       transferType?.value === 1 ||
                //       transferType === 1 ||
                //       accountsDto[0].numAmount > 0,
                //     message: "Gateway is required",
                //   },
                // ]}
              />
            </Col>
            <Col md={7}></Col>

            <Col md={3} className="mt-2">
              Mobile No
            </Col>
            <Col md={12} className="mt-2">
              <PInput
                type="number"
                name="mobile"
                placeholder="Mobile No"
                // rules={[
                //   {
                //     required:
                //       transferType?.value === 1 ||
                //       transferType === 1 ||
                //       accountsDto[0].numAmount > 0,
                //     message: "Account No is required",
                //   },
                // ]}
              />
            </Col>
            <Col md={7}></Col>
          </Row>
        );
      }}
    </Form.Item>
  );
};

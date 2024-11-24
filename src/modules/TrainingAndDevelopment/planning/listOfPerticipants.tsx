import { Col, Row, Tooltip } from "antd";
import { DataTable, Flex, PButton, PInput, PSelect } from "Components";
import React, { useEffect } from "react";

import { FormInstance } from "antd/lib/form";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { DeleteOutlined } from "@ant-design/icons";
import { tr } from "date-fns/locale";

const ListOfPerticipants = ({
  form,
  perticipantField,
  setperticipantField,
  addHandler,
}: {
  form: FormInstance;
  perticipantField: any[];
  setperticipantField: (data: any[]) => void;
  addHandler: (values: any) => void;
}) => {
  const [costTypeDDL, getCostTypeDDL] = useAxiosGet();

  useEffect(() => {
    getCostTypeDDL({ url: "/costType" });
  }, []);

  const headerCost = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Cost Type",
      dataIndex: "costType",
    },
    {
      title: "Cost Value",
      dataIndex: "costValue",
    },
    {
      title: "Action",
      dataIndex: "status",
      render: (_: any, rec: any) => (
        <Flex justify="center">
          <Tooltip placement="bottom" title="Status">
            <DeleteOutlined
              style={{
                color: "red",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                const updatedperticipantField = perticipantField.filter(
                  (item) => item.id !== rec.id
                );
                setperticipantField(updatedperticipantField);
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 120,
    },
  ];

  console.log(
    perticipantField.reduce((acc, item) => acc + Number(item.costValue), 0)
  );

  return (
    <div style={{ marginTop: "13px" }}>
      <h1>List of Perticipants</h1>
      <Row gutter={[10, 2]} style={{ marginTop: "10px" }}>
        <Col md={6} sm={24}>
          <PSelect
            options={costTypeDDL || []} // need to change
            name="costType"
            label="Cost Type"
            placeholder="Cost Type"
            onChange={(value, op) => {
              form.setFieldsValue({
                costType: op,
              });
            }}
            // rules={[
            //   {
            //     required: true,
            //     message: "Cost Type is required",
            //   },
            // ]}
          />
        </Col>
        <Col md={6} sm={24}>
          <PInput
            type="text"
            placeholder="Cost Value"
            label="Cost Value"
            name="costValue"
            // rules={[
            //   {
            //     required: true,
            //     message: "Cost Value is required",
            //   },
            // ]}
          />
        </Col>

        <Col md={6} sm={24}>
          <PButton
            style={{ marginTop: "22px" }}
            type="primary"
            content="Add"
            onClick={() => {
              const values = form.getFieldsValue(true);

              addHandler(values);
            }}
          />
        </Col>
      </Row>
      <Flex justify="flex-end" align="flex-start" className="mr-2">
        <h1>
          Total Cost:{" "}
          {perticipantField.reduce(
            (acc, item) => acc + Number(item.costValue),
            0
          )}
        </h1>
        {/* <div>
          <PInput
            type="text"
            placeholder="Total Cost:"
            label="Total Cost:"
            name="totalCost"
            value={String(
              perticipantField.reduce((acc, item) => acc + Number(item.costValue), 0)
            )}
            disabled={true}
          />
        </div> */}
      </Flex>
      {perticipantField?.length > 0 && (
        <div className="mb-3 mt-2">
          <DataTable
            bordered
            data={perticipantField || []}
            loading={false}
            header={headerCost}
          />
        </div>
      )}
    </div>
  );
};

export default ListOfPerticipants;

import { Col, Row, Tooltip } from "antd";
import { DataTable, Flex, PButton, PInput, PSelect } from "Components";
import { useEffect, useState } from "react";

import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/lib/form";
import { PModal } from "Components/Modal";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import TrainingCost from "../masterData/trainingCost";

const ListOfCost = ({
  form,
  costField,
  setCostField,
  addHandler,
}: {
  form: FormInstance;
  costField: any[];
  setCostField: (data: any[]) => void;
  addHandler: (values: any) => void;
}) => {
  const [costTypeDDL, getCostTypeDDL, loadingCostType, setCostType] =
    useAxiosGet();
  const [openCostTypeModal, setOpenCostTypeModal] = useState(false);

  const typeDataSetForCost = (data: any) => {
    let list: any[] = [];
    data?.map((d: any) => {
      if (d?.isActive === true) list.push({ label: d?.name, value: d?.id });
    });
    setCostType(list);
  };
  useEffect(() => {
    getCostTypeDDL("/TrainingCostType/Training/CostType", typeDataSetForCost);
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
          <Tooltip placement="bottom" title="Delete">
            <DeleteOutlined
              style={{
                color: "red",
                fontSize: "14px",
                cursor: "pointer",
                margin: "0 5px",
              }}
              onClick={() => {
                const updatedCostField = costField.filter(
                  (item) => item.id !== rec.id
                );
                setCostField(updatedCostField);
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 40,
    },
  ];

  console.log(costField.reduce((acc, item) => acc + Number(item.costValue), 0));

  return (
    <div style={{ marginTop: "13px" }}>
      <h1>List of Cost</h1>
      <Row gutter={[10, 2]} style={{ marginTop: "10px" }}>
        <Col md={6} sm={24}>
          <PSelect
            options={costTypeDDL || []} // need to change
            name="costType"
            label={
              <>
                Cost Type{" "}
                <PlusCircleOutlined
                  onClick={() => {
                    setOpenCostTypeModal(true);
                  }}
                  style={{
                    color: "green",
                    fontSize: "15px",
                    cursor: "pointer",
                    margin: "0 5px",
                  }}
                />
              </>
            }
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
            type="number"
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
          {costField.reduce((acc, item) => acc + Number(item.costValue), 0)}
        </h1>
        {/* <div>
          <PInput
            type="text"
            placeholder="Total Cost:"
            label="Total Cost:"
            name="totalCost"
            value={String(
              costField.reduce((acc, item) => acc + Number(item.costValue), 0)
            )}
            disabled={true}
          />
        </div> */}
      </Flex>
      {costField?.length > 0 && (
        <div className="mb-3 mt-2">
          <DataTable
            bordered
            data={costField || []}
            loading={false}
            header={headerCost}
          />
        </div>
      )}
      <PModal
        open={openCostTypeModal}
        title={"Training Title"}
        width="400"
        onCancel={() => {
          setOpenCostTypeModal(false);
          getCostTypeDDL(
            "/TrainingCostType/Training/CostType",
            typeDataSetForCost
          );
        }}
        maskClosable={false}
        components={
          <>
            <TrainingCost setOpenCostTypeModal={setOpenCostTypeModal} />
          </>
        }
      />
    </div>
  );
};

export default ListOfCost;

import { Col, Row, Tooltip } from "antd";
import { DataTable, Flex, PButton, PInput, PSelect } from "Components";
import { useEffect, useState } from "react";

import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/lib/form";
import { PModal } from "Components/Modal";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import TrainingCost from "../masterData/trainingCost";
import { getSerial } from "Utils";
const TrainerAndOrgInfo = ({
  nameOfTrainerOrgDDL,
  form,
  addHandler,
  trainerOrgField,
  setTrainerOrgField,
}: any) => {
  const header: any = [
    {
      title: "SL",
      render: (_: any, rec: any, index: number) =>
        getSerial({
          currentPage: 1,
          pageSize: 1000,
          index,
        }),
      fixed: "left",
      align: "center",
    },
    {
      title: "Inhouse Trainer?",
      dataIndex: "isInHouseTrainer",
      render: (isInHouseTrainer: boolean) => (isInHouseTrainer ? "Yes" : "No"),
    },
    {
      title: "Name of Trainer",
      dataIndex: "name",
      filter: true,
      filterKey: "nameofTrainerList",
      filterSearch: true,
    },
    {
      title: "Name of Organization",
      dataIndex: "organization",
      filter: true,
      filterKey: "nameOfOrganizationList",
      filterSearch: true,
    },
    {
      title: "Trainer Contact No",
      dataIndex: "contactNo",
      filter: true,
      filterKey: "nameOfOrganizationList",
      filterSearch: true,
    },
    {
      title: "Trainer Email",
      dataIndex: "email",
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
                const updatedCostField = trainerOrgField?.filter(
                  (item: any) => item.name !== rec.name
                );
                setTrainerOrgField(updatedCostField);
              }}
            />
          </Tooltip>
        </Flex>
      ),
      align: "center",
      width: 40,
    },
  ];
  console.log(trainerOrgField);
  return (
    <div style={{ marginTop: "13px" }}>
      <h1>List of Trainer & Organization</h1>
      <Row gutter={[10, 2]} style={{ marginTop: "20px" }}>
        <Col md={6} sm={12} xs={24}>
          <PSelect
            options={nameOfTrainerOrgDDL || []}
            name="nameofTrainerOrganization"
            label="Name of Trainer & Organization"
            placeholder="Name of Trainer & Organization"
            onChange={(value, op) => {
              console.log(op);
              form.setFieldsValue({
                nameofTrainerOrganization: op,
                // trinerContactNo: (op as any)?.contactNo || "",
                // trinerEmail: (op as any)?.email || "",
                // inHouseTrainer: (op as any)?.isInHouseTrainer ? "Yes" : "No",
              });
            }}
            // rules={[
            //   {
            //     required: true,
            //     message: "Name of Trainer & Organization is required",
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
        {/* {nameofTrainerOrganization && (
        <>
          <Col md={6} sm={24}>
            <PInput
              disabled={true}
              type="text"
              placeholder="Trainer Contact No."
              label="Trainer Contact No."
              name="trinerContactNo"
            />
          </Col>
          <Col md={6} sm={24}>
            <PInput
              disabled={true}
              type="text"
              placeholder="Trainer Email"
              label="Trainer Email"
              name="trinerEmail"
            />
          </Col>
          <Col md={6} sm={24}>
            <PInput
              disabled={true}
              type="text"
              placeholder="Inhouse Trainer?"
              label="Inhouse Trainer?"
              name="inHouseTrainer"
            />
          </Col>
        </>
      )} */}
      </Row>
      {trainerOrgField?.length > 0 && (
        <div className="mb-3 mt-2">
          <DataTable
            bordered
            data={trainerOrgField || []}
            loading={false}
            header={header}
          />
        </div>
      )}
    </div>
  );
};

export default TrainerAndOrgInfo;

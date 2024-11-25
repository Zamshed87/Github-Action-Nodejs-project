import { Col, Row, Tooltip } from "antd";
import { DataTable, Flex, PButton, PInput, PSelect } from "Components";
import React, { useEffect } from "react";

import { FormInstance } from "antd/lib/form";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { DeleteOutlined } from "@ant-design/icons";
import { tr } from "date-fns/locale";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";

const ListOfPerticipants = ({
  form,
  perticipantField,
  setperticipantField,
  addHandler,
  calculatePerPersonCost,
}: {
  form: FormInstance;
  perticipantField: any[];
  setperticipantField: (data: any[]) => void;
  addHandler: (values: any) => void;
  calculatePerPersonCost: () => number;
}) => {
  const [costTypeDDL, getCostTypeDDL] = useAxiosGet();
  const CommonEmployeeDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);

  // workplace wise
  const getEmployeDepartment = () => {
    const { workplaceGroup, workplace } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "DepartmentIdAll",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: workplaceGroup?.value,
        workplaceId: workplace?.value,

        accountId: orgId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.strDepartment;
          res[i].value = item?.intDepartmentId;
        });
      },
    });
  };

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, employeeId, orgId } = profileData;

  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: profileData?.buId,
        workplaceGroupId: profileData?.wgId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };

  useEffect(() => {
    getCostTypeDDL({ url: "/costType" });
    getEmployeDepartment();
  }, []);

  const headerCost = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Participants List",
      dataIndex: "perticipant",
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
            options={[{ label: "All", value: 0 }]} // need to change
            name="department"
            label="Department"
            placeholder="Department"
            onChange={(value, op) => {
              form.setFieldsValue({
                department: op,
              });
            }}
          />
        </Col>
        <Col md={6} sm={24}>
          <PSelect
            options={[{ label: "All", value: 0 }]} // need to change
            name="hrPosition"
            label="HR Position"
            placeholder="HR Position"
            onChange={(value, op) => {
              form.setFieldsValue({
                hrPosition: op,
              });
            }}
          />
        </Col>
        <Col md={6} sm={24}>
          <PSelect
            name="employee"
            label="Employee"
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
            allowClear={true}
            rules={[
              {
                required: true,
                message: "Employee is required",
              },
            ]}
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
        <h1>Per Person Cost: {calculatePerPersonCost()}</h1>
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

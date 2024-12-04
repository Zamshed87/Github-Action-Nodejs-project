import { Col, Row, Tooltip, Form } from "antd";
import { DataTable, Flex, PButton, PSelect } from "Components";
import { useEffect } from "react";

import { DeleteOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/lib/form";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";

const ListOfPerticipants = ({
  form,
  perticipantField,
  setperticipantField,
  addHandler,
  calculatePerPersonCost,
  departmentDDL,
  positionDDL,
}: {
  form: FormInstance;
  perticipantField: any[];
  setperticipantField: (data: any[]) => void;
  addHandler: (values: any) => void;
  calculatePerPersonCost: () => number;
  departmentDDL: any[];
  positionDDL: any[];
}) => {
  const [costTypeDDL, getCostTypeDDL] = useAxiosGet();
  const CommonEmployeeDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);

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
  }, []);

  const headerCost = [
    {
      title: "SL",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Participants List",
      dataIndex: "perticipant",
      width: 120,
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "HR Position",
      dataIndex: "hrPosition",
      width: 50,
    },
    {
      title: "workplaceGroup",
      dataIndex: "workplaceGroup",
      width: 50,
    },
    {
      title: "workplace",
      dataIndex: "workplace",
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
      width: 40,
    },
  ];

  console.log(
    perticipantField.reduce((acc, item) => acc + Number(item.costValue), 0)
  );

  const workplace = Form.useWatch("workplace", form);

  return (
    <div style={{ marginTop: "13px" }}>
      <h1>List of Perticipants</h1>
      <Row gutter={[10, 2]} style={{ marginTop: "10px" }}>
        <Col md={6} sm={24}>
          <PSelect
            options={departmentDDL} // need to change
            name="department"
            label="Department"
            disabled={!workplace}
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
            options={positionDDL} // need to change
            name="hrPosition"
            label="HR Position"
            disabled={!workplace}
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

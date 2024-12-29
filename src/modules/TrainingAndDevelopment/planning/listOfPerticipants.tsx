import { Col, Row, Tooltip } from "antd";
import { DataTable, Flex, PButton, PSelect } from "Components";
import { useEffect } from "react";

import { DeleteOutlined } from "@ant-design/icons";
import { FormInstance } from "antd/lib/form";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { de } from "date-fns/locale";

const ListOfPerticipants = ({
  form,
  perticipantField,
  setperticipantField,
  addHandler,
  calculatePerPersonCost,
  departmentDDL,
  positionDDL,
  workplaceGroup,
  getWorkplace,
  workplace,
  getEmployeDepartment,
  getEmployeePosition,
}: any) => {
  const [costTypeDDL, getCostTypeDDL] = useAxiosGet();
  const CommonEmployeeDDL = useApiRequest([]);

  const { permissionList, profileData } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  const { buId, wgId, employeeId, orgId } = profileData;

  const getEmployee = () => {
    console.log("value", form.getFieldsValue(true));
    const { bUnit, workplaceGroupPer, workplacePer, department, hrPosition } =
      form.getFieldsValue(true);
    // if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: bUnit?.value,
        workplaceGroupId: workplaceGroupPer?.value,
        workplaceId: workplacePer?.value,
        departmentId: department?.value,
        // searchText: value,
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
                  (item: any) => item.perticipantId !== rec.perticipantId
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

  // const workplace = Form.useWatch("workplace", form);

  const values = form.getFieldsValue(true);

  console.log("workplaceGroup", values);

  return (
    <div style={{ marginTop: "13px" }}>
      <h1>List of Perticipants</h1>
      <Row gutter={[10, 2]} style={{ marginTop: "10px" }}>
        <Col md={6} sm={12} xs={24}>
          <PSelect
            options={workplaceGroup?.data || []}
            name="workplaceGroupPer"
            label="Workplace Group"
            placeholder="Workplace Group"
            onChange={(value, op) => {
              form.setFieldsValue({
                workplaceGroupPer: op,
                workplacePer: undefined,
              });
              getWorkplace();
              getEmployee();
            }}
            rules={[{ required: true, message: "Workplace Group is required" }]}
          />
        </Col>
        <Col md={6} sm={12} xs={24}>
          <PSelect
            options={workplace?.data || []}
            name="workplacePer"
            label="Workplace"
            placeholder="Workplace"
            // disabled={+id ? true : false}
            onChange={(value, op) => {
              form.setFieldsValue({
                workplacePer: op,
              });
              getEmployeDepartment();
              getEmployeePosition();
              getEmployee();
              //   getDesignation();
            }}
            rules={[{ required: true, message: "Workplace is required" }]}
          />
        </Col>
        <Col md={6} sm={24}>
          <PSelect
            options={departmentDDL} // need to change
            name="department"
            label="Department"
            // disabled={!workplace}
            placeholder="Department"
            onChange={(value, op) => {
              form.setFieldsValue({
                department: op,
              });
              getEmployee();
            }}
            rules={[
              {
                required: true,
                message: "Department is required",
              },
            ]}
          />
        </Col>
        <Col md={6} sm={24}>
          <PSelect
            options={positionDDL} // need to change
            name="hrPosition"
            label="HR Position"
            // disabled={!workplace}
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
            options={CommonEmployeeDDL?.data || []} // need to change iffff..
            name="employee"
            label="Employee"
            allowClear
            // disabled={!workplace}
            placeholder="Employee"
            onChange={(value, op) => {
              form.setFieldsValue({
                employee: op,
              });
            }}
          />
        </Col>

        <Col md={6} sm={24}>
          <PButton
            style={{ marginTop: "22px" }}
            type="primary"
            content="Add"
            onClick={() => {
              const values = form.getFieldsValue(true);
              form
                .validateFields([
                  "department",
                  "workplacePer",
                  "workplaceGroupPer",
                ])
                .then(() => {
                  addHandler(values, CommonEmployeeDDL?.data);
                })
                .catch(() => {});
              // addHandler(values);
            }}
          />
        </Col>
      </Row>
      {calculatePerPersonCost && (
        <Flex justify="flex-end" align="flex-start" className="mr-2">
          <h1>Per Person Cost: {calculatePerPersonCost()}</h1>
        </Flex>
      )}

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

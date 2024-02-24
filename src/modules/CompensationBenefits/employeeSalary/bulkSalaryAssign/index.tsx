import { AddOutlined } from "@mui/icons-material";
import {
  DataTable,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import PBadge from "Components/Badge";
import { ModalFooter, PModal } from "Components/Modal";
import { useApiRequest } from "Hooks";
import { Col, Form, Modal, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { getLandingData } from "modules/assetManagement/itemRegistration/helper";
import {
  AttendanceType,
  EmpFilterType,
} from "modules/timeSheet/attendence/attendenceAdjust/utils/utils";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

type TAttendenceAdjust = unknown;
const BulkSalaryAssign: React.FC<TAttendenceAdjust> = () => {
  // Data From Store
  const { orgId, buId, wgId, wId, employeeId } = useSelector(
    (state: any) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector(
    (state: any) => state?.auth,
    shallowEqual
  );
  // States
  const [selectedRow, setSelectedRow] = React.useState<any[]>([]);
  const [rowDto, setRowDto] = React.useState<any[]>([]);
  const [dynamicHeader, setDynamicHeader] = React.useState<any[]>([]);

  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const bulkLandingAPI = useApiRequest([]);
  const employmentTypeDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const workG = useApiRequest([]);
  const workP = useApiRequest([]);
  const positionDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const payrollGroupDDL = useApiRequest([]);

  const dispatch = useDispatch();

  // Life Cycle Hooks
  // useEffect(() => {}, [buId, wgId, wId]);
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Compensation & Benefits"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Bulk Salary Assign";
  }, []);

  const getSalaryLanding = () => {
    const {
      payrollGroup,
      designation,
      department,
      employeeType,
      joiningDateTo,
      joiningDateFrom,
      hrPosition,
      wp,
    } = form.getFieldsValue(true);

    bulkLandingAPI?.action({
      urlKey: "BulkSalaryAssignLanding",
      method: "post",
      params: {
        accountId: orgId,
        workplaceId: wp?.value,
        payrollGroupId: payrollGroup?.value,
        empTypeId: employeeType?.value,
        hrPositionId: hrPosition?.value,
        departmentId: department?.value,
        designationId: designation?.value,
        fromDate: joiningDateFrom
          ? moment(joiningDateFrom).format("YYYY-MM-DD")
          : undefined,
        toDate: joiningDateTo
          ? moment(joiningDateTo).format("YYYY-MM-DD")
          : undefined,
      },
      onSuccess: (res) => {
        // console.log({ res });

        setRowDto(res?.result);
        const updatedHeader: any[] = [];
        res?.result[0]?.salaryElementsBreakdowns?.forEach((element: any) => {
          updatedHeader.push({
            title: `${element.strPayrollElementName}(${element.numNumberOfPercentage})`,
            dataIndex: element.strPayrollElementName,
          });
        });
        setDynamicHeader(updatedHeader);
      },
    });
  };

  const getEmploymentType = () => {
    const { workplaceGroup, wp } = form.getFieldsValue(true);

    employmentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: wp?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.EmploymentType;
          res[i].value = item?.Id;
        });
      },
    });
  };
  // workplace wise
  const getWorkplaceGroup = () => {
    workG?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "WorkplaceGroup",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId, // This should be removed
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplaceGroup;
          res[i].value = item?.intWorkplaceGroupId;
        });
      },
    });
  };
  const getWorkplace = () => {
    const { workplaceGroup } = form.getFieldsValue(true);
    workP?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Workplace",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        intId: employeeId,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strWorkplace;
          res[i].value = item?.intWorkplaceId;
        });
      },
    });
  };
  const getEmployeDepartment = () => {
    const { workplaceGroup, wp } = form.getFieldsValue(true);

    empDepartmentDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDepartment",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: wp?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.DepartmentName;
          res[i].value = item?.DepartmentId;
        });
      },
    });
  };
  const getEmployeDesignation = () => {
    const { workplaceGroup, wp } = form.getFieldsValue(true);

    empDesignationDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDesignation",
        AccountId: orgId,
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: wp?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.DesignationName;
          res[i].value = item?.DesignationId;
        });
      },
    });
  };
  const getEmployeePosition = () => {
    const { workplaceGroup, wp } = form.getFieldsValue(true);

    positionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Position",
        BusinessUnitId: buId,
        WorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: wp?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.PositionName;
          res[i].value = item?.PositionId;
        });
      },
    });
  };
  //   export const getBreakdownPolicyDDL = async (

  const getPayrollGroupDDL = () => {
    const { workplaceGroup, wp } = form.getFieldsValue(true);

    payrollGroupDDL?.action({
      urlKey: "BreakdownNPolicyForSalaryAssign",
      method: "GET",
      params: {
        StrReportType: "BREAKDOWN DDL",
        IntEmployeeId: employeeId,
        IntAccountId: orgId,
        IntSalaryBreakdownHeaderId: 0,
        IntBusinessUnitId: buId,
        IntWorkplaceGroupId: workplaceGroup?.value,
        IntWorkplaceId: wp?.value,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: any) => {
          res[i].label = item?.strSalaryBreakdownTitle;
          res[i].value = item?.intSalaryBreakdownHeaderId;
        });
      },
    });
  };
  const viewHandler = async () => {
    await form
      .validateFields()
      .then(() => {
        getSalaryLanding();
      })
      .catch(() => {
        // console.error("Validate Failed:", info);
      });
  };
  let employeeFeature: any = null;
  permissionList.forEach((item: any) => {
    if (item?.menuReferenceId === 30397) {
      employeeFeature = item;
    }
  });

  const submitHandler = async () => {
    await form
      .validateFields()
      .then(() => {
        console.log("first");
      })
      .catch(() => {
        // console.error("Validate Failed:", info);
      });
  };
  const calculateDynamicFields = (row: any) => {
    const dynamicFields = {} as any;

    // Add your logic here based on TGS
    // Example: Calculate each dynamic field based on TGS
    row.salaryElementsBreakdowns?.forEach((element: any) => {
      dynamicFields[element.strPayrollElementName] = (
        row.TGS *
        (element.numNumberOfPercentage / 100)
      ).toFixed(2);
    });
    // console.log({ dynamicFields });

    return dynamicFields;
  };
  // Table Header
  const handleIsPerDayChange = (
    value: number,
    rowIndex: number,
    property: string
  ) => {
    if (property === "TGS") {
      setRowDto((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex][property] = value;

        const data = calculateDynamicFields(updatedRows[rowIndex]);
        const newOB = { ...updatedRows[rowIndex], ...data };
        updatedRows[rowIndex] = newOB;
        return updatedRows;
      });
    } else {
      setRowDto((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex][property] = value;

        return updatedRows;
      });
    }
  };

  const header: any = [
    {
      title: "SL",
      render: (value: any, row: any, index: number) => index + 1,
      align: "center",
      width: 20,
      // fixed: "left",
    },
    {
      title: "Employee ID",
      dataIndex: "strEmployeeCode",
      // fixed: "left",
    },
    {
      title: "Employee Name",
      dataIndex: "strEmployeeName",
      fixed: "left",
    },
    {
      title: "Designation",
      dataIndex: "strDesignationName",
    },
    {
      title: "Department",
      dataIndex: "strDepartmentName",
    },

    {
      title: "Per Day Salary",
      render: (value: any, row: any, index: number) => (
        <>
          <PSelect
            name={`isPerDay_${index}`}
            options={[
              { value: 1, label: "Yes" },
              { value: 0, label: "No" },
            ]}
            onChange={(value, op) =>
              handleIsPerDayChange(value, index, "isPerDay")
            }
            defaultValue={{ value: 1, label: "Yes" }}
            // rules={[{ required: true, message: "Per Day Salary is required" }]}
          />
        </>
      ),
    },
    {
      title: "Total Gross Salary",
      render: (value: any, row: any, index: number) => (
        <>
          <PInput
            type="number"
            name={`TGS_${index}`}
            placeholder="Amount"
            rules={[
              // { required: true, message: "Amount Is Required" },
              {
                validator: (_, value, callback) => {
                  const TGS = parseFloat(value);
                  const isExit = selectedRow.find(
                    (item: any) => item?.intEmployeeId === row?.intEmployeeId
                  );
                  if (isExit && isNaN(TGS)) {
                    callback("Amount Is Required");
                  } else if (TGS < 0) {
                    callback("Cant be Negative");
                  } else {
                    callback();
                  }
                },
              },
            ]}
            // disabled={true}
            onChange={(e: any) => {
              handleIsPerDayChange(e, index, "TGS");
              handleIsPerDayChange(e, index, "CA");
              handleIsPerDayChange(0, index, "BA");
              handleIsPerDayChange(0, index, "MFS");
              const property = `CA_${index}`;
              const property2 = `BA_${index}`;
              const property3 = `MFS_${index}`;
              form.setFieldsValue({
                [property]: e,
                [property2]: 0,
                [property3]: 0,
              });
            }}
          />
        </>
      ),
    },
    ...dynamicHeader,
    {
      title: "Net Salary Amount",
      dataIndex: "TGS",
    },
    {
      title: "Bank Amount",
      render: (value: any, row: any, index: number) => (
        <>
          <PInput
            type="number"
            name={`BA_${index}`}
            placeholder="Amount"
            rules={[
              // { required: true, message: "Amount Is Required" },
              {
                validator: (_, value, callback) => {
                  const BA = parseFloat(value);
                  const isExit = selectedRow.find(
                    (item: any) => item?.intEmployeeId === row?.intEmployeeId
                  );
                  if (isExit && isNaN(BA)) {
                    callback("Amount Is Required");
                  } else if (BA < 0) {
                    callback("Cant be Negative");
                  } else {
                    callback();
                  }
                },
              },
            ]}
            // disabled={true}
            onChange={(e: any) => {
              // const property1 = `MFS_${index}`;
              handleIsPerDayChange(e, index, "BA");

              handleIsPerDayChange(row?.TGS - e - row?.MFS, index, "CA");
              // handleIsPerDayChange(e, index, "BA");
              // handleIsPerDayChange(row?.TGS - e, index, "CA");
              const property2 = `CA_${index}`;
              form.setFieldsValue({
                // [property1]: row?.TGS - e,
                [property2]: row?.TGS - e - row?.MFS,
              });
            }}
          />
        </>
      ),
    },
    {
      title: "MFS Amount     ",
      render: (_: any, row: any, index: number) => (
        <>
          <PInput
            type="number"
            name={`MFS_${index}`}
            placeholder="Amount"
            rules={[
              // { required: true, message: "Amount Is Required" },
              {
                validator: (_, value, callback) => {
                  const MFS = parseFloat(value);
                  const isExit = selectedRow.find(
                    (item: any) => item?.intEmployeeId === row?.intEmployeeId
                  );
                  if (isExit && isNaN(MFS)) {
                    callback("Amount Is Required");
                  } else if (MFS < 0) {
                    callback("Cant be Negative");
                  } else {
                    callback();
                  }
                },
              },
            ]}
            // disabled={true}
            onChange={(e: any) => {
              handleIsPerDayChange(e, index, "MFS");

              handleIsPerDayChange(row?.TGS - e - row?.BA, index, "CA");
              // handleIsPerDayChange(row?.TGS - row?.CA, index, "BA");
              // const property1 = `BA_${index}`;
              const property2 = `CA_${index}`;
              form.setFieldsValue({
                [property2]: row?.TGS - e - row?.BA,
                // [property1]: row?.TGS - row?.CA,
              });
            }}
          />
        </>
      ),
    },
    {
      title: "Cash Amount",
      render: (value: any, row: any, index: number) => (
        <>
          <PInput
            type="number"
            name={`CA_${index}`}
            placeholder="Amount"
            rules={[
              { required: true, message: "Amount Is Required" },
              {
                validator: (_, value, callback) => {
                  const isExit = selectedRow.find(
                    (item: any) => item?.intEmployeeId === row?.intEmployeeId
                  );
                  const CA = parseFloat(value);
                  const BA = parseFloat(form.getFieldValue(`BA_${index}`) || 0);
                  const MFS = parseFloat(
                    form.getFieldValue(`MFS_${index}`) || 0
                  );
                  const TGS = parseFloat(form.getFieldValue(`TGS_${index}`));
                  if (isExit) {
                    if (isNaN(CA) || CA < 0) {
                      callback("CA cannot be negative");
                    } else if (CA + BA + MFS !== TGS) {
                      callback("CA + BA + MFS must equal TGS");
                    } else {
                      callback();
                    }
                  }
                },
              },
            ]}
            // disabled={true}
            onChange={(e: any) => {
              handleIsPerDayChange(e, index, "CA");
              handleIsPerDayChange(0, index, "BA");
              handleIsPerDayChange(0, index, "MFS");

              const property1 = `BA_${index}`;
              const property2 = `MFS_${index}`;
              form.setFieldsValue({
                [property1]: 0,
                [property2]: 0,
              });
            }}
          />
        </>
      ),
    },
  ];
  useEffect(() => {
    getWorkplaceGroup();
  }, [wgId, buId, wId]);
  // console.log({ rowDto });

  return employeeFeature?.isView ? (
    <PForm form={form} initialValues={{}}>
      <PCard>
        <PCardHeader
          title="Bulk Salary Assign"
          buttonList={[
            {
              type: "primary",
              content: "Save",
              onClick: () => {
                submitHandler();
              },
              disabled: selectedRow?.length > 0 ? false : true,
              //   icon: <AddOutlined />,
            },
            {
              type: "primary-outline",
              content: "Cancel",
              onClick: () => {
                form.resetFields();
                setSelectedRow([]);
                setRowDto((prev) => {
                  prev = [];
                  return prev;
                });
                // getSalaryLanding();
              },
              // disabled: true,
              //   icon: <AddOutlined />,
            },
          ]}
        ></PCardHeader>
        <Row gutter={[10, 2]} className="mb-3">
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={workG?.data || []}
              name="workplaceGroup"
              label="Workplace Group"
              placeholder="Workplace Group"
              onChange={(value, op) => {
                form.setFieldsValue({
                  workplaceGroup: op,
                });
                getWorkplace();
              }}
              rules={[
                { required: true, message: "Workplace Group is required" },
              ]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={workP?.data || []}
              name="wp"
              label="Workplace"
              placeholder="Workplace"
              onChange={(value, op) => {
                form.setFieldsValue({
                  wp: op,
                });
                getEmploymentType();
                getEmployeDepartment();
                getEmployeDesignation();
                getEmployeePosition();
                getPayrollGroupDDL();
              }}
              rules={[{ required: true, message: "Workplace is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={payrollGroupDDL?.data || []}
              name="payrollGroup"
              label="Payroll Group"
              placeholder="Payroll Group"
              onChange={(value, op) => {
                form.setFieldsValue({
                  payrollGroup: op,
                });
              }}
              rules={[{ required: true, message: "Payroll Group is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={employmentTypeDDL?.data || []}
              name="employeeType"
              label="Employment Type"
              placeholder="Employment Type"
              onChange={(value, op) => {
                form.setFieldsValue({
                  employeeType: op,
                });
              }}
              //   rules={[
              //     { required: true, message: "Employment Type is required" },
              //   ]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={empDepartmentDDL?.data || []}
              name="department"
              showSearch
              filterOption={true}
              label="Department"
              allowClear
              placeholder="Department"
              onChange={(value, op) => {
                form.setFieldsValue({
                  department: op,
                });
              }}
              //   rules={[{ required: true, message: "Department is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={empDesignationDDL.data || []}
              showSearch
              filterOption={true}
              name="designation"
              label="Designation"
              placeholder="Designation"
              onChange={(value, op) => {
                form.setFieldsValue({
                  designation: op,
                });
              }}
              //   rules={[{ required: true, message: "Designation is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PSelect
              options={positionDDL?.data || []}
              name="hrPosition"
              showSearch
              filterOption={true}
              label="HR Position"
              placeholder="HR Position"
              onChange={(value, op) => {
                form.setFieldsValue({
                  hrPosition: op,
                });
              }}
              //   rules={[{ required: true, message: "HR Position is required" }]}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PInput
              type="date"
              name="joiningDateFrom"
              label="Joining Date From"
              placeholder="Joining Date From"
              //   rules={[{ required: true, message: "Joining Date is required" }]}
              // disabled={isEdit}
            />
          </Col>
          <Col md={6} sm={12} xs={24}>
            <PInput
              type="date"
              name="joiningDateTo"
              label="Joining Date To"
              placeholder="Joining Date To"
              //   rules={[{ required: true, message: "Joining Date is required" }]}
              // disabled={isEdit}
            />
          </Col>

          <Col
            style={{
              marginTop: "23px",
            }}
          >
            <PButton type="primary" content="View" onClick={viewHandler} />
          </Col>
        </Row>
        <DataTable
          header={header}
          bordered
          data={rowDto || []}
          loading={bulkLandingAPI?.loading}
          scroll={{ x: 1500 }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRow.map((item) => item?.key),
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRow(selectedRows);
            },
            getCheckboxProps: (rec) => {
              // console.log(rec);
              // return {
              //   disabled: rec?.ApplicationStatus === "Approved",
              // };
            },
          }}
        />
      </PCard>
    </PForm>
  ) : (
    <NotPermittedPage />
  );
};

export default BulkSalaryAssign;

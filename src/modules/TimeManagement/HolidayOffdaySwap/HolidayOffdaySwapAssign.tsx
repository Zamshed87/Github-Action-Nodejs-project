import {
  DataTable,
  PButton,
  PCard,
  PCardBody,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { attendenceStatusDDL, header } from "./helper";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { PModal } from "Components/Modal";
import { toast } from "react-toastify";

const HolidayOffdaySwapAssign = () => {
  const {
    permissionList,
    profileData: { wId, wgId, buId, orgId, employeeId },
  } = useSelector((state: any) => state?.auth, shallowEqual);
  const dispatch = useDispatch();

  // Form Instance
  const [form] = Form.useForm();

  const holidayOffdayPermission = useMemo(
    () => permissionList?.find((item: any) => item?.menuReferenceId === 30419),
    []
  );

  // states
  const [rowDto, setRowDto] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  // api states
  const empDepartmentDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const positionDDL = useApiRequest([]);
  const holidayOffdayLandingAPI = useApiRequest([]);
  const holidayOffdaySwapPostAPI = useApiRequest([]);

  const getEmployeDepartment = () => {
    empDepartmentDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDepartment",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
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
    empDesignationDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDesignation",
        AccountId: orgId,
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
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
    positionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Position",
        BusinessUnitId: buId,
        WorkplaceGroupId: wgId,
        IntWorkplaceId: wId,
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
  const postholidayOffdaySwap = () => {
    const { attendenceStatus, attendenceDate, changedTo, strRemarks } =
      form.getFieldsValue(true);

    holidayOffdaySwapPostAPI?.action({
      urlKey: "holidayOffdayAssignPost",
      method: "post",
      payload: {
        attendenceStatus: attendenceStatus?.value,
        attendenceDate: attendenceDate,
        empIdList: selectedRow?.map((dto) => dto?.intEmpId).toString(),
        swapDate: changedTo,
        empId: employeeId,
        strRemaks: strRemarks || "",
      },
      toast: true,
      onSuccess: () => {
        setOpen(false);
        setSelectedRow([]);
        getholidayOffdayLanding();
      },
    });
  };
  const getholidayOffdayLanding = (
    pagination = { current: 1, pageSize: 25 }
  ) => {
    const {
      departments,
      designatios,
      hrPositions,
      search,
      attendenceStatus,
      attendenceDate,
    } = form.getFieldsValue(true);

    holidayOffdayLandingAPI?.action({
      urlKey: "holidayOffdayLanding",
      method: "post",
      payload: {
        workplace: wId,
        workplaceGroup: wgId,
        hrPositions: hrPositions?.map((dto: any) => dto?.value) || [],
        departments: departments?.map((dto: any) => dto?.value) || [],
        designatios: designatios?.map((dto: any) => dto?.value) || [],
        searchTxt: search || "",
        attendenceStatus: attendenceStatus?.value,
        attendenceDate: attendenceDate,
        pageNo: pagination?.current,
        pageSize: pagination?.pageSize,
      },
      onSuccess: (res) => {
        setRowDto(res);
      },
    });
  };

  // Life Cycle Hooks
  useEffect(() => {
    getholidayOffdayLanding();
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Holiday/Offday Swap";
  }, []);
  useEffect(() => {
    getEmployeDepartment();
    getEmployeDesignation();
    getEmployeePosition();
  }, [wgId, buId, wId]);

  return holidayOffdayPermission?.isView ? (
    <>
      <PForm
        form={form}
        initialValues={{}}
        onFinish={() => {
          getholidayOffdayLanding();
        }}
      >
        <PCard>
          <PCardHeader
            title="Holiday/Offday Swap Assign"
            backButton={true}
            onSearch={(e) => {
              form.setFieldsValue({
                search: e?.target?.value,
              });
              getholidayOffdayLanding();
            }}
            buttonList={[
              {
                type: "primary",
                content: `Swap ${selectedRow?.length || ""}`,
                onClick: () => {
                  setOpen(true);
                },
                disabled: selectedRow?.length === 0 ? true : false,
              },
            ]}
          />
          <PCardBody className="mb-3">
            <Row gutter={[10, 2]}>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={empDepartmentDDL?.data || []}
                  name="departments"
                  showSearch
                  filterOption={true}
                  label="Department"
                  allowClear
                  mode="multiple"
                  placeholder="Department"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      departments: op,
                    });
                  }}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={empDesignationDDL.data || []}
                  showSearch
                  allowClear
                  filterOption={true}
                  name="designatios"
                  label="Designation"
                  mode="multiple"
                  placeholder="Designation"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      designatios: op,
                    });
                  }}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={positionDDL?.data || []}
                  name="hrPositions"
                  mode="multiple"
                  showSearch
                  allowClear
                  filterOption={true}
                  label="HR Position"
                  placeholder="HR Position"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      hrPositions: op,
                    });
                  }}
                />
              </Col>

              <Col md={6} sm={12} xs={24}>
                <PSelect
                  options={attendenceStatusDDL}
                  name="attendenceStatus"
                  showSearch
                  filterOption={true}
                  label="Holiday/Offday"
                  placeholder="Holiday/Offday"
                  onChange={(value, op) => {
                    form.setFieldsValue({
                      attendenceStatus: op,
                    });
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Attendence Status Is Required",
                    },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PInput
                  type="date"
                  name="attendenceDate"
                  placeholder="Attendence Date"
                  label="Attendence Date"
                  rules={[
                    { required: true, message: "Attendence Date Is Required" },
                  ]}
                />
              </Col>
              <Col md={6} sm={12} xs={24}>
                <PButton
                  action="submit"
                  style={{ marginTop: "22px" }}
                  type="primary"
                  content="View"
                />
              </Col>
            </Row>
          </PCardBody>
          <DataTable
            header={header(holidayOffdayLandingAPI)}
            bordered
            data={rowDto || []}
            loading={holidayOffdayLandingAPI?.loading}
            pagination={{
              current: holidayOffdayLandingAPI?.data[0]?.currentPage,
              pageSize: holidayOffdayLandingAPI?.data[0]?.pageSize,
              total: holidayOffdayLandingAPI?.data[0]?.totalCount,
            }}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedRow.map((item) => item?.key),
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRow(selectedRows);
              },
            }}
            onChange={(pagination, filters, sorter, extra) => {
              if (extra.action === "sort") return;
              getholidayOffdayLanding(pagination);
              setSelectedRow([]);
            }}
          />
        </PCard>
      </PForm>
      <PModal
        open={open}
        title={`Swap Holiday/Offday`}
        onCancel={() => {
          setOpen(false);
          form.setFieldValue("changedTo", "");
        }}
        width={800}
        components={
          <Row gutter={[10, 2]}>
            <Col md={6} sm={12} xs={24}>
              <PInput
                type="date"
                name="changedTo"
                placeholder="Changed to"
                label="Changed to"
                onChange={(value) => {
                  form.setFieldValue("changedTo", value);
                }}
              />
            </Col>
            <Col md={6} sm={12} xs={24}>
              <PInput
                type="text"
                name="strRemarks"
                placeholder="Remarks"
                label="Remarks"
                onChange={(e) => {
                  // console.log({value})
                  form.setFieldValue("strRemarks", e?.target?.value);
                }}
              />
            </Col>
            <Col md={6} sm={12} xs={24}>
              <PButton
                action="button"
                style={{ marginTop: "34px" }}
                type="primary"
                content="Save"
                onClick={() => {
                  if (form.getFieldValue("changedTo")) {
                    if (
                      form.getFieldValue("changedTo").format("YYYY-MM-DD") ===
                      form.getFieldValue("attendenceDate").format("YYYY-MM-DD")
                    ) {
                      return toast.error(
                        "Attendance date and Swaped date cannot be same"
                      );
                    }
                    postholidayOffdaySwap();
                  } else {
                    return toast.warning("please give a valid date");
                  }
                }}
              />
            </Col>
          </Row>
        }
      />
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default HolidayOffdaySwapAssign;

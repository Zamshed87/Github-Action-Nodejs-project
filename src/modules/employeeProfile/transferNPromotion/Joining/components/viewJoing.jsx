import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import BackButton from "../../../../../common/BackButton";
import Loading from "../../../../../common/loading/Loading";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import { getEmployeeProfileViewData } from "../../../employeeFeature/helper";
import Accordion from "../accordion";
import ViewJoiningTable from "./viewJoiningTable";
import { PButton, PForm, PInput, PSelect } from "Components";
import { Col, Divider, Form, Row } from "antd";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { debounce } from "lodash";
import FileUploadComponents from "utility/Upload/FileUploadComponents";
import { organizationTypeList } from "../../transferNPromotion/components/createTransferPromotion";
import { setOrganizationDDLFunc } from "modules/roleExtension/ExtensionCreate/helper";
import { toast } from "react-toastify";
import { DeleteOutlined } from "@ant-design/icons";
import { createPayload, joiningDisabledDate, setInitialData } from "./helper";

const ViewJoining = () => {
  const { orgId, employeeId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // form states
  const [form] = Form.useForm();

  const { id } = useParams();
  const location = useLocation();
  const [transferNpromotion, getTransferNpromotion, loading1] = useAxiosGet();
  const [empBasic, setEmpBasic] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initData, setInitData] = useState({});
  const [empSignature, setEmpSignature] = useState([]);
  const [organizationDDL, setOrganizationDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);

  const getSingleData = () => {
    getTransferNpromotion(
      `/Employee/GetEmpTransferNpromotionById?id=${id}`,
      (res) => {
        setInitialData(res, setInitData);
        res?.empTransferNpromotionRoleExtensionVMList?.length > 0 &&
          setRowDto(res?.empTransferNpromotionRoleExtensionVMList);
      }
    );
    getEmployeeProfileViewData(
      location?.state?.employeeId,
      setEmpBasic,
      setLoading,
      location?.state?.businessUnitId,
      location?.state?.workplaceGroupId
    );
  };

  // api states
  const employmentTypeDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const empSectionDDL = useApiRequest([]);
  const positionDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const supervisorDDL = useApiRequest([]);
  const dottedSupervisorDDL = useApiRequest([]);
  const lineManagerDDL = useApiRequest([]);
  const userRoleDDL = useApiRequest([]);
  const calendarDDL = useApiRequest([]);
  const rosterGroupDDL = useApiRequest([]);
  const calendarByRosterGroupDDL = useApiRequest([]);
  const holidayDDL = useApiRequest([]);

  const getSuperVisorDDL = debounce((value) => {
    if (value?.length < 2) return supervisorDDL?.reset();
    supervisorDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeBasicInfoForEmpMgmt",
        AccountId: orgId,
        BusinessUnitId: location?.state?.businessUnitId,
        intId: employeeId,
        workplaceGroupId: location?.state?.workplaceGroupId,
        strWorkplaceIdList: location?.state?.workplaceId.toString(),
        searchTxt: value || "",
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmployeeOnlyName;
          res[i].value = item?.EmployeeId;
        });
      },
    });
  }, 500);

  const getDottedSuperVisorDDL = debounce((value) => {
    if (value?.length < 2) return dottedSupervisorDDL?.reset();

    dottedSupervisorDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeBasicInfoForEmpMgmt",
        AccountId: orgId,
        BusinessUnitId: location?.state?.businessUnitId,
        intId: employeeId,
        workplaceGroupId: location?.state?.workplaceGroupId,
        strWorkplaceIdList: location?.state?.workplaceId.toString(),
        searchTxt: value || "",
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmployeeOnlyName;
          res[i].value = item?.EmployeeId;
        });
      },
    });
  }, 500);

  const getLineManagerDDL = debounce((value) => {
    if (value?.length < 2) return lineManagerDDL?.reset();

    lineManagerDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmployeeBasicInfoForEmpMgmt",
        AccountId: orgId,
        BusinessUnitId: location?.state?.businessUnitId,
        intId: employeeId,
        workplaceGroupId: location?.state?.workplaceGroupId,
        strWorkplaceIdList: location?.state?.workplaceId.toString(),
        searchTxt: value || "",
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmployeeOnlyName;
          res[i].value = item?.EmployeeId;
        });
      },
    });
  }, 500);

  const getData = () => {
    userRoleDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "UserRoleDDLWithoutDefault",
        BusinessUnitId: location?.state?.businessUnitId,
        WorkplaceGroupId: location?.state?.workplaceGroupId,
        IntWorkplaceId: location?.state?.workplaceId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.label;
          res[i].value = item?.value;
        });
      },
    });
    positionDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Position",
        BusinessUnitId: location?.state?.businessUnitId,
        WorkplaceGroupId: location?.state?.workplaceGroupId,
        IntWorkplaceId: location?.state?.workplaceId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.PositionName;
          res[i].value = item?.PositionId;
        });
      },
    });
    empDesignationDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDesignation",
        AccountId: orgId,
        BusinessUnitId: location?.state?.businessUnitId,
        WorkplaceGroupId: location?.state?.workplaceGroupId,
        IntWorkplaceId: location?.state?.workplaceId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.DesignationName;
          res[i].value = item?.DesignationId;
        });
      },
    });
    empDepartmentDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmpDepartment",
        BusinessUnitId: location?.state?.businessUnitId,
        WorkplaceGroupId: location?.state?.workplaceGroupId,
        IntWorkplaceId: location?.state?.workplaceId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.DepartmentName;
          res[i].value = item?.DepartmentId;
        });
      },
    });
    employmentTypeDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "EmploymentType",
        BusinessUnitId: location?.state?.businessUnitId,
        WorkplaceGroupId: location?.state?.workplaceGroupId,
        IntWorkplaceId: location?.state?.workplaceId,
        intId: 0,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.EmploymentType;
          res[i].value = item?.Id;
        });
      },
    });
    holidayDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "HolidayGroup",
        BusinessUnitId: location?.state?.businessUnitId,
        WorkplaceGroupId: location?.state?.workplaceGroupId,
        IntWorkplaceId: location?.state?.workplaceId,
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.HolidayGroupName;
          res[i].value = item?.HolidayGroupId;
        });
      },
    });
  };

  const getCalendarDDL = () => {
    calendarDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "Calender",
        IntWorkplaceId: location?.state?.workplaceId,
        BusinessUnitId: location?.state?.businessUnitId,
        WorkplaceGroupId: location?.state?.workplaceGroupId,
        intId: 0, // employeeId, Previously set 0
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.CalenderName;
          res[i].value = item?.CalenderId;
        });
      },
    });
  };

  const getRosterGroupDDL = () => {
    rosterGroupDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "RosterGroup",
        BusinessUnitId: location?.state?.businessUnitId,
        WorkplaceGroupId: location?.state?.workplaceGroupId,
        IntWorkplaceId: location?.state?.workplaceId,
        intId: 0, // employeeId, Previously set 0
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.RosterGroupName;
          res[i].value = item?.RosterGroupId;
        });
      },
    });
  };
  const getCalendarByRosterDDL = () => {
    const { calender } = form.getFieldsValue(true);
    calendarByRosterGroupDDL?.action({
      urlKey: "PeopleDeskAllDDL",
      method: "GET",
      params: {
        DDLType: "CalenderByRosterGroup",
        BusinessUnitId: location?.state?.businessUnitId,
        WorkplaceGroupId: location?.state?.workplaceGroupId,
        intId: calender?.value, // employeeId, Previously set 0
      },
      onSuccess: (res) => {
        res.forEach((item, i) => {
          res[i].label = item?.CalenderName;
          res[i].value = item?.CalenderId;
        });
      },
    });
  };

  useEffect(() => {
    getSingleData();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRoleAdd = (orgType, orgName) => {
    setRowDto([
      ...rowDto,
      {
        intOrganizationTypeId: +orgType?.value,
        strOrganizationTypeName: orgType?.label,
        intOrganizationReffId: orgName?.value,
        strOrganizationReffName: orgName?.label,
      },
    ]);
  };

  console.log(transferNpromotion, "transferNpromotion");

  return (
    <PForm
      form={form}
      initialValues={initData}
      onFinish={(values) =>
        createPayload(values, transferNpromotion, employeeId)
      }
    >
      {loading || loading1 ? (
        <Loading />
      ) : (
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <BackButton title={"View Joining Details"} />
            </div>
            <div className="table-card-head-right">
              <ul>
                <li>
                  <PButton
                    content="Save"
                    type="primary"
                    action="submit"
                    disabled={loading}
                  />
                </li>
              </ul>
            </div>
          </div>
          <div
            className="table-card-body card-style mb-3"
            style={{ minHeight: "auto" }}
          >
            <div className="mt-2">
              <Accordion empBasic={empBasic} />
            </div>

            {/* Proposed History transfers and promotions */}
            {!!transferNpromotion && (
              <div>
                <div className="col-lg-12 mb-2 pl-0">
                  <Divider style={{ borderColor: "darkgray" }}>
                    Proposed Transfer/Promotion
                  </Divider>
                </div>
                <div className="table-colored">
                  <ViewJoiningTable transferNpromotion={transferNpromotion} />
                </div>
              </div>
            )}
            <div>
              <div className="col-lg-12 my-3 px-0">
                <Divider style={{ borderColor: "darkgray" }}>
                  Edit Proposed Transfer/Promotion
                </Divider>
              </div>

              <Row gutter={[10, 2]}>
                <Col md={6} sm={12} xs={24}>
                  <PSelect
                    options={[]}
                    name="type"
                    label="Type"
                    placeholder="Type"
                    disabled
                  />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <PInput
                    type="date"
                    name="effectiveDate"
                    label="Effective Date"
                    placeholder="Effective Date"
                    disabled
                  />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <PSelect
                    options={[]}
                    name="businessUnit"
                    label="Business Unit"
                    placeholder="Business Unit"
                    disabled
                  />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <PSelect
                    options={[]}
                    name="workplaceGroup"
                    label="Workplace Group"
                    placeholder="Workplace Group"
                    disabled
                  />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <PSelect
                    options={[]}
                    name="workplace"
                    label="Workplace"
                    placeholder="Workplace"
                    disabled
                  />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <PSelect
                    options={employmentTypeDDL?.data || []}
                    name="employmentType"
                    label="Employment Type"
                    placeholder="Employment Type"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        employmentType: op,
                      });
                    }}
                  />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <PSelect
                    options={positionDDL?.data || []}
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
                <Col md={6} sm={12} xs={24}>
                  <PSelect
                    options={empDepartmentDDL?.data || []}
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
                <Col md={6} sm={12} xs={24}>
                  <PSelect
                    options={empSectionDDL?.data || []}
                    name="section"
                    label="Section"
                    placeholder="Section"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        section: op,
                      });
                    }}
                  />
                </Col>
                <Col md={6} sm={12} xs={24}>
                  <PSelect
                    options={empDesignationDDL?.data || []}
                    name="designation"
                    label="Designation"
                    placeholder="Designation"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        designation: op,
                      });
                    }}
                  />
                </Col>
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    const { workplaceGroup } = form.getFieldsValue(true);
                    return (
                      <>
                        <Col md={6} sm={24}>
                          <PSelect
                            options={supervisorDDL?.data || []}
                            name="supervisor"
                            label="Supervisor"
                            placeholder={`${
                              workplaceGroup?.value
                                ? "Search minimum 2 character"
                                : "Select Workplace Group first"
                            }`}
                            disabled={!workplaceGroup?.value}
                            onChange={(value, op) => {
                              form.setFieldsValue({
                                supervisor: op,
                              });
                            }}
                            showSearch
                            filterOption={false}
                            // notFoundContent={null}
                            loading={supervisorDDL?.loading}
                            onSearch={(value) => {
                              getSuperVisorDDL(value);
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Supervisor is required",
                              },
                            ]}
                          />
                        </Col>
                        <Col md={6} sm={24}>
                          <PSelect
                            options={dottedSupervisorDDL?.data || []}
                            name="dottedSuperVisor"
                            label="Dotted Supervisor"
                            allowClear
                            placeholder={`${
                              workplaceGroup?.value
                                ? "Search minimum 2 character"
                                : "Select Workplace Group first"
                            }`}
                            disabled={!workplaceGroup?.value}
                            onChange={(value, op) => {
                              form.setFieldsValue({
                                dottedSuperVisor: op,
                              });
                            }}
                            showSearch
                            filterOption={false}
                            // notFoundContent={null}
                            loading={dottedSupervisorDDL?.loading}
                            onSearch={(value) => {
                              getDottedSuperVisorDDL(value);
                            }}
                          />
                        </Col>
                        <Col md={6} sm={24}>
                          <PSelect
                            options={lineManagerDDL.data || []}
                            name="lineManager"
                            label="Line Manager"
                            placeholder={`${
                              workplaceGroup?.value
                                ? "Search minimum 2 character"
                                : "Select Workplace Group first"
                            }`}
                            disabled={!workplaceGroup?.value}
                            onChange={(value, op) => {
                              form.setFieldsValue({
                                lineManager: op,
                              });
                            }}
                            showSearch
                            filterOption={false}
                            // notFoundContent={null}
                            loading={lineManagerDDL?.loading}
                            onSearch={(value) => {
                              getLineManagerDDL(value);
                            }}
                            rules={[
                              {
                                required: true,
                                message: "Line Manager is required",
                              },
                            ]}
                          />
                        </Col>
                      </>
                    );
                  }}
                </Form.Item>
                <Col md={6} sm={12} xs={24}>
                  <PSelect
                    mode="multiple"
                    options={userRoleDDL?.data || []}
                    name="role"
                    label="Role"
                    placeholder="Role"
                    onChange={(value, op) => {
                      form.setFieldsValue({
                        role: op,
                      });
                    }}
                  />
                </Col>
                <Col md={6} sm={24}>
                  <PInput
                    type="text"
                    name="remarks"
                    label="Remarks"
                    placeholder="remarks"
                    rules={[{ required: true, message: "Remarks is required" }]}
                  />
                </Col>
                <Col md={6} sm={24} style={{ marginTop: "21px" }}>
                  <FileUploadComponents
                    propsObj={{
                      title: "Upload Document",
                      attachmentList: empSignature,
                      setAttachmentList: setEmpSignature,
                      accountId: orgId,
                      tableReferrence: "LeaveAndMovement",
                      documentTypeId: 15,
                      userId: employeeId,
                      buId,
                      maxCount: 1,
                      accept:
                        "image/png, image/jpeg, image/jpg, application/pdf",
                    }}
                  />
                </Col>
              </Row>
              <Divider
                orientation="left"
                style={{ fontSize: "13px", marginBottom: "10px" }}
              >
                Employment Shift Info
              </Divider>
              {/* emp calendar info 🔥🔥🔥 */}
              <>
                <Row gutter={[10, 2]}>
                  <Form.Item shouldUpdate noStyle>
                    {() => {
                      const { calenderType, workplace } =
                        form.getFieldsValue(true);
                      return (
                        <>
                          <Col md={8} sm={24}>
                            <PSelect
                              options={[
                                {
                                  value: 1,
                                  label: "Calendar",
                                },
                                { value: 2, label: "Roster" },
                              ]}
                              type="date"
                              name="calenderType"
                              label="Calendar Type"
                              placeholder="Calendar Type"
                              onChange={(value, op) => {
                                form.setFieldsValue({
                                  calender: null,
                                  // otType: null,
                                  calenderType: op,
                                });

                                value === 1
                                  ? getCalendarDDL()
                                  : getRosterGroupDDL();
                              }}
                            />
                          </Col>
                          <Col md={8} sm={24}>
                            <PSelect
                              options={
                                calenderType?.value === 2
                                  ? rosterGroupDDL.data || []
                                  : calendarDDL?.data || []
                              }
                              name="calender"
                              label={
                                calenderType?.value === 2
                                  ? `Roster Name`
                                  : `Calendar Name`
                              }
                              placeholder={
                                calenderType?.value === 2
                                  ? `Roster Name`
                                  : `Calendar Name`
                              }
                              disabled={!workplace}
                              onChange={(value, op) => {
                                form.setFieldsValue({
                                  calender: op,
                                });

                                const { calenderType } = form.getFieldsValue();
                                calenderType?.value === 2 &&
                                  getCalendarByRosterDDL();
                              }}
                            />
                          </Col>

                          {calenderType?.value === 2 ? (
                            <>
                              <Col md={8} sm={24}>
                                <PSelect
                                  options={calendarByRosterGroupDDL?.data || []}
                                  name="startingCalender"
                                  label="Starting Calendar"
                                  placeholder={"Starting Calendar"}
                                  disabled={!workplace}
                                  onChange={(value, op) => {
                                    form.setFieldsValue({
                                      startingCalender: op,
                                    });
                                  }}
                                />
                              </Col>
                              <Col md={8} sm={24}>
                                <PInput
                                  type="date"
                                  name="nextChangeDate"
                                  label="Next Calendar Change"
                                  placeholder={"Next Calendar Change"}
                                />
                              </Col>
                            </>
                          ) : undefined}
                        </>
                      );
                    }}
                  </Form.Item>
                  <Col md={8} sm={24}>
                    <PInput
                      type="date"
                      name="generateDate"
                      label="Calender Generate Date"
                      placeholder="Generate Date"
                      disabledDate={joiningDisabledDate}
                    />
                  </Col>
                  <Col md={8} sm={24}>
                    <PSelect
                      mode="multiple"
                      options={[
                        {
                          value: 1,
                          label: "Friday",
                        },
                        { value: 2, label: "Saturday" },
                        { value: 3, label: "Sunday" },
                        { value: 4, label: "Monday" },
                        { value: 5, label: "Tuseday" },
                        { value: 6, label: "Wednesday" },
                        { value: 7, label: "Thursday" },
                      ]}
                      name="offday"
                      label="Off Day"
                      placeholder=" Off Day"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          offday: op,
                        });

                        // value && getWorkplace();
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Off Day is required",
                        },
                      ]}
                    />
                  </Col>
                  <Col md={8} sm={24}>
                    <PSelect
                      options={holidayDDL?.data || []}
                      name="holiday"
                      label="Holiday"
                      placeholder="Holiday"
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          holiday: op,
                        });
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Holiday is required",
                        },
                      ]}
                    />
                  </Col>
                </Row>
              </>

              {/* emp role extension 🔥🔥🔥 */}
              <Divider
                orientation="left"
                style={{ fontSize: "13px", marginBottom: "10px" }}
              >
                Role Extension
              </Divider>
              <>
                <Row gutter={[10, 2]}>
                  {/* User Create */}
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const { isRoleExtension, orgName, orgType } =
                        form.getFieldsValue();
                      return (
                        <>
                          <Col md={8} sm={24}>
                            <PInput
                              label="Is applicable for role extension?"
                              type="checkbox"
                              name="isRoleExtension"
                              layout="horizontal"
                            />
                          </Col>
                          {isRoleExtension && (
                            <>
                              <Divider style={{ margin: "3px 0" }} />
                              <Col md={6} sm={24}>
                                <PSelect
                                  options={organizationTypeList || []}
                                  name="orgType"
                                  label="Organization Type"
                                  placeholder="Organization Type"
                                  onChange={(value, op) => {
                                    form.setFieldsValue({
                                      orgType: op,
                                      orgName: null,
                                    });
                                    setOrganizationDDLFunc(
                                      orgId,
                                      buId,
                                      employeeId,
                                      op,
                                      setOrganizationDDL
                                    );
                                  }}
                                />
                              </Col>
                              <Col md={6} sm={24}>
                                <PSelect
                                  options={organizationDDL || []}
                                  name="orgName"
                                  label="Organization Name"
                                  placeholder="Organization Name"
                                  onChange={(value, op) => {
                                    form.setFieldsValue({
                                      orgName: op,
                                    });
                                  }}
                                />
                              </Col>
                              <Col md={8} sm={24}>
                                <PButton
                                  content="Add"
                                  type="primary"
                                  style={{ marginTop: "22px" }}
                                  disabled={!orgName || !orgType}
                                  onClick={() => {
                                    const roleExist = rowDto?.some(
                                      (item) =>
                                        item?.intOrganizationTypeId ===
                                          orgType?.value &&
                                        item?.intOrganizationReffId ===
                                          orgName?.value
                                    );

                                    if (roleExist)
                                      return toast.warn(
                                        "Already extis this role"
                                      );
                                    onRoleAdd(orgType, orgName);
                                    form.setFieldsValue({
                                      orgType: null,
                                      orgName: null,
                                    });
                                  }}
                                />
                              </Col>
                            </>
                          )}
                        </>
                      );
                    }}
                  </Form.Item>
                </Row>
                <div>
                  {rowDto.length > 0 && (
                    <>
                      <div className="col-lg-12 mb-2 mt-3">
                        <h3
                          style={{
                            color: " gray700 !important",
                            fontSize: "16px",
                            lineHeight: "20px",
                            fontWeight: "500",
                          }}
                        >
                          Role Extension List
                        </h3>
                      </div>
                      <div className="col-md-12">
                        <div className="table-card-body">
                          <div className="table-card-styled tableOne">
                            <table className="table">
                              <thead>
                                <tr className="py-1">
                                  <th>SL</th>
                                  <th>
                                    <span className="mr-1"> Org Type</span>
                                  </th>
                                  <th>
                                    <span className="mr-1"> Org Name</span>
                                  </th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {rowDto?.map((item, index) => (
                                  <tr className="hasEvent" key={index + 1}>
                                    <td>
                                      <p className="tableBody-title pl-1">
                                        {index + 1}
                                      </p>
                                    </td>
                                    <td>
                                      <p className="tableBody-title">
                                        {item?.strOrganizationTypeName}
                                      </p>
                                    </td>
                                    <td>
                                      <p className="tableBody-title">
                                        {item?.strOrganizationReffName}
                                      </p>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center justify-content-end">
                                        <button
                                          type="button"
                                          className="iconButton mt-0 mt-md-2 mt-lg-0"
                                          onClick={() =>
                                            setRowDto((prev) => [
                                              ...prev.filter(
                                                (prev_item, item_index) =>
                                                  item_index !== index
                                              ),
                                            ])
                                          }
                                        >
                                          <DeleteOutlined />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            </div>
          </div>
        </div>
      )}
    </PForm>
  );
};

export default ViewJoining;

import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import BackButton from "../../../../../common/BackButton";
import Loading from "../../../../../common/loading/Loading";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import { getEmployeeProfileViewData } from "../../../employeeFeature/helper";
import Accordion from "../accordion";
import ViewJoiningTable from "./viewJoiningTable";
import { PForm, PInput, PSelect } from "Components";
import { Col, Divider, Form, Row } from "antd";
import moment from "moment";
import { useApiRequest } from "Hooks";
import { shallowEqual, useSelector } from "react-redux";
import { debounce } from "lodash";
import FileUploadComponents from "utility/Upload/FileUploadComponents";

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
  const getSingleData = () => {
    getTransferNpromotion(
      `/Employee/GetEmpTransferNpromotionById?id=${id}`,
      (res) => {
        setInitData({
          type: {
            label: res?.strTransferNpromotionType,
            value: res?.strTransferNpromotionType,
          },
          effectiveDate: moment(res?.dteEffectiveDate),
          businessUnit: {
            label: res?.businessUnitName,
            value: res?.intBusinessUnitId,
          },
          workplaceGroup: {
            label: res?.workplaceGroupName,
            value: res?.intWorkplaceGroupId,
          },
          workplace: {
            label: res?.workplaceName,
            value: res?.intWorkplaceId,
          },
          employmentType: {
            label: res?.employmentTypeName,
            value: res?.employmentTypeId,
          },
          hrPosition: {
            label: res?.hrPositionName,
            value: res?.hrPositionId,
          },
          department: {
            label: res?.departmentName,
            value: res?.intDepartmentId,
          },
          designation: {
            label: res?.designationName,
            value: res?.intDesignationId,
          },
          section: {
            label: res?.strSectionName,
            value: res?.intSectionId,
          },
          supervisor: {
            label: res?.supervisorName,
            value: res?.intSupervisorId,
          },
          dottedSuperVisor: {
            label: res?.dottedSupervisorName,
            value: res?.intDottedSupervisorId,
          },
          lineManager: {
            label: res?.lineManagerName,
            value: res?.intLineManagerId,
          },
          role: res?.empTransferNpromotionUserRoleVMList?.map((item) => {
            return {
              ...item,
              label: item?.strUserRoleName,
              value: item?.intUserRoleId,
            };
          }),
          remarks: res?.strRemarks,
          isRoleExtension: res?.isRoleExtension,
          orgType: {
            label: res?.strOrganizationTypeName,
            value: res?.intOrganizationTypeId,
          },
          orgName: {
            label: res?.strOrganizationReffName,
            value: res?.intOrganizationReffId,
          },
        });
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

  const employmentTypeDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const empSectionDDL = useApiRequest([]);
  const positionDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);
  const supervisorDDL = useApiRequest([]);
  const dottedSupervisorDDL = useApiRequest([]);
  const lineManagerDDL = useApiRequest([]);
  const userRoleDDL = useApiRequest([]);

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
  };

  useEffect(() => {
    getSingleData();
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(transferNpromotion);

  return (
    <>
      {loading || loading1 ? (
        <Loading />
      ) : (
        <div className="table-card">
          <div className="table-card-heading">
            <div className="d-flex align-items-center">
              <BackButton title={"View Joining Details"} />
            </div>
          </div>
          <div
            className="table-card-body card-style mb-3"
            style={{ minHeight: "auto" }}
          >
            <div className="mt-2">
              <Accordion empBasic={empBasic} />
            </div>

            {/* Role extension table */}
            {!!transferNpromotion?.empTransferNpromotionRoleExtensionVMList
              ?.length && (
              <div>
                <div className="col-lg-12 mb-2 mt-3 px-0">
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
                <div className="col-md-12 mx-0 px-0">
                  <div className="table-card-body px-0">
                    <div
                      className="table-card-styled tableOne"
                      style={{ marginTop: "12px" }}
                    >
                      <table className="table">
                        <thead>
                          <tr className="py-1">
                            <th>SL</th>
                            <th>
                              <div>
                                <span className="mr-1"> Org Type</span>
                              </div>
                            </th>
                            <th>
                              <div>
                                <span className="mr-1"> Org Name</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {transferNpromotion?.empTransferNpromotionRoleExtensionVMList.map(
                            (item, index) => (
                              <tr className="hasEvent" key={index + 1}>
                                <td>
                                  <p className="tableBody-title">{index + 1}</p>
                                </td>
                                <td>
                                  <p className="tableBody-title">
                                    {item?.strOrganizationTypeName}
                                  </p>
                                </td>
                                <td>
                                  <p className="tableBody-title">
                                    {" "}
                                    {item?.strOrganizationReffName}
                                  </p>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Proposed History transfers and promotions */}
            {!!transferNpromotion && (
              <div className="pt-2">
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
              <PForm
                form={form}
                initialValues={initData}
                onFinish={(values) => console.log(values)}
              >
                <button type="submit">save</button>
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
                      rules={[
                        { required: true, message: "Remarks is required" },
                      ]}
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
                <Row gutter={[10, 2]}>
                  {/* User Create */}
                  <Form.Item noStyle shouldUpdate>
                    {() => {
                      const { isRoleExtension } = form.getFieldsValue();
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
                              <Col md={8} sm={24}>
                                <PSelect
                                  options={[]}
                                  name="userType"
                                  // value="userType"
                                  label="User Type"
                                  placeholder="User Type"
                                  onChange={(value, op) => {
                                    form.setFieldsValue({
                                      userType: op,
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
              </PForm>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewJoining;

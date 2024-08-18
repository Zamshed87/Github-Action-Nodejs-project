import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import BackButton from "../../../../../common/BackButton";
import Loading from "../../../../../common/loading/Loading";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
import { getEmployeeProfileViewData } from "../../../employeeFeature/helper";
import Accordion from "../accordion";
import ViewJoiningTable from "./viewJoiningTable";
import { PForm, PInput, PSelect } from "Components";
import { Col, Form, Row } from "antd";
import moment from "moment";
import { useApiRequest } from "Hooks";

const ViewJoining = () => {
  // const { buId, wgId } = useSelector(
  //   (state) => state?.auth?.profileData,
  //   shallowEqual
  // );

  // form states
  const [form] = Form.useForm();

  const { id } = useParams();
  const location = useLocation();
  const [transferNpromotion, getTransferNpromotion, loading1] = useAxiosGet();
  const [empBasic, setEmpBasic] = useState([]);
  const [loading, setLoading] = useState(false);
  const getSingleData = () => {
    getTransferNpromotion(`/Employee/GetEmpTransferNpromotionById?id=${id}`);
    getEmployeeProfileViewData(
      location?.state?.employeeId,
      setEmpBasic,
      setLoading,
      location?.state?.businessUnitId,
      location?.state?.workplaceGroupId
    );
  };

  // getting the policy details by id
  useEffect(() => {
    getSingleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const employmentTypeDDL = useApiRequest([]);
  const empDepartmentDDL = useApiRequest([]);
  const empSectionDDL = useApiRequest([]);
  const positionDDL = useApiRequest([]);
  const empDesignationDDL = useApiRequest([]);

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
                  <h3
                    style={{
                      color: " gray700 !important",
                      fontSize: "16px",
                      lineHeight: "20px",
                      fontWeight: "500",
                    }}
                  >
                    Proposed Transfer/Promotion
                  </h3>
                </div>
                <div className="table-colored">
                  <ViewJoiningTable transferNpromotion={transferNpromotion} />
                </div>
              </div>
            )}
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
                  Edit Proposed Transfer/Promotion
                </h3>
              </div>
              <PForm
                form={form}
                initialValues={{
                  type: {
                    lebel: transferNpromotion?.strTransferNpromotionType,
                    value: transferNpromotion?.strTransferNpromotionType,
                  },
                  effectiveDate: moment(transferNpromotion?.dteEffectiveDate),
                  businessUnit: {
                    label: transferNpromotion?.businessUnitName,
                    value: transferNpromotion?.intBusinessUnitId,
                  },
                  workplaceGroup: {
                    label: transferNpromotion?.workplaceGroupName,
                    value: transferNpromotion?.intWorkplaceGroupId,
                  },
                  workplace: {
                    label: transferNpromotion?.workplaceName,
                    value: transferNpromotion?.intWorkplaceId,
                  },
                }}
              >
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
                      options={[]}
                      name="workplace"
                      label="Workplace"
                      placeholder="Workplace"
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
                      options={[]}
                      name="employmentType"
                      label="Employment Type"
                      placeholder="Employment Type"
                      disabled
                    />
                  </Col>
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

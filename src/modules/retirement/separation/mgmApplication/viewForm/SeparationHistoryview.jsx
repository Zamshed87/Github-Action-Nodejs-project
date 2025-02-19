import { FilePresentOutlined } from "@mui/icons-material";
import { Popover } from "antd";
import { APIUrl } from "App";
import Chips from "common/Chips";
import Loading from "common/loading/Loading";
import { getDownlloadFileView_Action } from "commonRedux/auth/actions";
import { DataTable, PButton } from "Components";
import moment from "moment";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { gray700 } from "utility/customColor";
import useAxiosGet from "utility/customHooks/useAxiosGet";
import { dateFormatter } from "utility/dateFormatter";
import profileImg from "../../../../../assets/images/profile.jpg";
import { getSeparationLandingById } from "../../helper";

function SeparationHistoryview({ id, empId }) {
  //Redux Data
  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();

  //Api Hooks
  const [, getApprovalListData] = useAxiosGet();
  const [handoverData, getHandoverData, handoverloading] = useAxiosGet();
  const [exitInterviewData, getExitInterviewData, exitInterviewDataloading] =
    useAxiosGet();

  //States
  const [empBasic, setEmpBasic] = useState({});
  const [singleSeparationData, setSingleSeparationData] = useState({});
  const [loading, setLoading] = useState(false);

  //Table Header
  const header = [
    {
      title: "Separation Type",
      dataIndex: "strSeparationTypeName",
      width: 150,
      fixed: "left",
    },
    {
      title: "Application Date",
      dataIndex: "dteSeparationDate",
      render: (data) => <>{data ? dateFormatter(data) : "N/A"}</>,
      width: 150,
      fixed: "left",
    },
    {
      title: "Last Working Date",
      dataIndex: "dteLastWorkingDate",
      render: (data) => <>{data ? dateFormatter(data) : "N/A"}</>,
      width: 150,
      fixed: "left",
    },
    {
      title: "Attachment",
      dataIndex: "docArr",
      render: (data) =>
        data?.length > 0
          ? data.map((item, index) => (
              <p
                style={{
                  margin: "6px 0 0",
                  fontWeight: "400",
                  fontSize: "12px",
                  lineHeight: "18px",
                  color: "#009cde",
                  cursor: "pointer",
                }}
                key={index}
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(getDownlloadFileView_Action(item));
                  }}
                >
                  <>
                    <FilePresentOutlined /> {`Attachment_${index + 1}`}
                  </>
                </span>
              </p>
            ))
          : "-",
      width: 150,
      fixed: "left",
    },
  ];

  useEffect(() => {
    if (id) {
      setLoading(true);
      getApprovalListData(
        `/SaasMasterData/GetEmpSeparationViewById?AccountId=${orgId}&Id=${id}`,
        (res) => {
          setEmpBasic(res);
          setLoading(false);
        }
      );
      getSeparationLandingById(id, setSingleSeparationData, setLoading);
    }
  }, [id]);
  return (
    <>
      {loading && <Loading />}
      {empBasic && (
        <div>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "12.5px",
              color: gray700,
              marginBottom: "10px",
            }}
          >
            Employee Details
          </div>
          <div className="card-about-info-main about-info-card">
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-between">
                <div>
                  <div
                    style={{
                      width: empBasic > 0 ? empBasic && "auto" : "36px",
                    }}
                    className={
                      empBasic > 0
                        ? empBasic && "add-image-about-info-card height-auto"
                        : "add-image-about-info-card"
                    }
                  >
                    <label
                      htmlFor="contained-button-file"
                      className="label-add-image sm-size"
                    >
                      {empBasic?.imageId ? (
                        <img
                          src={`${APIUrl}/Document/DownloadFile?id=${empBasic?.imageId}`}
                          alt=""
                          style={{ maxHeight: "36px", minWidth: "36px" }}
                        />
                      ) : (
                        <img
                          src={profileImg}
                          alt="iBOS"
                          height="36px"
                          width="36px"
                          style={{ height: "inherit" }}
                        />
                      )}
                    </label>
                  </div>
                </div>

                <div className="content-about-info-card ml-3">
                  <div className="d-flex justify-content-between">
                    <h4
                      className="name-about-info"
                      style={{ marginBottom: "5px" }}
                    >
                      {empBasic?.strEmployeeName}
                      <span style={{ fontWeight: "400", color: gray700 }}>
                        [{empBasic?.strEmployeeCode}]
                      </span>{" "}
                    </h4>
                  </div>
                  <div className="employee-info-div" style={{ width: "500px" }}>
                    <div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Employee Id -
                          </small>{" "}
                          {empBasic?.strEmployeeCode}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Designation -
                          </small>{" "}
                          {empBasic?.strEmployeeDesignation}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Department -
                          </small>{" "}
                          {empBasic?.strEmployeeDepartment}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Joining Date -
                          </small>{" "}
                          {empBasic?.dteJoiningDate
                            ? moment(empBasic?.dteJoiningDate).format(
                                "YYYY-MM-DD"
                              )
                            : "N/A"}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Length of Service -
                          </small>{" "}
                          {empBasic?.lengthofService}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Last Working Date -
                          </small>{" "}
                          {empBasic?.lastWorkingDate || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Mobile (Official) -
                          </small>{" "}
                          {empBasic?.mobileNumber || "N/A"}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Business Unit -
                          </small>{" "}
                          {empBasic?.strEmployeeBusinessUnit}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Workplace Group -
                          </small>{" "}
                          {empBasic?.strEmployeeWorkplaceGroupName}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Workplace -
                          </small>{" "}
                          {empBasic?.strEmployeeWorkplaceName}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Date of Application -
                          </small>{" "}
                          {empBasic?.dateofResign || "N/A"}
                        </p>
                      </div>
                      <div className="single-info">
                        <p
                          className="text-single-info"
                          style={{ fontWeight: "500", color: gray700 }}
                        >
                          <small
                            style={{ fontSize: "12px", lineHeight: "1.5" }}
                          >
                            Notice Period -
                          </small>{" "}
                          {`${empBasic?.noticePeriod} Days` || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ minWidth: "340px" }}>
                <br />
                <div className="d-flex justify-content-between">
                  <div>
                    <span style={{ fontSize: "13.5px" }}>Status:</span>&nbsp;
                    {
                      <>
                        {singleSeparationData?.approvalStatus ===
                          "Approved" && (
                          <Chips label="Approved" classess="success p-2" />
                        )}
                        {singleSeparationData?.approvalStatus === "Pending" && (
                          <Chips label="Pending" classess="warning p-2" />
                        )}
                        {singleSeparationData?.approvalStatus === "Process" && (
                          <Chips label="Process" classess="primary p-2" />
                        )}
                        {singleSeparationData?.approvalStatus === "Reject" && (
                          <Chips label="Rejected" classess="danger p-2 mr-2" />
                        )}
                        {singleSeparationData?.approvalStatus ===
                          "Released" && (
                          <Chips label="Released" classess="indigo p-2 mr-2" />
                        )}
                        {singleSeparationData?.approvalStatus ===
                          "Clearance" && (
                          <Chips label="Clearance" classess="info p-2 mr-2" />
                        )}
                        {singleSeparationData?.approvalStatus ===
                          "Withdrawn" && (
                          <Chips label="Withdrawn" classess="danger p-2 mr-2" />
                        )}
                      </>
                    }
                  </div>
                  <div>
                    <Popover
                      content={
                        <DataTable
                          bordered
                          data={handoverData.data ? handoverData.data : []}
                          loading={handoverloading}
                          header={[
                            {
                              title: "Charge Handedover To",
                              dataIndex: "strEmployeeName",
                              fixed: "left",
                            },
                            {
                              title: "Designation",
                              dataIndex: "strDesignation",
                              fixed: "left",
                            },
                            {
                              title: "Department",
                              dataIndex: "strDepartment",
                              fixed: "left",
                            },
                            {
                              title: "Comment",
                              dataIndex: "comment",
                              fixed: "left",
                            },
                          ]}
                        />
                      }
                      title="Charge Handed Over"
                      trigger="click"
                      placement="left"
                      overlayStyle={{
                        width: "600px",
                      }}
                    >
                      <PButton
                        type="primary"
                        content={
                          <div style={{ fontSize: "10px" }}>
                            Charge Handed Over
                          </div>
                        }
                        onClick={() => {
                          if (id) {
                            getHandoverData(
                              `/ChargeHandedOver/GetChargeHandedOverBySeparationId/${id}`,
                              () => {
                                setLoading(false);
                              }
                            );
                          }
                        }}
                      />
                    </Popover>
                  </div>
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <div>
                    <Popover
                      content={
                        <DataTable
                          bordered
                          scroll={{ x: false }}
                          data={[exitInterviewData?.data] || []}
                          loading={exitInterviewDataloading}
                          header={[
                            {
                              title: "Assigned To",
                              dataIndex: "strEmployeeName",
                            },
                            {
                              title: "Length of Service",
                              dataIndex: "serviceLength",
                            },
                            {
                              title: "Date of Resign",
                              dataIndex: "dteLastWorkingDate",
                              render: (data) => (
                                <>{data ? dateFormatter(data) : "N/A"}</>
                              ),
                            },
                            {
                              title: "Resign Status",
                              dataIndex: "approvalStatus",
                              sort: true,
                              filter: false,
                              render: (item) => (
                                <div className="d-flex justify-content-center">
                                  {item === "Approved" && (
                                    <Chips
                                      label="Approved"
                                      classess="success p-2"
                                    />
                                  )}
                                  {item === "Pending" && (
                                    <Chips
                                      label="Pending"
                                      classess="warning p-2"
                                    />
                                  )}
                                  {item === "Process" && (
                                    <Chips
                                      label="Process"
                                      classess="primary p-2"
                                    />
                                  )}
                                  {item === "Reject" && (
                                    <Chips
                                      label="Rejected"
                                      classess="danger p-2 mr-2"
                                    />
                                  )}
                                  {item === "Released" && (
                                    <Chips
                                      label="Released"
                                      classess="indigo p-2 mr-2"
                                    />
                                  )}
                                  {item === "Clearance" && (
                                    <Chips
                                      label="Clearance"
                                      classess="info p-2 mr-2"
                                    />
                                  )}
                                  {item === "Withdrawn" && (
                                    <Chips
                                      label="Withdrawn"
                                      classess="danger p-2 mr-2"
                                    />
                                  )}
                                </div>
                              ),
                              fieldType: "string",
                            },
                            {
                              title: "Interview Completed By ",
                              dataIndex: "strInterviewCompletedBy",
                              width: 80,
                            },
                            {
                              title: "Completed Date",
                              dataIndex: "dteInterviewCompletedDate",
                              render: (data) => (
                                <>{data ? dateFormatter(data) : "N/A"}</>
                              ),
                            },
                            {
                              title: "Status",
                              dataIndex: "strInterviewStatus",
                              width: 60,
                            },
                          ]}
                        />
                      }
                      title="Exit Interview"
                      trigger="click"
                      placement="left"
                      overlayStyle={{
                        width: "900px",
                      }}
                    >
                      <PButton
                        type="primary"
                        content={
                          <div style={{ fontSize: "10px" }}>Exit Interview</div>
                        }
                        onClick={() => {
                          if (id) {
                            getExitInterviewData(
                              `ExitInterview/GetExitInterviewBySeparationId?separationId=${id}&employeeId=${empId}`,
                              () => {
                                setLoading(false);
                              }
                            );
                          }
                        }}
                      />
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DataTable
            bordered
            data={singleSeparationData ? [singleSeparationData] : []}
            header={header}
          />
          <div style={{ marginTop: "10px" }}>
            <DataTable
              bordered
              data={singleSeparationData ? [singleSeparationData] : []}
              header={[
                {
                  title: "Application",
                  dataIndex: "fullReason",
                  render: (data) => (
                    <>
                      <small
                        style={{ fontSize: "12px", lineHeight: "1.5" }}
                        dangerouslySetInnerHTML={{
                          __html: data,
                        }}
                      />
                    </>
                  ),
                  width: 150,
                  fixed: "left",
                },
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default SeparationHistoryview;

import { Col, Row } from "antd";
import { APIUrl } from "App";
import profileImg from "../../../../assets/images/profile.jpg";
import { gray700, gray900 } from "utility/customColor";
import { PInput } from "Components";
import { MovingOutlined } from "@mui/icons-material";
import { salaryHoldAction } from "../salaryAssign/helper";
import IConfirmModal from "common/IConfirmModal";
import { useState } from "react";
import IncrementHistoryComponent from "../salaryAssign/DrawerBody/incrementHistoryView";

export const EmployeeInfo = ({
  employeeInfo,
  setLoading,
  getEmployeeInfo,
  loading,
  orgId,
  form,
}: any) => {
  const [openIncrement, setOpenIncrement] = useState(false);
  const handleIncrementClose = () => {
    setOpenIncrement(false);
  };
  const holdSalaryHandler = (e: any) => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: `Are your sure?`,
      yesAlertFunc: () => {
        const callback = () => {
          getEmployeeInfo();
        };
        salaryHoldAction(
          e.target.checked,
          employeeInfo?.data[0]?.EmployeeId,
          setLoading,
          callback
        );
      },
      noAlertFunc: () => {
        form.setFieldsValue({
          isHoldSalary: undefined,
        });
      },
    };
    IConfirmModal(confirmObject);
  };
  return (
    <Row gutter={[10, 2]} className="mb-3 card-style">
      <Col md={13}>
        <div
          className="d-flex justify-content-between align-items-center mt-2"
          style={{
            paddingBottom: "10px",
            marginBottom: "10px",
            // borderBottom: `1px solid ${gray200}`,
          }}
        >
          <div className="d-flex ">
            <div
              style={{
                width:
                  employeeInfo?.data?.length > 0
                    ? employeeInfo?.data && "auto"
                    : "78px",
                // width: [].length > 0 ? "auto" : "78px",
              }}
              className={
                employeeInfo?.data?.length > 0
                  ? employeeInfo?.data &&
                    "add-image-about-info-card height-auto"
                  : "add-image-about-info-card"
              }
            >
              <label
                htmlFor="contained-button-file"
                className="label-add-image"
              >
                {employeeInfo?.data[0]?.ProfileImageUrl ? ( //singleData[0]?.ProfileImageUrl
                  <img
                    src={`${APIUrl}/Document/DownloadFile?id=${employeeInfo?.data[0]?.ProfileImageUrl}`}
                    alt=""
                    height="78px"
                    width="78px"
                    style={{ maxHeight: "78px", minWidth: "78px" }}
                  />
                ) : (
                  <img
                    src={profileImg}
                    alt="iBOS"
                    height="78px"
                    width="78px"
                    style={{ maxHeight: "78px", minWidth: "78px" }}
                  />
                )}
              </label>
            </div>
            <div className="content-about-info-card ml-3">
              <div className="d-flex justify-content-between">
                <h4 className="name-about-info" style={{ marginBottom: "5px" }}>
                  {`${employeeInfo?.data[0]?.EmployeeName}  `}
                  <span style={{ fontWeight: "400", color: gray700 }}>
                    [{employeeInfo?.data[0]?.EmployeeCode}]
                  </span>{" "}
                </h4>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Department -
                  </small>{" "}
                  {`${employeeInfo?.data[0]?.DepartmentName}`}
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Designation -
                  </small>{" "}
                  {employeeInfo?.data[0]?.DesignationName}
                </p>
              </div>
              <div className="single-info">
                <p
                  className="text-single-info"
                  style={{ fontWeight: "500", color: gray700 }}
                >
                  <small style={{ fontSize: "12px", lineHeight: "1.5" }}>
                    Employment Type -
                  </small>{" "}
                  {employeeInfo?.data[0]?.strEmploymentType}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Col>
      <Col md={8}></Col>
      <div className="">
        <div className="ml-1">
          <PInput
            label="Hold Salary?"
            type="checkbox"
            layout="horizontal"
            name="isHoldSalary"
            onChange={(e) => {
              if (e.target.checked) {
                holdSalaryHandler(e);
              } else {
                const callback = () => {
                  getEmployeeInfo();
                };
                salaryHoldAction(
                  false,
                  employeeInfo?.data[0]?.EmployeeId,
                  setLoading,
                  callback
                );
              }
            }}
          />
        </div>
        <div>
          <p
            onClick={(e) => {
              e.stopPropagation();
              setOpenIncrement(true);
            }}
            style={{ color: gray900 }}
            className="d-inline-block mt-2 pointer uplaod-para"
          >
            <span style={{ fontSize: "12px" }}>
              <MovingOutlined
                sx={{
                  marginRight: "5px",
                  fontSize: "18px",
                  color: gray900,
                }}
              />{" "}
              Increment History
            </span>
          </p>
        </div>
      </div>

      <IncrementHistoryComponent
        show={openIncrement}
        title={"Increment History"}
        onHide={handleIncrementClose}
        size="lg"
        fullscreen=""
        backdrop="static"
        classes="default-modal"
        orgId={orgId}
        singleData={employeeInfo?.data?.[0]}
        loading={loading}
        setLoading={setLoading}
      />
    </Row>
  );
};

import { Avatar } from "@material-ui/core";
import {
  ControlPoint,
  DeleteOutline,
  ModeEditOutlined,
} from "@mui/icons-material";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { APIUrl } from "../../../../../../App";
import ActionMenu from "../../../../../../common/ActionMenu";
import Loading from "../../../../../../common/loading/Loading";
import FileUploadComponents from "../../../../../../utility/Upload/FileUploadComponents";
import { gray900, success500 } from "../../../../../../utility/customColor";
import { getEmployeeProfileViewData } from "../../../../employeeFeature/helper";
import "../../../employeeOverview.css";
import { todayDate } from "./../../../../../../utility/todayDate";
import { updateEmployeeProfile } from "../../helper";

const initData = {
  bloodGroup: "",
};

// const validationSchema = Yup.object().shape({
//   bloodGroup: Yup.object()
//     .shape({
//       label: Yup.string().required("Blood Group is required"),
//       value: Yup.string().required("Blood Group is required"),
//     })
//     .typeError("Blood Group is required"),
// });

function EmpSignature({ empId, buId: businessUnit, wgId: workplaceGroup }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("empty");
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [rowDto, setRowDto] = useState({});
  const [singleData, setSingleData] = useState("");
  const [authSignatureImage, setAuthSignatureImage] = useState([]);
  const { buId, employeeId, wgId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  /* 
  const authSignatureImage = {
            lastModified: new Date(),
            lastModifiedDate: todayDate(),
            name: `Attachment 1`,
            response: [
              {
                fileName: `Attachment 1`,
                globalFileUrlId: res?.intAuthorizedSignatureUrlId,
                intAutoId: 1,
                isActive: true,
              },
            ],
            url: `${APIUrl}/Document/DownloadFile?id=${res?.intAuthorizedSignatureUrlId}`,
            status: "done",
            type: "image/jpeg",
            uid: `Attachment ${res?.intAuthorizedSignatureUrlId}-${1}`,
          };
          setAuthSignatureImage([authSignatureImage]);
  
  */

  useEffect(() => {
    getEmployeeProfileViewData(
      empId,
      setRowDto,
      setLoading,
      businessUnit,
      workplaceGroup
    );
  }, [buId, wgId, empId, businessUnit, workplaceGroup]);

  const saveHandler = () => {
    if (!authSignatureImage?.length)
      return toast.warn("Please upload Emplployee signature image");

    if (singleData) {
      const payload = {
        partType: "EmployeeSignature",
        employeeId:
          rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
        autoId: rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || 0,
        value:
          authSignatureImage?.[0]?.response?.[0]?.globalFileUrlId + "" ||
          singleData?.label + "",
        insertByEmpId: employeeId,
        isActive: true,
        bankId: 0,
        bankName: "",
        branchName: "",
        routingNo: "",
        specialContactTypeId: 0,
        specialContactTypeName: "",
        trainingName: "",
        swiftCode: "",
        accountName: "",
        accountNo: "",
        paymentGateway: "",
        digitalBankingName: "",
        digitalBankingNo: "",
        addressTypeId: 0,
        countryId: 0,
        countryName: "",
        divisionId: 0,
        divisionName: "",
        districtId: 0,
        districtName: "",
        postOfficeId: 0,
        postOfficeName: "",
        addressDetails: "",
        companyName: "",
        jobTitle: "",
        location: "",
        fromDate: todayDate(),
        toDate: todayDate(),
        fileUrlId: 0,
        organizationName: rowDto?.employeeProfileLandingView?.strWorkplaceName,
        description: "",
        isForeign: true,
        instituteName: "",
        degree: "",
        degreeId: 0,
        fieldOfStudy: "",
        cgpa: "",
        outOf: "",
        startDate: todayDate(),
        endDate: todayDate(),
        expirationDate: todayDate(),
        name: "",
        relationId: 0,
        relationName: "",
        phone: "",
        email: "",
        nid: "",
        dateOfBirth: todayDate(),
        remarks: "",
      };

      const callback = () => {
        getEmployeeProfileViewData(
          empId,
          setRowDto,
          setLoading,
          businessUnit,
          workplaceGroup
        );
        setStatus("empty");
        setSingleData("");
        setAuthSignatureImage([]);
        setIsCreateForm(false);
      };
      updateEmployeeProfile(payload, setLoading, callback);
    } else {
      const payload = {
        partType: "EmployeeSignature",
        employeeId:
          rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
        autoId: rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || 0,
        value:
          authSignatureImage?.[0]?.response?.[0]?.globalFileUrlId + "" ||
          singleData?.label + "",
        insertByEmpId: employeeId,
        isActive: true,
        bankId: 0,
        bankName: "",
        branchName: "",
        routingNo: "",
        specialContactTypeId: 0,
        specialContactTypeName: "",
        trainingName: "",
        swiftCode: "",
        accountName: "",
        accountNo: "",
        paymentGateway: "",
        digitalBankingName: "",
        digitalBankingNo: "",
        addressTypeId: 0,
        countryId: 0,
        countryName: "",
        divisionId: 0,
        divisionName: "",
        districtId: 0,
        districtName: "",
        postOfficeId: 0,
        postOfficeName: "",
        addressDetails: "",
        companyName: "",
        jobTitle: "",
        location: "",
        fromDate: todayDate(),
        toDate: todayDate(),
        fileUrlId: 0,
        organizationName: rowDto?.employeeProfileLandingView?.strWorkplaceName,
        description: "",
        isForeign: true,
        instituteName: "",
        degree: "",
        degreeId: 0,
        fieldOfStudy: "",
        cgpa: "",
        outOf: "",
        startDate: todayDate(),
        endDate: todayDate(),
        expirationDate: todayDate(),
        name: "",
        relationId: 0,
        relationName: "",
        phone: "",
        email: "",
        nid: "",
        dateOfBirth: todayDate(),
        remarks: "",
      };
      const callback = () => {
        getEmployeeProfileViewData(
          empId,
          setRowDto,
          setLoading,
          businessUnit,
          workplaceGroup
        );
        setStatus("empty");
        setSingleData("");
        setAuthSignatureImage([]);
        setIsCreateForm(false);
      };
      updateEmployeeProfile(payload, setLoading, callback);
    }
  };

  const deleteHandler = () => {
    const payload = {
      partType: "EmployeeSignature",
      employeeId:
        rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || empId,
      autoId: rowDto?.employeeProfileLandingView?.intEmployeeBasicInfoId || 0,
      value: "",
      insertByEmpId: employeeId,
      isActive: true,
      bankId: 0,
      bankName: "",
      branchName: "",
      routingNo: "",
      specialContactTypeId: 0,
      specialContactTypeName: "",
      trainingName: "",
      swiftCode: "",
      accountName: "",
      accountNo: "",
      paymentGateway: "",
      digitalBankingName: "",
      digitalBankingNo: "",
      addressTypeId: 0,
      countryId: 0,
      countryName: "",
      divisionId: 0,
      divisionName: "",
      districtId: 0,
      districtName: "",
      postOfficeId: 0,
      postOfficeName: "",
      addressDetails: "",
      companyName: "",
      jobTitle: "",
      location: "",
      fromDate: todayDate(),
      toDate: todayDate(),
      fileUrlId: 0,
      organizationName: rowDto?.employeeProfileLandingView?.strWorkplaceName,
      description: "",
      isForeign: true,
      instituteName: "",
      degree: "",
      degreeId: 0,
      fieldOfStudy: "",
      cgpa: "",
      outOf: "",
      startDate: todayDate(),
      endDate: todayDate(),
      expirationDate: todayDate(),
      name: "",
      relationId: 0,
      relationName: "",
      phone: "",
      email: "",
      nid: "",
      dateOfBirth: todayDate(),
      remarks: "",
    };
    const callback = () => {
      getEmployeeProfileViewData(
        empId,
        setRowDto,
        setLoading,
        businessUnit,
        workplaceGroup
      );
      setStatus("empty");
      setSingleData("");
      setAuthSignatureImage([]);
    };
    updateEmployeeProfile(payload, setLoading, callback);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
        }}
        // validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {isCreateForm ? (
                <>
                  {/* addEdit form */}
                  {status === "input" && (
                    <>
                      <h5>Employee Signature</h5>
                      <div style={{ marginBottom: "40px", cursor: "pointer" }}>
                        <FileUploadComponents
                          propsObj={{
                            attachmentList: authSignatureImage,
                            setAttachmentList: setAuthSignatureImage,
                            accountId: orgId,
                            tableReferrence: "LeaveAndMovement",
                            documentTypeId: 15,
                            userId: employeeId,
                            buId,
                            maxCount: 1,
                            accept: "image/png, image/jpeg, image/jpg",
                          }}
                        />

                        <div
                          className="d-flex align-items-center justify-content-end"
                          style={{ marginTop: "24px" }}
                        >
                          <button
                            type="button"
                            className="btn btn-cancel"
                            style={{ marginRight: "16px" }}
                            onClick={() => {
                              setStatus("empty");
                              setSingleData("");
                              setIsCreateForm(false);
                              setFieldValue("bloodGroup", "");
                            }}
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="btn btn-green btn-green-disable"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* landing */}
                  {rowDto?.employeeProfileLandingView && !singleData && (
                    <>
                      {rowDto?.empEmployeePhotoIdentity
                        ?.intSignatureFileUrlId === "" ? (
                        <>
                          <h5>Employee Signature</h5>
                          <div
                            className="d-flex align-items-center"
                            style={{ marginBottom: "25px", cursor: "pointer" }}
                            onClick={() => {
                              setStatus("input");
                              setIsCreateForm(true);
                            }}
                          >
                            <div
                              className="item"
                              style={{ position: "relative", top: "-3px" }}
                            >
                              <ControlPoint
                                sx={{ color: success500, fontSize: "16px" }}
                              />
                            </div>
                            <div className="item">
                              <p>Add your signature</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <>
                            <div className="view">
                              <div className="row">
                                <div className="col-lg-1">
                                  <Avatar className="overviewAvatar">
                                    <DesignServicesIcon
                                      sx={{
                                        color: gray900,
                                        fontSize: "18px",
                                      }}
                                    />
                                  </Avatar>
                                </div>
                                <div className="col-lg-10">
                                  <h4>
                                    {/* {
                                      rowDto?.employeeProfileLandingView
                                        ?.strBloodGroup
                                    } */}
                                    <div className="employeeInfo d-flex align-items-center  ml-lg-0 ml-md-4">
                                      {rowDto?.empEmployeePhotoIdentity
                                        ?.intSignatureFileUrlId ? (
                                        <div
                                          style={{
                                            width: "100px",
                                            objectFit: "cover",
                                          }}
                                        >
                                          <img
                                            src={`${APIUrl}/Document/DownloadFile?id=${rowDto?.empEmployeePhotoIdentity?.intSignatureFileUrlId}`}
                                            alt="Profile"
                                            style={{
                                              width: "100%",
                                              objectFit: "cover",
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </h4>
                                  <small>Employee Signature</small>
                                </div>
                                <div className="col-lg-1">
                                  <ActionMenu
                                    color={gray900}
                                    fontSize={"18px"}
                                    options={[
                                      !rowDto?.employeeProfileLandingView
                                        ?.isMarkCompleted && {
                                        value: 1,
                                        label: "Edit",
                                        icon: (
                                          <ModeEditOutlined
                                            sx={{
                                              marginRight: "10px",
                                              fontSize: "16px",
                                            }}
                                          />
                                        ),
                                        onClick: () => {
                                          setSingleData({
                                            value: rowDto
                                              ?.empEmployeePhotoIdentity
                                              ?.intSignatureFileUrlId
                                              ? rowDto?.empEmployeePhotoIdentity
                                                  ?.intSignatureFileUrlId
                                              : 0,
                                            label: rowDto
                                              ?.empEmployeePhotoIdentity
                                              ?.intSignatureFileUrlId
                                              ? rowDto?.empEmployeePhotoIdentity
                                                  ?.intSignatureFileUrlId
                                              : 0,
                                          });
                                          if (
                                            rowDto?.empEmployeePhotoIdentity
                                              ?.intSignatureFileUrlId
                                          ) {
                                            const authSignatureImage = {
                                              lastModified: new Date(),
                                              lastModifiedDate: todayDate(),
                                              name: `Attachment 1`,
                                              response: [
                                                {
                                                  fileName: `Attachment 1`,
                                                  globalFileUrlId:
                                                    rowDto
                                                      ?.empEmployeePhotoIdentity
                                                      ?.intSignatureFileUrlId,
                                                  intAutoId: 1,
                                                  isActive: true,
                                                },
                                              ],
                                              url: `${APIUrl}/Document/DownloadFile?id=${rowDto?.empEmployeePhotoIdentity?.intSignatureFileUrlId}`,
                                              status: "done",
                                              type: "image/jpeg",
                                              uid: `Attachment ${
                                                rowDto?.empEmployeePhotoIdentity
                                                  ?.intSignatureFileUrlId
                                              }-${1}`,
                                            };
                                            setAuthSignatureImage([
                                              authSignatureImage,
                                            ]);
                                          }

                                          setStatus("input");
                                          setIsCreateForm(true);
                                        },
                                      },
                                      {
                                        value: 2,
                                        label: "Delete",
                                        icon: (
                                          <DeleteOutline
                                            sx={{
                                              marginRight: "10px",
                                              fontSize: "16px",
                                            }}
                                          />
                                        ),
                                        onClick: () => {
                                          deleteHandler(values);
                                        },
                                      },
                                    ]}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default EmpSignature;

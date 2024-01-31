import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import BackButton from "../../common/BackButton";
import Loading from "../../common/loading/Loading";
import NotPermittedPage from "../../common/notPermitted/NotPermittedPage";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import { todayDate } from "../../utility/todayDate";
import FormCard from "./coompnents/FormCard";
import { createAnnouncement, getSingleAnnouncement } from "./helper";
import "./index.css";

const initData = {
  body: "",
  date: "",
  workGroup: "",
  workPlace: "",
  department: "",
  designation: "",
  userGroup: "",
  insertDate: "",
  title: "",
  id: "",
};

const validationSchema = Yup.object().shape({
  date: Yup.date().required("Date is required"),
  title: Yup.string().required("Announcement title is required"),
  body: Yup.string().required("Announcement body is required"),
});

export default function AnnouncementCreate() {
  const params = useParams();
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [departData, setDepartData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const scrollRef = useRef();
  useEffect(() => {
    params?.id && getSingleAnnouncement(params?.id, setSingleData, setLoading);
    params?.id ? setIsEdit(true) : setIsEdit(false);
  }, [params?.id]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    let desig = [];
    let dept = [];
    let userGroup = [];
    let workGroup = [];
    let workPlace = [];
    if (values.workGroup.length === 0) {
      toast.error("Work Place Group is required");
      return;
    }
    values?.workGroup?.length > 0 &&
      (workGroup = values.workGroup?.map((item) => {
        return {
          intAnnouncementRowId: params?.id
            ? item?.intAnnouncementRowId || 0
            : 0,
          intAnnoucementId: params?.id ? item?.intAnnoucementId || 0 : 0,
          intAnnouncementReferenceId: item?.intWorkplaceGroupId || item?.value,
          strAnnounceCode: "Wg",
          strAnnouncementFor: item?.strWorkplaceGroup || item?.label,
          isActive: true,
        };
      }));
    values?.workPlace?.length > 0 &&
      (workPlace = values.workPlace?.map((item) => {
        return {
          intAnnouncementRowId: params?.id
            ? item?.intAnnouncementRowId || 0
            : 0,
          intAnnoucementId: params?.id ? item?.intAnnoucementId || 0 : 0,
          intAnnouncementReferenceId: item?.intWorkplaceId || item?.value,
          strAnnounceCode: "w",
          strAnnouncementFor: item?.strWorkplace || item?.label,
          isActive: true,
        };
      }));

    values?.designation?.length > 0 &&
      (desig = values?.designation?.map((item) => {
        return {
          intAnnouncementRowId: params?.id
            ? item?.intAnnouncementRowId || 0
            : 0,
          intAnnoucementId: params?.id ? item?.intAnnoucementId || 0 : 0,
          intAnnouncementReferenceId: item?.DesignationId || item?.value,
          strAnnounceCode: "Desig",
          strAnnouncementFor: item?.DesignationName || item?.label,
          isActive: true,
        };
      }));
    values?.department?.length > 0 &&
      (dept = values?.department?.map((item) => {
        return {
          intAnnouncementRowId: params?.id
            ? item?.intAnnouncementRowId || 0
            : 0,
          intAnnoucementId: params?.id ? item?.intAnnoucementId || 0 : 0,
          intAnnouncementReferenceId: item?.DepartmentId || item?.value,
          strAnnounceCode: "Dept",
          strAnnouncementFor: item?.DepartmentName || item?.label,
          isActive: true,
        };
      }));
    values?.userGroup?.length > 0 &&
      (userGroup = values?.userGroup?.map((item) => {
        return {
          intAnnouncementRowId: params?.id
            ? item?.intAnnouncementRowId || 0
            : 0,
          intAnnoucementId: params?.id ? item?.intAnnoucementId || 0 : 0,
          intAnnouncementReferenceId: item?.UserGroupId || item?.value,
          strAnnounceCode: "Ug",
          strAnnouncementFor: item?.UserGroupName || item?.label,
          isActive: true,
        };
      }));
    desig.length === 0 &&
      (desig = [
        {
          intAnnouncementRowId: 0,
          intAnnoucementId: 0,
          intAnnouncementReferenceId: 0,
          strAnnounceCode: "Desig",
          strAnnouncementFor: "All",
          isActive: true,
        },
      ]);
    dept.length === 0 &&
      (dept = [
        {
          intAnnouncementRowId: 0,
          intAnnoucementId: 0,
          intAnnouncementReferenceId: 0,
          strAnnounceCode: "Dept",
          strAnnouncementFor: "All",
          isActive: true,
        },
      ]);
    userGroup.length === 0 &&
      (userGroup = [
        {
          intAnnouncementRowId: 0,
          intAnnoucementId: 0,
          intAnnouncementReferenceId: 0,
          strAnnounceCode: "Ug",
          strAnnouncementFor: "All",
          isActive: true,
        },
      ]);

    if (
      values?.workGroup?.length === 0 &&
      values?.workPlace?.length === 0 &&
      values?.department?.length === 0 &&
      values?.designation?.length === 0 &&
      values?.userGroup?.length === 0
    ) {
      toast.error("One Field Must Be Selected");
      return;
    }
    const payload = {
      announcement: {
        intAnnouncementId: params?.id ? singleData?.intAnnouncementId : 0,
        intAccountId: params?.id ? singleData?.intAccountId : orgId,
        intBusinessUnitId: params?.id ? singleData?.intBusinessUnitId : buId,
        strTitle: values?.title,
        strDetails: values?.body,
        intTypeId: 0,
        strTypeName: "",
        dteExpiredDate: values?.date,
        dteCreatedAt: todayDate(),
        intCreatedBy: employeeId,
        isActive: true,
      },
      announcementRow: [
        ...workGroup,
        ...workPlace,
        ...desig,
        ...dept,
        ...userGroup,
      ],
      // intAnnouncementId: isEdit ? values?.id : 0,
      // intAccountId: orgId,
      // intBusinessUnitId: buId,
      // strTitle: values?.title,
      // strDetails: values?.body,
      // intTypeId: 0,
      // strTypeName: "",
      // dteExpiredDate: values?.date,
      // dteCreatedAt: todayDate(),
      // intCreatedBy: employeeId,
      // isActive: true,
    };

    cb();
    console.log(payload);
    createAnnouncement(payload, setLoading, "");
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 130) {
      permission = item;
    }
  });
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={params?.id ? singleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            // setIsEdit(false);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isCreate ? (
                <div
                  className="table-card announcement-wrapper"
                  ref={scrollRef}
                >
                  <div className="d-flex justify-content-start">
                    <div>
                      <BackButton
                        title={
                          params?.id
                            ? `Edit Announcement`
                            : `Create Announcement`
                        }
                      />
                    </div>
                  </div>

                  <div className="table-card-body">
                    <div className="col-md-12 px-0 mt-3">
                      <FormCard
                        propsObj={{
                          setFieldValue,
                          values,
                          errors,
                          touched,
                          resetForm,
                          initData,
                          isEdit,
                          setIsEdit,
                          setValues,
                          setDepartData,
                          departData,
                          params,
                        }}
                      ></FormCard>
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

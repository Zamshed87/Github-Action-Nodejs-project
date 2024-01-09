import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { Switch } from "antd";
import { IoMdAddCircleOutline } from "react-icons/io";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";
import { toast } from "react-toastify";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  // const debounce = useDebounce();
  const SaveDocType = useApiRequest({});

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // states

  // ddls
  // Form Instance
  const [form] = Form.useForm();

  // submit
  const submitHandler = ({ values, resetForm, setIsAddEditForm }) => {
    const cb = () => {
      resetForm();
      setIsAddEditForm(false);
      getData();
    };
    let payload = {
      actionTypeId: singleData?.intDocumentTypeId ? 2 : 1,
      intDocumentTypeId: singleData?.intDocumentTypeId
        ? singleData?.intDocumentTypeId
        : 0,
      strDocumentType: values?.strDocumentType,
      intAccountId: orgId,
      isActive: values?.isActive,
      intOwnerType: 0,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      dteUpdatedAt: todayDate(),
      intUpdatedBy: employeeId,
    };

    SaveDocType.action({
      urlKey: "SaveGlobalDocumentType",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };
  useEffect(() => {
    if (singleData?.intDocumentTypeId) {
      form.setFieldsValue({
        ...singleData,
      });
    }
  }, [singleData]);
  return (
    <>
      <PForm
        form={form}
        onFinish={() => {
          const values = form.getFieldsValue(true);
          submitHandler({
            values,
            getData,
            resetForm: form.resetFields,
            setIsAddEditForm,
            isEdit,
          });
        }}
        initialValues={{}}
      >
        <Row gutter={[10, 2]}>
          <Col md={24} sm={24}>
            <PInput
              type="text"
              name="strDocumentType"
              label="Document Type"
              placeholder="Document Type"
              rules={[{ required: true, message: "Document Type is required" }]}
            />
          </Col>

          <Col
            md={24}
            style={{
              marginLeft: "-0.5rem",
            }}
          >
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                className="input-main position-group-select "
                style={{ margin: "3rem 0 0 0.7rem" }}
              >
                <h6 className="title-item-name">Document Type Activation</h6>
                <p className="subtitle-p">
                  Activation toggle indicates to the particular Document Type
                  status (Active/Inactive)
                </p>
              </div>
              <div
                style={{
                  margin: "4rem 0 -1.5rem -2rem",
                  // padding: "5rem -2rem 0 -15rem",
                }}
              >
                <Form.Item name="isActive" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </div>
            </div>
          </Col>
        </Row>
        <ModalFooter
          onCancel={() => {
            setId("");

            setIsAddEditForm(false);
          }}
          submitAction="submit"
          loading={loading}
        />
      </PForm>
    </>
  );
}

// import { Close } from "@mui/icons-material";
// import { IconButton } from "@mui/material";
// import { Form, Formik } from "formik";
// import { useEffect, useState } from "react";
// import { Modal } from "react-bootstrap";
// import { shallowEqual, useSelector } from "react-redux";
// import * as Yup from "yup";
// import { getAllGlobalDocumentType } from "./../../../../common/api/index";
// import FormikInput from "./../../../../common/FormikInput";
// import FormikToggle from "./../../../../common/FormikToggle";
// import Loading from "./../../../../common/loading/Loading";
// import { blackColor40, greenColor } from "./../../../../utility/customColor";
// import { todayDate } from "./../../../../utility/todayDate";
// import { createDocumentType, getGlobalDocumentTypeById } from "./../helper";

// const initData = {
//   documentType: "",
//   isActive: false,
// };
// const validationSchema = Yup.object().shape({
//   documentType: Yup.string().required("Document Type is required"),
// });

// export default function AddEditFormComponent({
//   id,
//   show,
//   onHide,
//   size,
//   backdrop,
//   classes,
//   isVisibleHeading = true,
//   fullscreen,
//   title,
//   setId,
//   singleData,
//   setSingleData,
//   setRowDto,
//   setAllData,
// }) {
//   const [loading, setLoading] = useState(false);

//   const [modifySingleData, setModifySingleData] = useState("");

//   const { employeeId, orgId } = useSelector(
//     (state) => state?.auth?.profileData,
//     shallowEqual
//   );

//   useEffect(() => {
//     if (singleData) {
//       const newRowData = {
//         documentType: singleData?.strDocumentType,
//         isActive: singleData?.isActive,
//       };
//       setModifySingleData(newRowData);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [singleData]);

//   useEffect(() => {
//     if (id) {
//       getGlobalDocumentTypeById(setSingleData, id, setLoading);
//     }
//   }, [id, setSingleData]);

//   const saveHandler = (values, cb) => {
//     let payload = {
//       strDocumentType: values?.documentType,
//       intAccountId: orgId,
//       isActive: values?.isActive,
//       intOwnerType: 0,
//       dteCreatedAt: todayDate(),
//       intCreatedBy: employeeId,
//       dteUpdatedAt: todayDate(),
//       intUpdatedBy: employeeId,
//     };

//     const callback = () => {
//       cb();
//       onHide();
//       getAllGlobalDocumentType(setRowDto, setAllData, setLoading);
//     };

//     if (id) {
//       createDocumentType(
//         { ...payload, actionTypeId: 2, intDocumentTypeId: id },
//         setLoading,
//         callback
//       );
//     } else {
//       createDocumentType(
//         { ...payload, actionTypeId: 1, intDocumentTypeId: 0 },
//         setLoading,
//         callback
//       );
//     }
//   };

//   return (
//     <>
//       <Formik
//         enableReinitialize={true}
//         initialValues={id ? modifySingleData : initData}
//         validationSchema={validationSchema}
//         onSubmit={(values, { setSubmitting, resetForm }) => {
//           saveHandler(values, () => {
//             if (id) {
//               resetForm(modifySingleData);
//             } else {
//               resetForm(initData);
//             }
//             setId("");
//           });
//         }}
//       >
//         {({
//           handleSubmit,
//           resetForm,
//           values,
//           errors,
//           touched,
//           setFieldValue,
//           isValid,
//         }) => (
//           <>
//             {loading && <Loading />}
//             <div className="viewModal">
//               <Modal
//                 show={show}
//                 onHide={onHide}
//                 size={size}
//                 backdrop={backdrop}
//                 aria-labelledby="example-modal-sizes-title-xl"
//                 className={classes}
//                 fullscreen={fullscreen && fullscreen}
//               >
//                 <Form>
//                   {isVisibleHeading && (
//                     <Modal.Header className="bg-custom">
//                       <div className="d-flex w-100 justify-content-between align-items-center">
//                         <Modal.Title className="text-center">
//                           {title}
//                         </Modal.Title>
//                         <div>
//                           <IconButton onClick={() => onHide()}>
//                             <Close />
//                           </IconButton>
//                         </div>
//                       </div>
//                     </Modal.Header>
//                   )}

//                   <Modal.Body id="example-modal-sizes-title-xl">
//                     <div className="businessUnitModal">
//                       <div className="modalBody pt-0 px-0">
//                         <div className="row mx-0">
//                           <div className="col-12">
//                             <label>Document Type</label>
//                             <FormikInput
//                               classes="input-sm"
//                               value={values?.documentType}
//                               name="documentType"
//                               type="text"
//                               className="form-control"
//                               placeholder=""
//                               onChange={(e) => {
//                                 setFieldValue("documentType", e.target.value);
//                               }}
//                               errors={errors}
//                               touched={touched}
//                             />
//                           </div>
//                           <div className="col-12">
//                             <div className="input-main position-group-select mt-2">
//                               <h6 className="title-item-name">
//                                 Document Type Activation
//                               </h6>
//                               <p className="subtitle-p">
//                                 Activation toggle indicates to the particular
//                                 Document Type status (Active/Inactive)
//                               </p>
//                               <FormikToggle
//                                 name="isActive"
//                                 color={
//                                   values?.isActive ? greenColor : blackColor40
//                                 }
//                                 checked={values?.isActive}
//                                 onChange={(e) => {
//                                   setFieldValue("isActive", e.target.checked);
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </Modal.Body>
//                   <Modal.Footer className="form-modal-footer">
//                     <button
//                       type="button"
//                       className="btn btn-cancel"
//                       sx={{
//                         marginRight: "10px",
//                       }}
//                       onClick={() => {
//                         onHide();
//                       }}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="btn btn-green btn-green-disable"
//                       style={{ width: "auto" }}
//                       type="submit"
//                       onSubmit={() => handleSubmit()}
//                     >
//                       Save
//                     </button>
//                   </Modal.Footer>
//                 </Form>
//               </Modal>
//             </div>
//           </>
//         )}
//       </Formik>
//     </>
//   );
// }

import { ModalFooter } from "Components/Modal";
import { PForm, PInput, PSelect } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { Switch } from "antd";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { todayDate } from "utility/todayDate";

export default function AddEditForm({
  setIsAddEditForm,
  getData,
  // empBasic,
  isEdit,
  singleData,
  setId,
}) {
  // const debounce = useDebounce();
  const saveEmpLoanType = useApiRequest({});

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);

  // states

  // Pages Start From Here code from above will be removed soon

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
      intLoanTypeId: singleData?.intLoanTypeId ? singleData?.intLoanTypeId : 0,
      strLoanType: values?.strLoanType,
      isActive: values?.isActive,
      intAccountId: orgId,
      dteCreatedAt: todayDate(),
      intCreatedBy: employeeId,
      intWorkplaceId: wId,
    };

    saveEmpLoanType.action({
      urlKey: "SaveEmpLoanType",
      method: "POST",
      payload: payload,
      onSuccess: () => {
        cb();
      },
    });
  };
  useEffect(() => {
    if (singleData?.intLoanTypeId) {
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
              name="strLoanType"
              label="Loan Type"
              placeholder="Loan Type"
              rules={[{ required: true, message: "Loan Type is required" }]}
            />
          </Col>

          {isEdit && (
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
                  <h6 className="title-item-name">Loan Type Activation</h6>
                  <p className="subtitle-p">
                    Activation toggle indicates to the particular Loan Type
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
          )}
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
// import { getAllGlobalLoanType } from "../../../../common/api";
// import { todayDate } from "../../../../utility/todayDate";
// import FormikInput from "./../../../../common/FormikInput";
// import FormikToggle from "./../../../../common/FormikToggle";
// import Loading from "./../../../../common/loading/Loading";
// import { blackColor40, greenColor } from "./../../../../utility/customColor";
// import { createLoanType, getGlobalLoanTypeById } from "./../helper";

// const initData = {
//   loanType: "",
//   isActive: true,
// };
// const validationSchema = Yup.object().shape({
//   loanType: Yup.string().required("Loan Type is required"),
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

//   const { employeeId, orgId, wId } = useSelector(
//     (state) => state?.auth?.profileData,
//     shallowEqual
//   );

//   useEffect(() => {
//     if (singleData) {
//       const newRowData = {
//         loanType: singleData?.strLoanType,
//         isActive: singleData?.isActive,
//       };
//       setModifySingleData(newRowData);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [singleData]);

//   useEffect(() => {
//     if (id) {
//       getGlobalLoanTypeById(setSingleData, id, setLoading);
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const saveHandler = (values, cb) => {
//     let payload = {
//       strLoanType: values?.loanType,
//       isActive: values?.isActive,
//       intAccountId: orgId,
//       dteCreatedAt: todayDate(),
//       intCreatedBy: employeeId,
//       intWorkplaceId: wId,
//     };
//     const callback = () => {
//       cb();
//       onHide();
//       getAllGlobalLoanType(wId, setRowDto, setAllData, setLoading);
//     };

//     if (id) {
//       createLoanType({ ...payload, intLoanTypeId: id }, setLoading, callback);
//     } else {
//       createLoanType({ ...payload, intLoanTypeId: 0 }, setLoading, callback);
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
//                             <label>Loan Type</label>
//                             <FormikInput
//                               classes="input-sm"
//                               value={values?.loanType}
//                               name="loanType"
//                               type="text"
//                               className="form-control"
//                               placeholder=""
//                               onChange={(e) => {
//                                 setFieldValue("loanType", e.target.value);
//                               }}
//                               errors={errors}
//                               touched={touched}
//                             />
//                           </div>
//                           {id && (
//                             <div className="col-12">
//                               <div className="input-main position-group-select mt-2">
//                                 <h6 className="title-item-name">
//                                   Loan Type Activation
//                                 </h6>
//                                 <p className="subtitle-p">
//                                   Activation toggle indicates to the particular
//                                   Loan Type status (Active/Inactive)
//                                 </p>
//                                 <FormikToggle
//                                   name="isActive"
//                                   color={
//                                     values?.isActive ? greenColor : blackColor40
//                                   }
//                                   checked={values?.isActive}
//                                   onChange={(e) => {
//                                     setFieldValue("isActive", e.target.checked);
//                                   }}
//                                 />
//                               </div>
//                             </div>
//                           )}
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

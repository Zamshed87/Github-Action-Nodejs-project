import { PForm } from "Components/PForm";
import { Avatar, Divider, Row } from "antd";

import { MdOutlineLayers } from "react-icons/md";
import { MdLanguage } from "react-icons/md";
import { FaLightbulb } from "react-icons/fa";

export default function ViewFormComponent({ singleData }) {
  return (
    <>
      <PForm>
        <Row gutter={[5, 2]} style={{ marginBottom: "-1.2rem" }}>
          <div className=" d-flex align-items-center">
            <div style={{ marginRight: "17px" }}>
              <Avatar icon={<MdOutlineLayers />} />
            </div>
            <div className="modal-body-txt">
              <h6 className="title-item-name">{singleData?.strLoanType}</h6>
              <p className="subtitle-p">{"Loan Type"}</p>
            </div>
          </div>
        </Row>
      </PForm>
    </>
  );
}

// import { Close, Edit, Layers, Star } from "@mui/icons-material";
// import { Avatar, IconButton } from "@mui/material";
// import { Form, Formik } from "formik";
// import { useEffect } from "react";
// import { Modal } from "react-bootstrap";
// import * as Yup from "yup";
// import FormikToggle from "../../../../common/FormikToggle";
// import { getGlobalLoanTypeById } from "../helper";
// import { blackColor40, greenColor } from "./../../../../utility/customColor";

// const initData = {};
// const validationSchema = Yup.object().shape({});

// export default function ViewFormComponent({
//   id,
//   show,
//   onHide,
//   size,
//   backdrop,
//   classes,
//   isVisibleHeading = true,
//   fullscreen,
//   title,
//   singleData,
//   setId,
//   setLoading,
//   setSingleData,
//   handleOpen,
// }) {
//   const saveHandler = (values, cb) => {};

//   useEffect(() => {
//     if (id) {
//       getGlobalLoanTypeById(setSingleData, id, setLoading);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const avatarSx = {
//     background: "#F2F2F7",
//     "&": {
//       height: "30px",
//       width: "30px",
//     },
//     "& .MuiSvgIcon-root": {
//       fontSize: "16px",
//     },
//   };
//   return (
//     <>
//       <Formik
//         enableReinitialize={true}
//         initialValues={initData}
//         validationSchema={validationSchema}
//         onSubmit={(values, { setSubmitting, resetForm }) => {
//           saveHandler(values, () => {
//             resetForm(initData);
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
//                       <div className="modal-body-type-two">
//                         {singleData && (
//                           <>
//                             <div className="modal-body-top d-flex align-items-center">
//                               <div style={{ marginRight: "17px" }}>
//                                 <Avatar sx={avatarSx}>
//                                   <Layers sx={{ color: "#616163" }} />
//                                 </Avatar>
//                               </div>
//                               <div className="modal-body-txt">
//                                 <h6 className="title-item-name">
//                                   {singleData?.strLoanType}
//                                 </h6>
//                                 <p className="subtitle-p">
//                                   {"Employment Type"}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="modal-body-main d-flex align-items-center">
//                               <div style={{ marginRight: "17px" }}>
//                                 <Avatar sx={avatarSx}>
//                                   <Star sx={{ color: "#616163" }} />
//                                 </Avatar>
//                               </div>
//                               <div>
//                                 <h6 className="title-item-name">
//                                   <FormikToggle
//                                     color={
//                                       singleData?.isActive
//                                         ? greenColor
//                                         : blackColor40
//                                     }
//                                     checked={singleData?.isActive}
//                                   />
//                                 </h6>
//                                 <p className="subtitle-p">Activation</p>
//                               </div>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </Modal.Body>
//                   <Modal.Footer className="view-modal-footer">
//                     <button
//                       className="modal-btn modal-btn-edit"
//                       onClick={() => {
//                         handleOpen();
//                         onHide();
//                         setId(id);
//                       }}
//                     >
//                       <Edit sx={{ marginRight: "10px", fontSize: "16px" }} />
//                       Edit
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

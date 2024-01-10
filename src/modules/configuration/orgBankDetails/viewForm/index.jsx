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
              <h6 className="title-item-name">{singleData?.strAccountName}</h6>
              <p className="subtitle-p">{"Account Name"}</p>
            </div>
          </div>
          <Divider orientation="left" style={{ marginTop: "4px" }}></Divider>
          <div
            className=" d-flex align-items-center"
            style={{ marginTop: "-12px" }}
          >
            <div style={{ marginRight: "17px" }}>
              <Avatar icon={<MdLanguage />} />
            </div>
            <div className="modal-body-txt">
              <h6 className="title-item-name">
                Bank account no: {singleData?.strAccountNo}{" "}
              </h6>{" "}
              <p className="subtitle-p">
                Bank Branch name: {singleData?.strBranchName}{" "}
              </p>{" "}
              <p className="subtitle-p">
                Bank Route No: {singleData?.strRoutingNo}{" "}
              </p>
            </div>
          </div>
        </Row>
      </PForm>
    </>
  );
}

// import { Close, Edit, Language, Lightbulb, Star } from "@mui/icons-material";
// import { Avatar, IconButton } from "@mui/material";
// import { Form, Formik } from "formik";
// import React from "react";
// import { Modal } from "react-bootstrap";
// import * as Yup from "yup";
// import FormikToggle from "../../../../common/FormikToggle";
// import { blackColor80, greenColor } from "./../../../../utility/customColor";

// const initData = {};
// const validationSchema = Yup.object().shape({});

// export default function OrgBankDetailsViewFormComponent({
//   show,
//   onHide,
//   size,
//   backdrop,
//   classes,
//   isVisibleHeading = true,
//   fullscreen,
//   title,
//   handleOpen,
//   orgId,
//   buId,
//   singleData,
//   setSingleData,
// }) {
//   const saveHandler = (values, cb) => {};

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
//                 <Form>
//
//                   )}

//                   <Modal.Body id="example-modal-sizes-title-xl">
//                     <div className="businessUnitModal">
//                       <div className="modal-body-type-two">
//                         {singleData?.intAccountBankDetailsId && (
//                           <>
//                             <div
//                               className="modal-body-main d-flex align-items-center"
//                               style={{ borderTop: "none", paddingTop: "0" }}
//                             >
//                               <div style={{ marginRight: "17px" }}>
//                                 <Avatar sx={avatarSx}>
//                                   <Language sx={{ color: "#616163" }} />
//                                 </Avatar>
//                               </div>
//                               <div>
//                                 <h6 className="title-item-name">
//                                   {singleData?.strAccountName}
//                                 </h6>
//                                 <p className="subtitle-p">{"Account Name"}</p>
//                               </div>
//                             </div>
//                             <div className="modal-body-main d-flex align-items-center">
//                               <div style={{ marginRight: "17px" }}>
//                                 <Avatar sx={avatarSx}>
//                                   <Lightbulb sx={{ color: "#616163" }} />
//                                 </Avatar>
//                               </div>
//                               <div>
//                                 <h6 className="title-item-name">
//                                   Bank account no: {singleData?.strAccountNo}
//                                 </h6>
//                                 <p className="subtitle-p">
//                                   Bank Branch name: {singleData?.strBranchName}
//                                 </p>
//                                 <p className="subtitle-p">
//                                   Bank Route No: {singleData?.strRoutingNo}
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
//                                         : blackColor80
//                                     }
//                                     checked={singleData?.isActive}
//                                   />
//                                 </h6>
//                                 <p className="subtitle-p">{"Activation"}</p>
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
//                       }}
//                     >
//                       <Edit sx={{ marginRight: "10px", fontSize: "16px" }} />
//                       Edit
//                     </button>
//                     {/* <button
//                        className="btn btn-cancel"
//                       onClick={() => {
//                         onHide();
//                         setSingleData("");
//                       }}
//                     >
//                       Close
//                     </button> */}
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

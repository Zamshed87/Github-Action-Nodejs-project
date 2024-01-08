import { PForm } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Avatar, Divider, Row } from "antd";
import { useState } from "react";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
              <Avatar
                // size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                icon={<MdOutlineLayers />}
              />
            </div>
            <div className="modal-body-txt">
              <h6 className="title-item-name">{singleData?.sectionName}</h6>
              <p className="subtitle-p">{"Section Name"}</p>
            </div>
          </div>
          <Divider orientation="left" style={{ marginTop: "4px" }}></Divider>
          <div
            className=" d-flex align-items-center"
            style={{ marginTop: "-12px" }}
          >
            <div style={{ marginRight: "17px" }}>
              <Avatar
                // size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                icon={<MdLanguage />}
              />
            </div>
            <div className="modal-body-txt">
              <h6 className="title-item-name">{singleData?.departmentName}</h6>
              <p className="subtitle-p">{"Department Name"}</p>
            </div>
          </div>

          {/* <Divider orientation="left"></Divider> */}
        </Row>
      </PForm>
    </>
  );
}

// {singleData?.sectionId && (
//   <>
//     <div className="modal-body-top d-flex align-items-center">
//       <div style={{ marginRight: "17px" }}>
//         <Avatar sx={avatarSx}>
//           <Layers sx={{ color: "#616163" }} />
//         </Avatar>
//       </div>
//       <div className="modal-body-txt">
//         <h6 className="title-item-name">
//           {singleData?.sectionName}
//         </h6>
//         <p className="subtitle-p">
//           {"Section Name"}
//         </p>
//       </div>
//     </div>
//     <div className="modal-body-main d-flex align-items-center">
//       <div style={{ marginRight: "17px" }}>
//         <Avatar sx={avatarSx}>
//           <Lightbulb sx={{ color: "#616163" }} />
//         </Avatar>
//       </div>
//       <div>
//         <h6 className="title-item-name">
//           {singleData?.departmentName}
//         </h6>
//         <p className="subtitle-p">
//           {"Department Name"}
//         </p>
//       </div>
//     </div>
//     <div className="modal-body-main d-flex align-items-center">
//       <div style={{ marginRight: "17px" }}>
//         <Avatar sx={avatarSx}>
//           <Star sx={{ color: "#616163" }} />
//         </Avatar>
//       </div>
//       <div>
//         <FormikToggle
//           color={
//             singleData?.isActive
//               ? greenColor
//               : blackColor80
//           }
//           checked={singleData?.isActive}
//         />
//         <p className="subtitle-p">{"Activation"}</p>
//       </div>
//     </div>
//   </>
// )}

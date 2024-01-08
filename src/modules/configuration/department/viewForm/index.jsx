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
              <h6 className="title-item-name">{singleData?.strDepartment}</h6>
              <p className="subtitle-p">{"Department Name"}</p>
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
                {singleData?.strDepartmentCode}
              </h6>
              <p className="subtitle-p">{"Code"}</p>
            </div>
          </div>
          <Divider orientation="left" style={{ marginTop: "4px" }}></Divider>
          <div
            className=" d-flex align-items-center"
            style={{ marginTop: "-12px" }}
          >
            <div style={{ marginRight: "17px" }}>
              <Avatar icon={<FaLightbulb />} />
            </div>
            <div className="modal-body-txt">
              <h6 className="title-item-name">{singleData?.strBusinessUnit}</h6>
              <p className="subtitle-p">{"BusinessUnit"}</p>
            </div>
          </div>
        </Row>
      </PForm>
    </>
  );
}

import { PForm } from "Components/PForm";
import { useApiRequest } from "Hooks";
import { Avatar, Divider, Row } from "antd";
import { useState } from "react";

import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MdOutlineLayers } from "react-icons/md";
import { MdLanguage } from "react-icons/md";
import { FaLightbulb } from "react-icons/fa";

export default function ViewFormComponent({
  setIsAddEditForm,
  getData,
  // empBasic,
  // isEdit,
  singleData,
  setId,
}) {
  return (
    <>
      <PForm
      // // form={form}
      // onFinish={() => {
      //   const values = form.getFieldsValue(true);
      //   submitHandler({
      //     values,
      //     getData,
      //     resetForm: form.resetFields,
      //     setIsAddEditForm,
      //     isEdit,
      //   });
      // }}
      // initialValues={{}}
      >
        <Row gutter={[5, 2]} style={{ marginBottom: "-1.2rem" }}>
          <div className=" d-flex align-items-center">
            <div style={{ marginRight: "17px" }}>
              <Avatar
                // size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                icon={<MdOutlineLayers />}
              />
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
              <Avatar
                // size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                icon={<MdLanguage />}
              />
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
              <Avatar
                // size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                icon={<FaLightbulb />}
              />
            </div>
            <div className="modal-body-txt">
              <h6 className="title-item-name">{singleData?.strBusinessUnit}</h6>
              <p className="subtitle-p">{"BusinessUnit"}</p>
            </div>
          </div>
          {/* <Divider orientation="left"></Divider> */}
        </Row>
      </PForm>
    </>
  );
}

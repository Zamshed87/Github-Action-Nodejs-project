/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { getEmployeeProfileViewDataForAddress } from "../../../../employeeFeature/helper";
import "../../../employeeOverview.css";
import OtherAddress from "./OtherAddress";
import ParmanentAddress from "./ParmanentAddress";
import PresentAddress from "./PresentAddress";

function Address({ empId }) {
  const [rowDto, setRowDto] = useState({});
  const [loading, setLoading] = useState(false);

  const getData = () => {
    getEmployeeProfileViewDataForAddress(empId, setRowDto, setLoading);
  };

  return (
    <>
      <h5>Address</h5>
      <ParmanentAddress getData={getData} empId={empId} />
      <PresentAddress getData={getData} rowDto={rowDto} empId={empId} />
      <OtherAddress getData={getData} rowDto={rowDto} empId={empId} />
    </>
  );
}

export default Address;

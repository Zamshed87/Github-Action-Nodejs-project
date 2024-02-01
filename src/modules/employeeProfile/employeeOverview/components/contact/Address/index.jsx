/* eslint-disable no-unused-vars */
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getEmployeeProfileViewDataForAddress } from "../../../../employeeFeature/helper";
import "../../../employeeOverview.css";
import OtherAddress from "./OtherAddress";
import ParmanentAddress from "./ParmanentAddress";
import PresentAddress from "./PresentAddress";
import Loading from "common/loading/Loading";

function Address({ empId }) {
  const [rowDto, setRowDto] = useState({});
  const [loading, setLoading] = useState(false);
  const { buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const getData = () => {
    getEmployeeProfileViewDataForAddress(
      empId,
      buId,
      wgId,
      setRowDto,
      setLoading
    );
  };

  return (
    <>
      {loading && <Loading />}
      <h5>Address</h5>
      <ParmanentAddress getData={getData} empId={empId} />
      <PresentAddress getData={getData} rowDto={rowDto} empId={empId} />
      <OtherAddress getData={getData} rowDto={rowDto} empId={empId} />
    </>
  );
}

export default Address;

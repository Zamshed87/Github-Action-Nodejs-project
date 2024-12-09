import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../common/loading/Loading";
import useAxiosGet from "../../../../utility/customHooks/useAxiosGet";
import { getSingleData } from "../helper";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import ViewTask from "../components/viewTask";

const SelfViewTask = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { employeeId, orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [isAccordion, setIsAccordion] = useState(false);
  const [singleData, setSingleData] = useState([]);
  const [, getSingleTask, singleTaskLoading] = useAxiosGet([]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30351) {
      permission = item;
    }
  });

  useEffect(() => {
    getSingleData({
      orgId,
      buId,
      employeeId,
      isManagement: true,
      taskId: params?.id,
      getSingleTask,
      setSingleData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId, employeeId, params?.id]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, [dispatch]);

  return (
    <>
      {singleTaskLoading && <Loading />}
      <ViewTask
        propsObj={{ permission, singleData, isAccordion, setIsAccordion }}
      />
    </>
  );
};

export default SelfViewTask;

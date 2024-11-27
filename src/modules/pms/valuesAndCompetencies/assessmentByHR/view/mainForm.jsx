import { useEffect, useState } from "react";
import Form from "./form";
import { shallowEqual, useSelector } from "react-redux";
import { getEmployeeApproveAndActiveByKPIId, saveCreateData } from "./helper";
import { toArray } from "lodash";
import useAxiosGet from "../../../../../utility/customHooks/useAxiosGet";
// import { erpBaseUrl } from "../../../../../common/ErpBaseUrl";

const initData = {};

export default function ViewForm({ currentItem, setIsShowModal }) {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const { kpiId, frId, year, enroll, selectedYear, kpi, objective, setReport } =
    currentItem;
  const [target, getTarget] = useAxiosGet();
  //   const { profileData, selectedBusinessUnit, target } = storeData;
  const [rowDto, setRowDto] = useState({});

  //   const dispatch = useDispatch();

  //   const getTarget = () => {
  //     if (kpiId && frId && year) {
  //     //   dispatch(getTargetAction(kpiId, frId, year));
  //     }
  //   };

  useEffect(() => {
    if (kpiId && frId && year) {
      getTarget(
        `/pms/Kpi2/GetEmployeeTargetDetails?KpiId=${kpiId || 0}&FreqId=${
          frId || 0
        }&YearId=${year || 0}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kpiId, frId, year]);

  useEffect(() => {
    if (kpiId) {
      getEmployeeApproveAndActiveByKPIId(kpiId, setDisabled);
    }
  }, [kpiId]);
  const { profileData } = useSelector((state) => state?.auth, shallowEqual);
  const saveHandler = async (values, cb) => {
    const data = toArray(rowDto)?.map((itm, index) => ({
      ...itm,
      documentString:
        itm?.documentString || target?.objRow?.[index]?.documentString,
      numAchivment:
        itm.numAchivment >= 0 || itm.numAchivment <= 0
          ? parseFloat(itm.numAchivment)
          : target?.objRow?.[index]?.achivment,
      remarks: itm?.remarks,
    }));
    saveCreateData(data, cb);
    // dispatch(saveAchievementAction({ data: data, cb }));
  };

  const rowDtoHandler = (name, value, sl, rowId) => {
    setRowDto({
      ...rowDto,
      [sl]: {
        ...rowDto[sl],
        [name]: value,
        rowId: rowId,
      },
    });
  };

  // eslint-disable-next-line no-unused-vars
  const [objProps, setObjprops] = useState({});
  return (
    <Form
      {...objProps}
      initData={initData}
      saveHandler={saveHandler}
      accountId={profileData?.orgId}
      selectedBusinessUnit={profileData?.buId}
      target={target}
      rowDtoHandler={rowDtoHandler}
      rowDto={rowDto}
      setRowDto={setRowDto}
      enroll={enroll}
      getTarget={getTarget}
      selectedYear={selectedYear}
      kpi={kpi}
      objective={objective}
      setReport={setReport}
      setIsShowModal={setIsShowModal}
    />
  );
}

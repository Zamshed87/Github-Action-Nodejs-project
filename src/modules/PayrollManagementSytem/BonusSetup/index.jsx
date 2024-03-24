import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import {
  SettingsBackupRestoreOutlined,
  EditOutlined,
  AddOutlined,
} from "@mui/icons-material";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { getBonusSetupLanding } from "./helper";
import Loading from "../../../common/loading/Loading";
import ResetButton from "../../../common/ResetButton";
import PrimaryButton from "../../../common/PrimaryButton";
import Chips from "../../../common/Chips";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { toast } from "react-toastify";
import { todayDate } from "../../../utility/todayDate";
import AntTable from "../../../common/AntTable";

const initData = {
  status: "",
};

export default function BonusSetupLanding() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { orgId, buId, employeeId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 72) {
      permission = item;
    }
  });

  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Bonus Setup";
  }, [dispatch]);

  const getData = () => {
    getBonusSetupLanding(
      {
        strPartName: "BonusSetupList",
        intBonusHeaderId: 0,
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intBonusId: 0,
        intPayrollGroupId: 0,
        intWorkplaceGroupId: wgId,
        intWorkplaceId: wId,
        intReligionId: 0,
        dteEffectedDate: todayDate(),
        intCreatedBy: employeeId,
      },
      setRowDto,
      setLoading
    );
  };

  useEffect(() => {
    getBonusSetupLanding(
      {
        strPartName: "BonusSetupList",
        intBonusHeaderId: 0,
        intAccountId: orgId,
        intBusinessUnitId: buId,
        intBonusId: 0,
        intPayrollGroupId: 0,
        intWorkplaceGroupId: wgId,
        intWorkplaceId: wId,
        intReligionId: 0,
        dteEffectedDate: todayDate(),
        intCreatedBy: employeeId,
      },
      setRowDto,
      setLoading
    );
  }, [orgId, buId, employeeId, wId, wgId]);

  const { setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    // validationSchema: validationSchema,
    initialValues: initData,
    onSubmit: (values, { resetForm }) => {
      resetForm(initData);
    },
  });

  const columns = [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
    },
    {
      title: "Bonus Name",
      dataIndex: "strBonusName",
      sorter: true,
      filter: false,
    },
    {
      title: "Religion",
      dataIndex: "strReligionName",
      sorter: true,
      filter: false,
    },
    {
      title: "Employee Type",
      dataIndex: "strEmploymentType",
      sorter: true,
      filter: false,
    },
    {
      title: "Workplace Name",
      dataIndex: "strWorkplace",
      sorter: true,
      filter: false,
      width: "120px",
    },
    {
      title: "HR Position Name",
      dataIndex: "HrPositionName",
      sorter: true,
      filter: false,
      width: "120px",
    },
    {
      title: "Service Length Type",
      render: (_, item) => (
        <>{item?.IsServiceLengthInDays ? "Days" : "Month"}</>
      ),
      sorter: true,
      filter: false,
    },
    {
      title: "Min. Service Length",
      // dataIndex: "intMinimumServiceLengthMonth",
      render: (_, item) => (
        <>
          {item?.intMinimumServiceLengthMonth > 0
            ? item?.intMinimumServiceLengthMonth
            : item?.intMinimumServiceLengthDays || "-"}
        </>
      ),
      sorter: true,
      filter: false,
    },
    {
      title: `Max. Service Length`,
      // dataIndex: "intMaximumServiceLengthMonth",
      render: (_, item) => (
        <>
          {item?.intMaximumServiceLengthMonth > 0
            ? item?.intMaximumServiceLengthMonth
            : item?.intMaximumServiceLengthDays || "-"}
        </>
      ),
      sorter: true,
      filter: false,
    },
    {
      title: "Bonus Percentage On",
      dataIndex: "strBonusPercentageOn",
      sorter: true,
      filter: false,
    },
    {
      title: "Bonus Percentage",
      dataIndex: "numBonusPercentage",
      sorter: true,
      filter: false,
    },
    {
      title: "Divided by Service Length",
      dataIndex: "IsDividedbyServiceLength",
      render: (data) => <>{`${data}`}</>,
      sorter: true,
      filter: false,
    },
    {
      title: "Status",
      dataIndex: "statusValue",
      render: (_, item) => (
        <Chips
          label={item?.isActive ? "Active" : "Inactive"}
          classess={`${item?.isActive ? "success" : "danger"} p-2`}
        />
      ),
      sorter: true,
      filter: true,
    },
    {
      title: "",
      dataIndex: "",
      render: (_, item) => (
        <div className="d-flex">
          <Tooltip title="Edit" arrow>
            <button className="iconButton" type="button">
              <EditOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission");
                  history.push({
                    pathname: `/administration/payrollConfiguration/bonusSetup/edit/${item?.intBonusSetupId}`,
                    state: item,
                  });
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
      sorter: false,
      filter: false,
    },
  ];

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <>
          <form onSubmit={handleSubmit}>
            <div className="table-card businessUnit-wrapper dashboard-scroll">
              <div className="table-card-heading">
                <div>
                  <h6>Bonus Setup</h6>
                </div>
                <ul className="d-flex flex-wrap">
                  {status && (
                    <li>
                      <ResetButton
                        classes="btn-filter-reset"
                        title="reset"
                        icon={
                          <SettingsBackupRestoreOutlined
                            sx={{ marginRight: "10px", fontSize: "16px" }}
                          />
                        }
                        styles={{
                          marginRight: "16px",
                        }}
                        onClick={() => {
                          setFieldValue("status", "");
                          setStatus("");
                          getData();
                        }}
                      />
                    </li>
                  )}
                  <li>
                    <PrimaryButton
                      type="button"
                      className="btn btn-default flex-center"
                      label={"Create"}
                      icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!permission?.isCreate)
                          return toast.warn("You don't have permission");
                        history.push(
                          "/administration/payrollConfiguration/bonusSetup/create"
                        );
                      }}
                    />
                  </li>
                </ul>
              </div>
              <div className="table-card-body">
                <div className="table-card-styled tableOne">
                  {rowDto?.length > 0 ? (
                    <AntTable data={rowDto} columnsData={columns} />
                  ) : (
                    <>
                      {!loading && (
                        <NoResult title="You have no application." />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          <NotPermittedPage />
        </>
      )}
    </>
  );
}

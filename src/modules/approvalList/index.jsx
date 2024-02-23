/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from "@material-ui/core";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import adjustmentIOUIcon from "../../assets/images/ApprovalIcons/adjustmentIOU.svg";
import allowancededuction from "../../assets/images/ApprovalIcons/allowancededuction.svg";
import AttendanceIcon from "../../assets/images/ApprovalIcons/attendence.svg";
import BonusIcon from "../../assets/images/ApprovalIcons/bonusIcon.svg";
import iou from "../../assets/images/ApprovalIcons/iou.svg";
import leaveIcon from "../../assets/images/ApprovalIcons/leave.svg";
import loan from "../../assets/images/ApprovalIcons/loan.svg";
import movementIcon from "../../assets/images/ApprovalIcons/movement.svg";
import OvertimeIcon from "../../assets/images/ApprovalIcons/overtime.svg";
import remoteAttendance from "../../assets/images/ApprovalIcons/remoteAttendance.svg";
import SalaryGenerateIcon from "../../assets/images/ApprovalIcons/salaryGenerate.svg";
import SeparationIcon from "../../assets/images/ApprovalIcons/separationIcon.svg";
import Chips from "../../common/Chips";
import { setFirstLevelNameAction } from "../../commonRedux/reduxForLocalStorage/actions";
import Loading from "./../../common/loading/Loading";
import { getApprovalDashboardLanding } from "./helper";
import "./index.css";
import { handleMostClickedMenuListAction } from "commonRedux/auth/actions";
import { isDevServer } from "App";

const initData = {
  search: "",
};

export default function ApprovalList() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { orgId, employeeId, isOfficeAdmin, wId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [approvalPermissions, setApprovalPermissions] = useState([]);
  const [newTableData, setNewTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(wgId && wId){
      getApprovalDashboardLanding(
        orgId,
        employeeId,
        isOfficeAdmin,
        setApprovalPermissions,
        setLoading,
        wId,
        buId,
        wgId
      );
    }
  }, [orgId, employeeId, wId, buId, wgId]);

  useEffect(() => {
    const arr = [];
    approvalPermissions.forEach((item) => {
      if (item?.pipelineCode === "BABBAPBANDNQNARQ") {
        arr.push({
          ...item,
          icon: leaveIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNNAO") {
        arr.push({
          ...item,
          icon: movementIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNNAC") {
        arr.push({
          ...item,
          icon: AttendanceIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNNAP") {
        arr.push({
          ...item,
          icon: OvertimeIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNNAD") {
        arr.push({
          ...item,
          icon: SalaryGenerateIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNNAQ") {
        arr.push({
          ...item,
          icon: loan,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNNAE") {
        arr.push({
          ...item,
          icon: SeparationIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNNAR") {
        arr.push({
          ...item,
          icon: BonusIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNBQN") {
        arr.push({
          ...item,
          icon: SalaryGenerateIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNBQB") {
        arr.push({
          ...item,
          icon: AttendanceIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNBQO") {
        arr.push({
          ...item,
          icon: allowancededuction,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNBQC") {
        arr.push({
          ...item,
          icon: iou,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNBQP") {
        arr.push({
          ...item,
          icon: adjustmentIOUIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNBQD") {
        arr.push({
          ...item,
          icon: AttendanceIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNBQQ") {
        arr.push({
          ...item,
          icon: SalaryGenerateIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNONC") {
        arr.push({
          ...item,
          icon: remoteAttendance,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNONP") {
        arr.push({
          ...item,
          icon: remoteAttendance,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNOND") {
        arr.push({
          ...item,
          icon: SalaryGenerateIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNONR") {
        arr.push({
          ...item,
          icon: SalaryGenerateIcon,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNOBE") {
        arr.push({
          ...item,
          icon: remoteAttendance,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNNCA") {
        arr.push({
          ...item,
          icon: allowancededuction,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNOPP") {
        arr.push({
          ...item,
          icon: allowancededuction,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNOPO") {
        arr.push({
          ...item,
          icon: allowancededuction,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNOPD") {
        arr.push({
          ...item,
          icon: iou,
        });
      }
      if (item?.pipelineCode === "BABBAPBANDNQNOPR") {
        arr.push({
          ...item,
          icon: remoteAttendance,
        });
      }
    });
    setNewTableData(arr);
  }, [approvalPermissions]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Approval";
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {
          // console.log(values);
        }}
      >
        {({ handleSubmit }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <div className="approval-wrapper">
                <div className="table-card">
                  <div
                    className="table-card-heading"
                    style={{ margin: "10px 0 14px 0" }}
                  >
                    <h2>Pending Applications</h2>
                    <div className="table-card-head-right"></div>
                  </div>
                  <div className="table-card-body">
                    <div className="application-table">
                      <div className="table-card-styled">
                        <table className="table">
                          <tbody>
                            {newTableData
                              ?.filter((item) =>
                                isDevServer ? true : item?.totalCount
                              )
                              .map((data, index) => (
                                <tr
                                  className="hasEvent"
                                  onClick={() => {
                                    dispatch(
                                      handleMostClickedMenuListAction({
                                        id: data?.id,
                                        label: data?.menuName,
                                        to: data?.routeUrl,
                                      })
                                    );

                                    history.push(`${data?.routeUrl}`);
                                  }}
                                  key={index}
                                >
                                  <td>
                                    <div className="employeeInfo d-flex align-items-center approval-avatar">
                                      <Avatar
                                        alt="Remy Sharp"
                                        src={data?.icon}
                                      />
                                      <div className="table-title pl-3">
                                        <p>{data?.menuName}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="action-td">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <Tooltip title={"Pending"}>
                                        <div>
                                          <Chips
                                            label={data?.totalCount}
                                            classess="success p-2 rounded-5"
                                          />
                                        </div>
                                      </Tooltip>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

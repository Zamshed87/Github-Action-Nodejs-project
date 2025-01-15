/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from "@material-ui/core";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import "./index.css";
import { SettingsBackupRestoreOutlined } from "@mui/icons-material";
import { getApprovalDashboardLanding } from "./helper";
import Loading from "common/loading/Loading";
import ResetButton from "common/ResetButton";
import MasterFilter from "common/MasterFilter";
import Chips from "common/Chips";
import {
  FileOutlined,
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

const initData = {
  search: "",
};

export default function ApprovalList() {
  const history = useHistory();
  const { orgId, employeeId, wId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [approvalData, setApprovalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wgId && wId) {
      getApprovalDashboardLanding(
        orgId,
        employeeId,
        false,
        setApprovalData,
        setLoading,
        wId,
        buId,
        wgId
      );
    }
  }, [orgId, employeeId, wId, buId, wgId]);

  useEffect(() => {
    if (approvalData.length > 0) {
      const iconMapping = {
        "Type A": (
          <FileOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
        ),
        "Type B": (
          <UserOutlined style={{ fontSize: "24px", color: "#52c41a" }} />
        ),
        "Type C": (
          <SettingOutlined style={{ fontSize: "24px", color: "#faad14" }} />
        ),
        default: (
          <DashboardOutlined style={{ fontSize: "24px", color: "#8c8c8c" }} />
        ),
      };

      const mappedData = approvalData.map((item) => ({
        ...item,
        icon: iconMapping.default,
      }));

      setFilteredData(mappedData);
    }
  }, [approvalData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ handleSubmit, values, resetForm, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            {loading && <Loading />}
            <div className="approval-wrapper">
              <div className="table-card">
                <div
                  className="table-card-heading"
                  style={{ margin: "10px 0 14px 0" }}
                >
                  <h2>Pending Applications</h2>
                  <div className="table-card-head-right">
                    <ul>
                      {values?.search && (
                        <li>
                          <ResetButton
                            classes="btn-filter-reset"
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{ marginRight: "10px", fontSize: "16px" }}
                              />
                            }
                            onClick={() => {
                              setFilteredData(approvalData);
                              resetForm();
                            }}
                          />
                        </li>
                      )}

                      <li>
                        <MasterFilter
                          width="200px"
                          inputWidth="200px"
                          value={values?.search}
                          setValue={(value) => {
                            setFieldValue("search", value);
                            if (value) {
                              const filtered = approvalData.filter((item) =>
                                item.applicationType
                                  ?.toLowerCase()
                                  .includes(value.toLowerCase())
                              );
                              console.log("filtered", filtered);
                              setFilteredData(filtered);
                            } else {
                              setFilteredData(approvalData);
                            }
                          }}
                          cancelHandler={() => {
                            setFilteredData(approvalData);
                            setFieldValue("search", "");
                          }}
                          isHiddenFilter
                        />
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="table-card-body">
                  <div className="application-table">
                    <div className="table-card-styled">
                      <table className="table">
                        <tbody>
                          {filteredData.map((data, index) => (
                            <tr
                              className="hasEvent"
                              key={index}
                              onClick={() => {
                                const serializableData = {
                                  applicationTypeId: data.applicationTypeId,
                                  applicationType: data.applicationType,
                                };
                                history.push(`/approvalNew/${data.applicationTypeId}`, {
                                  state: serializableData,
                                });
                              }}
                            >
                              <td>
                                <div className="employeeInfo d-flex align-items-center approval-avatar">
                                  <Avatar
                                    alt={data.applicationType}
                                    src={data.icon}
                                  />
                                  <div className="table-title pl-3">
                                    <p>{data.applicationType}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="action-td">
                                <Tooltip title="Pending">
                                  <div>
                                    <Chips
                                      label={data.pendingApprovalCount}
                                      classess="success p-2 rounded-5"
                                    />
                                  </div>
                                </Tooltip>
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
        )}
      </Formik>
    </>
  );
}

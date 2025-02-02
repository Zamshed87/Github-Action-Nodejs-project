/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from "@material-ui/core";
import { Tooltip } from "@mui/material";
import { Formik } from "formik";
import { Form } from "antd";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import CommonFilter from "common/CommonFilter";

const initData = {
  search: "",
};

export default function ApprovalList() {
  const history = useHistory();
  const { orgId, employeeId, wId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [approvalData, setApprovalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const landingApiCall = () => {
    const values = form.getFieldsValue(true);

    getApprovalDashboardLanding(
      orgId,
      employeeId,
      false,
      setApprovalData,
      setLoading,
      values?.workplace?.value || wId,
      buId,
      values?.workplaceGroup?.value || wgId,
      values
    );
  };

  useEffect(() => {
    if (wId && wgId) {
      landingApiCall();
    }
  }, [wId, wgId]);

  const handleFilter = (values) => {
    const { workplace, workplaceGroup } = values;
    getApprovalDashboardLanding(
      orgId,
      employeeId,
      false,
      setApprovalData,
      setLoading,
      workplace?.value || wId,
      buId,
      workplaceGroup?.value || wgId,
      values
    );
  };

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
        icon: iconMapping[item.type] || iconMapping.default,
      }));

      setFilteredData(mappedData);
    } else {
      setFilteredData([]);
    }
  }, [approvalData, wgId, wId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Approval"));
    document.title = "Approval";
    return () => {
      document.title = "";
    };
  }, []);

  const [form] = Form.useForm();

  console.log("Form", form);

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
                      <li>
                        <CommonFilter
                          visible={isFilterVisible}
                          onClose={(visible) => setIsFilterVisible(visible)}
                          onFilter={handleFilter}
                          isDate={true}
                          isWorkplaceGroup={true}
                          isWorkplace={true}
                          isAllValue={true}
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
                                history.push(
                                  `/approval/${data.applicationTypeId}`,
                                  {
                                    state: serializableData,
                                  }
                                );
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

import {
  AddOutlined,
  FilterAltOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import MasterFilter from "../../../../common/MasterFilter";
import NoResult from "../../../../common/NoResult";
import PrimaryButton from "../../../../common/PrimaryButton";
import ResetButton from "../../../../common/ResetButton";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PeopleDeskTable from "../../../../common/peopleDeskTable";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import {
  getSeparationLanding,
  separationApplicationLandingTableColumn,
} from "../helper";
import { PModal } from "Components/Modal";
import ManagementSeparationHistoryView from "./viewForm/ManagementSeparationHistoryView";
import { statusDDL } from "./utils";
import { Col, Drawer, Form, Row } from "antd";
import { PButton, PForm, PInput, PSelect } from "Components";
import moment from "moment";
import SeparationHistoryview from "./viewForm/SeparationHistoryview";

const paginationSize = 100;
export const formatDate = (date) => {
  return moment(date).format("YYYY-MM-DD");
};
export default function ManagementSeparation() {
  // hook
  const dispatch = useDispatch();
  const history = useHistory();

  // redux
  const {
    profileData: { buId, wgId, wId },
    tokenData,
  } = useSelector((state) => state?.auth, shallowEqual);

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 10) {
      permission = item;
    }
  });

  // state
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);
  const [empId, setEmpId] = useState(null);

  // landing
  const [rowDto, setRowDto] = useState([]);
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });
  const [openFilter, setOpenFilter] = useState(false);

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const defaultFromDate = moment();
  const defaultToDate = moment().endOf("month");

  const getData = (pagination, searchText) => {
    const fromDate = formatDate(values?.fromDate || defaultFromDate);
    const toDate = formatDate(values?.toDate || defaultToDate);

    getSeparationLanding(
      "EmployeeSeparationList",
      buId,
      wgId,
      fromDate,
      toDate,
      values?.status || 0,
      searchText,
      setRowDto,
      setLoading,
      pagination?.current,
      pagination?.pageSize,
      setPages,
      wId,
      "",
      decodedToken.workplaceGroupList || "",
      decodedToken.workplaceList || ""
    );
  };

  const handleChangePage = (_, newPage, searchText = "") => {
    setPages((prev) => {
      return { ...prev, current: newPage };
    });
    getData(
      {
        current: newPage,
        pageSize: pages?.pageSize,
        total: pages?.total,
      },
      searchText
    );
  };

  const handleChangeRowsPerPage = (event, searchText = "") => {
    setPages(() => {
      return { current: 1, total: pages?.total, pageSize: +event.target.value };
    });
    getData(
      {
        current: 1,
        pageSize: +event.target.value,
        total: pages?.total,
      },
      searchText
    );
  };

  // initial
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Retirement"));
    document.title = "Separation";
  }, [dispatch]);

  useEffect(() => {
    getSeparationLanding(
      "EmployeeSeparationList",
      buId,
      wgId,
      values?.filterFromDate || "",
      values?.filterToDate || "",
      values?.status?.value || 0,
      "",
      setRowDto,
      setLoading,
      1,
      paginationSize,
      setPages,
      wId,
      "",
      decodedToken.workplaceGroupList || "",
      decodedToken.workplaceList || ""
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, wgId, wId]);

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <div className="table-card businessUnit-wrapper dashboard-scroll">
          <div className="table-card-heading" style={{ marginBottom: "20px" }}>
            <div>
              {/* <h6>Separation</h6> */}
              <PButton
                size="small"
                type="primary"
                icon={<FilterAltOutlined />}
                content={"Filter"}
                onClick={() => {
                  setOpenFilter(true);
                }}
              />
            </div>
            <ul className="d-flex flex-wrap">
              {(status || values?.search) && (
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
                      form.setFieldValue("status", "");
                      form.setFieldValue("search", "");
                      setStatus("");
                      getData(pages, "");
                    }}
                  />
                </li>
              )}
              <li>
                <MasterFilter
                  inputWidth="200"
                  width="200px"
                  isHiddenFilter
                  value={values?.search}
                  setValue={(value) => {
                    form.setFieldValue("search", value);
                    if (value) {
                      getData(pages, value);
                    } else {
                      getData(pages, "");
                    }
                  }}
                  cancelHandler={() => {
                    form.setFieldValue("search", "");
                    getData(pages, "");
                  }}
                />
              </li>
              <li>
                <Drawer
                  title="Filter"
                  onClose={() => setOpenFilter(false)}
                  open={openFilter}
                >
                  <PForm
                    form={form}
                    initialValues={{
                      fromDate: defaultFromDate,
                      toDate: defaultToDate,
                      status: 0,
                    }}
                  >
                    <Row gutter={[10, 2]}>
                      <Col md={24} sm={12} xs={24}>
                        <PSelect
                          style={{ marginBottom: "5px" }}
                          options={statusDDL || []}
                          name="status"
                          label={"Status"}
                          showSearch
                          placeholder="Status"
                          onChange={(value) => {
                            form.setFieldValue({
                              status: value,
                            });
                          }}
                          rules={[
                            {
                              required: true,
                              message: "Status is required",
                            },
                          ]}
                        />
                      </Col>
                      <Col md={12} sm={24}>
                        <PInput
                          type="date"
                          name="fromDate"
                          label="From Date"
                          placeholder="From Date"
                          onChange={(value) => {
                            form.setFieldsValue({
                              fromDate: value,
                            });
                          }}
                          rules={[
                            {
                              required: true,
                              message: "From Date is required",
                            },
                          ]}
                        />
                      </Col>
                      <Col md={12} sm={24}>
                        <PInput
                          type="date"
                          name="toDate"
                          label="To Date"
                          placeholder="To Date"
                          onChange={(value) => {
                            form.setFieldsValue({
                              toDate: value,
                            });
                          }}
                          rules={[
                            {
                              required: true,
                              message: "To Date is required",
                            },
                          ]}
                        />
                      </Col>
                      <Col md={6} sm={24}>
                        <PButton
                          style={{ marginTop: "15px" }}
                          type="primary"
                          content={"Filter"}
                          onClick={() => {
                            const values = form.getFieldsValue(true);
                            form
                              .validateFields()
                              .then(() => {
                                getData(pages, values?.search);
                              })
                              .catch(() => {});
                          }}
                        />
                      </Col>
                      <Col md={6} sm={24}>
                        <PButton
                          style={{ marginTop: "15px" }}
                          type="secondary"
                          content="Reset"
                          onClick={() => {
                            form.resetFields();
                          }}
                        />
                      </Col>
                    </Row>
                  </PForm>
                </Drawer>
              </li>
              <li>
                <PrimaryButton
                  type="button"
                  className="btn btn-default flex-center"
                  label={"Apply"}
                  icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!permission?.isCreate)
                      return toast.warn("You don't have permission");
                    history.push("/retirement/separation/create");
                  }}
                />
              </li>
            </ul>
          </div>
          {rowDto?.length > 0 ? (
            <>
              <PeopleDeskTable
                customClass="iouManagementTable"
                columnData={separationApplicationLandingTableColumn(
                  pages?.current,
                  pages?.pageSize,
                  history,
                  dispatch,
                  setOpenModal,
                  permission,
                  setId,
                  setEmpId
                )}
                pages={pages}
                rowDto={rowDto}
                setRowDto={setRowDto}
                handleChangePage={(e, newPage) =>
                  handleChangePage(e, newPage, values?.search)
                }
                handleChangeRowsPerPage={(e) =>
                  handleChangeRowsPerPage(e, values?.search)
                }
                uniqueKey="strEmployeeCode"
                isCheckBox={false}
                isScrollAble={false}
                onRowClick={(data) => {
                  history.push(
                    `/retirement/separation/view/${data?.separationId}`
                  );
                }}
              />
              {/* <PModal
                title="Separation History View"
                open={openModal}
                onCancel={() => {
                  setOpenModal(false);
                }}
                components={
                  <ManagementSeparationHistoryView
                    id={id}
                    type="view"
                    empId={empId}
                  />
                }
                width={1000}
              /> */}
              <PModal
                title="Separation History View"
                open={openModal}
                onCancel={() => {
                  setOpenModal(false);
                }}
                components={
                  <SeparationHistoryview id={id} type="view" empId={empId} />
                }
                width={1000}
              />
            </>
          ) : (
            <>{!loading && <NoResult title="No Result Found" para="" />}</>
          )}
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}

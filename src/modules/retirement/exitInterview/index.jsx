import { FilterAltOutlined } from "@mui/icons-material";
import { Col, Drawer, Form, Row } from "antd";
import PeopleDeskTable, { paginationSize } from "common/peopleDeskTable";
import { PButton, PForm, PInput, PSelect } from "Components";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  formatDate,
  getExitInterviewLanding,
  getExitInterviewLandingTableColumn,
  SearchFilter,
  statusDDL,
} from "../exitInterview/helper.js";
import { shallowEqual, useSelector } from "react-redux";
import NoResult from "common/NoResult";
import Loading from "common/loading/Loading";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import ExitInterviewAssign from "./components/ExitInterviewAssign.jsx";
import { PModal } from "Components/Modal";
import ExitInterviewDataView from "./components/ExitInterviewDataView.jsx";

export default function ExitInterviewLanding() {
  const {
    profileData: { buId, wgId, wId },
    permissionList,
    tokenData,
  } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30544) {
      permission = item;
    }
  });

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

  const defaultFromDate = moment();
  const defaultToDate = moment().endOf("month");

  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  const [openFilter, setOpenFilter] = useState(false);
  const [openExitInterviewAssignModal, setOpenExitInterviewAssignModal] =
    useState(false);
  const [openExitInterviewDataViewModal, setOpenExitInterviewDataViewModal] =
    useState(false);

  const [rowDto, setRowDto] = useState([]);
  const [id, setId] = useState(null);
  const [empId, setEmpId] = useState(null);
  const [questionId, setQuestionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = (pagination, searchText) => {
    const fromDate = formatDate(
      form.getFieldValue("fromDate") || defaultFromDate
    );
    const toDate = formatDate(form.getFieldValue("toDate") || defaultToDate);
    getExitInterviewLanding(
      "ExitInterview",
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

  useEffect(() => {
    getExitInterviewLanding(
      "ExitInterview",
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
          <div className="d-flex justify-content-between">
            <PButton
              size="small"
              type="primary"
              icon={<FilterAltOutlined />}
              content={"Filter"}
              onClick={() => {
                setOpenFilter(true);
              }}
            />
            <SearchFilter form={form} pages={pages} getData={getData} />
          </div>
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
                      form.validateFields().then(() => {
                        getData(pages, values?.search);
                      });
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
          <div className="mt-3">
            {rowDto?.length > 0 ? (
              <>
                <PeopleDeskTable
                  customClass="iouManagementTable"
                  columnData={getExitInterviewLandingTableColumn(
                    pages?.current,
                    pages?.pageSize,
                    setOpenExitInterviewAssignModal,
                    setOpenExitInterviewDataViewModal,
                    setId,
                    setEmpId,
                    setQuestionId
                  )}
                  pages={pages}
                  rowDto={rowDto || []}
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
                />
                <PModal
                  title="Assign Exit Interview"
                  open={openExitInterviewAssignModal}
                  onCancel={() => {
                    getExitInterviewLanding(
                      "ExitInterview",
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
                    setOpenExitInterviewAssignModal(false);
                  }}
                  components={<ExitInterviewAssign id={id} empId={empId} />}
                  width={1000}
                />
                <PModal
                  title="Exit Interview"
                  open={openExitInterviewDataViewModal}
                  onCancel={() => {
                    getExitInterviewLanding(
                      "ExitInterview",
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
                    setOpenExitInterviewDataViewModal(false);
                  }}
                  components={
                    <ExitInterviewDataView
                      id={id}
                      empId={empId}
                      questionId={questionId}
                    />
                  }
                  width={1000}
                />
              </>
            ) : (
              <>{!loading && <NoResult title="No Result Found" para="" />}</>
            )}
          </div>
        </div>
      ) : (
        <NotPermittedPage />
      )}
    </>
  );
}

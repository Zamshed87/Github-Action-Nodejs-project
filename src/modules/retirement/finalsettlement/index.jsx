import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Col, Drawer, Form, Row } from "antd";
import PeopleDeskTable, { paginationSize } from "common/peopleDeskTable";
import {
  formatDate,
  getFinalSettlementLanding,
  getFinalSettlementLandingTableColumn,
  SearchFilter,
  statusDDL,
} from "./helper";
import Loading from "common/loading/Loading";
import { PButton, PForm, PInput, PSelect } from "Components";
import { FilterAltOutlined } from "@mui/icons-material";
import { PModal } from "Components/Modal";
import NoResult from "common/NoResult";
import NotPermittedPage from "common/notPermitted/NotPermittedPage";
import useAxiosPost from "utility/customHooks/useAxiosPost";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";

export default function FinalSettlementLanding() {
  const {
    profileData: { buId, wgId, wId },
    permissionList,
    tokenData,
  } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30546) {
      permission = item;
    }
  });

  const decodedToken = tokenData
    ? JSON.parse(atob(tokenData.split(".")[1]))
    : null;

  const dispatch = useDispatch();

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
  const [openExitInterviewDataViewModal, setOpenExitInterviewDataViewModal] =
    useState(false);
  const [, postClearanceData] = useAxiosPost();

  const [rowDto, setRowDto] = useState([]);
  const [id, setId] = useState(null);
  const [empId, setEmpId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = (pagination, searchText) => {
    const fromDate = formatDate(
      form.getFieldValue("fromDate") || defaultFromDate
    );
    const toDate = formatDate(form.getFieldValue("toDate") || defaultToDate);
    getFinalSettlementLanding(
      "FinalSettlement",
      buId,
      wgId,
      fromDate,
      toDate,
      values?.status || "",
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
    dispatch(setFirstLevelNameAction("Retirement"));
    document.title = "Final Settlement";
  }, [dispatch]);

  useEffect(() => {
    getFinalSettlementLanding(
      "FinalSettlement",
      buId,
      wgId,
      values?.filterFromDate || "",
      values?.filterToDate || "",
      values?.status?.value || "",
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
                status: "",
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
                  />
                </Col>
                <Col md={12} sm={24}>
                  <PSelect
                    style={{ marginBottom: "5px" }}
                    options={statusDDL || []}
                    name="workplaceGroup"
                    label={"Workplace Group"}
                    showSearch
                    placeholder="Workplace Group"
                    onChange={(value) => {
                      form.setFieldValue({
                        status: value,
                      });
                    }}
                  />
                </Col>
                <Col md={12} sm={24}>
                  <PSelect
                    style={{ marginBottom: "5px" }}
                    options={statusDDL || []}
                    name="workplace"
                    label={"Workplace"}
                    showSearch
                    placeholder="Workplace"
                    onChange={(value) => {
                      form.setFieldValue({
                        status: value,
                      });
                    }}
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
                  columnData={getFinalSettlementLandingTableColumn(
                    pages?.current,
                    pages?.pageSize,
                    postClearanceData,
                    setOpenExitInterviewDataViewModal,
                    getData,
                    id,
                    setId,
                    empId,
                    setEmpId
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
                  isScrollAble={true}
                />
                <PModal
                  title="Exit Interview"
                  open={openExitInterviewDataViewModal}
                  onCancel={() => {
                    getFinalSettlementLanding(
                      "FinalSettlement",
                      buId,
                      wgId,
                      values?.filterFromDate || "",
                      values?.filterToDate || "",
                      values?.status?.value || "",
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
                  components={<></>}
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

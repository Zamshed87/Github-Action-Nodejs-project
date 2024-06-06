import { CircularProgress } from "@mui/material";
import { APIUrl } from "App";
import {
  DataTable,
  PButton,
  PCard,
  PCardHeader,
  PForm,
  PInput,
  PSelect,
} from "Components";
import { useApiRequest } from "Hooks";
import { Col, Form, Modal, Row } from "antd";
import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import moment from "moment";
import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import DemoImg from "../../../assets/images/demo.png";
import { dateFormatter, monthFirstDate, monthLastDate } from "utility/dateFormatter";
import NoResult from "common/NoResult";
import { gray500 } from "utility/customColor";
import Loading from "common/loading/Loading";
import withMovementContainer from "common/HOCMovement/movementContainer";
import MovementApplicationForm from "common/HOCMovement/component/MovementApplicationForm";
import EmployeeHeaderInfo from "common/HOCMovement/component/EmployeeHeaderInfo";
import { todayDate } from "utility/todayDate";

type TEmMovementApplication = any;
const EmMovementApplication: React.FC<TEmMovementApplication> = (props) => {
  // Data From Store
  //   const { orgId, buId, wgId, wId, employeeId } = useSelector(
  //     (state: any) => state?.auth?.profileData,
  //     shallowEqual
  //   );
  const dispatch = useDispatch();

  // States
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Movement Application";
  }, []);

  const {
    allData,
    singleData,
    moveHistoryData,

    employeeInfo,
    isEdit,
    isFilter,
    movementTypeDDL,
    loading,
    progress,
    loadingForInfo,

    getEmpInfoDetails,
    demoPopupForDelete,
    saveHandler,
    searchData,
    getData,
    setSingleData,
    setImageFile,
    setIsEdit,
    setIsFilter,
    setLoading,
    setMoveHistoryData,
    userName,
    employeeId,
    setEmployeeInfo,
    orgId,
    buId,
    setAllData,
    wgId,
    permission,
    isOfficeAdmin,
    // demoPopupForDeleteAdmin,
    empMgmtMoveApplicationDto,
    showTooltip,
    setShowTooltip,
    handleIconHover,
    getMovementHistortyForTable
  } = props?.propjObj;
  // Form Instance
  const [form] = Form.useForm();

  // Api Actions
  const CommonEmployeeDDL = useApiRequest([]);

  // Life Cycle Hooks
  useEffect(() => {
    // const { empSearchType, date, employee } = form.getFieldsValue(true);
    // empSearchType && date && employee();
  }, [buId, wgId]);

  const getEmployee = (value: any) => {
    if (value?.length < 2) return CommonEmployeeDDL?.reset();

    CommonEmployeeDDL?.action({
      urlKey: "CommonEmployeeDDL",
      method: "GET",
      params: {
        businessUnitId: buId,
        workplaceGroupId: wgId,
        // workplaceId: wId,
        searchText: value,
      },
      onSuccess: (res) => {
        res.forEach((item: any, i: number) => {
          res[i].label = item?.employeeName;
          res[i].value = item?.employeeId;
        });
      },
    });
  };

  const values = form.getFieldsValue(true);
  console.log(values)
  return (
    <PForm
      form={form}
      initialValues={{
        employee: {
          value: loadingForInfo
            ? ""
            : employeeInfo?.[0]?.EmployeeId || employeeId,
          label: loadingForInfo
            ? ""
            : employeeInfo?.[0]?.EmployeeName || userName,
        },
        year: moment().format("YYYY"),
        movementFromDate: moment(monthFirstDate()),
        movementToDate: moment(monthLastDate()),
      }}
    >
      {loading && <Loading />}

      <PCard>
        <PCardHeader
          title={
            <EmployeeHeaderInfo
              employeeInfo={employeeInfo}
              loadingForInfo={loadingForInfo}
              progress={progress}
            />
          }
        >
          <Form.Item shouldUpdate noStyle>
            {() => {
               const values = form.getFieldsValue(true);
              return (
                <Row gutter={[10, 2]} style={{ width: "500px" }}>
                  <Col md={24} sm={12} xs={24}>
                    <PSelect
                      name="employee"
                      placeholder="Search Min 2 char"
                      options={CommonEmployeeDDL?.data || []}
                      loading={CommonEmployeeDDL?.loading}
                      onChange={(value, op) => {
                        form.setFieldsValue({
                          employee: op,
                        });
                        getEmpInfoDetails(value);
                        getData(value);
                        getMovementHistortyForTable({
                          ...values,
                          employee: op,
                        });
                      }}
                      onSearch={(value) => {
                        getEmployee(value);
                      }}
                      showSearch
                      filterOption={false}
                      allowClear
                    />
                  </Col>
                </Row>
              );
            }}
          </Form.Item>
        </PCardHeader>
        {/* style={{ marginTop: "-5.7rem" }} */}
        <Row gutter={[10, 2]}>
          <Col md={24} sm={12} xs={24} className="leave-movement-FormCard">
            <MovementApplicationForm
              propsObj={{
                saveHandler,
                singleData,
                values: form.getFieldsValue(true),
                homeReset: form.resetFields,

                setMoveHistoryData,
                isEdit,
                setIsEdit,
                setSingleData,
                movementTypeDDL,
                setLoading,
                loading,
                editPermission: permission?.isEdit,
              }}
            />
          </Col>

          <Col
            md={24}
            sm={12}
            xs={24}
            style={{
              marginTop: "23px",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <h2 style={{ color: gray500, fontSize: "14px" }}>
                Movement List
              </h2>

              <PInput
                // label="Reason"
                name={"search"}
                type="text"
                placeholder="search"
                onChange={(e: any) => {
                  searchData(e.target.value, allData, setMoveHistoryData);
                }}
              />
            </div>
          </Col>
          <Col
            md={24}
            sm={12}
            xs={24}
            style={{
              marginTop: "10px",
            }}
          >
            <div className="card-style py-3">
              <Row gutter={[10, 2]}>
                <Form.Item shouldUpdate noStyle>
                  {() => {
                    return (
                      <>
                        <Col md={8} sm={12} xs={24}>
                          <PInput
                            type="date"
                            name="movementFromDate"
                            label="Movement From Date"
                            placeholder="From Date"
                          />
                        </Col>
                        <Col md={8} sm={12} xs={24}>
                          <PInput
                            type="date"
                            name="movementToDate"
                            label="Movement To Date"
                            placeholder="To Date"
                          />
                        </Col>
                        <Col
                          md={8}
                          sm={12}
                          xs={24}
                          style={{
                            marginTop: "23px",
                          }}
                        >
                          <PButton
                            type="primary"
                            content={"View"}
                            action="button"
                            onClick={() => {
                              const values = form.getFieldsValue(true);
                              getMovementHistortyForTable(values)
                              // form.resetFields();
                            }}
                          />
                        </Col>
                      </>
                    );
                  }}
                </Form.Item>
              </Row>
            </div>
          </Col>
          <Col md={24} sm={12} xs={24}>
            <div className="table-responsive mt-2" style={{ height: "190px" }}>
              {moveHistoryData?.length > 0 ? (
                <DataTable
                  header={empMgmtMoveApplicationDto(
                    handleIconHover,
                    setIsEdit,
                    setSingleData,
                    setLoading,
                    demoPopupForDelete,
                    form.getFieldsValue(true),
                    setShowTooltip,
                    showTooltip
                  )}
                  data={moveHistoryData?.length > 0 ? moveHistoryData : []}
                />
              ) : (
                <>{!loading && <NoResult title="No Result Found" para="" />}</>
              )}
            </div>
          </Col>

          <Col
            style={{
              marginTop: "23px",
            }}
          ></Col>
        </Row>
      </PCard>
    </PForm>
  );
};

export default withMovementContainer(EmMovementApplication);

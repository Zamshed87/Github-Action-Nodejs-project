import { CircularProgress } from "@mui/material";
import { APIUrl } from "App";
import {
  DataTable,
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
import { dateFormatter } from "utility/dateFormatter";
import NoResult from "common/NoResult";
import { gray500 } from "utility/customColor";
import Loading from "common/loading/Loading";
import movementContainer from "common/HOCMovement/movementContainer";
import MovementApplicationForm from "common/HOCMovement/component/MovementApplicationForm";

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
      }}
    >
      {loading && <Loading />}

      <PCard>
        <PCardHeader>
          <div style={{ width: "500px" }}>
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
              }}
              onSearch={(value) => {
                getEmployee(value);
              }}
              showSearch
              filterOption={false}
            />
          </div>
        </PCardHeader>
        <Row gutter={[10, 2]} style={{ marginTop: "-5.7rem" }}>
          <div className="table-card">
            <div
              //   ref={scrollRef}
              className="table-card-heading pb-1 pr-0"
            >
              <div className="employeeInfo d-flex align-items-center  ml-lg-0 ml-md-4">
                {loadingForInfo && (
                  <CircularProgress
                    variant="determinate"
                    value={progress}
                    sx={{ marginRight: "5px" }}
                    color="success"
                    size={25}
                  />
                )}
                {!loadingForInfo && employeeInfo?.[0]?.strProfileImageUrl ? (
                  <img
                    src={
                      employeeInfo?.[0]?.strProfileImageUrl
                        ? `${APIUrl}/Document/DownloadFile?id=${employeeInfo?.[0]?.strProfileImageUrl}`
                        : DemoImg
                    }
                    alt="Profile"
                    style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  !loadingForInfo && (
                    <img
                      src={DemoImg}
                      alt="Profile"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  )
                )}
                <div className="employeeTitle ml-2 ">
                  <p className="employeeName">
                    {!loadingForInfo && employeeInfo?.[0]?.EmployeeName
                      ? employeeInfo?.[0]?.EmployeeName
                      : ""}
                  </p>
                  <p className="employeePosition">
                    {!loadingForInfo && employeeInfo?.[0]?.DesignationName
                      ? `${employeeInfo?.[0]?.DesignationName}, ${employeeInfo?.[0]?.EmployeeCode}`
                      : ""}
                    {!loadingForInfo && employeeInfo?.[0]?.DesignationName
                      ? `, Joining Date:  ${dateFormatter(
                          employeeInfo?.[0]?.JoiningDate
                        )}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            <Row gutter={[10, 2]} className=" justify-content-center">
              <Col
                md={24}
                className="leave-movement-FormCard"
                style={{ marginTop: "-3.4rem" }}
              >
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
            </Row>
            <div className="row">
              <div className="col-md-12 my-3">
                <div className="table-card-body pl-lg-1 pl-md-3">
                  <div>
                    <div className="d-flex align-items-center justify-content-between">
                      <h2 style={{ color: gray500, fontSize: "14px" }}>
                        Leave List
                      </h2>
                      {/* <MasterFilter
                                isHiddenFilter
                                styles={{
                                  marginRight: "0px",
                                }}
                                width="200px"
                                inputWidth="200px"
                                value={values?.search}
                                setValue={(value) => {
                                  searchData(
                                    value,
                                    allData,
                                    setLeaveHistoryData
                                  );
                                  setFieldValue("search", value);
                                }}
                                cancelHandler={() => {
                                  getData();
                                  setFieldValue("search", "");
                                }}
                                handleClick={handleClick}
                              /> */}
                      <PInput
                        // label="Reason"
                        name={"search"}
                        type="text"
                        placeholder="search"
                        onChange={(e: any) => {
                          searchData(
                            e.target.value,
                            allData,
                            setMoveHistoryData
                          );
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className=" table-responsive mt-2"
                    style={{ height: "190px" }}
                  >
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
                        data={
                          moveHistoryData?.length > 0 ? moveHistoryData : []
                        }
                      />
                    ) : (
                      <>
                        {!loading && (
                          <NoResult title="No Result Found" para="" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* </>
              );
            }}
          </Form.Item> */}

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

export default movementContainer(EmMovementApplication);

/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from "@material-ui/core";
import { AddOutlined, ModeEditOutlineOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntTable from "../../../../common/AntTable";
import { getPeopleDeskAllLanding } from "../../../../common/api";
import FormikSelect from "../../../../common/FormikSelect";
import Loading from "../../../../common/loading/Loading";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import ViewModal from "../../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { yearDDLAction } from "../../../../utility/yearDDL";
import "../style.css";
import CreateYearlyPolicyModal from "./CreateYearlyPolicyModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useApiRequest } from "../../../../Hooks";
import { getYearlyPolicyLanding } from "./helper";

let date = new Date();
let currentYear = date.getFullYear();

const initData = {
  year: { value: currentYear, label: currentYear },
};

const YearlyLeavePolicy = () => {
  const policyLanding = useApiRequest([]);

  const [show, setShow] = useState(false);
  const [allPolicy, setAllPolicy] = useState([]);
  const [landingData, setLandingData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [sortType, setSortType] = useState("desc");
  const history = useHistory();

  const [, setYear] = useState(null);

  const saveHandler = (values, cb) => {};
  const [loading, setLoading] = useState(false);

  const { orgId, buId, wgId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (year) => {
    getPeopleDeskAllLanding(
      "EmploymentTypeWiseLeaveBalance",
      orgId,
      buId,
      0,
      setLandingData,
      setAllData,
      setLoading,
      "",
      year ? year : formikRef?.current?.values?.year?.value,
      `${wgId}&strWorkplace=${wId}`
    );
  };

  // const filterData = (year) => {
  //   let data = [];
  //   data = allData.filter((item) => item?.YearId == year);
  //   setLandingData(data);
  // };

  // eslint-disable-next-line no-unused-vars
  const sortData = (sortBy, isNumber) => {
    setSortType(sortType === "desc" ? "asc" : "desc");
    let newData = [...landingData];
    newData.sort((a, b) => {
      if (sortType === "desc") {
        return isNumber
          ? b?.[sortBy] - a?.[sortBy]
          : b?.[sortBy]?.localeCompare(a?.[sortBy]);
      } else {
        return isNumber
          ? a?.[sortBy] - b?.[sortBy]
          : a?.[sortBy]?.localeCompare(b?.[sortBy]);
      }
    });
    setLandingData(newData);
  };

  useEffect(() => {
    getYearlyPolicyLanding(
      `/SaasMasterData/AllLeavePolicyLanding?businessUnitId=${buId}&PageNo=${1}&PageSize=${100}&IsForXl=false`,
      setAllPolicy
    );
  }, [orgId, buId, wgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  console.log({ allPolicy });
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 38) {
      permission = item;
    }
  });

  const columns = [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
      width: 20,
    },
    {
      title: "Employment Type",
      dataIndex: "EmploymentTypeName",
      sorter: true,
      filter: false,
    },
    {
      title: "Leave Type",
      dataIndex: "LeaveTypeName",
      sorter: true,
      filter: false,
    },
    {
      title: "Workplace Group",
      dataIndex: "strWorkplaceGroup",
      sorter: true,
      filter: false,
    },
    {
      title: "Workplace",
      dataIndex: "strWorkplace",
      sorter: true,
      filter: false,
    },
    {
      title: "Days",
      dataIndex: "AllocatedLeave",
      sorter: true,
      filter: false,
    },
    {
      title: "",
      dataIndex: "",
      render: (_, item) => (
        <div
          onClick={(e) => {
            if (!permission?.isEdit)
              return toast.warn("You don't have permission");
            e.stopPropagation();
            setShow(true);
            setSingleData({
              businessUnit: [
                {
                  value: item?.BusinessUnitId,
                  label: item?.strBusinessUnit,
                },
              ],
              workplaceGroup: [
                {
                  value: item?.intWorkplaceGroupId,
                  label: item?.strWorkplaceGroup,
                },
              ],
              workplace: [
                {
                  value: item?.intWorkplaceId,
                  label: item?.strWorkplace,
                },
              ],
              year: {
                value: item?.YearId,
                label: item?.YearId,
              },
              employmentType: {
                value: item?.EmploymentTypeId,
                label: item?.EmploymentTypeName,
              },
              leaveType: {
                value: item?.LeaveTypeId,
                label: item?.LeaveTypeName,
              },
              gender: {
                value: item?.GenderId,
                label: item?.GenderName,
              },
              days: item?.AllocatedLeave,
              autoId: item?.AutoId,
            });
          }}
        >
          <Tooltip title="Edit" arrow>
            <Avatar className="edit-icon-btn">
              <ModeEditOutlineOutlined
                sx={{
                  color: "rgba(0, 0, 0, 0.6)",
                }}
              />
            </Avatar>
          </Tooltip>
        </div>
      ),
      sorter: false,
      filter: false,
    },
  ];
  const formikRef = useRef();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
        innerRef={formikRef}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card approval-pipeline">
                  <div className="table-card-heading">
                    <div></div>
                    <ul className="d-flex flex-wrap">
                      <li>
                        <FormikSelect
                          name="year"
                          options={yearDDLAction(5, 10)}
                          value={values?.year}
                          label=""
                          isClearable={false}
                          onChange={(valueOption) => {
                            if (valueOption?.value) {
                              getData(valueOption?.value);
                              // filterData(valueOption?.value);
                            } else {
                              setLandingData({ Result: allData });
                            }
                            setFieldValue("year", valueOption);
                            setYear(valueOption?.value);
                          }}
                          placeholder="Year"
                          styles={customStyles}
                          errors={errors}
                          touched={touched}
                          isDisabled={false}
                        />
                      </li>
                      <li>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center"
                          label={"Leave policy"}
                          icon={
                            <AddOutlined
                              sx={{
                                marginRight: "0px",
                                fontSize: "15px",
                              }}
                            />
                          }
                          onClick={(e) => {
                            if (!permission?.isCreate)
                              return toast.warn("You don't have permission");
                            setSingleData({});
                            // setShow(true);
                            history.push(
                              "/administration/leaveandmovement/yearlyLeavePolicy/create"
                            );
                          }}
                          style={{ marginLeft: "16px" }}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
                    <div className="approval-table">
                      <h5
                        style={{
                          fontSize: "15px",
                          color: "rgba(0, 0, 0, 0.6)",
                          fontWeight: "600",
                        }}
                      >
                        Year {values?.year ? values?.year.label : currentYear}
                      </h5>
                      <div className="table-card-styled tableOne">
                        <AntTable data={landingData} columnsData={columns} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}

              {/* Create Yearly Leave Policy Modal */}
            </Form>
          </>
        )}
      </Formik>
      <ViewModal
        size="lg"
        title="Create yearly leave policy"
        backdrop="static"
        classes="default-modal preview-modal"
        show={show}
        onHide={() => setShow(false)}
      >
        <CreateYearlyPolicyModal
          getData={getData}
          singleData={singleData}
          setShow={setShow}
        />
      </ViewModal>
    </>
  );
};

export default YearlyLeavePolicy;

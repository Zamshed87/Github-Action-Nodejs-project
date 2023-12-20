import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "./../../../../common/loading/Loading";
import PrimaryButton from "../../../../common/PrimaryButton";
import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
  SearchOutlined,
  EditOutlined,
} from "@mui/icons-material";
import ViewModal from "../../../../common/ViewModal";
import { useHistory } from "react-router";
import HolidayGroupModal from "./addEditForm";
import ResetButton from "./../../../../common/ResetButton";
import FormikInput from "./../../../../common/FormikInput";
import NoResult from "./../../../../common/NoResult";
import "./styles.css";
import { Tooltip } from "@mui/material";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import { toast } from "react-toastify";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { getHolidaySetupLanding } from "./helper";
import AntTable from "../../../../common/AntTable";

const initData = {
  search: "",
};

export default function HolidaySetup() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  // row Data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  // modal
  const [isHolidayGroup, setIsHolidayGroup] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    document.title = "Holiday Setup";
  }, []);

  const handleClose = () => {
    setIsHolidayGroup(false);
  };

  const { orgId, buId, wId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  useEffect(() => {
    getHolidaySetupLanding(
      "HolidayGroup",
      orgId,
      buId,
      "",
      setRowDto,
      setAllData,
      setLoading,
      wId
    );
  }, [orgId, buId, wId]);

  // search
  const filterData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      let newDta = allData?.filter((item) =>
        regex.test(item?.HolidayGroupName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  const saveHandler = (values) => {};

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 39) {
      permission = item;
    }
  });

  const columns = () => {
    return [
      {
        title: "SL",
        render: (text, record, index) => index + 1,
        sorter: false,
        filter: false,
        className: "text-center",
        width: "30px",
      },
      {
        title: "Holiday Group",
        dataIndex: "HolidayGroupName",
        sorter: true,
        filter: true,
      },
      {
        title: "Year",
        dataIndex: "Year",
        className: "text-center",
        sorter: true,
        filter: false,
        isNumber: true,
      },
      {
        title: "No. of Days",
        dataIndex: "noOfDays",
        className: "text-center",
        width: 200,
        render: (_, record) => (
          <div className="text-center">
            <div>{record?.noOfDays}</div>
          </div>
        ),
        sorter: true,
        filter: false,
        isNumber: true,
      },
      {
        className: "text-center",
        width: 100,
        render: () => (
          <div className="d-flex justify-content-center">
            <Tooltip title="Edit" arrow>
              <button className="iconButton" type="button">
                <EditOutlined onClick={() => {}} />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ];
  };

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
                <div className="table-card holidaySetup">
                  <div className="table-card-heading">
                    <div className="total-result">
                      {rowDto?.length > 0 ? (
                        <>
                          <h6
                            style={{
                              fontSize: "14px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            Total {rowDto?.length} items
                          </h6>
                        </>
                      ) : (
                        <>
                          <small>Total result 0</small>
                        </>
                      )}
                    </div>
                    <ul className="d-flex flex-wrap">
                      {values?.search && (
                        <li>
                          <ResetButton
                            title="reset"
                            icon={
                              <SettingsBackupRestoreOutlined
                                sx={{
                                  marginRight: "10px",
                                  fontSize: "18px",
                                }}
                              />
                            }
                            onClick={() => {
                              setRowDto(allData);
                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
                      <li style={{ marginRight: "24px" }}>
                        <FormikInput
                          classes="search-input fixed-width"
                          inputClasses="search-inner-input"
                          placeholder="Search"
                          value={values?.search}
                          name="search"
                          type="text"
                          trailicon={
                            <SearchOutlined
                              sx={{
                                color: "#323232",
                                fontSize: "18px",
                              }}
                            />
                          }
                          onChange={(e) => {
                            filterData(e.target.value, allData, setRowDto);
                            setFieldValue("search", e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </li>
                      <li>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center"
                          label={"Holiday group"}
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
                            e.stopPropagation();
                            setIsHolidayGroup(true);
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {rowDto?.length > 0 ? (
                        <>
                          <AntTable
                            data={rowDto?.length > 0 && rowDto}
                            columnsData={columns()}
                            onRowClick={(dataRow) => {
                              if (!permission?.isEdit)
                                return toast.warn("You don't have permission");
                              history.push({
                                pathname: `/administration/timeManagement/holidaySetup/${dataRow?.HolidayGroupId}`,
                                state: { holidayItem: dataRow },
                              });
                            }}
                          />
                        </>
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
              ) : (
                <NotPermittedPage />
              )}

              {/* addEditForm */}
              <ViewModal
                show={isHolidayGroup}
                title={"Create Holiday Group Name"}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                classes="default-modal form-modal"
              >
                <HolidayGroupModal
                  onHide={handleClose}
                  setRowDto={setRowDto}
                  setAllData={setAllData}
                  setLoading={setLoading}
                />
              </ViewModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

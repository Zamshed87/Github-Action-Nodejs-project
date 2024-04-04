import React, { useEffect, useState } from "react";
import MasterFilter from "../../../common/MasterFilter";
import AntTable from "../../../common/AntTable";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import NoResult from "../../../common/NoResult";
import Loading from "../../../common/loading/Loading";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import { toast } from "react-toastify";
import IConfirmModal from "../../../common/IConfirmModal";
import {
  deleteFinalSettlement,
  finalSettlementColumns,
  getFinalSettlementLanding,
  statusDDL,
} from "./utility/utils";
import { customStyles } from "utility/selectCustomStyle";
import FormikSelect from "common/FormikSelect";
import { useFormik } from "formik";
import { PModal } from "Components/Modal";
import ManagementSeparationHistoryView from "../separation/mgmApplication/viewForm/ManagementSeparationHistoryView";

const initData = {
  status: { value: 0, label: "All" },
};

const FinalSettlement = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30398) {
      permission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState(null);
  const [type, setType] = useState(null);
  const [empId, setEmpId] = useState(null);

  // useFormik
  const { setFieldValue, values, handleSubmit, errors, touched } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    // onSubmit: (values, { setSubmitting, resetForm }) => {},
  });

  const searchData = (keywords) => {
    try {
      if (!keywords) {
        setRowDto(allData);
        return;
      }
      setLoading(true);
      const regex = new RegExp(keywords?.toLowerCase());
      const newData = allData?.filter(
        (item) =>
          regex.test(item?.strEmployeeName?.toLowerCase()) ||
          regex.test(item?.strEmployeeCode?.toLowerCase())
      );
      setRowDto(newData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setRowDto([]);
    }
  };

  const getData = () => {
    getFinalSettlementLanding(orgId, buId, values?.status?.value || 0, setRowDto, setLoading, setAllData);
  };

  const demoPopup = (stlmntId) => {
    const confirmObject = {
      closeOnClickOutside: false,
      message: "Are you want to sure you delete this data?",
      yesAlertFunc: () => {
        const callback = () => {
          getData();
        };
        deleteFinalSettlement(
          orgId,
          buId,
          stlmntId,
          employeeId,
          setLoading,
          callback
        );
      },
      noAlertFunc: () => {
        //   history.push("/components/dialogs")
      },
    };
    IConfirmModal(confirmObject);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  return permission?.isView ? (
    <>
      {loading && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card">
          <div className="table-card-heading" style={{ marginBottom: "2px" }}>
            <div className="d-flex align-items-center">
              {rowDto?.length > 0 ? (
                <h6 className="count">Total {rowDto?.length} employees</h6>
              ) : (
                <h6 className="count">Total result 0</h6>
              )}
            </div>
            <ul className="d-flex flex-wrap">
              <li>
                <MasterFilter
                  styles={{
                    marginRight: "10px",
                  }}
                  inputWidth="200px"
                  width="200px"
                  value={searchString}
                  setValue={(value) => {
                    setSearchString(value);
                    searchData(value);
                  }}
                  cancelHandler={() => {
                    setSearchString("");
                  }}
                  isHiddenFilter
                  placeholder="Employee Name or ID"
                />
              </li>
              {/* <li>
                <PrimaryButton
                  customStyle={{ minWidth: "150px" }}
                  type="button"
                  className="btn btn-green flex-center"
                  label={"Make Clearance"}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!permission?.isCreate)
                      return toast.warn("You don't have permission");
                    history.push(`/profile/finalSettlement/create`);
                  }}
                />
              </li> */}
            </ul>
          </div>
          <div className="card-style pb-0 mb-2" style={{ marginTop: "12px" }}>
            <div className="row">
              <div className="col-lg-3">
                <div className="input-field-main">
                  <label>Status</label>
                  <FormikSelect
                    classes="input-sm"
                    name="status"
                    options={statusDDL || []}
                    value={values?.status}
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption);
                    }}
                    placeholder="Select Status"
                    styles={customStyles}
                    errors={errors}
                    touched={touched}
                    isClearable={true}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <button
                  className="btn btn-green btn-green-disable mt-4"
                  type="button"
                  disabled={!values?.status}
                  onClick={() => {
                    getData();
                  }}
                >
                  View
                </button>
              </div>
            </div>
          </div>
          <div className="table-card-body">
            <div className="table-card-styled tableOne">
              {rowDto?.length > 0 ? (
                <div className="table-card-styled employee-table-card tableOne">
                  <AntTable
                    data={rowDto}
                    columnsData={finalSettlementColumns(
                      demoPopup,
                      history,
                      orgId,
                      buId,
                      setLoading,
                      setId,
                      setOpenModal,
                      setType,
                      setEmpId
                    )}
                    rowClassName="pointer"
                    onRowClick={(record) => {
                      history.push(
                        `/profile/finalSettlement/view/${record?.intFinalSettlementId}`,
                        { employeeId: record?.intEmployeeId }
                      );
                    }}
                    rowKey={(record) => record?.intFinalSettlementId}
                  />
                  <PModal
                    title={`Full & Final Settlement`}
                    open={openModal}
                    onCancel={() => {
                      setOpenModal(false);
                    }}
                    components={
                      <ManagementSeparationHistoryView id={id} type={type} empId={empId} />
                    }
                    width={1000}
                  />
                </div>
              ) : (
                <>{!loading && <NoResult title="No Result Found" para="" />}</>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default FinalSettlement;

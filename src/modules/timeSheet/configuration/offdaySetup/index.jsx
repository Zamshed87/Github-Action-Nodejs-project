import {
  AddOutlined,
  SearchOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import AntTable from "../../../../common/AntTable";
import { getPeopleDeskAllLanding } from "../../../../common/api";
import FormikInput from "../../../../common/FormikInput";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import ResetButton from "../../../../common/ResetButton";
import ViewModal from "../../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import RosterSetupCreate from "./addEditForm";
import "./styles.css";

const initData = {
  search: "",
};

export default function OffdaySetup() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  // modal state
  const [isRosterSetup, setIsRosterSetup] = useState(false);

  // row Data
  const [rowDto, setRowDto] = useState([]);
  const [allData, setAllData] = useState([]);

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    getPeopleDeskAllLanding(
      "OffdayGroup",
      orgId,
      buId,
      "",
      setRowDto,
      setAllData,
      setLoading
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, buId]);

  // search
  const filterData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      const newDta = allData?.filter((item) =>
        regex.test(item?.strOffdayGroupName?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 128) {
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
        width: 30,
      },
      {
        title: "Offday Name",
        dataIndex: "strOffdayGroupName",
        sorter: true,
        filter: true,
      },
      {
        title: "Created By",
        dataIndex: "strCreatedBy",
        sorter: true,
        filter: true,
      },
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              {permission?.isView ? (
                <div className="table-card roster-setup-main">
                  <div className="table-card-heading">
                    <div className="total-result">
                      {rowDto?.length > 0 ? (
                        <>
                          <h6 className="count">
                            Total {rowDto?.length} results
                          </h6>
                        </>
                      ) : (
                        <>
                          <h6 className="count">Total result 0</h6>
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
                          label={"Offday Setup"}
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
                            setIsRosterSetup(true);
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

                              history.push(
                                `/administration/timeManagement/offdaySetup/${dataRow?.intOffdayGroupId}/${dataRow?.strOffdayGroupName}`
                              );
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

                    <ViewModal
                      show={isRosterSetup}
                      title={"Create Offday Setup"}
                      onHide={() => setIsRosterSetup(false)}
                      size="lg"
                      backdrop="static"
                      classes="default-modal form-modal"
                    >
                      <RosterSetupCreate
                        setIsRosterSetup={setIsRosterSetup}
                        getData={getData}
                      />
                    </ViewModal>
                  </div>
                </div>
              ) : (
                <NotPermittedPage />
              )}
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

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

export default function RosterSetup() {
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
      "RosterGroup",
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
      let newDta = allData?.filter((item) =>
        regex.test(item?.RosterGroupName?.toLowerCase())
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
    if (item?.menuReferenceId === 42) {
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
        title: "Roster Name",
        dataIndex: "RosterGroupName",
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
                <div className="table-card roster-setup-main">
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
                            Total {rowDto?.length} results
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
                          label={"Roster Setup"}
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
                                `/administration/timeManagement/rosterSetup/${dataRow?.RosterGroupId}/${dataRow?.RosterGroupName}`
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
                      title={"Create Roster Setup"}
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

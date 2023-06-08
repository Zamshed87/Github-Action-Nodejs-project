import React, { useRef, useState } from "react";
import TreeView from "./components/TreeView";
import Loading from "../../../common/loading/Loading";
import TableView from "./components/TableView";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { getPeopleDeskAllDDL } from "../../announcement/helper";
import "./style.css";
import { getTableViewLanding } from "./helper";
import { useFormik } from "formik";

const tabName = [
  { name: "Tree View", noLeftRadius: false, noRadius: false },
  { name: "Table View", noLeftRadius: false, noRadius: true },
];

const initialValues = {
  parentTerritory: "",
  territoryType: "",
};

const TerritorySetup = () => {
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [filterIndex, setFilterIndex] = useState(0);
  const [territoryType, setTerritoryType] = useState([]);
  const [tableViewLandingDto, setTableViewLandingDto] = useState([]);

  const { values, errors, touched, setFieldValue, handleSubmit, resetForm } =
    useFormik({
      initialValues,
      onSubmit: (values) => {
        viewHandler(values);
      },
    });

  const getData = (parentTT, teritoryType) => {
    getTableViewLanding(
      setTableViewLandingDto,
      setLoading,
      orgId,
      buId,
      parentTT || "",
      teritoryType || ""
    );
  };

  const viewHandler = (values) => {
    getData(values?.parentTerritory?.value, values?.territoryType?.value);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const scrollRef = useRef();
  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30373) {
      permission = item;
    }
  });

  useEffect(() => {
    getPeopleDeskAllDDL(
      `/SaasMasterData/GetAllTerritoryType?accountId=${orgId}&businessUnitId=${buId}`,
      "intTerritoryTypeId",
      "strTerritoryType",
      setTerritoryType
    );
  }, [orgId, buId]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, [dispatch]);

  return permission?.isView ? (
    <>
      {loading && <Loading />}
      <div className="table-card">
        <div className="table-card-heading  mt-2" ref={scrollRef}>
          <h2>Territory Setup</h2>
        </div>
        <div className="table-card-body" style={{ marginTop: "16px" }}>
          <div className="custom-button-group">
            {tabName.map((item, i) => {
              return (
                <button
                  key={i}
                  type="button"
                  className={`btn-single-groupe ${
                    i === filterIndex && "btn-single-groupe-active"
                  } ${item?.noRadius && "not-radius"} ${
                    item?.noLeftRadius && "no-left-radius"
                  }`}
                  onClick={() => {
                    setFilterIndex(i);
                    if (filterIndex === 1) {
                      getData();
                      resetForm();
                    }
                  }}
                >
                  {item?.name}
                </button>
              );
            })}
          </div>
          <div>
            <TreeView
              index={filterIndex}
              tabIndex={0}
              loading={loading}
              setLoading={setLoading}
              territoryType={territoryType}
              permission={permission}
              getTableViewLanding={getData}
            />
            <TableView
              index={filterIndex}
              tabIndex={1}
              loading={loading}
              territoryType={territoryType}
              rowDto={tableViewLandingDto}
              getData={getData}
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default TerritorySetup;

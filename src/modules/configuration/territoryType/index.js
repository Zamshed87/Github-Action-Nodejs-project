import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import { useFormik } from "formik";
import Loading from "../../../common/loading/Loading";
import useAxiosPost from "../../../utility/customHooks/useAxiosPost";
import { todayDate } from "../../../utility/todayDate";
// import PrimaryButton from "../../../common/PrimaryButton";
// import { AddOutlined } from "@mui/icons-material";
// import { toast } from "react-toastify";
import NoResult from "../../../common/NoResult";
import * as Yup from "yup";
import { getTerritoryLanding, territoryColumn } from "./helper";
import AntTable from "../../../common/AntTable";
import AddEditForm from "./component/AddEditForm";

const initialValues = {
  hrPosition: "",
  territoryType: "",
  workplaceGroup: "",
};
export const validationSchema = Yup.object({
  //   hrPosition: Yup.object()
  //     .shape({
  //       label: Yup.string().required("Hr Position is required"),
  //       value: Yup.string().required("Hr Position is required"),
  //     })
  //     .typeError("Hr Position is required"),
  //   workplaceGroup: Yup.object()
  //     .shape({
  //       label: Yup.string().required("Workplace Group is required"),
  //       value: Yup.string().required("Workplace Group is required"),
  //     })
  //     .typeError("Workplace Group is required"),
  territoryType: Yup.string()
    .required("Territory Type is required")
    .typeError("Territory Type is required"),
});

const TerritoryType = () => {
  const { orgId, buId, employeeId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);
  const dispatch = useDispatch();

  const [, saveTerritory, territoryLoading] = useAxiosPost({});
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30373) {
      permission = item;
    }
  });

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, [dispatch]);

  const getData = () => {
    getTerritoryLanding(orgId, buId, setRowDto, setLoading);
  };

  const { values, setFieldValue, handleSubmit, errors, touched, resetForm } =
    useFormik({
      enableReinitialize: true,
      initialValues: singleData?.territoryType ? singleData : initialValues,
      validationSchema,
      onSubmit: (values) => {
        saveHandler(values, () => {
          resetForm(initialValues);
          getData();
          setSingleData(null);
          setOpenModal(false);
        });
      },
    });

  const saveHandler = (values, cb) => {
    const payload = {
      intTerritoryTypeId: singleData?.intTerritoryTypeId || 0,
      intHrPositionId: 2,
      intWorkplaceGroupId: 3,
      strTerritoryType: values?.territoryType,
      intAccountId: orgId,
      intBusinessUnitId: buId,
      isActive: true,
      intCreatedBy: employeeId,
      dteCreatedAt: todayDate(),
    };
    saveTerritory(`/SaasMasterData/SaveTerritoryType`, payload, cb, true);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return permission?.isView ? (
    <>
      {(territoryLoading || loading) && <Loading />}
      <form onSubmit={handleSubmit}>
        <div className="table-card">
          <div className="table-card-heading">
            <div></div>
            <div className="table-card-head-right">
              {/* <PrimaryButton
                type="button"
                className="btn btn-default flex-center"
                label={"Territory Type"}
                icon={
                  <AddOutlined
                    sx={{
                      marginRight: "0px",
                      fontSize: "15px",
                    }}
                  />
                }
                onClick={() => {
                  if (!permission?.isCreate)
                    return toast.warn("You don't have permission");
                  setSingleData(null);
                  setOpenModal(true);
                }}
              /> */}
            </div>
          </div>
          <div className="table-card-body">
            {rowDto?.length > 0 ? (
              <div className="table-card-styled tableOne employee-table-card tableOne  table-responsive">
                <AntTable
                  data={rowDto}
                  removePagination
                  columnsData={territoryColumn(
                    permission,
                    setSingleData,
                    setOpenModal
                  )}
                />
              </div>
            ) : (
              <NoResult />
            )}
          </div>
        </div>
        <AddEditForm
          propsObj={{
            show: openModal,
            title: "Create Territory Type",
            setOpenModal,
            size: "lg",
            backdrop: "static",
            classes: "default-modal approval-pipeline-modal",
            getData,
            singleData,
            setSingleData,
            saveTerritory,
            values,
            setFieldValue,
            errors,
            touched,
            resetForm,
            initialValues,
            handleSubmit,
          }}
        />
      </form>
    </>
  ) : (
    <NotPermittedPage />
  );
};

export default TerritoryType;

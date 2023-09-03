import {
  AddOutlined, EditOutlined, SettingsBackupRestoreOutlined
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import AntTable from "../../../common/AntTable";
import Loading from "../../../common/loading/Loading";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import { getPyrGrossWiseBasicAction, setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { getAllGrossWiseBasicLanding } from "./helper";



const initData = {
  status: "",
};

export default function PayrollGrossWiseBasicLanding() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 30371) {
      permission = item;
    }
  });

  const [loading, setLoading] = useState(false);
  const [, setRowDto] = useState([]);

  const [status, setStatus] = useState("");

  // get sbuDDl ddl from store
  const pyrGrossWiseBasicLanding = useSelector((state) => {
    return state?.localStorage?.pyrGrossWiseBasic;
  }, shallowEqual);


  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
  }, [dispatch]);

  const getData = () => {
    getAllGrossWiseBasicLanding(
      orgId,
      buId,
      setRowDto,
      setLoading
    );
    dispatch(
      getPyrGrossWiseBasicAction(orgId, buId)
    );
  };

  useEffect(() => {
    getAllGrossWiseBasicLanding(
      orgId,
      buId,
      setRowDto,
      setLoading
    );
    dispatch(
      getPyrGrossWiseBasicAction(orgId, buId)
    );
  }, [orgId, buId, dispatch]);

  const { setFieldValue, handleSubmit } = useFormik({
    enableReinitialize: true,
    initialValues: initData,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      resetForm(initData);
    },
  });

  const columns = [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
      width: 40
    },
    {
      title: "Gross Salary",
      render: (_, item) => (
        <div>
          {item?.numMinGross}-{item?.numMaxGross < 999999 ? item?.numMaxGross : "Max"}
        </div>
      ),
      sorter: false,
      filter: false,
    },
    {
      title: "% of Basic",
      dataIndex: "numPercentageOfBasic",
      sorter: false,
      filter: false,
    },
    {
      title: "",
      dataIndex: "",
      render: (_, item) => (
        <div className="d-flex">
          <Tooltip title="Edit" arrow>
            <button className="iconButton" type="button">
              <EditOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  if (!permission?.isEdit)
                    return toast.warn("You don't have permission");
                  history.push({
                    pathname: `/administration/payrollConfiguration/payrollBasic/edit/${item?.intGrossWiseBasicId}`,
                    state: item,
                  });
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
      sorter: false,
      filter: false,
    },
  ];

  return (
    <>
      {loading && <Loading />}
      {permission?.isView ? (
        <>
          <form onSubmit={handleSubmit}>
            <div className="table-card businessUnit-wrapper dashboard-scroll">
              <div className="table-card-heading">
                <div>
                  <h6>Payroll Gross Wise Basic</h6>
                </div>
                <ul className="d-flex flex-wrap">
                  {status && (
                    <li>
                      <ResetButton
                        classes="btn-filter-reset"
                        title="reset"
                        icon={
                          <SettingsBackupRestoreOutlined
                            sx={{ marginRight: "10px", fontSize: "16px" }}
                          />
                        }
                        styles={{
                          marginRight: "16px",
                        }}
                        onClick={() => {
                          setFieldValue("status", "");
                          setStatus("");
                          getData();
                        }}
                      />
                    </li>
                  )}
                  <li>
                    <PrimaryButton
                      type="button"
                      className="btn btn-default flex-center"
                      label={"Create"}
                      icon={<AddOutlined sx={{ marginRight: "11px" }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!permission?.isCreate)
                          return toast.warn("You don't have permission");
                        history.push(
                          "/administration/payrollConfiguration/payrollBasic/create"
                        );
                      }}
                    />
                  </li>
                </ul>
              </div>
              <div className="table-card-body">
                <div className="table-card-styled tableOne">
                  {pyrGrossWiseBasicLanding?.length > 0 ? (
                    <AntTable data={pyrGrossWiseBasicLanding} columnsData={columns} />
                  ) : (
                    <>
                      {!loading && (
                        <NoResult title="You have no application." />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          <NotPermittedPage />
        </>
      )}
    </>
  );
}

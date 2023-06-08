import {
  AddOutlined,
  DeleteOutlineOutlined,
  ModeEditOutlineOutlined
} from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntTable from "../../../../common/AntTable";
import Loading from "../../../../common/loading/Loading";
import NoResult from "../../../../common/NoResult";
import NotPermittedPage from "../../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../../common/PrimaryButton";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import { gray700 } from "../../../../utility/customColor";
import { getAllLveMovementType, getDeleteLveMovementTypeById } from "../helper";
import AddEditFormComponent from "./addEditForm";

const initData = {
  string: "",
  status: "",
};

const MovementType = () => {
  const [movementTypeList, setMovementTypeList] = useState([]);
  const [, setAllData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [singleData, setSingleData] = useState("");

  const { orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [loading] = useState(false);

  const getData = () => {
    getAllLveMovementType(orgId, setMovementTypeList, setAllData);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 36) {
      permission = item;
    }
  });

  const frequencyLabel = (id) => {
    switch (id) {
      case 1:
        return "Daily";
      case 2:
        return "Weekly";
      case 3:
        return "Monthly";
      case 4:
        return "Half-Yearly";
      case 5:
        return "Yearly";
      default:
        return " ";
    }
  };

  const columns = [
    {
      title: "SL",
      render: (text, record, index) => index + 1,
      sorter: false,
      filter: false,
    },
    {
      title: "Movement Type Name",
      dataIndex: "strLeaveType",
      render: (_, item) => (
        <div>
          {item?.strMovementType} [{item?.strMovementTypeCode}]
        </div>
      ),
      sorter: false,
      filter: false,
    },
    {
      title: "Quota Hour",
      dataIndex: "intQuotaHour",
      sorter: false,
      filter: false,
    },
    {
      title: "Quota Frequency",
      dataIndex: "strLeaveTypeCode",
      render: (_, item) => <div>{frequencyLabel(item?.intQuotaFrequency)}</div>,
      sorter: false,
      filter: false,
    },
    {
      title: "",
      dataIndex: "",
      render: (_, item) => (
        <div className="d-flex align-items-center">
          <Tooltip title="Edit" arrow>
            <button
              className="iconButton"
              onClick={(e) => {
                if (!permission?.isEdit)
                  return toast.warn("You don't have permission");
                e.stopPropagation();
                setSingleData(item);
                setOpenModal(true);
              }}
            >
              <ModeEditOutlineOutlined sx={{ fontSize: "20px" }} />
            </button>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <button
              className="iconButton"
              onClick={(e) => {
                if (!permission?.isEdit)
                  return toast.warn("You don't have permission");
                e.stopPropagation();
                getDeleteLveMovementTypeById(item?.intMovementTypeId, () => {
                  getData();
                });
              }}
            >
              <DeleteOutlineOutlined sx={{ fontSize: "20px" }} />
            </button>
          </Tooltip>
        </div>
      ),
      sorter: false,
      filter: false,
    },
  ];

  const saveHandler = (values) => {};

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
            {loading && <Loading />}
            <Form onSubmit={handleSubmit}>
              {permission?.isView ? (
                <div className="table-card">
                  <div
                    className="table-card-heading"
                    style={{ marginBottom: "12px" }}
                  >
                    <div>
                      <h3 style={{ fontSize: "12px", color: gray700 }}>
                        Total {movementTypeList?.length || 0} items
                      </h3>
                    </div>
                    <ul className="d-flex flex-wrap">
                      <li>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center"
                          label={"Movement Type"}
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
                            setOpenModal(true);
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled tableOne">
                      {movementTypeList?.length > 0 ? (
                        <AntTable
                          data={movementTypeList}
                          columnsData={columns}
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
              ) : (
                <NotPermittedPage />
              )}

              <AddEditFormComponent
                show={openModal}
                title={
                  singleData?.intMovementTypeId
                    ? "Edit Movement Type"
                    : "Create Movement Type"
                }
                onHide={setOpenModal}
                size="lg"
                backdrop="static"
                classes="default-modal"
                getData={getData}
                setOpenModal={setOpenModal}
                singleData={singleData}
                setSingleData={setSingleData}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default MovementType;

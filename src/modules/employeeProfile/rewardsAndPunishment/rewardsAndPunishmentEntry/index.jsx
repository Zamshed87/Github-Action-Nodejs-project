/* eslint-disable no-unused-vars */
import { AddOutlined } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import AvatarComponent from "../../../../common/AvatarComponent";
import IConfirmModal from "../../../../common/IConfirmModal";
import Loading from "../../../../common/loading/Loading";
import MasterFilter from "../../../../common/MasterFilter";
import PrimaryButton from "../../../../common/PrimaryButton";
import SortingIcon from "../../../../common/SortingIcon";
import ViewModal from "../../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../../commonRedux/reduxForLocalStorage/actions";
import MasterFilterRewardsAndPunishment from "../components/MasterFilterRewardsAndPunishment";
import ViewRewardAndPunishmentModal from "../components/ViewRewardAndPunishmentModal";

const initData = {
  search: "",
};

const fakeData = [
  {
    employee: "Mahedi Hassan",
    discliptinaryType: "Target Achive",
    applicationDate: "18/12/2021",
    actionTaken: "Suspended",
    status: "target Achive",
  },
  {
    employee: "Sakib Hassan",
    discliptinaryType: "Target Achive",
    applicationDate: "16/12/2021",
    actionTaken: "Suspended",
    status: "target Achive",
  },
  {
    employee: "Mahedi Hassan",
    discliptinaryType: "Target Achive",
    applicationDate: "18/12/2021",
    actionTaken: "Suspended",
    status: "target Achive",
  },
  {
    employee: "Sakib Hassan",
    discliptinaryType: "Target Achive",
    applicationDate: "16/12/2021",
    actionTaken: "Suspended",
    status: "target Achive",
  },
];

const customStyleObj = {
  root: {
    minWidth: "750px",
  },
};

function RewardsAndPunishmentEntry() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Management"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [show, setShow] = useState(false);

  const saveHandler = (values) => {};

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openModal, setOpenModal] = useState(false);
  // for view state
  const [viewModal, setViewModal] = useState(false);

  // for create Modal
  const handleOpen = () => {
    setViewModal(false);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setViewModal(false);
    setOpenModal(false);
  };

  const history = useHistory();
  const rewardPunishmentAdd = () => {
    history.push("/profile/rewardsandpunishmentadd");
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const demoPopup = () => {
    const rewardsAndPunishment = {};

    const callback = () => {};
    let confirmObject = {
      closeOnClickOutside: false,
      message: "Are you Sure you want to delete your Disciplinary action?",
      yesAlertFunc: () => {},
      noAlertFunc: () => {
        //   history.push("/components/dialogs")
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
            <Form onSubmit={handleSubmit} className="employeeProfile-form-main">
              <div className="employee-profile-main">
                <div className="table-card">
                  <div className="table-card-heading justify-content-end">
                    <div></div>
                    <div className="table-card-head-right">
                      <MasterFilter
                        width="200px"
                        inputWidth="200px"
                        value={values?.search}
                        setValue={(value) => {
                          setFieldValue("search", value);
                        }}
                        cancelHandler={() => {
                          setFieldValue("search", "");
                        }}
                        handleClick={handleClick}
                      />
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label={"Add"}
                        icon={
                          <AddOutlined
                            sx={{
                              marginRight: "0px",
                              fontSize: "15px",
                              marginBottom: "2px",
                            }}
                          />
                        }
                        onClick={() => rewardPunishmentAdd()}
                      />
                    </div>
                  </div>
                  <div className="table-card-body">
                    <div className="table-card-styled employee-table-card tableOne">
                      <>
                        <table className="table mt-3">
                          <thead>
                            <tr>
                              <th
                                style={{ width: "40px", textAlign: "center" }}
                              >
                                SL
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Employee</span>
                                  <div>
                                    <SortingIcon></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Disciplinary Type</span>
                                  <div>
                                    <SortingIcon></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Application Date</span>
                                  <div>
                                    <SortingIcon></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Type</span>
                                  <div>
                                    <SortingIcon></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th>
                                <div className="sortable">
                                  <span>Status</span>
                                  <div>
                                    <SortingIcon></SortingIcon>
                                  </div>
                                </div>
                              </th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {fakeData.map((data, index) => (
                              <tr key={index}>
                                <td
                                  className="text-center"
                                  style={{ color: "rgba(0, 0, 0, 0.6)" }}
                                >
                                  {index + 1}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <AvatarComponent
                                      letterCount={1}
                                      label={data?.employee}
                                    />
                                    <span className="tableBody-title ml-2">
                                      {data?.employee}
                                    </span>
                                  </div>
                                </td>
                                <td style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                                  {data.discliptinaryType}
                                </td>
                                <td style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                                  {data.applicationDate}
                                </td>
                                <td style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                                  {data.actionTaken}
                                </td>
                                <td style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                                  {data.status}
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <button
                                      className="iconButton"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenModal(true);
                                      }}
                                    >
                                      <EditOutlinedIcon
                                        sx={{ fontSize: "20px" }}
                                      />
                                    </button>
                                    <button className="iconButton">
                                      <DeleteOutlineIcon
                                        sx={{ fontSize: "20px" }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          demoPopup();
                                        }}
                                      />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    </div>
                  </div>
                </div>
                {/* <MasterFilterRewardsAndPunishment
                  propsObj={{
                    id,
                    open,
                    anchorEl,
                    handleClose,
                  }}
                ></MasterFilterRewardsAndPunishment> */}
              </div>
            </Form>
          </>
        )}
      </Formik>
      <MasterFilterRewardsAndPunishment
        propsObj={{
          id,
          open,
          anchorEl,
          handleClose,
          customStyleObj,
        }}
        masterFilterHandler={handleClick}
      />

      <ViewModal
        size="lg"
        title="Disciplinary Action Details"
        backdrop="static"
        classes="default-modal preview-modal"
        show={openModal}
        onHide={handleCloseModal}
      >
        <ViewRewardAndPunishmentModal
          /* singleData={singleData}
          rowDto={rowDto} */
          setViewModal={setViewModal}
          handleCloseModal={handleCloseModal}
        />
      </ViewModal>
    </>
  );
}

export default RewardsAndPunishmentEntry;

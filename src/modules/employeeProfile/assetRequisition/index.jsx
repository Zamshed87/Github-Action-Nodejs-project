/* eslint-disable react-hooks/exhaustive-deps */
import {
  AddOutlined,
  AssignmentReturnOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  SettingsBackupRestoreOutlined,
  SettingsOutlined
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ActionMenu from "../../../common/ActionMenu";
import AvatarComponent from "../../../common/AvatarComponent";
import Chips from "../../../common/Chips";
import FormikCheckBox from "../../../common/FormikCheckbox";
import Loading from "../../../common/loading/Loading";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import ResetButton from "../../../common/ResetButton";
import ViewModal from "../../../common/ViewModal";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { gray900, greenColor } from "../../../utility/customColor";
import IConfirmModal from "./../../../common/IConfirmModal";
import PrimaryButton from "./../../../common/PrimaryButton";
import MaintenanceReason from "./component/MaintenanceReason";
import PopOverFilter from "./component/PopOverFilter";
import ReturnReason from "./component/ReturnReason";
import { assetRequisitionData } from "./helper";

const initData = {
  search: "",
};

export default function AssetRequisition() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
  }, []);

  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFilter, setIsFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([...assetRequisitionData]);
  const [selectRowDto, setSelectedRowDto] = useState([]);
  const [isActionMenu, setActionMenu] = useState(true);

  const { userId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  // modal
  const [show, setShow] = useState(false);
  const [returnShow, setReturnShow] = useState(false);

  // for master filter
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const allSelectHandler = (e) => {
    setRowDto(
      rowDto?.map((item) => ({
        ...item,
        selectCheckbox: e.target.checked,
      }))
    );

    if (e.target.checked === true) {
      const filterRow = rowDto?.filter(
        (itm) => itm?.isAcknowledged === false && itm?.isApproved === true
      );
      setSelectedRowDto(filterRow);
    } else {
      setSelectedRowDto([]);
    }
  };

  const singleSelectHandler = (e, index) => {
    let data = [...rowDto];
    data[index].selectCheckbox = e.target.checked;
    const filterRow = data?.filter(
      (itm) =>
        (itm?.selectCheckbox && itm?.isApproved) === true &&
        itm?.isAcknowledged === false
    );
    setSelectedRowDto([...filterRow]);
    setRowDto([...data]);
  };

  // acknowledge handler
  const acknowledgeHandler = (data) => {
    let confirmObject = {
      title: "Are you sure?",
      closeOnClickOutside: false,
      yesAlertFunc: () => {},
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  // save handler
  const saveHandler = (values) => {
    alert("test");
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
              <div className="table-card">
                <div className="table-card-heading">
                  <div></div>
                  <ul className="d-flex flex-wrap">
                    {selectRowDto?.length > 0 && (
                      <li>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center mr-2"
                          label={"Acknowledge"}
                          icon={
                            <CheckOutlined
                              sx={{
                                marginRight: "0px",
                                fontSize: "15px",
                              }}
                            />
                          }
                          onClick={() => {
                            acknowledgeHandler();
                          }}
                        />
                      </li>
                    )}
                    {isFilter && (
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
                            setIsFilter(false);
                            setFieldValue("search", "");
                            resetForm();
                          }}
                        />
                      </li>
                    )}
                    <li>
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
                    </li>
                    <li>
                      <PrimaryButton
                        type="button"
                        className="btn btn-default flex-center"
                        label={"Requisition"}
                        icon={
                          <AddOutlined
                            sx={{
                              marginRight: "0px",
                              fontSize: "15px",
                            }}
                          />
                        }
                        onClick={() => {
                          history.push({
                            pathname:
                              "/SelfService/asset/assetRequisition/create",
                          });
                        }}
                      />
                    </li>
                  </ul>
                </div>
                <div className="table-card-body">
                  <div className="table-card-styled tableOne">
                    {rowDto?.length > 0 ? (
                      <>
                        <table className="table">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>
                                <div className="d-flex align-items-center pr-1">
                                  <FormikCheckBox
                                    styleObj={{
                                      color: gray900,
                                      checkedColor: greenColor,
                                    }}
                                    name="allSelected"
                                    checked={
                                      rowDto?.length > 0 &&
                                      rowDto?.every(
                                        (item) => item?.selectCheckbox
                                      )
                                    }
                                    onChange={(e) => {
                                      allSelectHandler(e);
                                      setFieldValue(
                                        "allSelected",
                                        e.target.checked
                                      );
                                    }}
                                  />
                                </div>
                              </th>
                              <th>Requisition Code</th>
                              <th>Date</th>
                              <th>Employee</th>
                              <th>Remarks</th>
                              <th style={{ width: "100px" }}>Status</th>
                              <th style={{ width: "80px" }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    {item?.isApproved &&
                                      item?.isAcknowledged && (
                                        <FormikCheckBox
                                          styleObj={{
                                            color: gray900,
                                            checkedColor: greenColor,
                                          }}
                                          name="selectCheckbox"
                                          color={greenColor}
                                          checked={
                                            rowDto[index]?.selectCheckbox
                                          }
                                          onChange={(e) => {
                                            singleSelectHandler(e, index);
                                            // let data = [...rowDto];
                                            // data[index].selectCheckbox = e.target.checked;
                                            // setRowDto([...data]);
                                          }}
                                          // disabled={(item?.isAcknowledged && item?.isAcknowledged) === false}
                                        />
                                      )}

                                    {item?.isApproved &&
                                      !item?.isAcknowledged && (
                                        <FormikCheckBox
                                          styleObj={{
                                            color: gray900,
                                            checkedColor: greenColor,
                                          }}
                                          name="selectCheckbox"
                                          color={greenColor}
                                          checked={
                                            rowDto[index]?.selectCheckbox
                                          }
                                          onChange={(e) => {
                                            singleSelectHandler(e, index);
                                            // let data = [...rowDto];
                                            // data[index].selectCheckbox = e.target.checked;
                                            // setRowDto([...data]);
                                          }}
                                        />
                                      )}
                                  </td>
                                  <td>
                                    <p className="tableBody-title">Req122</p>
                                  </td>
                                  <td>
                                    <p className="tableBody-title">
                                      10 Jan, 2022
                                    </p>
                                  </td>
                                  <td>
                                    <div className="employeeInfo d-flex align-items-center">
                                      <AvatarComponent
                                        letterCount={1}
                                        label={"Jubayer"}
                                      />
                                      <div className="ml-3">
                                        <h5
                                          className="employeeName tableBody-title"
                                          style={{
                                            color: "#667085",
                                            fontWeight: "400",
                                          }}
                                        >
                                          {"Jubayer"} [{"0123654"}]
                                        </h5>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <p className="tableBody-title">
                                      Office Use
                                    </p>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      {item?.isApproved && (
                                        <Chips
                                          label="Approved"
                                          classess="success"
                                        />
                                      )}
                                      {!item?.isApproved && (
                                        <Chips
                                          label="Pending"
                                          classess="warning"
                                        />
                                      )}
                                      <div className="ml-2">
                                        {item?.isApproved && isActionMenu && (
                                          <ActionMenu
                                            // anchorEl={anchorElAction}
                                            // setAnchorEl={setAnchorElAction}
                                            color={"rgba(0, 0, 0, 0.6)"}
                                            fontSize={"16px"}
                                            options={[
                                              {
                                                value: 1,
                                                label: "Acknowledge",
                                                icon: (
                                                  <CheckOutlined
                                                    sx={{
                                                      marginRight: "10px",
                                                      fontSize: "16px",
                                                    }}
                                                  />
                                                ),
                                                onClick: () => {
                                                  acknowledgeHandler(item);
                                                },
                                                disabled: item?.isAcknowledged,
                                              },
                                              {
                                                value: 2,
                                                label: "Maintenance",
                                                icon: (
                                                  <SettingsOutlined
                                                    sx={{
                                                      marginRight: "10px",
                                                      fontSize: "16px",
                                                    }}
                                                  />
                                                ),
                                                onClick: () => {
                                                  // setAnchorElAction(null);
                                                  setShow(true);
                                                  setActionMenu(false);
                                                },
                                              },
                                              {
                                                value: 3,
                                                label: "Return",
                                                icon: (
                                                  <AssignmentReturnOutlined
                                                    sx={{
                                                      marginRight: "10px",
                                                      fontSize: "16px",
                                                    }}
                                                  />
                                                ),
                                                onClick: () => {
                                                  // setAnchorElAction(null);
                                                  setReturnShow(true);
                                                  setActionMenu(false);
                                                },
                                              },
                                            ]}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {!item?.isApproved && (
                                      <div className="d-flex align-items-center">
                                        <button
                                          className="iconButton"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                          }}
                                        >
                                          <EditOutlined
                                            sx={{ fontSize: "20px" }}
                                          />
                                        </button>
                                        <button
                                          type="button"
                                          className="iconButton mt-0 mt-md-2 mt-lg-0"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                          }}
                                        >
                                          <DeleteOutlined />
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
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

              {/* master popover filter */}
              <PopOverFilter
                propsObj={{
                  id,
                  open,
                  anchorEl,
                  handleClose,
                  setLoading,
                  setIsFilter,
                }}
                masterFilterHandler={handleClick}
              />

              {/* Maintenance Modal */}
              <ViewModal
                size="lg"
                title="Reason of Maintenance"
                backdrop="static"
                classes="default-modal preview-modal asset-requision-modal"
                show={show}
                onHide={() => {
                  setShow(false);
                  setActionMenu(true);
                }}
              >
                <MaintenanceReason
                  orgId={orgId}
                  userId={userId}
                  setShow={setShow}
                  setActionMenu={setActionMenu}
                />
              </ViewModal>

              {/* Return Modal */}
              <ViewModal
                size="lg"
                title="Reason of Return"
                backdrop="static"
                classes="default-modal preview-modal asset-requision-modal"
                show={returnShow}
                onHide={() => setReturnShow(false)}
              >
                <ReturnReason
                  orgId={orgId}
                  userId={userId}
                  setShow={setReturnShow}
                  setActionMenu={setActionMenu}
                />
              </ViewModal>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

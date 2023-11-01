import {
  AddOutlined,
  SettingsBackupRestoreOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AntTable, { paginationSize } from "../../../common/AntTable";
import NoResult from "../../../common/NoResult";
import NotPermittedPage from "../../../common/notPermitted/NotPermittedPage";
import PrimaryButton from "../../../common/PrimaryButton";
import ResetButton from "../../../common/ResetButton";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import Loading from "./../../../common/loading/Loading";
import AddEditFormComponent from "./AddEditForm";
import { userGroupCol } from "./helper";
import "./styles.css";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import MasterFilter from "../../../common/MasterFilter";

const initData = {
  search: "",
};

export default function UserGroup() {
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState("");
  const [tableData, setTableData] = useState([]);
  const [id, setId] = useState("");
  const [rowDto, getLanding, loadingLanding, setRowDto] = useAxiosGet();
  const [pages, setPages] = useState({
    current: 1,
    pageSize: paginationSize,
    total: 0,
  });

  // modal state
  const [isFormModal, setIsFormModal] = useState(false);

  // const { orgId } = useSelector(
  //   (state) => state?.auth?.profileData,
  //   shallowEqual
  // );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (pagination, searchtText) => {
    const api = `/Auth/GetAllUserGroupByAccountId?PageNo=${
      pagination?.current
    }&PageSize=${pagination?.pageSize}&searchTxt=${searchtText || ""}`;
    getLanding(api, (res) => {
      setRowDto(res?.data);
      setPages({
        current: pagination?.current,
        pageSize: pagination?.pageSize,
        total: res?.totalCount,
      });
    });
  };

  const handleTableChange = (pagination, newRowDto, srcText) => {
    if (newRowDto?.action === "filter") {
      return;
    }
    if (
      pages?.current === pagination?.current &&
      pages?.pageSize !== pagination?.pageSize
    ) {
      return getData(pagination, srcText);
    }
    if (pages?.current !== pagination?.current) {
      return getData(pagination, srcText);
    }
  };

  useEffect(() => {
    getData(pages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values) => {};

  const { permissionList } = useSelector((state) => state?.auth, shallowEqual);

  let permission = null;
  permissionList.forEach((item) => {
    if (item?.menuReferenceId === 31) {
      permission = item;
    }
  });

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
              {(loading || loadingLanding) && <Loading />}
              {permission?.isView ? (
                <div className="table-card userGroup-wrapper">
                  <div className="table-card-heading justify-content-end">
                    <ul className="d-flex flex-wrap">
                      {values?.search && (
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
                              getData(pages);
                              setFieldValue("search", "");
                            }}
                          />
                        </li>
                      )}
                      <li>
                        <MasterFilter
                          inputWidth="250px"
                          width="250px"
                          isHiddenFilter
                          value={values?.search}
                          setValue={(value) => {
                            setFieldValue("search", value);
                            if (value) {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                value
                              );
                            } else {
                              getData(
                                { current: 1, pageSize: paginationSize },
                                ""
                              );
                            }
                          }}
                          cancelHandler={() => {
                            setFieldValue("search", "");
                            getData(
                              { current: 1, pageSize: paginationSize },
                              ""
                            );
                          }}
                        />
                      </li>
                      <li>
                        <PrimaryButton
                          type="button"
                          className="btn btn-default flex-center"
                          label={"User Group"}
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
                            setIsFormModal(true);
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
                            columnsData={userGroupCol(
                              pages,
                              permission,
                              setIsFormModal,
                              setId,
                              setSingleData,
                              setTableData,
                              setLoading
                            )}
                            handleTableChange={({ pagination, newRowDto }) =>
                              handleTableChange(
                                pagination,
                                newRowDto,
                                values?.search || ""
                              )
                            }
                            pages={pages?.pageSize}
                            pagination={pages}
                            onRowClick={(dataRow) => {
                              // setSingelUser(dataRow);
                              // setIsFormModal(true);
                            }}
                          />
                          {/* <table className="table">
                            <thead>
                              <tr>
                                <th style={{ width: "30px" }}>
                                  <div className="sortable">
                                    <span>SL</span>
                                  </div>
                                </th>
                                <th>
                                  <div
                                    className="sortable"
                                    onClick={() => {
                                      setViewOrder(
                                        viewOrder === "desc" ? "asc" : "desc"
                                      );
                                      sortByFilter(viewOrder);
                                    }}
                                  >
                                    <span>User Group Name</span>
                                    <div>
                                      <SortingIcon
                                        viewOrder={viewOrder}
                                      ></SortingIcon>
                                    </div>
                                  </div>
                                </th>
                                <th>
                                  <div className="sortable">
                                    <span>User Group Code</span>
                                  </div>
                                </th>
                                <th style={{ width: "80px" }}></th>
                              </tr>
                            </thead>
                            <tbody>
                              {rowDto?.map((item, index) => {
                                const {
                                  strUserGroup,
                                  strCode,
                                  intUserGroupHeaderId,
                                } = item;
                                return (
                                  <tr key={index}>
                                    <td>
                                      <div className="content tableBody-title">
                                        {index + 1}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="content tableBody-title">
                                        {" "}
                                        {strUserGroup}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="content tableBody-title mr-2">
                                        {strCode}
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <Tooltip title="Edit" arrow>
                                          <button
                                            className="iconButton"
                                            onClick={(e) => {
                                              if (!permission?.isEdit)
                                                return toast.warn(
                                                  "You don't have permission"
                                                );
                                              e.stopPropagation();
                                              setIsFormModal(true);
                                              setId(intUserGroupHeaderId);
                                              getRoleGroupById(
                                                intUserGroupHeaderId,
                                                setSingleData,
                                                setTableData,
                                                setLoading
                                              );
                                            }}
                                          >
                                            <EditOutlined
                                              sx={{ fontSize: "20px" }}
                                            />
                                          </button>
                                        </Tooltip>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table> */}
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

              {/* addEdit form Modal */}
              <AddEditFormComponent
                show={isFormModal}
                title={id ? "Edit User Group" : "Create User Group"}
                onHide={() => {
                  setIsFormModal(false);
                  setId("");
                  setSingleData("");
                }}
                size="lg"
                backdrop="static"
                classes="default-modal"
                setRowDto={setRowDto}
                singleData={singleData}
                setSingleData={setSingleData}
                tableData={tableData}
                setTableData={setTableData}
                id={id}
                setId={setId}
                getData={getData}
                pages={pages}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

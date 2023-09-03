import {
  Cancel,
  CheckCircle,
  DeleteOutlined,
  EditOutlined,
  RemoveRedEyeOutlined
} from "@mui/icons-material";
import { TableCell, TableRow } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import PrimaryButton from "../../../common/PrimaryButton";
import {
  failColor,
  greenColor,
  successColor
} from "../../../utility/customColor";
import ActionMenu from "./../../../common/ActionMenu";
import AvatarComponent from "./../../../common/AvatarComponent";
import Chips from "./../../../common/Chips";
import FormikCheckBox from "./../../../common/FormikCheckbox";
import FormikLinearProgress from "./../../../common/FormikLinearProgress";
import FormikRatings from "./../../../common/FormikRatings";
import LandingTable from "./../../../common/LandingTable";
import MuiIcon from "./../../../common/MuiIcon";
import { ratingColor } from "./../../../utility/customColor";
import { landingData } from "./../../../utility/data";

const initData = {
  allSelected: false,
  selectCheckbox: "",
  ratings: "",
};

const validationSchema = Yup.object().shape({});

const styles = makeStyles({
  tableCell: {
    padding: "16px",
  },
});

export default function DataGridModule() {
  const classes = styles();
  const [rowDto, setRowDto] = useState([...landingData?.data]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // save handler
  const saveHandler = (values, cb) => {};

  const handleChangePage = (page) => {};
  const handleChangeRowsPerPage = (size) => {};

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          handleChange,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form>
              <h2>Data Grid</h2>
              <div className="container-fluids">
                <div className="my-3">
                  <h6 style={{ fontSize: "14px" }}>Table</h6>
                </div>
                <div className="my-3">
                  <div className="row">
                    <div className="col-xl-10 col-lg-12 col-12">
                      <LandingTable
                        headers={
                          <TableRow>
                            <TableCell align="center">
                              <FormikCheckBox
                                styleObj={{
                                  margin: "0 auto!important",
                                  color: greenColor,
                                }}
                                name="allSelected"
                                checked={rowDto?.every(
                                  (item) => item?.selectCheckbox
                                )}
                                onChange={(e) => {
                                  setRowDto(
                                    rowDto?.map((item) => ({
                                      ...item,
                                      selectCheckbox: e.target.checked,
                                    }))
                                  );
                                  setFieldValue(
                                    "allSelected",
                                    e.target.checked
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Rating</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Is Active</TableCell>
                            <TableCell align="center">Performance</TableCell>
                            <TableCell align="center">Comment</TableCell>
                            <TableCell align="center"></TableCell>
                          </TableRow>
                        }
                        body={rowDto?.map((data, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              align="center"
                              className={classes?.tableCell}
                            >
                              <FormikCheckBox
                                styleObj={{
                                  margin: "0 auto!important",
                                  color: greenColor,
                                }}
                                name="selectCheckbox"
                                color={greenColor}
                                checked={data?.selectCheckbox === true}
                                onChange={(e) => {
                                  data["selectCheckbox"] = e.target.checked;
                                  setRowDto([...rowDto]);
                                }}
                              />
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes?.tableCell}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <AvatarComponent
                                    classess="mx-2"
                                    letterCount={1}
                                    label={data.userName}
                                  />
                                </div>
                                <div>{data.userName}</div>
                              </div>
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes?.tableCell}
                            >
                              {data.email}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes?.tableCell}
                            >
                              <FormikRatings
                                name="ratings"
                                value={data?.ratings}
                                color={ratingColor}
                                onChange={(e) => {
                                  data["ratings"] = e.target.value;
                                  setRowDto([...rowDto]);
                                }}
                              />
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes?.tableCell}
                            >
                              <Chips
                                label={data?.status}
                                classess={
                                  data?.status === "online"
                                    ? "success"
                                    : "danger"
                                }
                              />
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes?.tableCell}
                            >
                              {data?.isActive ? (
                                <MuiIcon
                                  icon={
                                    <CheckCircle sx={{ color: successColor }} />
                                  }
                                />
                              ) : (
                                <MuiIcon
                                  icon={<Cancel sx={{ color: failColor }} />}
                                />
                              )}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes?.tableCell}
                            >
                              <div className="flex-center">
                                <FormikLinearProgress
                                  variant="determinate"
                                  progress={data?.performance}
                                />
                                <span className="ml-2">
                                  {data?.performance} %
                                </span>
                              </div>
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes?.tableCell}
                            >
                              {data?.comment}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes?.tableCell}
                            >
                              <ActionMenu
                                color={"#000"}
                                options={[
                                  {
                                    value: 1,
                                    label: "View",
                                    icon: (
                                      <RemoveRedEyeOutlined
                                        sx={{ marginRight: "10px" }}
                                      />
                                    ),
                                    onClick: () => {},
                                  },
                                  {
                                    value: 2,
                                    label: "Edit",
                                    icon: (
                                      <EditOutlined
                                        sx={{ marginRight: "10px" }}
                                      />
                                    ),
                                    onClick: () => {},
                                  },
                                  {
                                    value: 3,
                                    label: "Delete",
                                    icon: (
                                      <DeleteOutlined
                                        sx={{ marginRight: "10px" }}
                                      />
                                    ),
                                    onClick: () => {},
                                  },
                                ]}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        styleObj={{
                          minWidth: "100%",
                        }}
                        count={landingData.totalCount}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        setPageNo={setPageNo}
                        setPageSize={setPageSize}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                      />
                    </div>
                  </div>
                </div>
                <div className="row my-3">
                  <div className="col-md-2">
                    <PrimaryButton
                      type="submit"
                      className="btn btn-basic"
                      label="Submit"
                    />
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

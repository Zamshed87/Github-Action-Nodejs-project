/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Print, SaveAlt } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { Form, Formik } from "formik";
import { useState } from "react";
import companyLogo from "../../../../assets/images/company/logo.png";
import Loading from "../../../../common/loading/Loading";
import DashboardHead from "../../../../layout/dashboardHead/DashboardHead";
import SideMenu from "../../../../layout/menuComponent/SideMenu";
import TableScrollable from "./components/ScrollableTable";

const initData = {
  search: "",
};

const tableData = [
  {
    employeeName: "Dev Rayhan",
    empCode: "dev@ibos",
    empId: "7437",
    designation: "Backed Dev",
    department: "Officer & Staff",
    jobType: "Permanent",
    doj: "-",
    confirmDate: "31-01-2022",
    dob: "31-01-2022",
    empEmail: "utshaw.cse.1614.eu.bd@gmail.com",
    religion: "Islam",
    gender: "Male",
    personalNo: "01674070166",
    officeContact: "01674070166",
    personalAddress: "Segertek 11, House - 29, Mohammadpur, Dhaka - 1207",
    bloodGroup: "AB+",
    supervisorName: "Md. Al-amin",
    bankName: "Islami Bank Bangladesh Limited",
    branch: "Mohammadpur Krishi Market",
    accountNo: "78932748329",
    Routing: "7439",
    grossSalary: "1000",
    basicSalary: "20000",
    netPayble: "9000",
  },
];

export default function EmpOverallStaus() {
  const [loading] = useState(false);
  const [rowDto] = useState([...tableData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          resetForm(initData);
        }}
      >
        {({ handleSubmit }) => (
          <>
            <Form onSubmit={handleSubmit}>
              {loading && <Loading />}
              <DashboardHead
                companyLogo={companyLogo}
                moduleTitle={"Employee Management"}
              />
              <div className="all-candidate">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-2">
                      <SideMenu />
                    </div>
                    <div className="col-md-10">
                      <div className="table-card">
                        <div className="table-card-heading">
                          <div className="d-flex">
                            <Tooltip title="Export CSV" arrow>
                              <button
                                type="button"
                                className="btn-save "
                                style={{
                                  border: "transparent",
                                  width: "30px",
                                  height: "30px",
                                  background: "#f2f2f7",
                                  borderRadius: "100px",
                                }}
                              >
                                <SaveAlt
                                  sx={{ color: "#637381", fontSize: "16px" }}
                                />
                              </button>
                            </Tooltip>
                            <Tooltip title="Print" arrow>
                              <button
                                className="btn-save ml-3"
                                type="button"
                                style={{
                                  border: "transparent",
                                  width: "30px",
                                  height: "30px",
                                  background: "#f2f2f7",
                                  borderRadius: "100px",
                                }}
                              >
                                <Print
                                  sx={{ color: "#637381", fontSize: "16px" }}
                                />
                              </button>
                            </Tooltip>
                          </div>
                          <div className="table-card-head-right"></div>
                        </div>
                        <div className="table-card-body mt-3">
                          <TableScrollable propsObj={{ rowDto }} />
                        </div>
                      </div>
                    </div>
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

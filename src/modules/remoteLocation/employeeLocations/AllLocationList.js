import { Close } from "@mui/icons-material";
import { Alert, AlertTitle, IconButton } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import AntTable from "../../../common/AntTable";
import Chips from "../../../common/Chips";
import MasterFilter from "../../../common/MasterFilter";
import NoResult from "../../../common/NoResult";
import Loading from "../../../common/loading/Loading";
import useDebounce from "../../../utility/customHooks/useDebounce";
import { getAllLocation } from "./helper";

const initialValues = {
  search: "",
};

const AllLocationList = ({ show, setOpenModal, size, backdrop, classes }) => {
  const { orgId, buId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [allData, setAllData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(15);

  const debounce = useDebounce();

  const searchData = (keywords, allData, setRowDto) => {
    try {
      const regex = new RegExp(keywords?.toLowerCase());
      const newDta = allData?.filter(
        (item) =>
          regex.test(item?.strPlaceName?.toLowerCase()) ||
          regex.test(item?.locationLog?.toLowerCase())
      );
      setRowDto(newDta);
    } catch {
      setRowDto([]);
    }
  };

  const { values, setFieldValue, handleSubmit } = useFormik({
    initialValues,
  });

  const getData = () => {
    getAllLocation(orgId, buId, setAllData, setRowDto, setLoading);
  };
  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allLocationColumn = () => {
    return [
      {
        title: "SL",
        render: (text, record, index) =>
          (page - 1) * paginationSize + index + 1,
        className: "text-center",
      },
      {
        title: "Code",
        dataIndex: "strLocationCOde",
      },
      {
        title: "Name",
        dataIndex: "strPlaceName",
      },
      {
        title: "Loation Log",
        dataIndex: "locationLog",
      },
      {
        title: "Status",
        dataIndex: "strStatus",
        render: (_, record) => (
          <div className="text-center action-chip" style={{ width: "70px" }}>
            {record?.strStatus === "approved" && (
              <Chips label="Approved" classess="success" />
            )}
            {record?.strStatus === "pending" && (
              <Chips label="Pending" classess=" warning" />
            )}
            {record?.strStatus === "rejected" && (
              <Chips label="Rejected" classess="danger" />
            )}
          </div>
        ),
        filter: false,
        sorter: false,
      },
      {
        title: "No of Employee",
        dataIndex: "count",
      },
    ];
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="viewModal">
        <Modal
          show={show}
          onHide={() => {
            setOpenModal(false);
          }}
          size={size}
          backdrop={backdrop}
          aria-labelledby="example-modal-sizes-title-xl"
          className={classes}
        >
          <Modal.Header className="bg-custom">
            <div className="d-flex w-100 justify-content-between align-items-center">
              <Modal.Title className="text-center">
                All Location List
              </Modal.Title>
              <div>
                <IconButton
                  onClick={() => {
                    setOpenModal(false);
                  }}
                >
                  <Close />
                </IconButton>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body id="example-modal-sizes-title-xl">
            {loading && <Loading />}
            <div className="pipeLineModal">
              <div className="modalBody px-3">
                <div>
                  <Alert severity="info">
                    <AlertTitle
                      sx={{ fontSize: "14px", color: "black", fontWeight: 500 }}
                    >
                      Location Registration
                    </AlertTitle>
                    <span style={{ fontSize: "12px", color: "black" }}>
                      {" "}
                      Must be register using the PeopleDesk Mobile App {"> "}
                      Application {"> "} Location & Device {"> "} Admin Location
                      (TAB) {"> "}
                      Add
                    </span>
                  </Alert>
                </div>
                <div className="d-flex justify-content-end my-2">
                  <MasterFilter
                    styles={{
                      marginRight: "0px",
                    }}
                    isHiddenFilter
                    width="200px"
                    inputWidth="200px"
                    value={values?.search}
                    setValue={(value) => {
                      debounce(() => {
                        searchData(value, allData, setRowDto);
                      }, 500);
                      setFieldValue("search", value);
                    }}
                    cancelHandler={() => {
                      setFieldValue("search", "");
                      getData();
                    }}
                  />
                </div>
                <div>
                  {rowDto?.length > 0 ? (
                    <AntTable
                      data={rowDto}
                      columnsData={allLocationColumn()}
                      setPage={setPage}
                      setPaginationSize={setPaginationSize}
                      rowKey={(record) => record?.intMasterLocationId}
                    />
                  ) : (
                    <NoResult />
                  )}
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </form>
  );
};

export default AllLocationList;

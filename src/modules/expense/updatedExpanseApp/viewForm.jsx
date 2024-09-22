import { DateRange, FilePresentOutlined } from "@mui/icons-material";
import BackButton from "../../../common/BackButton";
import CircleButton from "../../../common/CircleButton";
import { dateFormatter } from "../../../utility/dateFormatter";
import moneyIcon from "../../../assets/images/moneyIcon.png";
import Loading from "../../../common/loading/Loading";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setFirstLevelNameAction } from "../../../commonRedux/reduxForLocalStorage/actions";
import { useParams } from "react-router-dom";
import useAxiosGet from "../../../utility/customHooks/useAxiosGet";
import { numberWithCommas } from "../../../utility/numberWithCommas";
import { gray700 } from "../../../utility/customColor";
import { getDownlloadFileView_Action } from "../../../commonRedux/auth/actions";
import { getExpenseApplicationById } from "./helper";
import { getPDFAction } from "utility/downloadFile";
import { MdLocalPrintshop } from "react-icons/md";
import { Tooltip } from "antd";

const SelfExpenseApplicationView = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const { buId, orgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const [singleData, setSingleData] = useState([]);
  const [imgRow, setImgRow] = useState([]);
  const [loading, setLoading] = useState(false);

  const [, getExpenseDetail, expenseDetailsLoading] = useAxiosGet([]);

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Employee Self Service"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    params?.id &&
      getExpenseDetail(
        `/Employee/GetExpenseDocList?intExpenseId=${params?.id}`,
        (data) => {
          setImgRow([...data]);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  useEffect(() => {
    if (params?.id) {
      getExpenseApplicationById(+params?.id, buId, setSingleData, setLoading);
    }
  }, [buId, params?.id]);

  return (
    <>
      {(loading || expenseDetailsLoading) && <Loading />}
      <div>
        {expenseDetailsLoading && <Loading />}
        <div className="table-card">
          <div className="table-card-heading" style={{ marginBottom: "12px" }}>
            <div className="d-flex align-items-center">
              <BackButton />
              <h2>{`View Expense Application`}</h2>
              <div>
                {(orgId == 5 || orgId === 6) && (
                  <Tooltip className="mx-2" placement="bottom" title="Print">
                    <MdLocalPrintshop
                      style={{
                        // color: "gray",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();

                        getPDFAction(
                          `/PdfAndExcelReport/EmpExpenseReportPdf?intExpenseId=${+params?.id}&businessUnitId=${buId}`,
                          setLoading
                        );
                      }}
                    ></MdLocalPrintshop>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
          <div className="card-style">
            <div className="row">
              <div className="col-12" style={{ margin: "12px 0 0" }}></div>

              <div className="col-lg-2">
                <CircleButton
                  icon={<DateRange style={{ fontSize: "24px" }} />}
                  title={
                    dateFormatter(singleData[0]?.dteExpenseFromDate) || "-"
                  }
                  subTitle="From Date"
                />
              </div>

              <div className="col-lg-2">
                <CircleButton
                  icon={<DateRange style={{ fontSize: "24px" }} />}
                  title={dateFormatter(singleData[0]?.dteExpenseToDate) || "-"}
                  subTitle="To Date"
                />
              </div>

              <div className="col-lg-2">
                <CircleButton
                  icon={<img src={moneyIcon} alt="iBOS" />}
                  title={
                    numberWithCommas(singleData[0]?.numExpenseAmount) || "-"
                  }
                  subTitle="Expense Amount"
                />
              </div>
              <div className="col-lg-4">
                <CircleButton
                  icon={<img src={moneyIcon} alt="iBOS" />}
                  title={numberWithCommas(singleData[0]?.strExpenseType) || "-"}
                  subTitle="Expense Type"
                />
              </div>
              <div className="col-12">
                <div className="card-save-border"></div>
              </div>
              <div className="col-12">
                <div className="salary-breakdown-details">
                  <div className="row">
                    <div className="col-6">
                      <h2>Description</h2>
                      {singleData[0]?.strDiscription && (
                        <p
                          style={{
                            margin: "6px 0 0",
                            fontWeight: "400",
                            fontSize: "12px",
                            lineHeight: "18px",
                            color: gray700,
                          }}
                        >
                          {singleData[0]?.strDiscription || "N/A"}
                        </p>
                      )}
                    </div>
                    <div className="col-6 d-flex flex-column flex-wrap">
                      <h2>Attachment</h2>
                      <div className="d-flex flex-wrap">
                        {imgRow?.length
                          ? imgRow.map((image, i) => (
                              <p
                                key={i}
                                style={{
                                  margin: "6px 0 0",
                                  fontWeight: "400",
                                  fontSize: "12px",
                                  lineHeight: "18px",
                                  color: "#009cde",
                                  cursor: "pointer",
                                }}
                              >
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        image?.intDocURLId
                                      )
                                    );
                                  }}
                                >
                                  {image?.intDocURLId !== 0 && (
                                    <>
                                      <FilePresentOutlined />{" "}
                                      {`Attachment_${i + 1}`}
                                    </>
                                  )}
                                </span>
                              </p>
                            ))
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelfExpenseApplicationView;

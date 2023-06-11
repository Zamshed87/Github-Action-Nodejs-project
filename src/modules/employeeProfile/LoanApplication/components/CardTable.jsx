import {
  Attachment,
  CreateOutlined,
  DeleteOutline,
  InfoOutlined,
} from "@mui/icons-material";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/system";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import AvatarComponent from "../../../../common/AvatarComponent";
import Chips from "../../../../common/Chips";
// import SortingIcon from "../../../../common/SortingIcon";
import { getDownlloadFileView_Action } from "../../../../commonRedux/auth/actions";
import {
  dateFormatter,
  dateFormatterForInput,
} from "../../../../utility/dateFormatter";
import { numberWithCommas } from "../../../../utility/numberWithCommas";
import "../application.css";
import { loanCrudAction } from "../helper.js";
// import { gray600 } from "../../../../utility/customColor"
const CardTable = ({
  rowDto,
  setRowDto,
  setView,
  getData,
  setSingleData,
  setShow,
  setFileId,
  permission,
  setLoading,
}) => {
  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#fff !important",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#fff",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 300,
      boxShadow:
        "0px 1px 5px rgba(0, 0, 0, 0.05), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 5px rgba(0, 0, 0, 0.05)",
      fontSize: 11,
    },
  }));

  // const [order, setOrder] = useState({
  //   employeeOrder: "desc",
  //   designationOrder: "desc",
  //   departmentOrder: "desc"
  // })
  const { employeeId, orgId, buId, wgId } = useSelector(
    (state) => state?.auth?.profileData,
    shallowEqual
  );

  const setSingleDataAction = (data) => {
    setSingleData({
      employee: {
        label: data?.employeeName,
        value: data?.employeeId,
        code: data?.employeeCode,
        designation: data?.designationName,
        department: data?.departmentName,
      },
      loanType: {
        value: data?.loanTypeId,
        label: data?.loanType,
      },
      insertDateTime: data?.insertDateTime,
      loanAmount: data?.loanAmount,
      installmentNumber: data?.numberOfInstallment,
      amountPerInstallment: data?.numberOfInstallmentAmount,
      description: data?.description,
      effectiveDate: dateFormatterForInput(data?.effectiveDate),
      fileUrl: data?.fileUrl,
      loanApplicationId: data?.loanApplicationId,
      status: data?.applicationStatus,
      approveLoanAmount: data?.approveLoanAmount || data?.loanAmount,
      approveInstallmentNumber:
        data?.approveNumberOfInstallment || data?.numberOfInstallment,
      approveAmountPerInstallment:
        data?.approveNumberOfInstallmentAmount ||
        data?.numberOfInstallmentAmount,
      intCreatedBy: data?.intCreatedBy,
    });
    setFileId(data?.fileUrl);
  };

  const dispatch = useDispatch();

  // const commonSortByFilter = (filterType, property) => {
  //   const newRowData = [...rowDto];
  //   let modifyRowData = [];

  //   if (filterType === "asc") {
  //     modifyRowData = newRowData?.sort((a, b) => {
  //       if (a[property] > b[property]) return -1;
  //       return 1;
  //     });
  //   } else {
  //     modifyRowData = newRowData?.sort((a, b) => {
  //       if (b[property] > a[property]) return -1;
  //       return 1;
  //     });
  //   }
  //   setRowDto(modifyRowData);
  // };

  return (
    <>
      {rowDto?.map((data, index) => (
        <tr
          className="hasEvent"
          onClick={() => {
            setSingleDataAction(data);
            setView(true);
          }}
          key={index}
        >
          <td>
            <div className="tableBody-title pl-1">{index + 1}</div>
          </td>
          <td>
            <div className="tableBody-title">{data?.employeeCode}</div>
          </td>
          <td className="fixed-column" style={{ left: "125px" }}>
            <div className="employeeInfo d-flex align-items-center">
              <AvatarComponent letterCount={1} label={data?.employeeName} />
              <div className="employeeTitle ml-3">
                <p className="tableBody-title employeeName text-nowrap">
                  {data?.employeeName}
                </p>
              </div>
            </div>
          </td>
          <td>
            <div className="tableBody-title">{data?.designationName}</div>
          </td>
          <td>
            <div className="tableBody-title">{data?.departmentName}</div>
          </td>
          <td>
            <div className="d-flex align-items-center justify-content-start tableBody-title">
              <div className="pr-1">
                <LightTooltip
                  title={
                    <div className="application-tooltip">
                      <h6>Reason</h6>
                      <h5>{data?.description}</h5>
                      <h6 className="pt-2">Effective Date</h6>
                      <h5> {dateFormatter(data?.effectiveDate)}</h5>
                      <h6 className="pt-2">Attachment</h6>
                      {data?.fileUrl ? (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              getDownlloadFileView_Action(data?.fileUrl)
                            );
                          }}
                        >
                          <div
                            className="text-decoration-none file text-primary"
                            style={{ cursor: "pointer" }}
                          >
                            <Attachment /> Attachment
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  }
                >
                  <InfoOutlined />
                </LightTooltip>
              </div>

              {data?.loanType}
            </div>
          </td>
          <td className="text-right">
            <div className="tableBody-title">
              {numberWithCommas(data?.loanAmount)}
            </div>
          </td>
          <td className="text-right">
            <div className="tableBody-title">
              {numberWithCommas(data?.numberOfInstallmentAmount)}
            </div>
          </td>
          <td className="text-center">
            <div className="tableBody-title">{data?.numberOfInstallment}</div>
          </td>
          <td className="text-right">
            <div className="tableBody-title">
              {numberWithCommas(data?.approveLoanAmount)}
            </div>
          </td>
          <td className="text-right">
            <div className="tableBody-title">
              {numberWithCommas(data?.approveNumberOfInstallmentAmount)}
            </div>
          </td>
          <td className="text-center">
            <div className="tableBody-title">
              {data?.approveNumberOfInstallment}
            </div>
          </td>
          <td>
            <div className="d-flex align-items-center">
              {data?.applicationStatus === "Approved" && (
                <Chips label={data?.applicationStatus} classess="success" />
              )}
              {data?.applicationStatus === "Pending" && (
                <Chips label={data?.applicationStatus} classess="warning" />
              )}
              {data?.applicationStatus === "Rejected" && (
                <Chips label={data?.applicationStatus} classess="danger" />
              )}
              {data?.applicationStatus === "Process" && (
                <Chips label={data?.applicationStatus} classess="primary" />
              )}
            </div>
          </td>
          <td>
            <div className="d-flex align-items-center">
              <div className="d-flex mr-2">
                {data?.installmentStatus === "Completed" && (
                  <Chips label={data?.installmentStatus} classess="success" />
                )}
                {data?.installmentStatus === "Running" && (
                  <Chips label={data?.installmentStatus} classess="primary" />
                )}
                {data?.installmentStatus === "Not Started" && (
                  <Chips label={data?.installmentStatus} classess="danger" />
                )}
                {data?.installmentStatus === "Hold" && (
                  <Chips label={data?.installmentStatus} classess="danger" />
                )}
              </div>
              <div>
                {data?.applicationStatus === "Pending" && (
                  <div className="d-flex">
                    <Tooltip title="Edit" arrow>
                      <button
                        type="button"
                        className="iconButton"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSingleDataAction(data);
                          setShow(true);
                        }}
                      >
                        <CreateOutlined />
                      </button>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <button
                        type="button"
                        className="iconButton"
                        onClick={(e) => {
                          e.stopPropagation();
                          loanCrudAction(
                            { loanApplicationId: data?.loanApplicationId },
                            getData,
                            setLoading,
                            employeeId,
                            null,
                            orgId,
                            true,
                            buId,
                            wgId
                          );
                        }}
                      >
                        <DeleteOutline />
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default CardTable;

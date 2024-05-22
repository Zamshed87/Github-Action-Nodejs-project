import { Cancel, CheckCircle } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import axios from "axios";
import Chips from "common/Chips";
import FormikCheckBox from "common/FormikCheckbox";
import MuiIcon from "common/MuiIcon";
import { toast } from "react-toastify";
import {
  failColor,
  gray900,
  greenColor,
  successColor,
} from "utility/customColor";
import { dateFormatter } from "utility/dateFormatter";
import { numberWithCommas } from "utility/numberWithCommas";


// search
export const filterData = (keywords, allData, setRowDto) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    const newDta = allData?.filter((item) =>
      regex.test(item?.strPayrollGroup?.toLowerCase())
    );
    setRowDto(newDta);
  } catch (error) {
    setRowDto([]);
  }
};

export const getBonusGenerateRequestReport = async (
  payload,
  setter,
  setAllData,
  setLoading,
  cb
) => {
  setLoading && setLoading(true);
  try {
    const res = await axios.post(
      `/ApprovalPipeline/BonusGenerateHeaderLandingEngine`,
      payload
    );
    if (res?.data?.listData) {
      console.log("res",res?.data)
      setAllData && setAllData(res?.data?.listData);
      cb && cb(res?.data?.listData);
      setter(res?.data?.listData);
      setLoading && setLoading(false);
    }
  } catch (error) {
    setLoading && setLoading(false);
  }
};

export const bonusApproveRejectRequest = async (payload, cb) => {
  try {
    const res = await axios.post(
      `/ApprovalPipeline/BonusGenerateHeaderApprovalEngine`,
      payload
    );
    const message = payload?.[0]?.isReject ? "Application Rejected" : "Application Approved";
    toast.success(res?.data?.message || message);
    cb && cb();
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};

export const bonusApprovalTableColumn = ({
  setFieldValue,
  setFilterData,
  rowData,
  filterData,
  setRowData,
  demoPopupForTable,
}) => {
  console.log("rowData",rowData)
  return [
    {
      title: "SL",
      dataIndex: "SL",
      render: (text, record, index) => index + 1,
      width: "50px",
    },
    {
      title: () => (
        <div className="d-flex align-items-center">
          <div className="mr-2">
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                padding: "0 !important",
                color: gray900,
                checkedColor: greenColor,
              }}
              name="allSelected"
              checked={
                filterData?.length > 0 &&
                filterData?.every((item) => item?.selectCheckbox)
              }
              onChange={(e) => {
                e.stopPropagation();
                setRowData(
                  rowData?.map((item) => ({
                    ...item,
                    selectCheckbox: e.target.checked,
                  }))
                );
                setFilterData(
                  filterData?.map((item) => ({
                    ...item,
                    selectCheckbox: e.target.checked,
                  }))
                );
                setFieldValue("allSelected", e.target.checked);
              }}
            />
          </div>
        </div>
      ),
      dataIndex: "",
      render: (_, data) => (
        <div className="d-flex align-items-center">
          <div className="mr-2" onClick={(e) => e.stopPropagation()}>
            <FormikCheckBox
              styleObj={{
                margin: "0 auto!important",
                color: gray900,
                checkedColor: greenColor,
                padding: "0px",
              }}
              name="selectCheckbox"
              color={greenColor}
              checked={data?.selectCheckbox}
              onChange={(e) => {
                e.stopPropagation();
                setRowData(
                  rowData?.map((item) => {
                    if (
                      item?.application?.intBonusHeaderId ===
                      data?.application?.intBonusHeaderId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  })
                );
                setFilterData(
                  filterData?.map((item) => {
                    if (
                      item?.application?.intBonusHeaderId ===
                      data?.application?.intBonusHeaderId
                    ) {
                      return {
                        ...item,
                        selectCheckbox: e.target.checked,
                      };
                    } else return item;
                  })
                );
              }}
            />
          </div>
        </div>
      ),
      width: "50px",
    },
    {
      title: "Bonus Name",
      dataIndex: "strBonusName",
      sorter: true,
    },
    {
      title: "Effective Date",
      dataIndex: "dteEffectedDateTime",
      render: (dteEffectedDateTime) => dateFormatter(dteEffectedDateTime),
      className: "text-center",
    },
    {
      title: "Bonus Amount",
      dataIndex: "numBonusAmount",
      render: (numBonusAmount) => numberWithCommas(numBonusAmount),
      className: "text-right",
      sorter: true,
      isNumber: true,
    },
    {
      title: "Status",
      dataIndex: "strStatus",
      render: (_, record) => (
        <div className="text-center action-chip">
          {record?.application?.strStatus === "Approved" && (
            <Chips label="Approved" classess="success" />
          )}

          {record?.application?.strStatus === "Pending" && (
            <>
              <div className="actionChip">
                <Chips label="Pending" classess=" warning" />
              </div>
              <div className="d-flex actionIcon justify-content-center">
                <Tooltip title="Approve">
                  <div
                    className="mx-2 muiIconHover success "
                    onClick={(e) => {
                      e.stopPropagation();
                      demoPopupForTable(
                        "approve",
                        "Approve",
                        record
                      );
                    }}
                  >
                    <MuiIcon
                      icon={<CheckCircle sx={{ color: successColor }} />}
                    />
                  </div>
                </Tooltip>
                <Tooltip title="Reject">
                  <div
                    className="muiIconHover  danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      demoPopupForTable(
                        "reject",
                        "Reject",
                        record
                      );
                    }}
                  >
                    <MuiIcon icon={<Cancel sx={{ color: failColor }} />} />
                  </div>
                </Tooltip>
              </div>
            </>
          )}
        </div>
      ),
      width: "150px",
      className: "text-center",
    },
  ];
};

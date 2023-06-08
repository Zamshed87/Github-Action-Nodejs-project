import { EditOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import moment from "moment";
import { gray600 } from "../../../utility/customColor";
import { dateFormatter } from "../../../utility/dateFormatter";

export const filterDataOfTaxChallanLanding = (
  keywords,
  mainChallanData,
  setTempChallanData
) => {
  try {
    const regex = new RegExp(keywords?.toLowerCase());
    let newDta = mainChallanData?.filter(
      (item) =>
        regex.test(item?.strFiscalYearDateRange?.toLowerCase()) ||
        regex.test(item?.strCircle?.toLowerCase()) ||
        regex.test(item?.strZone?.toLowerCase()) ||
        regex.test(item?.strChallanNo?.toLowerCase()) ||
        regex.test(item?.strBankName?.toLowerCase()) ||
        regex.test(item?.dteChallanDate?.toLowerCase())
    );
    setTempChallanData(newDta);
  } catch {
    setTempChallanData([]);
  }
};

export const taxChallanConfigTablecolumns = (setShow, setRowId) => {
  return [
    {
      title: (
        <p
          style={{
            fontSize: "12px",
            color: gray600,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          SL
        </p>
      ),
      dataIndex: "sl",
      sorter: false,
      filter: false,
      className: "text-center",
    },
    {
      title: () => <span style={{ color: gray600 }}>Fiscal Year</span>,
      dataIndex: "strFiscalYearDateRange",
    },
    {
      title: "Circle",
      dataIndex: "strCircle",
      sorter: true,
      filter: true,
    },
    {
      title: "Zone",
      dataIndex: "strZone",
      sorter: true,
      filter: true,
    },
    {
      title: "Challan Number",
      dataIndex: "strChallanNo",
      sorter: true,
      filter: true,
    },
    {
      title: () => <span style={{ color: gray600 }}>Challan Date</span>,
      render: (_, record) =>
        record?.dteChallanDate ? dateFormatter(record?.dteChallanDate) : "N/A",
    },
    {
      title: "Bank Name",
      dataIndex: "strBankName",
      sorter: true,
      filter: true,
    },
    {
      className: "text-center",
      render: (_, record) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Edit" arrow>
            <button className="iconButton" type="button">
              <EditOutlined
                onClick={() => {
                  setShow(true);
                  setRowId(record?.intTaxChallanConfigId);
                }}
              />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];
};

export const onGetTaxChallanById = (
  getTaxChallanInfo,
  taxChallanId,
  setValues
) => {
  getTaxChallanInfo(
    `/SaasMasterData/GetTaxchallanConfigById?id=${taxChallanId}`,
    (response) => {
      setValues((prev) => ({
        ...prev,
        intTaxChallanConfigId: response?.intTaxChallanConfigId,
        year: {
          label: response?.intYear,
          value: response?.intYear,
        },
        fiscalYearRange: {
          label: response?.strFiscalYearDateRange,
          value: response?.intFiscalYearId,
        },
        fromDate: response?.dteFiscalFromDate
          ? moment(response?.dteFiscalFromDate).format("yyyy-MM-DD")
          : null,
        toDate: response?.dteFiscalToDate
          ? moment(response?.dteFiscalToDate).format("yyyy-MM-DD")
          : null,
        circle: response?.strCircle,
        zone: response?.strZone,
        challanNumber: response?.strChallanNo,
        bankName: {
          label: response?.strBankName,
          value: response?.intBankId,
        },
        dteChallanDate: response?.dteChallanDate
          ? moment(response?.dteChallanDate).format("yyyy-MM-DD")
          : null,
        intActionBy: response?.intActionBy,
        intCreatedBy: response?.intCreatedBy,
        dteCreatedAt: response?.dteCreatedAt,
      }));
    }
  );
};

export const onCreateTaxChallanConfig = (
  formValues,
  profileData,
  createTaxChallanConfig,
  onHide,
  resetForm
) => {
  const payload = {
    intTaxChallanConfigId: formValues?.intTaxChallanConfigId || 0,
    intYear: formValues?.year?.value,
    dteFiscalFromDate: formValues?.fromDate,
    dteFiscalToDate: formValues?.toDate,
    strCircle: formValues?.circle,
    strZone: formValues?.zone,
    strChallanNo: formValues?.challanNumber,
    strBankName: formValues?.bankName?.label,
    intBankId: formValues?.bankName?.value,
    intAccountId: profileData?.orgId,
    intFiscalYearId: formValues?.fiscalYearRange?.value,
    intActionBy: formValues?.intActionBy || profileData?.employeeId,
    intCreatedBy: formValues?.intCreatedBy || profileData?.employeeId,
    intUpdatedBy: formValues?.intTaxChallanConfigId
      ? profileData?.employeeId
      : 0,
    dteChallanDate: formValues?.dteChallanDate,
    dteCreatedAt: formValues?.dteCreatedAt,
    dteUpdatedAt: formValues?.dteUpdatedAt,
  };
  createTaxChallanConfig(
    `/SaasMasterData/SaveTaxChallanConfig`,
    payload,
    () => {
      onHide();
      resetForm();
    },
    true
  );
};

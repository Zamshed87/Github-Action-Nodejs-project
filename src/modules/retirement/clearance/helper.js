import { CheckCircleTwoTone, EyeTwoTone } from "@ant-design/icons";
import { InfoOutlined } from "@mui/icons-material";
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { Form, Tooltip } from "antd";
import axios from "axios";
import Chips from "common/Chips";
import IConfirmModal from "common/IConfirmModal";
import { LightTooltip } from "common/LightTooltip";
import MasterFilter from "common/MasterFilter";
import PrimaryButton from "common/PrimaryButton";
import moment from "moment";
import { gray900 } from "utility/customColor";
import { dateFormatter } from "utility/dateFormatter";

// Utility function to format dates
export const formatDate = (date) => moment(date).format("YYYY-MM-DD");

export const statusDDL = [
    { value: "", label: "All" },
    { value: "Pending", label: "Pending" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Approved", label: "Approved" },
    { value: "Withdrawn", label: "Withdrawn" },
    { value: "Clearance", label: "Clearance" },
    { value: "Final Settlement Completed", label: "Final Settlement Completed" },
    { value: "Released", label: "Released" },
];

// SearchFilter Component
export const SearchFilter = ({ form, pages, getData }) => {
    const values = Form.useWatch([], form);

    return (
        <MasterFilter
            inputWidth="200"
            width="200px"
            isHiddenFilter
            value={values?.search}
            setValue={(value) => {
                form.setFieldValue("search", value);
                getData(pages, value || "");
            }}
            cancelHandler={() => {
                form.setFieldValue("search", "");
                getData(pages, "");
            }}
        />
    );
};

export const getClearanceLanding = async (
    partType = "",
    buId,
    wgId,
    fromDate,
    toDate,
    status,
    search,
    setter,
    setLoading,
    pageNo,
    pageSize,
    setPages,
    wId,
    empId,
    workplaceGroupList,
    workplaceList
) => {
    try {
        setLoading && setLoading(true);
        const payload = {
            pageSize,
            pageNo,
            businessUnitId: buId,
            workplaceGroupId: wgId,
            workplaceId: wId,
            employeeId: empId,
            fromDate,
            toDate,
            isForXl: false,
            searchTxt: search,
            status,
            separationTypeIds: "",
            departments: "",
            designations: "",
            workplaceGroupList,
            workplaceList,
        };

        const res = await axios.get("/SeparationClearance/GetEmployeeSeparations", {
            params: payload,
        });

        if (res?.data) {
            if (partType === "Clearance") {
                setter(res?.data?.data);
                setPages({
                    current: res?.data?.pageNo,
                    pageSize: res?.data?.pageSize,
                    total: res?.data?.totalCount,
                });
            }
        }

        setLoading && setLoading(false);
    } catch (error) {
        setLoading && setLoading(false);
    }
};

export const getClearanceLandingTableColumn = (
    page,
    paginationSize,
    postClearanceData,
    postReleaseData,
    setOpenExitInterviewDataViewModal,
    getData,
    id,
    setId,
    empId,
    setEmpId,
) => {
    const confirmClearancePopup = (sepId, employeeId) => {
        const confirmObject = {
            closeOnClickOutside: false,
            message: "Are you sure you want to send this application for Clearance?",
            yesAlertFunc: () => {
                postClearanceData(
                    `/Separation/StartSeparationClearance?id=${sepId}&employeeId=${employeeId}`,
                    "",
                    () => {
                        getData();
                    },
                    true
                );
            },
            noAlertFunc: () => {
                getData();
            },
        };
        IConfirmModal(confirmObject);
    };

    const confirmReleasePopup = (sepId) => {
        const confirmObject = {
            closeOnClickOutside: false,
            message: "Are you sure you want to release this application?",
            yesAlertFunc: () => {
                postReleaseData("Separation/ReleasedSeparation", { IntSeparationId: sepId, IsReleased: 1 }, () => {
                    getData();
                }, true)
            },
            noAlertFunc: () => {
                getData();
            },
        };
        IConfirmModal(confirmObject);
    };

    return [
        {
            title: "SL",
            render: (_, index) => (page - 1) * paginationSize + index + 1,
            sort: false,
            filter: false,
            className: "text-center",
        },
        {
            title: "Code",
            dataIndex: "strEmployeeCode",
            filter: false,
            fieldType: "string",
        },
        {
            title: "Employee",
            dataIndex: "strEmployeeName",
            filter: false,
            fieldType: "string",
        },
        {
            title: "Designation",
            dataIndex: "strDesignation",
            filter: false,
            fieldType: "string",
        },
        {
            title: "Department",
            dataIndex: "strDepartment",
            filter: false,
            fieldType: "string",
        },
        {
            title: "Separation Type",
            dataIndex: "strSeparationTypeName",
            filter: false,
            fieldType: "string",
        },
        {
            title: "Application Date",
            dataIndex: "dteSeparationDate",
            render: (data) => (
                <>
                    {data?.dteSeparationDate
                        ? dateFormatter(data?.dteSeparationDate)
                        : "N/A"}
                </>
            ),
            filter: false,
            fieldType: "date",
        },
        {
            title: "Last Working Date",
            dataIndex: "dteLastWorkingDate",
            render: (data) => (
                <>
                    {data?.dteLastWorkingDate
                        ? dateFormatter(data?.dteLastWorkingDate)
                        : "N/A"}
                </>
            ),
            filter: false,
            fieldType: "date",
        },
        {
            title: "Created By",
            dataIndex: "strCreatedBy",
            filter: false,
            fieldType: "string",
        },
        {
            title: "Created Date",
            dataIndex: "dteCreatedAt",
            render: (data) => (
                <>
                    {data?.dteCreatedAt
                        ? dateFormatter(data?.dteCreatedAt)
                        : "N/A"}
                </>
            ),
            filter: false,
            fieldType: "date",
        },
        {
            title: "Status",
            dataIndex: "approvalStatus",
            filter: false,
            render: (data) => (
                <div className="d-flex align-items-center">
                    <div>
                        <div className="content tableBody-title d-flex align-items-center">
                            <LightTooltip
                                title={
                                    <div className="p-1">
                                        <div className="mb-1">
                                            <table style={{ border: `1px solid #475467`, borderCollapse: "collapse" }}>
                                                <th style={{ border: `1px solid #475467`, margin: "10px", padding: "10px" }}><p><b>Charge Handover</b></p></th>
                                                <th style={{ border: `1px solid #475467`, margin: "10px", padding: "10px" }}><p><b>Exit Interview</b></p></th>
                                                <tr>
                                                    <td style={{ border: `1px solid #475467`, textAlign: "center", padding: "5px 0" }}>{data?.isHandedOverDone === true ? <Chips label="Done" classess="success p-2" /> : <Chips label="Not Done" classess="warning p-2" />}</td>
                                                    <td style={{ border: `1px solid #475467`, textAlign: "center", padding: "5px 0" }}>{data?.isExitInterviewDone === true ? <Chips label="Done" classess="success p-2" /> : <Chips label="Not Done" classess="warning p-2" />}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                }
                                arrow
                            >
                                <InfoOutlined
                                    sx={{
                                        color: gray900,
                                    }}
                                />
                            </LightTooltip>
                        </div>
                    </div>
                    <div className="ml-2">
                        {data?.approvalStatus === "Pending" && (
                            <Chips label="Pending" classess="warning p-2" />
                        )}
                        {data?.approvalStatus === "Cancelled" && (
                            <Chips label="Cancelled" classess="danger p-2" />
                        )}
                        {data?.approvalStatus === "Approved" && (
                            <Chips label="Approved" classess="success p-2" />
                        )}
                        {data?.approvalStatus === "Withdrawn" && (
                            <Chips label="Withdrawn" classess="danger p-2" />
                        )}
                        {data?.approvalStatus === "Clearance" && (
                            <Chips label="Clearance" classess="info p-2" />
                        )}
                        {data?.approvalStatus === "Final Settlement Completed" && (
                            <Chips label="Final Settlement Completed" classess="success p-2" />
                        )}
                        {data?.approvalStatus === "Released" && (
                            <Chips label="Released" classess="indigo p-2" />
                        )}
                    </div>
                </div>
            ),
            fieldType: "string",
        },
        {
            title: "Actions",
            dataIndex: "approvalStatus",
            render: (data) => (
                <div className="d-flex justify-content-evenly align-items-center">
                    <div>
                        {data?.approvalStatus && (
                            <Tooltip placement="top" color={"#34a853"} title={"View"}>
                                <PrimaryButton
                                    type="button"
                                    icon={<EyeTwoTone twoToneColor="#34a853" />}
                                    className={"iconButton"}
                                    customStyle={{
                                        height: "25px",
                                        width: "25px"
                                    }}
                                    onClick={() => {
                                        setId(data?.separationId)
                                        setEmpId(data?.intEmployeeId)
                                        setOpenExitInterviewDataViewModal(true);
                                    }}
                                />
                            </Tooltip>
                        )}
                    </div>
                    <div>
                        {data?.approvalStatus?.includes("Approved") && (
                            <Tooltip placement="top" color={"#34a853"} title={"Clearance"}>
                                <button
                                    className={"iconButton"}
                                    style={{
                                        height: "25px",
                                        width: "25px"
                                    }}
                                    type="button"
                                    onClick={() => {
                                        setId(data?.separationId)
                                        setEmpId(data?.intEmployeeId)
                                        confirmClearancePopup(data?.separationId, data?.intEmployeeId);
                                    }}
                                ><CheckCircleTwoTone twoToneColor="#34a853" />
                                </button>
                            </Tooltip>
                        )}
                        {data?.approvalStatus?.includes("Clearance") && (
                            <Tooltip placement="top" color={"#34a853"} title={"Release"}>
                                <button
                                    className={"iconButton"}
                                    style={{
                                        height: "25px",
                                        width: "25px"
                                    }}
                                    type="button"
                                    onClick={() => {
                                        setId(data?.separationId)
                                        setEmpId(data?.intEmployeeId)
                                        confirmReleasePopup(data?.separationId);
                                    }}
                                ><SendTwoToneIcon color="success" />
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>
            ),
        }
    ]
};

export const getSeparationLandingById = async (id, setter, setLoading) => {
    setLoading && setLoading(true);
    try {
        const res = await axios.get(
            `/separation/GetSeparationById/${id}`
        );

        const modifyRes = [res?.data]?.map((itm) => {
            return {
                ...itm,
                docArr:
                    itm?.strDocumentId?.length > 0 ? itm?.strDocumentId?.split(",") : [],
                halfReason:
                    itm?.strReason?.length > 120
                        ? itm?.strReason?.slice(0, 120)
                        : `${itm?.strReason?.slice(0, 120)}...`,
                fullReason: itm?.strReason,
            };
        });
        setter(modifyRes[0]);
        setLoading && setLoading(false);
    } catch (error) {
        setLoading && setLoading(false);
    }
};
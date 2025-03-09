import { EditTwoTone, EyeTwoTone, ProfileFilled, ProfileTwoTone } from "@ant-design/icons";
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import { Form, Tooltip } from "antd";
import axios from "axios";
import Chips from "common/Chips";
import IConfirmModal from "common/IConfirmModal";
import MasterFilter from "common/MasterFilter";
import PrimaryButton from "common/PrimaryButton";
import moment from "moment";
import { dateFormatter } from "utility/dateFormatter";

// Utility function to format dates
export const formatDate = (date) => moment(date).format("YYYY-MM-DD");

export const statusDDL = [
    { value: "", label: "All" },
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

export const getFinalSettlementLanding = async (
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

        const res = await axios.get("FinalSettlement/GetEmployeeSeparations", {
            params: payload,
        });

        if (res?.data) {
            if (partType === "FinalSettlement") {
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

export const getFinalSettlementLandingTableColumn = (
    page,
    paginationSize,
    history,
    setOpenFinalSettlementViewModal,
    getData,
    id,
    setId,
    empId,
    setEmpId,
) => {

    const confirmSendForApprovalPopup = (sepId, employeeId) => {
        const confirmObject = {
            closeOnClickOutside: false,
            message: "Are you sure you want to send this application for Approval?",
            yesAlertFunc: () => {
                console.log("Send for Approval", sepId, employeeId);
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

            filter: false,
        },
        {
            title: "Code",
            dataIndex: "strEmployeeCode",
            filter: false,
            fieldType: "string",
        },
        {
            title: "Employee Name",
            dataIndex: "strEmployeeName",
            filter: false,
            fieldType: "string",
        },
        {
            title: "Workplace",
            dataIndex: "strWorkplaceName",
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
            title: "Designation",
            dataIndex: "strDesignation",
            filter: false,
            fieldType: "string",
        },
        {
            title: "Supervisor",
            dataIndex: "strSupervisor",
            filter: false,
            fieldType: "string",
        },
        {
            title: "Line Manager",
            dataIndex: "strLineManager",
            filter: false,
            fieldType: "string",
        },
        {
            title: "Employment Type",
            dataIndex: "strEmploymentType",
            filter: false,
            fieldType: "string",
        },
        {
            title: "Joining Date",
            dataIndex: "dteJoiningDate",
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
            title: "Service Length",
            dataIndex: "serviceLength",
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
            title: "Status",
            dataIndex: "approvalStatus",
            filter: false,
            render: (data) => (
                <div>
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
            ),
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
            title: "Actions",
            dataIndex: "",
            render: (data) => (
                <div className="d-flex justify-content-evenly align-items-center">
                    {data?.intFinalSettlementId !== null && (
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
                                    setOpenFinalSettlementViewModal(true)
                                }}
                            />
                        </Tooltip>
                    )}
                    {data?.intFinalSettlementId === null && (
                        <Tooltip placement="top" color={"#34a853"} title={"Generate"}>
                            <PrimaryButton
                                type="button"
                                icon={<ProfileTwoTone twoToneColor="#34a853" />}
                                className={"iconButton"}
                                customStyle={{
                                    height: "25px",
                                    width: "25px"
                                }}
                                onClick={() => {
                                    setId(data?.separationId)
                                    setEmpId(data?.intEmployeeId)
                                    history.push(`/retirement/finalsettlement/generate/${data?.separationId}/${data?.intEmployeeId}`)
                                }}
                            />
                        </Tooltip>

                    )}
                    {data?.intFinalSettlementId !== null && (<Tooltip placement="top" color={"#34a853"} title={"Regenarate"}>
                        <PrimaryButton
                            type="button"
                            icon={<ProfileFilled style={{ color: "#34a853" }} />}
                            className={"iconButton"}
                            customStyle={{
                                height: "25px",
                                width: "25px"
                            }}
                            onClick={() => {
                                setId(data?.separationId)
                                setEmpId(data?.intEmployeeId)
                            }}
                        />
                    </Tooltip>)}
                    {data?.intFinalSettlementId !== null && (
                        <Tooltip placement="top" color={"#34a853"} title={"Edit"}>
                            <PrimaryButton
                                type="button"
                                icon={<EditTwoTone style={{ color: "#34a853" }} />}
                                className={"iconButton"}
                                customStyle={{
                                    height: "25px",
                                    width: "25px"
                                }}
                                onClick={() => {
                                    setId(data?.separationId)
                                    setEmpId(data?.intEmployeeId)
                                    history.push(`/retirement/finalsettlement/edit/${data?.intFinalSettlementId}`)
                                }}
                            />
                        </Tooltip>
                    )}
                    {data?.intFinalSettlementId !== null && (<Tooltip placement="top" color={"#34a853"} title={"Regenarate"}>
                        <PrimaryButton
                            type="button"
                            icon={<ProfileFilled style={{ color: "#34a853" }} />}
                            className={"iconButton"}
                            customStyle={{
                                height: "25px",
                                width: "25px"
                            }}
                            onClick={() => {
                                setId(data?.separationId)
                                setEmpId(data?.intEmployeeId)
                            }}
                        />
                    </Tooltip>)}
                    <Tooltip placement="top" color={"#34a853"} title={"Send For Approval"}>
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
                                confirmSendForApprovalPopup(data?.separationId, data?.intEmployeeId)
                            }}
                        ><SendTwoToneIcon color="success" />
                        </button>
                    </Tooltip>
                </div>
            ),
        }
    ]
};


export const dataFormatter = (data) => {
    if (data === null || data === 0 || data === undefined || data === "") {
        return 0
    }
    else {
        return `${data}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

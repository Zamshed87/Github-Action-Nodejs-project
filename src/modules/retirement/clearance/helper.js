import { CheckCircleTwoTone, EyeTwoTone } from "@ant-design/icons";
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
    { value: 0, label: "All" },
    { value: 1, label: "Pending" },
    { value: 2, label: "Approved" },
    { value: 3, label: "Rejected" },
    { value: 4, label: "Released" },
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

    const confirmReleasePopup = (sepId, employeeId) => {
        const confirmObject = {
            closeOnClickOutside: false,
            message: "Are you sure you want to release this application?",
            yesAlertFunc: () => {
                console.log("release", sepId, employeeId);
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
            sort: true,
            filter: false,
            fieldType: "string",
        },
        {
            title: "Employee",
            dataIndex: "strEmployeeName",
            sort: true,
            filter: false,
            fieldType: "string",
        },
        {
            title: "Designation",
            dataIndex: "strDesignation",
            sort: true,
            filter: false,
            fieldType: "string",
        },
        {
            title: "Department",
            dataIndex: "strDepartment",
            sort: true,
            filter: false,
            fieldType: "string",
        },
        {
            title: "Separation Type",
            dataIndex: "strSeparationTypeName",
            sort: true,
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
            sort: true,
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
            sort: true,
            filter: false,
            fieldType: "date",
        },
        {
            title: "Created By",
            dataIndex: "strCreatedBy",
            sort: true,
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
            sort: true,
            filter: false,
            fieldType: "date",
            width: 100,
        },
        {
            title: "Status",
            dataIndex: "approvalStatus",
            sort: true,
            filter: false,
            render: (item) => (
                <div className="d-flex justify-content-center">
                    {item?.approvalStatus?.includes("Approved") && (
                        <Chips
                            label="Approved"
                            classess="success p-2"
                        />
                    )}
                    {item?.approvalStatus === "Released" && (
                        <Chips
                            label="Released"
                            classess="indigo p-2 mr-2"
                        />
                    )}
                    {item?.approvalStatus === "Clearance" && (
                        <Chips
                            label="Clearance"
                            classess="danger p-2 mr-2"
                        />
                    )}
                </div>
            ),
            fieldType: "string",
            width: 50,
        },
        {
            title: "",
            dataIndex: "approvalStatus",
            render: (data) => (
                <div className="d-flex justify-content-evenly align-items-center">
                    <div>
                        {data?.approvalStatus && (
                            <Tooltip placement="top" color={"#34a853"} title={"View"}>
                                <PrimaryButton
                                    type="button"
                                    icon={<EyeTwoTone twoToneColor="#34a853" />}
                                    customStyle={{
                                        height: "30px",
                                        fontSize: "16px",
                                        padding: "0px 12px 0px 12px",
                                        border: "none",
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
                                    style={{
                                        height: "24px",
                                        fontSize: "12px",
                                        padding: "0px 12px 0px 12px",
                                        border: "none"
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
                                    style={{
                                        height: "24px",
                                        fontSize: "12px",
                                        padding: "0px 12px 0px 12px",
                                        border: "none"
                                    }}
                                    type="button"
                                    onClick={() => {
                                        setId(data?.separationId)
                                        setEmpId(data?.intEmployeeId)
                                        confirmReleasePopup(data?.separationId, data?.intEmployeeId);
                                    }}
                                ><SendTwoToneIcon color="success" />
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>
            ),
            width: 60,
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
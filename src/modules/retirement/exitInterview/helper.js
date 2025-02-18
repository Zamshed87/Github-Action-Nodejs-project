import { EyeTwoTone, HighlightTwoTone, ProfileTwoTone } from "@ant-design/icons";
import { Form, Tooltip } from "antd";
import axios from "axios";
import Chips from "common/Chips";
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

export const getExitInterviewLanding = async (
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
        let apiUrl = `/ExitInterview/GetEmployeeSeparations?BusinessUnitId=${buId}&WorkplaceId=${wId}&WorkplaceGroupId=${wgId}&FromDate=${fromDate}&ToDate=${toDate}&status=${status}&IsForXl=false&PageNo=${pageNo}&PageSize=${pageSize}&WorkplaceGroupList=${workplaceGroupList}&WorkplaceList=${workplaceList}`;

        search && (apiUrl += `&searchTxt=${search}`);
        empId && (apiUrl += `&EmployeeId=${empId}`);

        const res = await axios.get(apiUrl);

        if (res?.data) {
            if (partType === "ExitInterview") {
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

export const getExitInterviewLandingTableColumn = (
    page,
    paginationSize,
    setOpenExitInterviewAssignModal,
    setOpenExitInterviewDataViewModal,
    setId,
    setEmpId
) => {
    return [
        {
            title: "SL",
            render: (_, index) => (page - 1) * paginationSize + index + 1,
            sort: false,
            filter: false,
            className: "text-center",
            width: 30,
        },
        {
            title: "Assigned To",
            dataIndex: "strEmployeeName",
            width: 120,
            sort: true,
            filter: false,
        },
        {
            title: "Length of Service",
            dataIndex: "serviceLength",
            width: 50,
        },
        {
            title: "Date of Resign",
            dataIndex: "dteLastWorkingDate",
            render: (data) => (
                <>
                    {data?.dteLastWorkingDate
                        ? dateFormatter(data?.dteLastWorkingDate)
                        : "N/A"}
                </>
            ),
            width: 50,

        },
        {
            title: "Resign Status",
            dataIndex: "approvalStatus",
            sort: true,
            filter: false,
            render: (item) => (
                <div className="d-flex justify-content-center">
                    {item?.approvalStatus === "Approve" && (
                        <Chips
                            label="Approved"
                            classess="success p-2"
                        />
                    )}
                    {item?.approvalStatus === "Pending" && (
                        <Chips
                            label="Pending"
                            classess="warning p-2"
                        />
                    )}
                    {item?.approvalStatus === "Process" && (
                        <Chips
                            label="Process"
                            classess="primary p-2"
                        />
                    )}
                    {item?.approvalStatus === "Reject" && (
                        <Chips
                            label="Rejected"
                            classess="danger p-2 mr-2"
                        />
                    )}
                    {item?.approvalStatus === "Released" && (
                        <Chips
                            label="Released"
                            classess="indigo p-2 mr-2"
                        />
                    )}
                    {item?.approvalStatus === "Cancelled" && (
                        <Chips
                            label="Released"
                            classess="danger p-2 mr-2"
                        />
                    )}
                </div>
            ),
            fieldType: "string",
            width: 50,
        },
        {
            title: "Interview Completed By ",
            dataIndex: "strInterviewCompletedBy",
            width: 80,
            sort: true,
            filter: false,
        },
        {
            title: "Completed Date",
            dataIndex: "dteInterviewCompletedDate",
            render: (data) => (
                <>
                    {data?.dteInterviewCompletedDate
                        ? dateFormatter(data?.dteInterviewCompletedDate)
                        : "N/A"}
                </>
            ),
            width: 50,
        },
        {
            title: "Status",
            dataIndex: "strInterviewStatus",
            width: 60,
            sort: true,
            filter: false,
        },
        {
            title: "",
            dataIndex: "approvalStatus",
            render: (data) => (
                <div className="d-flex justify-content-evenly align-items-center">
                    {(data?.strInterviewStatus === "Not Assigned") && (
                        <Tooltip placement="top" color={"#34a853"} title={"Assign Questions"}>
                            <PrimaryButton
                                type="button"
                                icon={<ProfileTwoTone twoToneColor="#34a853" />}
                                customStyle={{
                                    height: "30px",
                                    fontSize: "16px",
                                    padding: "0px 12px 0px 12px",
                                    border: "none",
                                }}
                                onClick={() => {
                                    setId(data?.separationId)
                                    setEmpId(data?.intEmployeeId)
                                    setOpenExitInterviewAssignModal(true);
                                }}
                            />
                        </Tooltip>
                    )}
                    {(data?.strInterviewStatus === "Completed" || data?.strInterviewStatus === "Clearance" || data?.strInterviewStatus === "Assigned") && (
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
                    {data?.strInterviewStatus === "Assigned" && (
                        <Tooltip placement="top" color={"#34a853"} title={"Interview"}>
                            <PrimaryButton
                                type="button"
                                icon={<HighlightTwoTone twoToneColor="#34a853" />}
                                customStyle={{
                                    height: "30px",
                                    fontSize: "16px",
                                    padding: "0px 12px 0px 12px",
                                    border: "none",
                                }} />
                        </Tooltip>
                    )}
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
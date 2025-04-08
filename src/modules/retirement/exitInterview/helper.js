import { EyeTwoTone, ProfileTwoTone } from "@ant-design/icons";
import QuizIcon from '@mui/icons-material/Quiz';
import { Form, Tooltip } from "antd";
import axios from "axios";
import Chips from "common/Chips";
import MasterFilter from "common/MasterFilter";
import PrimaryButton from "common/PrimaryButton";
import moment from "moment";
import { toast } from "react-toastify";
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
    { value: "Clearance Running", label: "Clearance Running" },
    { value: "Clearance Completed", label: "Clearance Completed" },
    { value: "Final Settlement Completed", label: "Final Settlement Completed" },
    { value: "Released", label: "Released" },
    { value: "Rejected", label: "Rejected" },
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
    history,
    setOpenExitInterviewAssignModal,
    setOpenExitInterviewDataViewModal,
    setId,
    setEmpId,
    setQuestionId
) => {
    return [
        {
            title: "SL",
            render: (_, index) => (page - 1) * paginationSize + index + 1,
            sort: false,
            filter: false,
            className: "text-center",
        },
        {
            title: "Assigned To",
            dataIndex: "strEmployeeName",
            filter: false,
        },
        {
            title: "Length of Service",
            dataIndex: "serviceLength",
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
        },
        {
            title: "Resign Status",
            dataIndex: "approvalStatus",
            filter: false,
            render: (data) => (
                <div className="d-flex justify-content-center">
                    {data?.approvalStatus === "Pending" && (
                        <Chips label="Pending" classess="warning p-2" />
                    )}
                    {data?.approvalStatus === "Cancelled" && (
                        <Chips label="Cancelled" classess="danger p-2" />
                    )}
                    {data?.approvalStatus
                        ?.toLowerCase()
                        .includes("approved") && (
                            <Chips label="Approved" classess="success p-2" />
                        )}
                    {data?.approvalStatus === "Withdrawn" && (
                        <Chips label="Withdrawn" classess="danger p-2" />
                    )}
                    {data?.approvalStatus === "Clearance" && (
                        <Chips label="Clearance" classess="info p-2" />
                    )}
                    {data?.approvalStatus === "Clearance Running" && (
                        <Chips label="Clearance Running" classess="warning p-2" />
                    )}
                    {data?.approvalStatus === "Clearance Completed" && (
                        <Chips label="Clearance Completed" classess="success p-2" />
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
            title: "Interview Completed By ",
            dataIndex: "strInterviewCompletedBy",
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
        },
        {
            title: "Status",
            dataIndex: "strInterviewStatus",
            filter: false,
        },
        {
            title: "Actions",
            dataIndex: "approvalStatus",
            render: (data) => (
                <div className="d-flex justify-content-evenly align-items-center">
                    {(data?.strInterviewStatus === "Not Assigned") && (
                        <Tooltip placement="top" color={"#34a853"} title={"Assign Questions"}>
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
                                className={"iconButton"}
                                customStyle={{
                                    height: "25px",
                                    width: "25px"
                                }}
                                onClick={() => {
                                    setId(data?.separationId)
                                    setEmpId(data?.intEmployeeId)
                                    setQuestionId(data?.intQuestionAssignId)
                                    setOpenExitInterviewDataViewModal(true);
                                }}
                            />
                        </Tooltip>
                    )}
                    {data?.strInterviewStatus === "Assigned" && (
                        <Tooltip placement="top" color={"#34a853"} title={"Interview"}>
                            <PrimaryButton
                                type="button"
                                icon={<QuizIcon sx={{ color: "#34a853" }} />}
                                className={"iconButton"}
                                customStyle={{
                                    height: "25px",
                                    width: "25px"
                                }}
                                onClick={() => {
                                    history.push("/SelfService/separation/applicationV2/interView", {
                                        data: data,
                                    });
                                }}
                            />
                        </Tooltip>
                    )}
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

export const getQuestionaireById = async (id, setData, setLoading, setOpen) => {
    setLoading && setLoading(true);
    try {
        const res = await axios.get(`/Questionnaire/AssignedTo/${id}`);
        setData(res.data);
        setOpen && setOpen(true);
    } catch (error) {
        toast.warning("Something went wrong");
    } finally {
        setLoading && setLoading(false);
    }
};


export const interViewQuestionSave = async (
    data,
    fieldsArr,
    values,
    setLoading,
    cb
) => {
    setLoading(true);
    try {
        const payload = {
            EmployeeId: data?.intEmployeeId || 0,
            SeparationId: data?.separationId || 0,
            Request: {
                id: data?.intQuestionAssignId || 0,
                startDateTime: values?.startTime,
                endDateTime: moment().format("YYYY-MM-DDTHH:mm:ss"),
                questions: fieldsArr.map((field) => {
                    const id = `field-${field.id}`;
                    const answer = values[id];

                    return {
                        id: field.id,
                        answer: field.typeName === "Checkbox" ? answer : [answer] || [],
                    };
                }),
            },
        };


        const res = await axios.post(`/ExitInterview/SubmitExitInterview`, payload);
        cb && cb();
        toast.success(res?.data?.Message, { toastId: 1 });
    } catch (error) {
        toast.warn(error?.response?.data?.Message || "Something went wrong", {
            toastId: 1,
        });
    } finally {
        setLoading(false);
    }
};
import axios from "axios";
// import moment from "moment";
import { toast } from "react-toastify";

// export const getTargetFrequency = ({
//     frequency,
//     year,
//     setTargetList,
// }) => {
//     if (frequency === "Monthly") {
//         let startMonth = moment(
//             `Jun, ${year?.label?.split("-")[0]}`,
//             "MMM, YYYY"
//         );
//         let next12Months = [];
//         for (let i = 0; i < 12; i++) {
//             next12Months.push({
//                 title: startMonth.add(1, "month").format("MMM, YYYY"),
//                 target: "",
//                 actual: "",
//                 remarks: "",
//                 attachment: "",
//                 id: i + 13,
//             });
//         }
//         setTargetList(next12Months);
//     } else if (frequency === "Quarterly") {
//         let quarters = [];
//         for (let i = 0; i < 4; i++) {
//             quarters.push({
//                 title: `Quarter-${i + 1}`,
//                 mtarget: "",
//                 actual: "",
//                 remarks: "",
//                 attachment: "",
//                 id: i + 1,
//             });
//         }
//         setTargetList(quarters);
//     } else if (frequency === "Yearly") {
//         setTargetList([{
//             title: year?.label,
//             target: "",
//             actual: "",
//             remarks: "",
//             attachment: "", id: 1
//         }]);
//     } else {
//         setTargetList([]);
//     }
// };

export const attachment_action = async (
    accountId,
    tableReferrence,
    documentTypeId,
    buId,
    userId,
    attachment,
    setLoading
) => {
    setLoading && setLoading(true);
    let formData = new FormData();
    formData.append("files", attachment[0]);
    try {
        let { data } = await axios.post(`/Document/UploadFile?accountId=${accountId}&tableReferrence=${tableReferrence}&documentTypeId=${documentTypeId}&businessUnitId=${buId}&createdBy=${userId}`,
            formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
        );
        setLoading && setLoading(false);
        toast.success("Upload  successfully");
        return data;
    } catch (error) {
        setLoading && setLoading(false);
        toast.error("File Size is too large or inValid File!");
        return error;
    }
};
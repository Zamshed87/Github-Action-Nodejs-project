import { Form } from "antd";
import MasterFilter from "common/MasterFilter";
import moment from "moment";
// Utility function to format dates
export const formatDate = (date) => moment(date).format("YYYY-MM-DD");

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
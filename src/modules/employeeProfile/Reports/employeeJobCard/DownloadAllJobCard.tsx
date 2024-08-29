import { Col, Form, Row, Tooltip } from "antd";
import { PButton, PForm, PInput } from "Components";
import moment from "moment";
import { monthFirstDate, monthLastDate } from "utility/dateFormatter";
import { custom26to25LandingDataHandler } from "./utils";
import { RangePickerProps } from "antd/es/date-picker";
import PInfo from "common/PInfo";
import { shallowEqual, useSelector } from "react-redux";

const DownloadAllJobCard = ({ propsObj }: any) => {
  const {
    profileData: { wName },
  } = useSelector((state: any) => state?.auth, shallowEqual);

  // Form Instance
  const [form] = Form.useForm();

  const { loading, setOpen } = propsObj;

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    const { fromDate } = form.getFieldsValue(true);
    const fromDateMoment = moment(fromDate, "MM/DD/YYYY");
    // Disable dates before fromDate and after next3daysForEmp
    return current && current < fromDateMoment.startOf("day");
  };

  return (
    <PForm
      form={form}
      initialValues={{
        fromDate: moment(monthFirstDate()),
        toDate: moment(monthLastDate()),
      }}
      onFinish={() => {}}
    >
      <Row gutter={[10, 2]}>
        <Col md={24} sm={24} xs={24}>
          <PInfo>
            <p>
              Download all employee job card of <strong>{wName}</strong> for the
              selected date range below{" "}
            </p>
          </PInfo>
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PInput
            type="date"
            name="fromDate"
            label="From Date"
            placeholder="From Date"
            onChange={(value) => {
              form.setFieldsValue({
                fromDate: value,
              });
            }}
          />
        </Col>
        <Col md={5} sm={12} xs={24}>
          <PInput
            type="date"
            name="toDate"
            label="To Date"
            placeholder="To Date"
            disabledDate={disabledDate}
            onChange={(value) => {
              form.setFieldsValue({
                toDate: value,
              });
            }}
          />
        </Col>

        <Col
          style={{
            marginTop: "23px",
          }}
        >
          <PButton
            type="primary"
            action="submit"
            content="Download"
            disabled={loading}
          />
        </Col>
        <Col
          style={{
            marginTop: "23px",
          }}
        >
          <Tooltip
            title="Previous Month 26 to Current Month 25"
            placement="bottom"
          >
            <PButton
              type="primary"
              action="button"
              content="Download Custom [26 - 25]"
              disabled={loading}
              onClick={() => {
                const { fromDate } = form.getFieldsValue(true);
                custom26to25LandingDataHandler(
                  fromDate,
                  (previousMonthStartDate: any, currentMonthEndDate: any) => {
                    form.setFieldsValue({
                      fromDate: moment(previousMonthStartDate),
                      toDate: moment(currentMonthEndDate),
                    });
                    setOpen(false);
                  }
                );
              }}
            />
          </Tooltip>
        </Col>
      </Row>
    </PForm>
  );
};

export default DownloadAllJobCard;

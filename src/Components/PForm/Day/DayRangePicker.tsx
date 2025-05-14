import { DatePicker, Form } from "antd";
import moment from "moment";
import "./style.css";

type Props = {
  name: string;
  type?: "day" | "dayRange";
  label?: string;
  rules?: any;
  format?: string;
  onChange?: (date: any, dateString: any) => void;
  allowedMonth?: number; // 0 = January
  allowedYear?: number;
  [key: string]: any; // Allow other DatePicker props
};

const DayRangePicker = ({
  name,
  type = "day",
  label,
  rules,
  format,
  onChange,
  allowedMonth = 0,
  allowedYear = moment().year(),
  ...restProps
}: Props) => {
  const isDayRange = type === "dayRange";
  const allowedMonthStart = moment({ year: allowedYear, month: allowedMonth, day: 1 });

  const disabledDate = (current: moment.Moment) => {
    return (
      current &&
      (current.month() !== allowedMonth || current.year() !== allowedYear)
    );
  };

  return (
    <div className="PeopleDeskInputWrapper">
      <Form.Item label={label} name={name} rules={rules}>
        {isDayRange ? (
          <DatePicker.RangePicker
            placeholder={["From Day", "To Day"]}
            onChange={onChange}
            style={{ width: "100%" }}
            format={format || "DD"}
            allowClear
            picker="date"
            disabledDate={disabledDate}
            defaultPickerValue={[allowedMonthStart, allowedMonthStart]}
            popupClassName="single-month-panel"
            {...restProps}
          />
        ) : (
          <DatePicker
            placeholder="Day"
            onChange={onChange}
            style={{ width: "100%" }}
            format={format || "DD"}
            allowClear
            picker="date"
            disabledDate={disabledDate}
            defaultPickerValue={allowedMonthStart}
            popupClassName="single-month-panel"
            {...restProps}
          />
        )}
      </Form.Item>
    </div>
  );
};

export default DayRangePicker;

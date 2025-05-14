import { DatePicker, Form } from "antd";
import moment from "moment";
import "./style.css";

type Props = {
  name: string;
  type?: "day" | "dayRange";
  label?: string;
  rules?: any;
  onChange?: (date: any, dateString: any) => void;
  [key: string]: any; // Allow other DatePicker props
};

const DayRangePicker = ({
  name,
  type = "day",
  label,
  format,
  rules,
  onChange,
  ...restProps
}: Props) => {
  const currentYear = moment().year();
  const januaryStart = moment(`${currentYear}-01-01`);
  const isDayRange = type === "dayRange";

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
            disabledDate={(current) =>
              current &&
              (current.month() !== 0 || current.year() !== currentYear)
            }
            defaultPickerValue={[januaryStart, januaryStart]}
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
            popupClassName="single-month-panel"
            {...restProps}
          />
        )}
      </Form.Item>
    </div>
  );
};

export default DayRangePicker;

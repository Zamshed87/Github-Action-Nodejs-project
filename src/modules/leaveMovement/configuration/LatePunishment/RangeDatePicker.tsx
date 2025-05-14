import { DatePicker, Form } from "antd";
import "./style.css";

const RangeDatePicker = ({ name }: any) => {
  return name === "dayRange" ? (
    <div className={`PeopleDeskInputWrapper`}>
      {" "}
      <Form.Item
        label={"Day Range"}
        name={name}
        rules={[{ required: true, message: "Day Range is required!" }]}

        //   valuePropName={type === "checkbox" ? "checked" : valuePropName}
        //   hasFeedback={hasFeedback}
        //   style={{ marginBottom: 0 }}
      >
        <DatePicker.RangePicker
          name={name}
          placeholder={["From Day", "To Day"]}
          onCalendarChange={(values) => {
            // setSelectedDates(values);
          }}
          onChange={(values: any, formatString: [string, string]) => {
            // Handle date change here
            console.log("Selected Range:", values, formatString);
          }}
          style={{ width: "100%" }}
          format={"DD"}
          allowClear={true}
          // disabledDate={disabledDate}
          picker={"date"}
          showTime={false}
          popupClassName="single-month-panel"
        />
      </Form.Item>
    </div>
  ) : (
    <div className={`PeopleDeskInputWrapper`}>
      {" "}
      <Form.Item
        label={"Each Day Count By"}
        name={name}
        //   rules={rules}
        //   valuePropName={type === "checkbox" ? "checked" : valuePropName}
        //   hasFeedback={hasFeedback}
        //   style={{ marginBottom: 0 }}
      >
        <DatePicker
          placeholder={"Day"}
          //   onChange={onChange as (date: any, dateString: string) => void}
          style={{ width: "100%" }}
          format={"DD"}
          // showTime={{ use12Hours: true }}
          allowClear={true}
          picker={"date"}
          popupClassName="single-month-panel"
        />
      </Form.Item>
    </div>
  );
};

export default RangeDatePicker;

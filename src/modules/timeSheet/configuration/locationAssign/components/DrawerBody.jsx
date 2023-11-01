import { SearchOutlined } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Avatar from "@mui/material/Avatar";
import * as React from "react";
import AvatarComponent from "../../../../../common/AvatarComponent";
import FormikCheckBox from "../../../../../common/FormikCheckbox";
import FormikInput from "../../../../../common/FormikInput";
import { greenColor } from "../../../../../utility/customColor";
export default function LocationAssignDrawerBody(props) {
  const { setFieldValue, values, setIsOpen } = props;
  const userInfo = [
    {
      name: "Md. Mridul Hasan",
      position: "Business Analyst, ",
      type: "Full-time",
      dept: "Engineering",
    },
    {
      name: "Md. Mridul Hasan",
      position: "Business Analyst, ",
      type: "Full-time",
      dept: "Engineering",
    },
    {
      name: "Md. Mridul Hasan",
      position: "Business Analyst, ",
      type: "Full-time",
      dept: "Engineering",
    },
  ];
  const [rowDto, setRowDto] = React.useState(userInfo);
  return (
    <div className="locationAssignMain">
      <div className="locationAssignHeader">
        <div
          className="headerTop d-flex align-items-center"
          style={{ padding: "24px" }}
        >
          <Avatar
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              marginRight: "16px",
            }}
          >
            <LocationOnIcon />
          </Avatar>
          <h4>Location</h4>
        </div>
        <div className="header-main">
          <FormikCheckBox
            styleObj={{
              margin: "0 auto!important",
              color: greenColor,
            }}
            label="Select All"
            name="allSelected"
            checked={rowDto?.every((item) => item?.selectCheckbox)}
            onChange={(e) => {
              setRowDto(
                rowDto?.map((item) => ({
                  ...item,
                  selectCheckbox: e.target.checked,
                }))
              );
              setFieldValue("allSelected", e.target.checked);
            }}
          />
          {/* <MasterFilter
            value={values?.search}
            setValue={(value) => {
              setFieldValue("search", value);
            }}
            cancelHandler={() => {
              setFieldValue("search", "");
            }}
            // handleClick={handleClick}
          /> */}
          <FormikInput
            classes="search-input "
            inputClasses="search-inner-input"
            placeholder="Search"
            value={values?.search}
            name="search"
            type="text"
            trailicon={<SearchOutlined sx={{ color: "#323232" }} />}
            // errors={errors}
            // touched={touched}
          />
        </div>
      </div>
      <div className="locationAssignBody">
        {userInfo.map((item, index) => {
          return (
            <div key={index} className="row-user-info-main">
              <FormikCheckBox
                styleObj={{
                  // marginTop: "-1rem !important",
                  color: greenColor,
                }}
                name="selectCheckbox"
                color={greenColor}
                checked={rowDto[index]?.selectCheckbox}
                onChange={(e) => {
                  let data = [...rowDto];
                  data[index].selectCheckbox = e.target.checked;
                  setRowDto([...data]);
                }}
              />

              <div className="avater-info-user d-flex">
                <AvatarComponent
                  classess={"mr-3 avater"}
                  isImage={true}
                  img={""}
                  alt={item.name}
                />

                <div className="info-user d-flex flex-col">
                  <div className="user-name">{item.name}</div>
                  <small className="position mb-1">
                    {item.position}, {item.type}
                  </small>
                  <small className="mb-1">{item.dept}</small>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="locationAssignFooter">
        <button
          className="form-btn form-btn-cancel"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
        <button className="form-btn form-btn-save">Save</button>
      </div>
    </div>
  );
}

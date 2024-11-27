import { toast } from "react-toastify";
import FormikSelect from "../../../../common/FormikSelect";
import { customStyles } from "../../../../utility/selectCustomStyle";
import { Close } from "@mui/icons-material";
import FormikInput from "../../../../common/FormikInput";

const ValuesCompetenciesCard = ({
  title,
  ddlOptions,
  selectedValuesCompetencies,
  setSelectedValuesCompetencies,
  planList,
  values,
  setFieldValue,
}) => {
  
  return (
    <div className="card-style" style={{ width: "49.3%", minHeight: "200px" }}>
      <div className="row mt-2 align-item-center">
        <div className="col-md-3">
          <p>{title}</p>
        </div>
        <div className="input-field-main col-md-5">
          <FormikSelect
            classes="input-sm form-control"
            options={ddlOptions || []}
            isDisabled={planList?.isConfirm}
            onChange={(valueOption) => {
              if (
                selectedValuesCompetencies?.some(
                  (item) => item?.value === valueOption?.value && item?.isActive
                )
              ) {
                toast.warn("Chip already exist");
              } else {
                setSelectedValuesCompetencies((prev) => {
                  if (typeof prev === "object") {
                    const filtered = prev?.filter(
                      (item) => item?.value !== valueOption?.value
                    );
                    return [...filtered, { ...valueOption, isActive: true }];
                  } else return [{ ...valueOption, isActive: true }];
                });
              }
            }}
            styles={customStyles}
          />
        </div>
      </div>
      <div>
        <ul className="d-flex">
          {selectedValuesCompetencies?.map((item, index) => {
            if (item?.isActive) {
              return (
                <>
                  <li
                    key={index}
                    style={{
                      backgroundColor: "#EEEEEE",
                      border: 0,
                    }}
                    className="chips success relative chips-two mr-1 mb-2"
                  >
                    {item?.label}
                    <span
                      className="pointer cross-chips-icon white"
                      onClick={() => {
                        const modifiedOpenList =
                          selectedValuesCompetencies?.map((nestedItem) => {
                            if (nestedItem?.value !== item?.value)
                              return nestedItem;
                            else
                              return {
                                ...nestedItem,
                                isActive: false,
                              };
                          });
                        setSelectedValuesCompetencies(modifiedOpenList);
                      }}
                    >
                      <Close sx={{ fontSize: "12px" }} />
                    </span>
                  </li>
                </>
              );
            } else {
              return <></>;
            }
          })}
        </ul>
      </div>
      <div className="input-field-main">
        <label>{title === "Core Values"? "Core Values Comment": "Core Competencies Comment"}</label>
        <FormikInput
          value={title === "Core Values"? values?.coreValuesComment: values?.coreCompetencyComment}
          name={title === "Core Values"? "coreValuesComment": "coreCompetencyComment"}
          classes="input-sm"
          onChange={(e) => {
            setFieldValue(title === "Core Values"? "coreValuesComment": "coreCompetencyComment",e.target.value);
          }}
          type="text"
          className="form-control"
        />
      </div>
    </div>
  );
};

export default ValuesCompetenciesCard;

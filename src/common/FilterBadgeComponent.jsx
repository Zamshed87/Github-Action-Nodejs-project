import { MdRefresh } from "react-icons/md";
import BadgeComponent from "./Badge";
import ResetButton from "./ResetButton";

const FilterBadgeComponent = ({ propsObj }) => {
  const {
    filterBages,
    setFieldValue,
    clearBadge,
    values,
    resetForm,
    initData,
    clearFilter,
    setIsAccordion, //this is only applicable for bulk allowance assign & deduction
    isAccordion, //this is only applicable for bulk allowance assign & deduction
    setIsFormOpen, //this is only applicable for bulk allowance assign & deduction
    setRowDto, //this is only applicable for bulk allowance assign & deduction
  } = propsObj;
  let newData = [];
  const checkIsObjectData = (arr) => {
    let newArr = arr.filter((item) => item);
    if (newArr.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  for (const value in filterBages) {
    if (filterBages[value]) {
      const data = {
        value: filterBages[value],
        name: value,
      };
      newData.push(data);
    }
  }
  return (
    <>
      {filterBages && checkIsObjectData(Object?.values(filterBages)) && (
        <div className="filter_chips_wrapper">
          <div className="d-flex align-items-center flex-wrap">
            {newData.map((item, index) => {
              return (
                <BadgeComponent
                  onClick={() => {
                    setFieldValue(item?.name, "");
                    clearBadge(values, item?.name);
                  }}
                  label={item?.value?.label || item?.value}
                  key={index}
                />
              );
            })}

            <ResetButton
              classes="btn-filter-reset"
              title="Reset"
              icon={
                <MdRefresh style={{ marginRight: "4px", fontSize: "15px" }} />
              }
              onClick={() => {
                resetForm(initData);
                clearFilter();
                setIsAccordion && setIsAccordion(!isAccordion); //this is only applicable for bulk allowance assign & deduction
                setIsFormOpen && setIsFormOpen(false); //this is only applicable for bulk allowance assign & deduction
                setRowDto && setRowDto([]); //this is only applicable for bulk allowance assign & deduction
              }}
              styles={{ height: "auto", fontSize: "12px" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBadgeComponent;

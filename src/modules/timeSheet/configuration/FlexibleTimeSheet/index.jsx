import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const FlexibleTimeSheet = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Flexible Timesheet";
    () => {
      document.title = "PeopleDesk";
    };
  }, []);

  return (
    <div>
      <h1>Holiday Offday Setup</h1>
    </div>
  );
};

export default FlexibleTimeSheet;

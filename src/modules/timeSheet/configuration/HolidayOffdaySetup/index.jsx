import { setFirstLevelNameAction } from "commonRedux/reduxForLocalStorage/actions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const HolidayOffdaySetup = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFirstLevelNameAction("Administration"));
    document.title = "Job Card";
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

export default HolidayOffdaySetup;

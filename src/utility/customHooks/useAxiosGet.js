import axios from "axios";
import { useState } from "react";

const useAxiosGet = (initValue) => {
  console.log("initValue", initValue)
  const [res, setRes] = useState(initValue || []);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = (url, cb) => {
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        setRes(res?.data);
        setLoading(false);
        cb && cb(res?.data);
      })
      .catch((err) => {
        setRes([]);
        setError(err);
        setLoading(false);
      });
  };

  return [res, getData, loading, setRes, error];
};

export default useAxiosGet;

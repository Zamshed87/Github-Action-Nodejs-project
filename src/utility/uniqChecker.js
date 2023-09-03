import { toast } from "react-toastify";

/*
Description
key : name that should be unique,
param : current value, which we will check for duplication
arr : array that will be used for iteration
hideToast : if true , it won't show toast message
*/

export const isUniq = (key, param, arr, hideToast) => {
  if (Array.isArray(arr)) {
    const isUnique = arr.filter((itm) => itm[key] === param).length < 1;
    if (isUnique) {
      return true;
    } else {
      !hideToast &&
        toast.warn("Not allowed to duplicate item!", { toastId: 456 });
      return false;
    }
  }
};

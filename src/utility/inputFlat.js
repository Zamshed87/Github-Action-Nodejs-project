export const flat = (obj) => {
  const out = {};
  const flatten = (obj, keyLabel) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] == "object") {
        if (Array.isArray(obj)) {
          flatten(obj[key], keyLabel ? keyLabel + "[" + key + "]" : key);
        } else {
          flatten(obj[key], keyLabel ? keyLabel + "." + key.toString() : key);
        }
      } else {
        if (Array.isArray(obj)) {
          out[keyLabel + "[" + key + "]"] = obj[key];
        } else {
          if (keyLabel) {
            out[keyLabel + "." + key] = obj[key];
          } else {
            out[key] = obj[key];
          }
        }
      }
    });
  };
  flatten(obj, "");
  return out;
};

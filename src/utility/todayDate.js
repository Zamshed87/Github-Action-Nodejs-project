export const todayDate = () => {
  var today = new Date();
  const todayDate =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);
  return todayDate;
};

export const toBn = (n) => n.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

/*
 * Title: Letter Config
 * Author: Khurshida Meem
 * Date: 23-10-2024
 *
 */

export const customFields = [
  { id: "", value: "[Employee Name]", label: "Employee Name" },
  { id: 2, value: "[Employee Code]", label: "Employee Code" },
  { id: 3, value: "[Designation]", label: "Designation" },
  { id: 4, value: "[Department]", label: "Department" },
  { id: 4, value: "[Salary]", label: "Salary" },
  { id: 4, value: "[Joining Date]", label: "Joining Date" },
  { id: "", value: "[Employee Name]", label: "Employee Name" },
  { id: 2, value: "[Employee Code]", label: "Employee Code" },
  { id: 3, value: "[Designation]", label: "Designation" },
  { id: 4, value: "[Department]", label: "Department" },
  { id: 4, value: "[Salary]", label: "Salary" },
  { id: 4, value: "[Joining Date]", label: "Joining Date" },
  { id: "", value: "[Employee Name]", label: "Employee Name" },
  { id: 2, value: "[Employee Code]", label: "Employee Code" },
  { id: 3, value: "[Designation]", label: "Designation" },
  { id: 4, value: "[Department]", label: "Department" },
  { id: 4, value: "[Salary]", label: "Salary" },
  { id: 4, value: "[Joining Date]", label: "Joining Date" },
  { id: "", value: "[Employee Name]", label: "Employee Name" },
  { id: 2, value: "[Employee Code]", label: "Employee Code" },
  { id: 3, value: "[Designation]", label: "Designation" },
  { id: 4, value: "[Department]", label: "Department" },
  { id: 4, value: "[Salary]", label: "Salary" },
  { id: 4, value: "[Joining Date]", label: "Joining Date" },
];

export const modules = {
  mention: {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    mentionDenotationChars: ["@"],
    source: function (searchTerm: any, renderList: any, mentionChar: any) {
      let MentionValue: any[] = [];

      if (mentionChar === "@") {
        MentionValue = customFields;
      }

      if (searchTerm.length === 0) {
        renderList(MentionValue, searchTerm);
      } else {
        const matches = [];
        for (let i = 0; i < MentionValue.length; i++)
          if (
            ~MentionValue[i].value
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase())
          )
            matches.push(MentionValue[i]);
        renderList(matches, searchTerm);
      }
    },
  },
  toolbar: [
    { header: [1, 2, 3, false] },
    "bold",
    "italic",
    "underline",
    "blockquote",
    { list: "ordered" },
    { list: "bullet" },
    { indent: "-1" },
    { indent: "+1" },
    { color: [] },
    { background: [] },
    { align: [] },
    "link",
    "",
    "",
  ],
  clipboard: {
    matchVisual: true,
  },
};

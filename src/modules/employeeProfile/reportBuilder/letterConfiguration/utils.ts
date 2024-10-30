/*
 * Title: Letter Config
 * Author: Khurshida Meem
 * Date: 23-10-2024
 *
 */

export const customFields = [
  { id: 1, value: "[Employee ID]", label: "Employee ID" },
  { id: 2, value: "[Employee Name]", label: "Employee Name" },
  { id: 3, value: "[Employee Code]", label: "Employee Code" },
  { id: 4, value: "[Designation]", label: "Designation" },
  { id: 5, value: "[Department]", label: "Department" },
  { id: 6, value: "[Section]", label: "Section" },
  { id: 7, value: "[HR Position]", label: "HR Position" },
  { id: 8, value: "[Employment Type]", label: "Employment Type" },
  { id: 9, value: "[Joining Date]", label: "Joining Date" },
  { id: 10, value: "[Service Length]", label: "Service Length" },
  { id: 11, value: "[Supervisor]", label: "Supervisor" },
  { id: 12, value: "[Religion]", label: "Religion" },
  { id: 13, value: "[Gender]", label: "Gender" },
  { id: 14, value: "[Date of Birth]", label: "Date of Birth" },
  { id: 15, value: "[Age]", label: "Age" },
  { id: 16, value: "[Blood Group]", label: "Blood Group" },
  { id: 17, value: "[Personal Email]", label: "Personal Email" },
  { id: 18, value: "[Personal Contact No]", label: "Personal Contact No" },
  { id: 19, value: "[NID]", label: "NID" },
  { id: 20, value: "[TIN No]", label: "TIN No" },
  { id: 21, value: "[Present Address]", label: "Present Address" },
  { id: 22, value: "[Permanent Address]", label: "Permanent Address" },
  { id: 23, value: "[Salary Type]", label: "Salary Type" },
  { id: 24, value: "[Gross Salary]", label: "Gross Salary" },
  { id: 25, value: "[Business Unit]", label: "Business Unit" },
  { id: 26, value: "[Workplace Group]", label: "Workplace Group" },
  { id: 27, value: "[Workplace]", label: "Workplace" },
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
    { size: ["small", false, "large", "huge"] },
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
    matchVisual: false,
  },
};

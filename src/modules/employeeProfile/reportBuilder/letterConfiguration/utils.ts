/*
 * Title: Letter Config
 * Author: Khurshida Meem
 * Date: 23-10-2024
 *
 */

import { Quill } from "react-quill";

const Delta = Quill.import("delta");
const Break = Quill.import("blots/break");
const Embed = Quill.import("blots/embed");

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

const lineBreakMatcher = () => {
  let newDelta = new Delta();
  newDelta.insert({ break: "" });
  return newDelta;
};

class SmartBreak extends Break {
  length() {
    return 1;
  }
  value() {
    return "\n";
  }

  insertInto(parent: any, ref: any) {
    Embed.prototype.insertInto.call(this, parent, ref);
  }
}

SmartBreak.blotName = "break";
SmartBreak.tagName = "BR";
Quill.register(SmartBreak);

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
    matchers: [["BR", lineBreakMatcher]],
    matchVisual: false,
  },
  // keyboard: {
  //   bindings: {
  //     linebreak: {
  //       key: 13,
  //       shiftKey: true,
  //       handler: function(range) {
  //         const currentLeaf = quill.getLeaf(range.index)[0];
  //         const nextLeaf = this.quill.getLeaf(range.index + 1)[0];
  //         this.quill.insertEmbed(range.index, "break", true, "user");
  //         // Insert a second break if:
  //         // At the end of the editor, OR next leaf has a different parent (<p>)
  //         if (nextLeaf === null || currentLeaf.parent !== nextLeaf.parent) {
  //           this.quill.insertEmbed(range.index, "break", true, "user");
  //         }
  //         // Now that we've inserted a line break, move the cursor forward
  //         this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
  //       }
  //     }
  //   }
  // }
};

// export const modules = {
//   mention: {
//     allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
//     mentionDenotationChars: ["@"],
//     source: function (searchTerm: any, renderList: any, mentionChar: any) {
//       let MentionValue: any[] = [];

//       if (mentionChar === "@") {
//         MentionValue = customFields;
//       }

//       if (searchTerm.length === 0) {
//         renderList(MentionValue, searchTerm);
//       } else {
//         const matches = [];
//         for (let i = 0; i < MentionValue.length; i++)
//           if (
//             ~MentionValue[i].value
//               .toLowerCase()
//               .indexOf(searchTerm.toLowerCase())
//           )
//             matches.push(MentionValue[i]);
//         renderList(matches, searchTerm);
//       }
//     },
//   },
//   toolbar: [
//     { header: [1, 2, 3, false] },
//     { size: ["small", false, "large", "huge"] },
//     "bold",
//     "italic",
//     "underline",
//     "blockquote",
//     { list: "ordered" },
//     { list: "bullet" },
//     { indent: "-1" },
//     { indent: "+1" },
//     { color: [] },
//     { background: [] },
//     { align: [] },
//     "link",
//     "",
//     "",
//   ],
//   clipboard: {
//     matchers: [["BR", lineBreakMatcher]],
//     matchVisual: false
//   },

// };

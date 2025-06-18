/*
 * Title: Letter Generate Funcs
 * Author: Khurshida Meem
 * Date: 24-10-2024
 *
 */

import axios from "axios";
import { toast } from "react-toastify";
import { todayDate } from "utility/todayDate";

export const getLetterNameDDL = async (
  profileData,
  setLoading,
  setLetterNameDDL,
  letterTypeId
) => {
  try {
    setLoading(true);
    const { orgId, buId, wgId, wId } = profileData;

    const res = await axios.get(
      `/LetterBuilder/GetLetterNameListByLetterType?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}&letterTypeId=${letterTypeId}`
    );

    setLetterNameDDL(res?.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
  }
};

export const getLetterPreview = async (
  profileData,
  setLoading,
  form,
  templateRef
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId } = profileData;
    const { letterType, letterName, employee } = form.getFieldsValue(true);

    const res = await axios.get(
      `/LetterBuilder/GetGeneratedLetterPreview?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}&letterTypeId=${
        letterType?.value
      }&letterName=${letterName?.label}&issuedEmployeeId=${
        employee?.value || 0
      }`
    );

    // const modifiedLetter = (
    //   res?.data?.generatedLetterBody?.match(/<body>([\s\S]*?)<\/body>/i)?.[1] ||
    //   ""
    // ).trim();
    let letterTemplate = res?.data?.generatedLetterBody;
    form.setFieldValue("letter", letterTemplate);
    templateRef.current = letterTemplate;
    form.setFieldValue("letterId", res?.data?.templateId);
  } catch (error) {
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};
export const getLetterPreviewAndTransform = async (
  profileData,
  setLoading,
  form,
  templateRef
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId } = profileData;
    const { letterType, letterName, employee } = form.getFieldsValue(true);

    const res = await axios.get(
      `/LetterBuilder/GetGeneratedLetterPreviewData?accountId=${orgId}&businessUnitId=${buId}&workplaceGroupId=${wgId}&workplaceId=${wId}&letterTypeId=${
        letterType?.value
      }&letterName=${letterName?.label}&issuedEmployeeId=${
        employee?.value || 0
      }`
    );

    // const modifiedLetter = (
    //   res?.data?.generatedLetterBody?.match(/<body>([\s\S]*?)<\/body>/i)?.[1] ||
    //   ""
    // ).trim();

    // form.setFieldValue("letterId", res?.data?.templateId);
    const letterTemplate = templateRef.current || "";

    let data = replacePlaceholdersInHTML(letterTemplate, res?.data);
    form.setFieldValue("letter", data);
  } catch (error) {
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};
export const createNEditLetterGenerate = async (
  form,
  profileData,
  setLoading,
  letterData
) => {
  setLoading(true);
  try {
    const { orgId, buId, wgId, wId, employeeId } = profileData;
    const values = form.getFieldsValue(true);

    const payload = {
      templateId: values?.letterId || 0,
      letterTypeId: values?.letterType?.value,
      letterName: values?.letterName?.label,
      generatedLetterBody: values?.letter,
      issuedEmployeeId: values?.employee?.value || "",
      accountId: letterData?.accountId || orgId,
      businessUnitId: letterData?.businessUnitId || buId,
      workplaceGroupId: letterData?.workplaceGroupId || wgId,
      workplaceId: letterData?.workplaceId || wId,
      createdBy: letterData?.createdBy || employeeId,
      createdAt: todayDate(),
    };
    const res = await axios.post(`/LetterBuilder/LetterGenerate`, payload);
    form.resetFields();
    toast.success(res?.data?.message, { toastId: 1 });
  } catch (error) {
    toast.warn(error?.response?.data?.message ?? "something went wrong");
    setLoading(false);
  }
};
export function generateIncrementTableHTML(tableData) {
  const totalColumns = tableData.header.length + 1; // +1 for SL
  const colspan = totalColumns - 1;

  const headerHTML = `<tr>
    <th>SL</th>
    ${tableData.header.map((h) => `<th>${h}</th>`).join("")}
  </tr>`;

  const rowsHTML = tableData.data
    .map(
      (item, index) =>
        `<tr>
          <td>${index + 1}</td>
          <td>${item.label}</td>
          <td>${item.value.toLocaleString()}</td>
        </tr>`
    )
    .join("");

  const totalRow = `<tr>
    <td colspan="${colspan}"><strong>Total</strong></td>
    <td><strong>${tableData.total.toLocaleString()}</strong></td>
  </tr>`;

  return `
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <thead>${headerHTML}</thead>
      <tbody>
        ${rowsHTML}
        ${totalRow}
      </tbody>
    </table>
  `;
}

export function replacePlaceholdersInHTML(html, data) {
  return html.replace(/@\[(.*?)\]/g, (_, key) => {
    const cleanKey = key.trim();

    // Handle special case for the table
    if (
      cleanKey === "Increment Details Table" &&
      data["Increment Details Table"]
    ) {
      return generateIncrementTableHTML(data["Increment Details Table"]);
    }

    // Handle @InWord
    if (cleanKey === "InWord" && data["Increment Details Table"]?.toWord) {
      return `In Word: ${data["Increment Details Table"].toWord}`;
    }
    // Handle @Increment %
    if (cleanKey === "Increment %") {
      let grossSalary = data["Gross Salary"];
      let incrementedSalary = data["Incremented Salary"];
      let incrementPercent =
        ((incrementedSalary - grossSalary) / grossSalary) * 100;
      return incrementPercent?.toFixed(2);
    }

    // Generic key-value replacement
    return data[cleanKey] ?? "";
  });
}

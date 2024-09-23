import { useEffect, useState } from "react";
import { Page, Text, View, Document, Image, Font } from "@react-pdf/renderer";
import { APIUrl } from "App";
import profileImg from "../../../../assets/images/profile.jpg";
import { styles } from "./cardStyle";

const paginate = (array, pageSize) => {
  return array.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / pageSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
};

// The actual PDF document component
const IdCardPdf = ({ employeeAllData }) => {
  const { companyInfo = {}, employees = [] } = employeeAllData || {};
  const paginatedEmployees = paginate(employees, 6);

  //   image states
  const [companyLogo, setCompanyLogo] = useState("");
  const [companySignature, setCompanySignature] = useState("");

  useEffect(() => {
    fetch(`${APIUrl}/Document/DownloadFile?id=${companyInfo.companyLogoUrl}`)
      .then((res) => res.blob())
      .then((blob) => {
        setCompanyLogo(URL.createObjectURL(blob));
      });

    fetch(`${APIUrl}/Document/DownloadFile?id=${companyInfo.authorySignUrl}`)
      .then((res) => res.blob())
      .then((blob) => {
        setCompanySignature(URL.createObjectURL(blob));
      });
  }, []);

  const handleImageError = (e) => {
    e.target.src = `data:image/png;base64, 0`; // Set fallback image on error
  };

  Font.registerHyphenationCallback((word) => [word]);

  return (
    <Document>
      {paginatedEmployees.map((employee, index) => (
        <Page size="A4" style={styles.page} key={index}>
          {employee.map((employee, index) => (
            <View key={index} style={styles.idCard}>
              <View style={styles.leftColumn}>
                <View style={styles.imageContainer}>
                  <Image src={companyLogo} style={{ width: 70, height: 30 }} />
                </View>
                <View style={styles.employeeImage}>
                  {employee.profilePicUrlId ? (
                    <Image
                      onError={handleImageError}
                      src={
                        employee.profilePicUrlId
                          ? `${APIUrl}/Document/DownloadFile?id=${employee.profilePicUrlId}` ||
                            `data:image/png;base64, ${companyInfo.authorySignUrl}`
                          : `data:image/png;base64, ${companyInfo.authorySignUrl}`
                      }
                      style={{ width: 40, height: 50 }}
                    />
                  ) : (
                    <Image src={profileImg} style={{ width: 40, height: 50 }} />
                  )}
                </View>
                <View style={styles.infoTable}>
                  {[
                    { label: "Name", value: employee.employeeName },
                    { label: "Designation", value: employee.designation },
                    { label: "Department", value: employee.department },
                    { label: "Section", value: employee.section },
                    { label: "ID Number", value: employee.employeeId },
                    {
                      label: "Joining Date",
                      value: new Date(
                        employee.joiningDate
                      ).toLocaleDateString(),
                    },
                    { label: "Blood Group", value: employee.bloodGroup },
                  ].map((row, index) => (
                    <View style={styles.infoRow} key={index}>
                      <Text style={styles.infoLabel}>{row.label}</Text>
                      <Text>:</Text>
                      <Text style={styles.infoValue}>{row.value}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.signatureTable}>
                  <View>
                    <Image
                      src={
                        employee.empSignUrlId
                          ? `${APIUrl}/Document/DownloadFile?id=${employee.empSignUrlId}` ||
                            `data:image/png;base64, ${companyInfo.authorySignUrl}`
                          : `data:image/png;base64, ${companyInfo.authorySignUrl}`
                      }
                      style={styles.signatureImage}
                      onError={handleImageError}
                    />
                    <Text>Employee Sign</Text>
                  </View>
                  <View>
                    <Image
                      src={companySignature}
                      style={styles.signatureImage}
                    />
                    <Text>Authorized Sign</Text>
                  </View>
                </View>
                <View style={styles.noteContainer}>
                  <Text>{companyInfo.workplace}</Text>
                </View>
              </View>

              <View style={styles.rightColumn}>
                <View style={styles.rightColumnContent}>
                  <Text>Issue Date: {new Date().toLocaleDateString()}</Text>
                  <Text>NID/BRC Number: {employee.nid}</Text>
                  <Text>Mobile Number: {employee.personalMobileNumber}</Text>
                  <Text>
                    Permanent Address: {"\n"}
                    {employee.permanentAdress}
                  </Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={{ marginTop: 4 }}>
                    If found please return to the following address
                  </Text>
                  <Text style={{ marginVertical: 8, marginHorizontal: 4 }}>
                    {companyInfo.workplaceGroup}
                  </Text>
                  <Text>{companyInfo.workplaceGroupAddress}</Text>
                  <Text style={{ marginVertical: 8, marginHorizontal: 3 }}>
                    Mobile: {companyInfo.workplaceGrouplMobile}
                  </Text>
                  <Text style={{ marginVertical: 4 }}>
                    Email:{" "}
                    {companyInfo.workplaceGroupEmail || "info@matador.com.bd"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

export default IdCardPdf;

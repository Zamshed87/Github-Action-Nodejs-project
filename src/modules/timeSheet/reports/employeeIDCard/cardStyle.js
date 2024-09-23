import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  idCard: {
    width: "48%",
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  leftColumn: {
    width: "57%",
    height: 240,
    position: "relative",
    fontSize: 8,
    border: "1px solid #c1c1c1",
    marginRight: 2,
  },
  rightColumn: {
    width: "41%",
    height: 240,
    border: "1px solid #c1c1c1",
    fontSize: 8,
  },
  imageContainer: {
    position: "absolute",
    top: 10,
    left: 40,
  },
  employeeImage: {
    position: "absolute",
    top: 50,
    left: 55,
  },
  infoTable: {
    marginTop: 110,
    width: "100%",
  },
  infoRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 2,
    marginLeft: 5,
  },
  infoLabel: {
    width: 60,
    fontWeight: "bold",
  },
  infoValue: {
    marginLeft: 5,
    flex: 1,
    flexWrap: "wrap",
  },
  signatureTable: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  signatureImage: {
    maxWidth: 36,
    height: 10,
    marginLeft: 6,
  },
  noteContainer: {
    backgroundColor: "red",
    color: "white",
    fontSize: 7,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
    padding: 3,
  },
  rightColumnContent: {
    fontSize: 8,
    padding: 10,
  },
  contactInfo: {
    textAlign: "center",
    backgroundColor: "#ff0000",
    color: "white",
    minHeight: 120,
    fontSize: 8,
    padding: 3,
    marginTop: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

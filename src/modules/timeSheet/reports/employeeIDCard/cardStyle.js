import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
  },
  idCard: {
    width: "48%",
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  leftColumn: {
    width: "48%",
    height: 220,
    position: "relative",
    fontSize: 6,
    border: "1px solid #c1c1c1",
    marginRight: 10,
  },
  rightColumn: {
    width: "39%",
    height: 220,
    border: "1px solid #c1c1c1",
    fontSize: 6,
  },
  imageContainer: {
    position: "absolute",
    top: 10,
    left: 40,
  },
  employeeImage: {
    position: "absolute",
    top: 35,
    left: 45,
  },
  infoTable: {
    marginTop: 90,
    width: "100%",
    padding: 5,
  },
  infoRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 2,
  },
  infoLabel: {
    width: 50,
    fontWeight: "bold",
  },
  infoValue: {
    marginLeft: 4,
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
    fontSize: 6,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
    padding: 3,
  },
  rightColumnContent: {
    fontSize: 6,
    padding: 10,
  },
  contactInfo: {
    textAlign: "center",
    backgroundColor: "#ff0000",
    color: "white",
    minHeight: 110,
    fontSize: 6,
    paddingHorizontal: 2,
    marginTop: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

import moment from "moment";
import { monthYearFormatter } from "utility/dateFormatter";
import { convert_number_to_word } from "utility/numberToWord";

const styles = {
  header: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: "10px",
  },
  text: {
    color: "black",
    fontSize: 16,
  },
};

export const Header = ({ strBusinessUnit, businessUnitAddress }) => {
  return (
    <center style={{ marginTop: "10%" }}>
      <h1 style={styles.header}>
        <u>{strBusinessUnit}</u>
      </h1>
      <h1 style={styles.subHeader}>
        {" "}
        <u>{businessUnitAddress}</u>{" "}
      </h1>
      <h1 style={styles.subHeader}>
        {" "}
        <u>Bank Advice Report</u>{" "}
      </h1>
    </center>
  );
};

export const TopSheetReport = ({ dataProp }) => {
  const { strBusinessUnit, total, businessUnitAddress, values } = dataProp;

  return (
    <>
      <Header
        strBusinessUnit={strBusinessUnit}
        businessUnitAddress={businessUnitAddress}
      />

      <div className="mt-5">
        <p className="bold" style={styles.text}>
          {moment().format("DD-MMMM-yyyy")}
        </p>
        <p className="bold" style={styles.text}>
          To,
        </p>
        <p className="bold" style={styles.text}>
          {values?.bank?.label === "Standard Chartered Bank" ||
          values?.bank?.label === "Dhaka Bank Limited "
            ? "Branch Manager"
            : values?.bank?.label === "Dutch Bangla Bank Agent Banking"
            ? "The Head of Agent Banking"
            : "The Manager"}
        </p>
        <p style={styles.text}>
          {values?.bank?.label === "Dutch Bangla Bank Agent Banking"
            ? "DBBL PLC Head Office"
            : values?.bank?.label}
        </p>
        <p style={styles.text}>
          {values?.bank?.label === "Standard Chartered Bank"
            ? "Dhanmondi Road# 5 Branch "
            : values?.bank?.label === "Dhaka Bank Limited "
            ? "Imamganj Branch Dhaka"
            : values?.bank?.label === "DUTCH-BANGLA BANK LTD"
            ? "Local Office Branch, Dilkusha Dhaka."
            : values?.bank?.label === "Dutch-Bangla Bank PLC."
            ? "Local Office Branch, Dilkusha Dhaka."
            : values?.bank?.label === "Dutch Bangla Bank Agent Banking"
            ? "47, Motijheel C/A"
            : "Tejgaon Branch Dhaka"}
        </p>
        <p style={styles.text}>
          {values?.bank?.label === "Standard Chartered Bank"
            ? "House 6, Road 5, Dhanmondi R/A, Dhaka-1209."
            : values?.bank?.label === "Dutch Bangla Bank Agent Banking"
            ? "Dhaka-1000."
            : ""}
        </p>
      </div>
      <p className="bold my-4" style={styles.text}>
        {" "}
        <u>{`Subject : REQUEST TO DISBURSE EMPLOYEE ${
          values?.bankAdviceFor?.value === 2 ? "BONUS" : "SALARY"
        } ${monthYearFormatter(values?.monthYear).toUpperCase()}`}</u>{" "}
      </p>
      <div>
        <p className="bold" style={styles.text}>
          Dear Recipients,
        </p>
        <p style={styles.text}>
          With due respect, please disburse the net payable amount BDT {total} (
          {convert_number_to_word(total)} Only) as Employee
          {values?.bankAdviceFor?.value === 2 ? " bonus " : " salary "}
          {monthYearFormatter(values?.monthYear)} to the all-account holders as
          per attached sheet from our Company Account{" "}
          {values?.account?.AccountNo}
        </p>
        <p className="my-4" style={styles.text}>
          We are looking forward for your kind cooperation.
        </p>
        <p className="my-4" style={styles.text}>
          Thanking You
        </p>
      </div>
    </>
  );
};

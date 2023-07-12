import Input from "../../components/Input";
import styles from "./Account.module.css";

const Account = () => {
  return (
    <>
      <Input placeholder="Input account address..." />
      <div className={styles.account}></div>
    </>
  );
};

export default Account;

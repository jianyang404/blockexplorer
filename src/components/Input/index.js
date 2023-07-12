import styles from "./Input.module.css";

const Input = ({ value, onChange, placeholder, errorMessage }) => (
  <div className={styles["input-container"]}>
    <input
      className={styles.input}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {errorMessage && <span className={styles.error}>{errorMessage}</span>}
  </div>
);

export default Input;

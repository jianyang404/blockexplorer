import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import List from "../../components/List";
import Loader from "../../components/Loader";
import Input from "../../components/Input";
import { AlchemyContext } from "../../context/AlchemyContext";
import { BigNumber } from "alchemy-sdk";
import styles from "./Transaction.module.css";

const Transaction = () => {
  const navigate = useNavigate();

  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [transaction, setTransaction] = useState({});
  const [transactionHash, setTransactionHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const alchemy = useContext(AlchemyContext);
  const { transactionId } = useParams();

  useEffect(() => {
    let debounce;

    const getTransaction = async () => {
      try {
        setTransactionHash(transactionId);
        setIsLoadingTransaction(true);

        const transaction = await alchemy.core.getTransactionReceipt(
          transactionId
        );

        if (transaction) {
          setTransaction(transaction);
        } else {
          setTransaction({});
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoadingTransaction(false);
      }
    };

    if (transactionId) debounce = setTimeout(getTransaction, 500);

    return () => clearTimeout(debounce);
  }, [alchemy.core, transactionId]);

  const handleChange = (evt) => {
    evt.preventDefault();

    setErrorMessage("");
    setTransactionHash(evt.target.value);

    navigate(`/transaction/${evt.target.value}`);
    if (!evt.target.value) setTransaction({});
  };

  return (
    <>
      <Input
        placeholder="Input transaction hash..."
        value={transactionHash}
        onChange={handleChange}
        errorMessage={transactionHash && errorMessage}
      />

      {isLoadingTransaction ? (
        <Loader />
      ) : (
        <div className={styles.transaction}>
          {Object.entries(transaction).map(([key, value]) => {
            // Has to go first or else React elements will get converted
            if (value instanceof BigNumber) value = parseInt(value, 10);

            // Same as the above
            if (
              (typeof value === "object" && !Array.isArray(value)) ||
              typeof value === "boolean"
            )
              value = JSON.stringify(value, null, 2);

            if (["blockHash", "blockNumber"].includes(key))
              value = <Link to={`/block/${value}`}>{value}</Link>;

            if (key === "status") value = value ? "success" : "failure";

            if (["logs", "logsBloom", "byzantium", "type"].includes(key))
              return null;

            return <List key={key} name={key} value={value} />;
          })}
        </div>
      )}
    </>
  );
};

export default Transaction;

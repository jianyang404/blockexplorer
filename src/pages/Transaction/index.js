import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import List from "../../components/List";
import Loader from "../../components/Loader";
import { AlchemyContext } from "../../context/AlchemyContext";
import { BigNumber } from "alchemy-sdk";

const Transaction = () => {
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [transaction, setTransaction] = useState({});

  const alchemy = useContext(AlchemyContext);
  const { transactionId } = useParams();

  useEffect(() => {
    const getTransaction = async () => {
      try {
        setIsLoadingTransaction(true);
        const transaction = await alchemy.core.getTransactionReceipt(
          transactionId
        );

        setIsLoadingTransaction(false);

        if (transaction) {
          setTransaction(transaction);
        } else {
          setTransaction({});
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (transactionId) getTransaction();
  }, [alchemy.core, transactionId]);

  return (
    <div>
      <h3>Transaction Receipt</h3>
      {isLoadingTransaction ? (
        <Loader />
      ) : (
        Object.entries(transaction).map(([key, value]) => {
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
        })
      )}
    </div>
  );
};

export default Transaction;

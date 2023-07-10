const Transactions = ({ transactions }) => {
  console.log("asdfs", transactions);
  // TODO: add select dropdown

  return (
    <div>
      {transactions.length
        ? transactions.map((txn) => {
            return <div>{txn.hash}</div>;
          })
        : "-"}
    </div>
  );
};

export default Transactions;

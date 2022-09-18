import React from "react";
import ItemForm from "../components/ItemForm";
import Layout from "../components/Layout";

const Sell = () => {
  return (
    <Layout>
      <div className="flex flex-col h-full py-32 ">
        <ItemForm />
      </div>
    </Layout>
  );
};

export default Sell;

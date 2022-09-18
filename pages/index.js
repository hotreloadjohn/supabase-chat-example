import Head from "next/head";
import Layout from "../components/Layout";
import ProductListing from "../components/ProductListing";

// Github:Supabase acct: typescriptguy

export default function Home() {
  return (
    <Layout>
      {/* <h1 className="flex justify-center items-center flex-col pt-40 text-center font-bold lg:text-8xl text-6xl space-y-2">
        Responsive Navbar example
      </h1> */}
      <main className="flex flex-col pt-32">
        <ProductListing />
      </main>
    </Layout>
  );
}

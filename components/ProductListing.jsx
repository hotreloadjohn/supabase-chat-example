import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

// https://www.youtube.com/watch?v=BSoRXk1FIw8
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function BlurImage({ product }) {
  const [isLoading, setLoading] = useState(true);
  return (
    <Link href={`/products/${product.id}`} className="group">
      <a>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
          <Image
            alt=""
            src={product.image_url}
            layout="fill"
            objectFit="cover"
            className={cn(
              "group-hover:opacity-75 duration-700 ease-in-out",
              isLoading
                ? "grayscale blur-2xl scale-110"
                : "grayscale-0 blur-0 scale-100"
            )}
            onLoadingComplete={() => setLoading(false)}
          />
        </div>
        <h3 className="mt-4 text-sm text-gray-700">
          Seller: {product.profiles.username}
        </h3>
        <p className="mt-1 text-lg font-medium text-gray-900">{product.name}</p>
        <p className="mt-1 text-lg font-medium text-gray-900 truncate">
          {product.description}
        </p>
      </a>
    </Link>
  );
}

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabaseClient.from("products").select(`
        *,
        profiles (username)
      `);

      if (error) {
        return toast.error(error.message);
      }
      setProducts(data);

      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    // <section className="grid grid-cols-1 gap-6 p-4 my-4  md:grid-cols-3 lg:grid-cols-4">
    //   {products &&
    //     products.length > 0 &&
    //     products.map((product) => (
    //       <ProductItem key={product.id} {...product} />
    //     ))}
    // </section>
    <div className=" max-w-2xl px-4 sm:py-24 sm:px-6 lg:max-w-full lg:px-16">
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {/* Images will go here */}
        {products.map((product) => (
          <BlurImage key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductListing;

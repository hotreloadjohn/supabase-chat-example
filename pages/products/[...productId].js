import Layout from "../../components/Layout";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";

// https://www.youtube.com/watch?v=sFYEpseLriU
// https://github.com/iskurbanov/shopify-next.js-tailwind/blob/main/components/ProductPageContent.js

const ProductDetails = ({ data }) => {
  const router = useRouter();
  const images = [];
  const productImgs = [data.image_url];
  const seller = data.seller_id;
  const product_details = data;
  const item_name = data.name;

  const [isChatCreated, setIsChatCreated] = useState(false);
  const { user, error } = useUser();

  productImgs.map((image, i) => {
    images.push(
      <SwiperSlide key={`slide-${i}`}>
        <Image src={image} alt={image} layout="fill" objectFit="cover" />
      </SwiperSlide>
    );
  });

  SwiperCore.use([Navigation, Pagination]);

  const handleCreateChat = async (e) => {
    e.preventDefault();
    if (isChatCreated) {
      alert(
        "You are already in a conversation with this seller regarding this item"
      );
      return;
    }
    const { data, error } = await supabaseClient
      .rpc("create_room", {
        name: item_name,
        product_id: product_details.id,
        seller,
      })
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      router.push("/inbox");
    }
  };

  useEffect(() => {
    const checkIfChatCreated = async () => {
      const { data, error, count } = await supabaseClient
        .from("rooms")
        .select("*", { count: "exact", head: true })
        .match({ product_id: product_details.id, buyer_id: user.id });

      if (error) alert(error.message);
      console.log(count);
      if (count === 1) {
        setIsChatCreated(true);
      } else {
        setIsChatCreated(false);
      }
    };

    if (user?.id) {
      checkIfChatCreated();
    }

    return () => {
      setIsChatCreated(false);
    };
  }, [user?.id]);

  return (
    <Layout>
      <div className="min-h-screen sm:pt-20">
        <div className="flex flex-col justify-center items-center space-y-8 md:flex-row md:items-start md:space-y-0 md:space-x-4 lg:space-x-8 max-w-6xl w-11/12 mx-auto mt-12">
          <div className="w-full max-w-md border bg-white rounded-2xl overflow-hidden shadow-lg md:w-1/2">
            <div className="relative h-96 w-full">
              <Swiper
                style={{
                  "--swiper-navigation-color": "#000",
                  "--swiper-pagination-color": "#000",
                }}
                navigation
                pagination={{ clickable: true }}
                className="h-96 rounded-2xl"
                loop="true"
              >
                {images}
                <SwiperSlide>More Images 1</SwiperSlide>
                <SwiperSlide>More Images 2</SwiperSlide>
              </Swiper>
            </div>
          </div>

          {/* product detail / chat with seller form */}
          <div className="rounded-2xl p-4 shadow-lg flex flex-col w-full md:w-1/3">
            <h2 className="text-2xl font-bold">{data.name}</h2>
            <span className="pb-3">{data.description}</span>
            {/* chat form */}
            <form className="flex flex-col" onSubmit={handleCreateChat}>
              {/* <textarea className="border p-2" rows="5"></textarea> */}
              <button
                disabled={isChatCreated}
                className={`${
                  isChatCreated
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                } rounded-lg text-white px-2 py-3 mt-3 `}
              >
                Chat with {data.profiles.username}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;

export const getServerSideProps = async ({ params }) => {
  const { productId } = params;

  const { data, error } = await supabaseClient
    .from("products")
    .select(
      `
        *,
        profiles (username)
      `
    )
    .eq("id", productId[0])
    .single();

  if (error) {
    return toast.error(error.message);
  }

  return {
    props: {
      data,
    },
  };
};

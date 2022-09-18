import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useForm from "../hooks/useForm";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";

const ItemForm = () => {
  const { user, error } = useUser();

  const { form, handleChange, resetForm } = useForm({
    name: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const imageFileRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);

  const uploadImage = async () => {
    const imageName = `${Date.now()}-${imageFile.name}`;
    const { error } = await supabaseClient.storage
      .from("products")
      .upload(`images/${imageName}`, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) return toast.error(error.message);

    const { publicURL } = supabaseClient.storage
      .from("products")
      .getPublicUrl(`images/${imageName}`);

    return new URL(publicURL).href;
  };

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image.size > 2000000) {
      toast.error("Image size must be less than 2MB");
      return;
    }
    setImageFile(image);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    let publicUrl = "";
    if (imageFile) {
      publicUrl = await uploadImage();
    }

    const { data, error } = await supabaseClient.from("products").insert([
      {
        name: form.name,
        description: form.description,
        image_url: publicUrl,
        seller_id: user.id,
      },
    ]);

    if (error) {
      // delete the uploaded image?
      //   return showErrorToast(error.message, setLoading);
      resetForm();
      imageFileRef.current.value = "";
      setLoading(false);
      return toast.error(error.message);
    }

    toast.success("Product added successfully");
    resetForm();
    imageFileRef.current.value = "";
    setLoading(false);
  };

  const router = useRouter();

  return (
    <form onSubmit={handleSubmitProduct} className="mx-auto space-y-2 w-96 ">
      <div className="w-full">
        <label htmlFor="name">Product Name</label>
        <input
          type="text"
          name="name"
          id="name"
          className="w-full p-2 border border-gray-500 rounded outline-black placeholder:text-gray-400"
          placeholder="Product Name"
          onChange={handleChange}
          value={form.name}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Product Description</label>
        <input
          type="text"
          name="description"
          id="description"
          className="w-full p-2 border border-gray-500 rounded outline-black placeholder:text-gray-400"
          placeholder="Product Description"
          onChange={handleChange}
          value={form.description}
          required
        />
      </div>

      <div>
        <label htmlFor="image">Product Image</label>
        <input
          accept="image/*"
          type="file"
          name="image"
          id="image"
          ref={imageFileRef}
          onChange={handleImageChange}
          required
        />
      </div>

      <button
        type="submit"
        className={`py-0.5 text-lg w-full bg-black hover:text-black hover:bg-white border-black border text-white rounded
            ${loading ? "cursor-not-allowed animate-pulse" : "cursor-pointer"}
          `}
      >
        Submit
      </button>
    </form>
  );
};

export default ItemForm;

import React, { useState } from "react";
import useForm from "../hooks/useForm";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { useChat } from "../context/ChatContext";

const AuthForm = ({ formType = "signup", closeModal }) => {
  const [loading, setLoading] = useState(false);

  const { dispatch } = useChat();

  const { form, handleChange, resetForm } = useForm({
    name: "",
    email: "",
    password: "",
  });

  // const genAvatar = async (initials) => {
  //   const data = await axios.get(`https://ui-avatars.com/api/?name=${initials}`);
  //   console.log(data);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formType === "signup") {
      const { error: signUpError } = await supabaseClient.auth.signUp(
        {
          email: form.email,
          password: form.password,
        },
        {
          data: {
            username: form.name,
            avatar_url: `https://ui-avatars.com/api/?name=${form.name}?format=png`,
          },
        }
      );

      if (signUpError) {
        // showErrorToast(signUpError.message, setLoading);
        toast.error(signUpError.message);
        return;
      }
    }

    if (formType === "login") {
      const { data, error } = await supabaseClient.auth.signIn({
        email: form.email,
        password: form.password,
      });
      if (error) {
        return toast(error.message);
      }

      console.log(data);
      dispatch({ type: "SET_CURRUSER", payload: data.user });
    }

    toast.success(
      formType === "signup"
        ? "You have successfully signed up! Confirm your email."
        : "You have successfully signed in!"
    );
    resetForm();
    closeModal(false);
    setLoading(false);
  };

  return (
    <div className="my-2">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center gap-y-1"
      >
        {formType === "signup" && (
          <>
            <label htmlFor="name">Username</label>
            <input
              type="text"
              name="name"
              id="name"
              className="p-2 border border-gray-500 rounded outline-black placeholder:text-gray-400"
              placeholder="Your username"
              value={form.name}
              required={formType === "signup"}
              onChange={handleChange}
              disabled={loading}
            />
          </>
        )}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="p-2 border border-gray-500 rounded outline-black placeholder:text-gray-400"
          value={form.email}
          required
          onChange={handleChange}
          disabled={loading}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          minLength={6}
          required
          className="p-2 border border-gray-500 rounded outline-black placeholder:text-gray-400"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
        />

        <button
          type="submit"
          className={`py-0.5 h-full text-lg w-full bg-black hover:text-black hover:bg-white border-black border text-white rounded
            ${loading ? "cursor-not-allowed animate-pulse" : "cursor-pointer"}
          `}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : formType === "signup"
            ? "Sign up"
            : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;

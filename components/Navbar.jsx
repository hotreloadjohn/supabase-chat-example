import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { useUser } from "@supabase/auth-helpers-react";
import Modal from "./Modal";
import AuthForm from "./AuthForm";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import ProfileDropdown from "./ProfileDropdown";
import { AiOutlineMessage } from "react-icons/ai";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, error } = useUser();
  const [openModal, setOpenModal] = useState(false);
  const [formType, setFormType] = useState("login");

  return (
    <div className="sticky top-0 z-10">
      <nav className="shadow-sm w-full bg-gray-300">
        <div className="w-full">
          <div className="flex items-center h-20 w-full">
            {/* first block */}
            <div className="flex items items-center mx-10 justify-between w-full">
              <Link
                href="/"
                className="flex justify-center items-center flex-shrink-0"
              >
                <h1 className="font-bold text-xl cursor-pointer">
                  <span className="text-yellow-600">Iron</span>
                  <span className="text-red-600">Man</span>
                </h1>
              </Link>
              {user ? (
                <div className="hidden md:block">
                  <div className="ml-10 flex items-center space-x-4">
                    {/* <Link href="services">
                      <a className="cursor-pointer hover:bg-blue-600 text-black hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                        Services
                      </a>
                    </Link> */}

                    <ProfileDropdown />
                    <Link href="/inbox">
                      <a>
                        <AiOutlineMessage size="1.4rem" />
                      </a>
                    </Link>

                    <Link href="/sell">
                      <a className="cursor-pointer bg-red-500 hover:bg-white text-white hover:border border-black hover:text-black px-3 py-2 rounded-md text-sm font-medium">
                        SELL
                      </a>
                    </Link>

                    <button
                      className="px-4 py-2 text-md text-white bg-black border border-black rounded hover:text-black hover:bg-white"
                      onClick={() => supabaseClient.auth.signOut()}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <button
                      onClick={() => {
                        setFormType("signup");
                        setOpenModal(true);
                      }}
                      className="px-4 py-2 text-md text-white font-bold bg-black border border-black rounded hover:text-black hover:bg-white"
                    >
                      Sign up
                    </button>
                    <button
                      onClick={() => {
                        setFormType("login");
                        setOpenModal(true);
                      }}
                      className="px-4 py-2 text-md text-white font-bold bg-blue-600 border border-black rounded hover:text-black hover:bg-white"
                    >
                      Login
                    </button>
                  </div>
                  <Modal
                    isOpen={openModal}
                    closeModal={setOpenModal}
                    title={formType.toUpperCase()}
                  >
                    <AuthForm formType={formType} closeModal={setOpenModal} />
                  </Modal>
                </div>
              )}
            </div>
            {/* mobile nav */}
            <div className="mr-10 flex md:hidden ">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-blue-600 inline-flex items-center justify-center p-2 rounded-md text-white  hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterhref="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leavehref="opacity-0 scale-95"
        >
          {(ref) => (
            <div className="md:hidden" id="mobile-menu">
              <div
                ref={ref}
                className="bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3"
              >
                <Link href="home">
                  <a className="cursor-pointer hover:bg-blue-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                    Home
                  </a>
                </Link>
                <Link href="about">
                  <a className="cursor-pointer hover:bg-blue-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                    About
                  </a>
                </Link>

                <Link href="projects">
                  <a className="cursor-pointer hover:bg-blue-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                    Projects
                  </a>
                </Link>
                <Link href="services">
                  <a className="cursor-pointer hover:bg-blue-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                    Services
                  </a>
                </Link>

                <Link href="work">
                  <a className="cursor-pointer hover:bg-blue-600 text-black hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                    Contact
                  </a>
                </Link>
              </div>
            </div>
          )}
        </Transition>
      </nav>
    </div>
  );
};

export default Navbar;

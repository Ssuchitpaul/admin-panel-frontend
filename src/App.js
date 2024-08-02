import React, { useState, useEffect } from "react";
import "./App.css";
import Popup from "./components/popupCreate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import OTPVerification from "./components/OTPVerification";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  //useStates
  const [users, setUsers] = useState([]);
  const [address, setAddress] = useState("");
  const [size, setSize] = useState("");
  const [type, setType] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [image1, setImage1] = useState(null);
  const [imagePopup, setImagePopup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [desc, setDescription] = useState("");
  const [buttonPopup, setButtonPopup] = useState(
    localStorage.getItem("buttonPopup") === "true" ? true : false
  );

  // Update localStorage whenever buttonPopup state changes
  useEffect(() => {
    localStorage.setItem("buttonPopup", buttonPopup);
  }, [buttonPopup]);

  const [buttonPopup1, setButtonPopup1] = useState(
    localStorage.getItem("buttonPopup1") === "true" ? true : false
  );

  // Update localStorage whenever buttonPopup state changes
  useEffect(() => {
    localStorage.setItem("buttonPopup1", buttonPopup1);
  }, [buttonPopup1]);

  useEffect(() => {
    getData();
  }, []);

  // converting the image to Data URL and fetching it mock api
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeInKB = file.size / 1024;
      if (fileSizeInKB > 60) {
        toast.error("Please select an image file that is 60 KB or below.");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const dataURL = reader.result;
        setImage1(dataURL);
      };
    }
  };

  //IMAGE PREVIEW Component
  const handleClosePopup = () => {
    setImagePopup(false);
  };
  const handlePreview = (dataURL) => {
    const img = new Image();
    img.onload = () => {
      console.log("Image loaded:", img.src);
      const imagePreview = document.getElementById("imagePreview");
      if (imagePreview) {
        imagePreview.src = img.src;
      }
    };
    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
    img.src = dataURL;
    setImagePopup(true);
  };

  const getData = async () => {
    try {
      const response = await fetch(
        "https://6618101f9a41b1b3dfbc2b99.mockapi.io/RealEstate"
      );
      const userData = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      console.log("Deleting user with id:", id);
      await fetch(
        `https://6618101f9a41b1b3dfbc2b99.mockapi.io/RealEstate/${id}`,
        { method: "DELETE" }
      );
      console.log("User deleted successfully");
      getData();
      toast.error("Property Deleted Successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const addUser = async () => {


    if (!desc || !address || !size || !type || !image1) {
      toast.error("Missing required fields");
      return;
    }
    try {
      const date = new Date().toISOString();

      const userData = {
        createdAt: date,
        desc: desc,
        Address: address,
        Size: size,
        type: type,
        Image1: image1,
      };

      await fetch("https://6618101f9a41b1b3dfbc2b99.mockapi.io/RealEstate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      getData();
      setDescription("");
      setAddress("");
      setSize("");
      setType("");
      setImage1("");
      toast.success("Property added Successfully!");
      setButtonPopup(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const editUser = async () => {
    try {
      const userToUpdate = users.find((user) => user.id === editId);
      const updatedUserData = {
        desc: desc || userToUpdate.desc,
        Address: address || userToUpdate.Address,
        Size: size || userToUpdate.Size,
        type: type || userToUpdate.type,
        Image1: image1 || userToUpdate.Image1,
      };

      await fetch(
        `https://6618101f9a41b1b3dfbc2b99.mockapi.io/RealEstate/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        }
      );

      getData();
      setButtonPopup1(false);
      toast.success("Property edited Successfully!");
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  const handleEditModal = (id) => {
    setEditId(id);
  };

  useEffect(() => {
    const loggedInTime = sessionStorage.getItem("loggedInTime");
    const ONE_HOURS = 60 * 60 * 1000;

    if (loggedInTime && Date.now() - loggedInTime < ONE_HOURS) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      sessionStorage.removeItem("loggedInTime");
    }
  }, []);

  const handleOTPVerificationSuccess = () => {
    setIsAdmin(true);
    sessionStorage.setItem("loggedInTime", Date.now());
  };

  return (
    <>
      <div>
        {isAdmin ? (
          <div>
            <div className="flex justify-center items-center mt-5">
              <header className="text-center">
                <h1 className="text-4xl font-bold mb-4">
                  Welcome to Real Estate Admin Panel!
                </h1>
                <p className="text-lg font-semibold text-gray-700">
                  Manage your real estate assets efficiently
                </p>
              </header>
            </div>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <div className="relative flex-grow">
                    <input
                      type="search"
                      className="relative m-0 block w-96 rounded border border-solid border-neutral-200 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none dark:border-white/10 dark:text-white dark:placeholder:text-neutral-200 dark:autofill:shadow-autofill dark:focus:border-primary"
                      placeholder="Search"
                      onChange={(e) => setSearch(e.target.value.toLowerCase())}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                  <button
                    className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                    type="button"
                    onClick={() => setButtonPopup(true)}
                  >
                    <span id="_text_content">Add New Listing</span>
                  </button>
                  <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                    <h2 className="text-2xl font-bold mb-4">
                      Add New Property
                    </h2>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="address"
                      >
                        Description
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={desc}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="address"
                      >
                        Address
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="address"
                      >
                        Type
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="size"
                      >
                        Size
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        placeholder="Sqft"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Images: image need to be size of 60 kb or
                        below. (format: jpg, jpeg, png)
                      </label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        placeholder="Image 1"
                        accept=".jpg, .jpeg, .png"
                      />
                    </div>
                    <button
                      type="button"
                      className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      onClick={addUser}
                    >
                      Submit
                    </button>
                  </Popup>
                </div>
              </div>
            </div>
            {/*
  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
*/}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-900">
                <thead className="text-left">
                  <tr>
                    <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 dark:text-white">
                      Description
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 dark:text-white">
                      Address
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 dark:text-white">
                      Type
                    </th>
                    <th className="whitespace-nowrap px-3 py-2 font-medium text-gray-900 dark:text-white">
                      Sqft
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users
                    .filter((user) => {
                      return search.toLowerCase() === ""
                        ? user.id
                        : user.desc.toLowerCase().includes(search) ||
                            user.Address.toLowerCase().includes(search) ||
                            user.Size.toLowerCase().includes(search) ||
                            user.type.toLowerCase().includes(search);
                    })
                    .map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700 dark:text-gray-200">
                          {user.desc}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700 dark:text-gray-200">
                          {user.Address}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700 dark:text-gray-200">
                          {user.type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700 dark:text-gray-200">
                          {user.Size}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-gray-700 dark:text-gray-200">
                          <button
                            onClick={() => handlePreview(user.Image1)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                          >
                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                          </button>
                          {imagePopup && (
                            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
                              <button
                                className="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-700 rounded-full text-gray-600 hover:text-gray-700 focus:outline-none focus:ring focus:ring-gray-400"
                                onClick={handleClosePopup}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M14.12 5.88a.75.75 0 011.06 1.06L11.06 10l4.12 4.12a.75.75 0 11-1.06 1.06L10 11.06l-4.12 4.12a.75.75 0 11-1.06-1.06L8.94 10 4.82 5.88a.75.75 0 111.06-1.06L10 8.94l4.12-4.12a.75.75 0 011.06 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                              <div className="max-w-sm mx-auto p-4 rounded-lg">
                                <img
                                  id="imagePreview"
                                  alt=""
                                  className="w-full"
                                />
                              </div>
                            </div>
                          )}
                        </td>
                        <div className="flex justify-end items-center">
                          <button
                            className="mt-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            onClick={() => deleteUser(user.id)}
                          >
                            Delete
                          </button>

                          <button
                            onClick={() => {
                              setButtonPopup1(true);
                              handleEditModal(user.id);
                            }}
                            className="mt-1 ml-4 bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Edit
                          </button>
                          <Popup
                            trigger={buttonPopup1}
                            setTrigger={setButtonPopup1}
                          >
                            {editId && (
                              <div>
                                <h2 className="text-2xl font-bold mb-4">
                                  Edit Property
                                </h2>

                                <div className="mb-4">
                                  <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="address"
                                  >
                                    Description
                                  </label>
                                  <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={desc}
                                    onChange={(e) =>
                                      setDescription(e.target.value)
                                    }
                                    placeholder="123 Main St"
                                  />
                                </div>

                                <div className="mb-4">
                                  <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="address"
                                  >
                                    Address
                                  </label>
                                  <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="123 Main St"
                                  />
                                </div>
                                <div className="mb-4">
                                  <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="type"
                                  >
                                    Type
                                  </label>
                                  <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    placeholder="Type"
                                  />
                                </div>
                                <div className="mb-4">
                                  <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="size"
                                  >
                                    Size
                                  </label>
                                  <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    placeholder="Sqft"
                                  />
                                </div>
                                <div className="mb-4">
                                  <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Images: image need to be size of 60 kb or
                                    below (format: jpg, jpeg, png)
                                  </label>
                                  <input
                                    type="file"
                                    onChange={handleFileChange}
                                    placeholder="Image 1"
                                    accept=".jpeg, .jpg, .png"
                                  />
                                </div>
                                <button
                                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                  onClick={editUser}
                                >
                                  Submit
                                </button>
                              </div>
                            )}
                          </Popup>
                        </div>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/*
  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
*/}
            <footer className="bg-white dark:bg-gray-900">
              <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  <div>
                    <div className="flex justify-center text-teal-600 dark:text-teal-300 sm:justify-start">
                      <i className="fa-solid fa-rocket h-8"></i>
                    </div>
                    <p className="mt-6 max-w-md text-center leading-relaxed text-gray-500 dark:text-gray-400 sm:max-w-xs sm:text-left">
                      <span id="_text_content">
                      Turning plots into possibilities. Manage with precision.
                      </span>
                    </p>
                  </div>

                  <p className="text-lg font-medium text-gray-900 dark:text-white"></p>
                  <ul className="mt-8 space-y-4 text-sm">
                    <li>
                      <a
                        className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                        href="/"
                      >
                        <svg
                          className="h-5 w-5 shrink-0 text-gray-900 dark:text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <span className="flex-1 text-gray-700 dark:text-gray-300">
                          <span id="_text_content">ploto.hyd@gmail.com</span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="flex items-center justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end"
                        href="/"
                      >
                        <svg
                          className="h-5 w-5 shrink-0 text-gray-900 dark:text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                        <span className="flex-1 text-gray-700 dark:text-gray-300">
                          <span id="_text_content">9393693902</span>
                        </span>
                      </a>
                    </li>
                    <li className="flex items-start justify-center gap-1.5 ltr:sm:justify-start rtl:sm:justify-end">
                      <svg
                        className="h-5 w-5 shrink-0 text-gray-900 dark:text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <address className="-mt-0.5 flex-1 not-italic text-gray-700 dark:text-gray-300">
                        <span id="_text_content">Flat No: 601, Divyashakthi Residency, Mothi Nagar, Erragadda, Hyderabad - 500018.</span>
                      </address>
                    </li>
                  </ul>

                  <div className="text-center justify-center sm:flex sm:justify-between">
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 sm:order-first sm:mt-0">
                      <span id="_text_content">© 2024 ploto-real-estate</span>
                    </p>
                  </div>
                </div>
              </div>
            </footer>
            <ToastContainer />
          </div>
        ) : (
          <OTPVerification
            onSuccess={handleOTPVerificationSuccess}
          ></OTPVerification>
        )}
      </div>
    </>
  );
}

export default App;

import { useState, useEffect } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import TypeInput from "../../../components/Forms/TypeInput";
import ButtonSubmit from "../../../components/Forms/ButtonSubmit";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import AxiosClient from "../../../AxiosClient";
import { Link } from "@inertiajs/react";

const defaultFormValues = {
  grade: "",
  name: "",
};

const ClassroomCreate = () => {
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading("Loading...");

    AxiosClient.post("/api/classrooms", formValues)
      .then((res) => {
        setFormValues(defaultFormValues);
        toast.success(res.data.message, { id: toastId });
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.statusText ||
          "Something went wrong";
        toast.error(errorMessage, { id: toastId });
      })
      .finally(() => setIsLoading(false));
  };

  const handleChange = (attr, value) => {
    setFormValues({ ...formValues, [attr]: value });
  };

  return (
    <>
      <Breadcrumb pageName="Classroom Create">
        <Link
          to="/manages/classroom"
          className="self-end inline-flex items-center justify-center gap-2 text-base font-medium text-boxdark hover:opacity-80 hover:text-black hover:dark:text-white dark:text-bodydark"
        >
          <FaArrowLeft /> Kembali
        </Link>
      </Breadcrumb>

      <div className="flex flex-col">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Grade
                </label>
                <TypeInput
                  value={formValues.grade}
                  onChange={(e) => handleChange("grade", e.target.value)}
                  placeholder="Enter Grade"
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Classroom Name
                </label>
                <TypeInput
                  value={formValues.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter Classroom Name"
                  disabled={isLoading}
                />
              </div>

              <ButtonSubmit text="Submit" isLoading={isLoading} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ClassroomCreate;

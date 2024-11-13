import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import TypeInput from "../../../components/Forms/TypeInput";
import ButtonSubmit from "../../../components/Forms/ButtonSubmit";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import AxiosClient from "../../../AxiosClient";
import { Link, usePage } from "@inertiajs/react";

const defaultFormValues = {
  grade: "",
  name: "",
};

const ClassroomUpdate = () => {
  const { id } = usePage().props;
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      AxiosClient.get(`/api/classrooms/${id}`)
        .then((res) => {
          const data = res.data.data;
          setFormValues({
            school_id: data.school_id,
            grade: data.grade,
            name: data.name,
          });
        })
        .catch((err) => {
          console.error("Error fetching classroom data:", err);
        })
    }
  }, [id]);

  const handleChange = (attr, value) => {
    setFormValues({ ...formValues, [attr]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading("Loading...");

    AxiosClient.put(`/api/classrooms/${id}`, formValues)
      .then((res) => {
        toast.success("Classroom updated successfully", { id: toastId });
      })
      .catch((err) => {
        if (err.response?.status === 500) {
          toast.error("Internal Server Error", { id: toastId });
        } else {
          toast.error(err.response?.data?.message || "Failed to update classroom", { id: toastId });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Breadcrumb pageName="Classroom Update">
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
                <TypeInput
                  label="Grade"
                  value={formValues.grade}
                  id="grade"
                  onChange={(e) => handleChange("grade", e.target.value)}
                  placeholder="Enter Grade"
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4.5">
                <TypeInput
                  label="Classroom Name"
                  value={formValues.name}
                  id="name"
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter classroom Name"
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

export default ClassroomUpdate;

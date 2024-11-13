import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import { sanitizeNumberInput } from "../../../utils/helper";
import SelectInput from "../../../components/Forms/SelectInput";
import DatePickerInput from "../../../components/Forms/DatePickerInput";
import TypeInput from "../../../components/Forms/TypeInput";
import ButtonSubmit from "../../../components/Forms/ButtonSubmit";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import AxiosClient from "../../../AxiosClient";
import { Link, usePage } from "@inertiajs/react";

const semesterOptions = [
  { value: "1", label: "Semester 1" },
  { value: "2", label: "Semester 2" },
];

const defaultFormValues = {
  start_academic_year: "",
  end_academic_year: "",
  semester: null,
  start_date: null,
  end_date: null,
};

const AcademicYearUpdate = () => {
  const { id } = usePage().props;
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      AxiosClient.get(`/api/academic-years/${id}`)
        .then((res) => {
          const data = res.data.data;
          setFormValues({
            school_id: data.school_id,
            start_academic_year: data.start_academic_year,
            end_academic_year: data.end_academic_year,
            semester: data.semester.toString(),
            start_date: data.start_date ? new Date(data.start_date) : null,
            end_date: data.end_date ? new Date(data.end_date) : null,
          });
        })
        .catch((err) => {
          console.error("Error fetching academic year data:", err);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading("Loading...");

    const { start_date, end_date } = formValues;

    AxiosClient.put(`/api/academic-years/${id}`, {
      ...formValues,
      start_date: start_date ? start_date.toISOString().split("T")[0] : null,
      end_date: end_date ? end_date.toISOString().split("T")[0] : null,
    })
      .then((res) => {
        toast.success(res.data.message, { id: toastId });
      })
      .catch((err) => {
        if (err.response.status === 500) {
          toast.error(err.response.statusText, { id: toastId });
        } else {
          toast.error(err.response.data.message, { id: toastId });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleChange = (attr, value) => {
    setFormValues({ ...formValues, [attr]: value });
  };

  const handleAcademicYearChange = (e, attr) => {
    const currentValue = sanitizeNumberInput(e.target.value, 4);
    e.target.value = currentValue;
    handleChange(attr, currentValue);
  };

  return (
    <>
      <Breadcrumb pageName="Academic Year Update">
        <Link
          to="/manages/academic-years"
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
                  Tahun Ajaran
                </label>
                <div className="flex gap-2 items-end">
                  <div className="w-1/2">
                    <TypeInput
                      value={formValues.start_academic_year}
                      onChange={(e) =>
                        handleAcademicYearChange(e, "start_academic_year")
                      }
                      placeholder="Awal Tahun Ajaran"
                      disabled={isLoading}
                    />
                  </div>
                  <span className="text-xl py-2 px-1 text-black dark:text-white">
                    /
                  </span>
                  <div className="w-1/2">
                    <TypeInput
                      value={formValues.end_academic_year}
                      onChange={(e) =>
                        handleAcademicYearChange(e, "end_academic_year")
                      }
                      disabled={isLoading}
                      placeholder="Akhir Tahun Ajaran"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4.5">
                <SelectInput
                  label="Semester"
                  id="semester"
                  value={formValues.semester}
                  options={semesterOptions}
                  searchable={false}
                  onChange={(value) => handleChange("semester", value)}
                  disabled={isLoading}
                />
              </div>

              <div className="mb-6 flex gap-4 flex-row items-end">
                <div className="w-1/2">
                  <DatePickerInput
                    id="start_date"
                    label="Tanggal Mulai"
                    value={formValues.start_date}
                    onChange={(e) => handleChange("start_date", e || null)}
                    disabled={isLoading}
                  />
                </div>

                <div className="w-1/2">
                  <DatePickerInput
                    id="end_date"
                    label="Tanggal Selesai"
                    value={formValues.end_date}
                    onChange={(e) => handleChange("end_date", e || null)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <ButtonSubmit text="Submit" isLoading={isLoading} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AcademicYearUpdate;

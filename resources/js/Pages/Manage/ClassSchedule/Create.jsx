import React, { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import SelectInput from "../../../components/Forms/SelectInput";
import ButtonSubmit from "../../../components/Forms/ButtonSubmit";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import AxiosClient from "../../../AxiosClient";
import TypeInput from "../../../components/Forms/TypeInput";

const dayOptions = [
  { value: "senin", label: "Senin" },
  { value: "selasa", label: "Selasa" },
  { value: "rabu", label: "Rabu" },
  { value: "kamis", label: "Kamis" },
  { value: "jumat", label: "Jumat" },
  { value: "sabtu", label: "Sabtu" },
  { value: "minggu", label: "Minggu" },
];

const ClassScheduleCreate = () => {
  const { school_id } = usePage().props;
  const defaultFormValues = {
    school_id: school_id || "",
    teacher_id: "",
    subject_id: "",
    classroom_id: "",
    academic_year_id: "",
    start_time: "",
    end_time: "",
    day: null,
  };

  const [formValues, setFormValues] = useState(defaultFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    if (!school_id) return;

    AxiosClient.get(`/api/teachers?load=user&school=${school_id}`)
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error("Error fetching teachers:", err));

    AxiosClient.get(`/api/subjects?school=${school_id}`)
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Error fetching subjects:", err));

    AxiosClient.get(`/api/classrooms?school=${school_id}`)
      .then((res) => setClassrooms(res.data))
      .catch((err) => console.error("Error fetching classrooms:", err));

    AxiosClient.get(`/api/academic-years?school=${school_id}`)
      .then((res) => setAcademicYears(res.data))
      .catch((err) => console.error("Error fetching academicYears:", err));
  }, [school_id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading("Loading...");

    AxiosClient.post("/api/class-schedules", {
      ...formValues,
      subject_id: formValues.subject_id.toString(),
      classroom_id: formValues.classroom_id.toString(),
    })
      .then((res) => {
        setFormValues(defaultFormValues);
        toast.success(res.data.message, { id: toastId });
      })
      .catch((err) => {
        console.log("Error details:", err.response.data);
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

  return (
    <>
      <Breadcrumb pageName="Class Schedule Create">
        <Link
          href="/manages/class-schedule"
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
                <SelectInput
                  label="Teacher"
                  id="teacher_id"
                  value={formValues.teacher_id}
                  options={teachers.map((teacher) => ({
                    value: teacher.id,
                    label: teacher.user.name,
                  }))}
                  onChange={(e) => handleChange("teacher_id", e || null)}
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4.5">
                <SelectInput
                  label="Subject"
                  id="subject_id"
                  value={formValues.subject_id}
                  options={subjects.map((subject) => ({
                    value: subject.id,
                    label: subject.name,
                  }))}
                  onChange={(e) => handleChange("subject_id", e || null)}
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4.5">
                <SelectInput
                  label="Classroom"
                  id="classroom_id"
                  value={formValues.classroom_id}
                  options={classrooms.map((classroom) => ({
                    value: classroom.id,
                    label: classroom.name,
                  }))}
                  onChange={(e) => handleChange("classroom_id", e || null)}
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4.5">
                <SelectInput
                  label="Academic Year"
                  id="academic_year_id"
                  value={formValues.academic_year_id}
                  options={academicYears.map((academicYear) => ({
                    value: academicYear.id,
                    label: `${academicYear.academic_year} (Semester ${academicYear.semester || "N/A"})`,
                  }))}
                  onChange={(e) => handleChange("academic_year_id", e || null)}
                  disabled={isLoading}
                />
              </div>

              <div className="mb-4.5">
                <SelectInput
                  label="Day"
                  id="day"
                  value={formValues.day}
                  options={dayOptions}
                  searchable={false}
                  onChange={(e) => handleChange("day", e || null)}
                  disabled={isLoading}
                />
              </div>

              <div className="mb-6 flex gap-4 flex-row items-end">
                <div className="w-1/2">
                  <TypeInput
                    id="start_time"
                    type="time"
                    label="Jam Mulai"
                    value={formValues.start_time || ""}
                    onChange={(e) => handleChange("start_time", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="w-1/2">
                  <TypeInput
                    id="end_time"
                    type="time"
                    label="Jam Selesai"
                    value={formValues.end_time || ""}
                    onChange={(e) => handleChange("end_time", e.target.value)}
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

export default ClassScheduleCreate;

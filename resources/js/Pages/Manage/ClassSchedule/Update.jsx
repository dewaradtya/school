import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import SelectInput from "../../../components/Forms/SelectInput";
import ButtonSubmit from "../../../components/Forms/ButtonSubmit";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import AxiosClient from "../../../AxiosClient";
import TypeInput from "../../../components/Forms/TypeInput";
import { Link, router, usePage } from "@inertiajs/react";

const dayOptions = [
  { value: "senin", label: "Senin" },
  { value: "selasa", label: "Selasa" },
  { value: "rabu", label: "Rabu" },
  { value: "kamis", label: "Kamis" },
  { value: "jumat", label: "Jumat" },
  { value: "sabtu", label: "Sabtu" },
  { value: "minggu", label: "Minggu" },
];

const ClassScheduleUpdate = () => {
  const { id } = usePage().props;

  const [formValues, setFormValues] = useState({
    school_id: "",
    teacher_id: "",
    subject_id: "",
    classroom_id: "",
    academic_year_id: "",
    start_time: "",
    end_time: "",
    day: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  // Fetch schedule data and set form values
  useEffect(() => {
    AxiosClient.get(`/api/class-schedules/${id}`)
      .then((res) => {
        const data = res.data.data;
        setFormValues({
          school_id: data.school_id || "",
          teacher_id: data.teacher_id || "",
          subject_id: data.subject_id || "",
          classroom_id: data.classroom_id || "",
          academic_year_id: data.academic_year_id || "",
          start_time: data.start_time.split(':').slice(0, 2).join(':'), // format time
          end_time: data.end_time.split(':').slice(0, 2).join(':'), // format time
          day: data.day || null,
        });

        // After setting school_id, fetch related data
        return Promise.all([
          AxiosClient.get(`/api/teachers?load=user&school=${data.school_id}`),
          AxiosClient.get(`/api/subjects?school=${data.school_id}`),
          AxiosClient.get(`/api/classrooms?school=${data.school_id}`),
          AxiosClient.get(`/api/academic-years?school=${data.school_id}`),
        ]);
      })
      .then((responses) => {
        setTeachers(responses[0].data);
        setSubjects(responses[1].data);
        setClassrooms(responses[2].data);
        setAcademicYears(responses[3].data);
      })
      .catch((err) => console.error("Error fetching schedule data:", err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timePattern.test(formValues.start_time) || !timePattern.test(formValues.end_time)) {
      toast.error("Jam mulai dan jam selesai harus dalam format HH:MM.");
      setIsLoading(false);
      return;
    }

    const toastId = toast.loading("loading...");

    AxiosClient.put(`/api/class-schedules/${id}`, {
      ...formValues,
      subject_id: formValues.subject_id.toString(),
      classroom_id: formValues.classroom_id.toString(),
    })
      .then(() => {
        toast.success("Schedule updated successfully!", { id: toastId });
        router.visit("/manages/class-schedule");
      })
      .catch((err) => {
        console.error("Error details:", err.response.data);
        toast.error("Failed to update schedule.", { id: toastId });
      })
      .finally(() => setIsLoading(false));
  };

  const handleChange = (attr, value) => {
    setFormValues({ ...formValues, [attr]: value });
  };

  return (
    <>
      <Breadcrumb pageName="Update Class Schedule">
        <Link
          to="/manages/class-schedule"
          className="self-end inline-flex items-center justify-center gap-2 text-base font-medium text-boxdark hover:opacity-80 hover:text-black hover:dark:text-white dark:text-bodydark"
        >
          <FaArrowLeft /> Kembali
        </Link>
      </Breadcrumb>

      <div className="flex flex-col">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form action="#" onSubmit={handleSubmit}>
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

export default ClassScheduleUpdate;

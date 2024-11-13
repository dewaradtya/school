import { useEffect, useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import SelectInput from "../../../components/Forms/SelectInput";
import ButtonSubmit from "../../../components/Forms/ButtonSubmit";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { TypeTextarea } from "../../../components/Forms/TypeInput";

const HomeroomTeacherUpdate = () => {
  const { id } = usePage().props;
  const [formValues, setFormValues] = useState({
    school_id: "",
    teacher_id: "",
    subject_id: "",
    classroom_id: "",
    academic_year_id: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    router.get(`/api/homeroom-teachers/${id}`, {}, {
      onSuccess: ({ props }) => {
        const data = props.homeroomTeacher;
        setFormValues({
          school_id: data.school_id || "",
          teacher_id: data.teacher_id || "",
          classroom_id: data.classroom_id || "",
          academic_year_id: data.academic_year_id || "",
          notes: data.notes || "",
        });
        setTeachers(props.teachers);
        setClassrooms(props.classrooms);
        setAcademicYears(props.academicYears);
      },
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Loading...");

    router.put(`/api/homeroom-teachers/${id}`, formValues, {
      onSuccess: () => {
        toast.success("Schedule updated successfully!", { id: toastId });
        router.visit("/manages/homeroom-teacher");
      },
      onError: () => {
        toast.error("Failed to update schedule.", { id: toastId });
      },
      onFinish: () => setIsLoading(false),
    });
  };

  const handleChange = (attr, value) => {
    setFormValues({ ...formValues, [attr]: value });
  };

  return (
    <>
      <Breadcrumb pageName="Homeroom Teacher Schedule">
        <Link
          href="/manages/homeroom-teacher"
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
                <TypeTextarea
                  label="Notes"
                  id="notes"
                  value={formValues.notes}
                  onChange={(e) =>
                    setFormValues({ ...formValues, notes: e.target.value })
                  }
                  placeholder="Masukkan notes Anda"
                  disabled={isLoading}
                  rows={5}
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

export default HomeroomTeacherUpdate;

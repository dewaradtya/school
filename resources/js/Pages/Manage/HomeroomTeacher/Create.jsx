import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import SelectInput from "../../../components/Forms/SelectInput";
import ButtonSubmit from "../../../components/Forms/ButtonSubmit";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { usePage, Link, router } from "@inertiajs/react";
import { TypeTextarea } from "../../../components/Forms/TypeInput";

const HomeroomTeacherCreate = () => {
  const { school_id: schoolId } = usePage().props;
  const defaultFormValues = {
    school_id: schoolId || "",
    teacher_id: "",
    classroom_id: "",
    academic_year_id: "",
    notes: "",
  };

  const [formValues, setFormValues] = useState(defaultFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    if (!schoolId) return;

    router.get(`/api/teachers?load=user&school=${schoolId}`, {
      onSuccess: ({ props }) => setTeachers(props.data),
    });

    router.get(`/api/classrooms?school=${schoolId}`, {
      onSuccess: ({ props }) => setClassrooms(props.data),
    });

    router.get(`/api/academic-years?school=${schoolId}`, {
      onSuccess: ({ props }) => setAcademicYears(props.data),
    });
  }, [schoolId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Loading...");

    router.post("/api/homeroom-teachers", formValues, {
      onSuccess: (res) => {
        setFormValues(defaultFormValues);
        toast.success(res.props.message, { id: toastId });
      },
      onError: (err) => {
        console.error("Error details:", err);
        toast.error(err.message || "An error occurred", { id: toastId });
      },
      onFinish: () => setIsLoading(false),
    });
  };

  const handleChange = (attr, value) => {
    setFormValues({ ...formValues, [attr]: value });
  };

  return (
    <>
      <Breadcrumb pageName="Homeroom Teacher Create">
        <Link
          href="/manages/homeroom-teacher"
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

export default HomeroomTeacherCreate;

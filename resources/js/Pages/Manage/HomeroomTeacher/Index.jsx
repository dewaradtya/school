import { router, usePage } from "@inertiajs/react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import TableThree from "../../../components/Tables/TableThree";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import toast from "react-hot-toast";

const HomeroomTeacher = () => {
  const { schools: initialSchools, schedules: initialSchedules } = usePage().props;
  const [data, setData] = useState(initialSchedules || []);
  const [schools, setSchools] = useState(initialSchools || []);
  const [schoolFilter, setSchoolFilter] = useState("");

  const handleCreate = () => {
    if (!schoolFilter) {
      toast.error("Silakan pilih sekolah terlebih dahulu untuk membuat data.");
      return;
    }
    router.visit(`/manages/homeroom-teacher/create?school_id=${schoolFilter}`);
  };

  useEffect(() => {
    if (!initialSchedules) {
      router.get("/api/homeroom-teachers", {
        onSuccess: ({ props }) => setData(props.schedules),
      });
    }
    if (!initialSchools) {
      router.get("/api/schools", {
        onSuccess: ({ props }) => setSchools(props.schools),
      });
    }
  }, [initialSchedules, initialSchools]);

  const filteredData = schoolFilter
    ? data.filter((item) => item.school_id == schoolFilter)
    : data;

  const handleEdit = (id) => {
    router.visit(`/manages/homeroom-teacher/edit/${id}`);
  };

  const handleDelete = (id) => {
    toast.success(`Delete schedule ID: ${id}`);
  };

  const handleView = (id) => {
    toast.success(`View schedule ID: ${id}`);
  };

  const columns = [
    { header: "School", field: "school_name" },
    { header: "Teacher", field: "teacher_name" },
    { header: "Classroom", field: "classroom_name" },
    { header: "Academic Year", field: "academic_year" },
    { header: "Notes", field: "notes" },
    {
      header: "Action",
      render: (rowData) => (
        <div className="flex items-center space-x-3.5">
          <button className="hover:text-primary" onClick={() => handleView(rowData.id)}>
            <AiOutlineEye size={18} />
          </button>
          <button className="hover:text-primary" onClick={() => handleEdit(rowData.id)}>
            <AiOutlineEdit size={18} />
          </button>
          <button className="hover:text-primary" onClick={() => handleDelete(rowData.id)}>
            <AiOutlineDelete size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb pageName="Homeroom Teacher">
        <button
          onClick={handleCreate}
          className="self-end inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-center text-white hover:bg-opacity-90 hover:text-white"
        >
          <FaPlus className="mr-1" /> Create
        </button>
      </Breadcrumb>

      <div className="flex flex-col gap-9">
        <div className="flex items-center">
          <label htmlFor="schoolFilter" className="mr-2 font-medium">
            Filter by School:
          </label>
          <select
            id="schoolFilter"
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:bg-slate-100 disabled:dark:bg-slate-700 disabled:cursor-not-allowed dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">All Schools</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        <TableThree tableData={filteredData} columns={columns} />
      </div>
    </>
  );
};

export default HomeroomTeacher;

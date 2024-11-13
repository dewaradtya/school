import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import TableThree from "../../../components/Tables/TableThree";
import { FaPlus } from "react-icons/fa6";
import AxiosClient from "../../../AxiosClient";
import { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";

const ClassSchedule = () => {
  const [data, setData] = useState([]);
  const [schools, setSchools] = useState([]);
  const [schoolFilter, setSchoolFilter] = useState("");

  const handleCreate = () => {
    if (!schoolFilter) {
      toast.error("Silakan pilih sekolah terlebih dahulu untuk membuat data.");
      return;
    }
    router.visit(`/manages/class-schedule/create?school_id=${schoolFilter}`);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const schedulesRes = await AxiosClient.get("/api/class-schedules");
        const teachersRes = await AxiosClient.get("/api/teachers?load=user");
        const subjectsRes = await AxiosClient.get("/api/subjects");
        const classroomsRes = await AxiosClient.get("/api/classrooms");
        const schoolsRes = await AxiosClient.get("/api/schools");
        const academicYearsRes = await AxiosClient.get("/api/academic-years");
  
        setSchools(schoolsRes.data);
  
        const schedulesWithSchoolNames = schedulesRes.data.map((schedule) => {
          const school = schoolsRes.data.find((s) => s.id === schedule.school_id);
          const teacher = teachersRes.data.find((s) => s.id === schedule.teacher_id);
          const subject = subjectsRes.data.find((s) => s.id === schedule.subject_id);
          const classroom = classroomsRes.data.find((s) => s.id === schedule.classroom_id);
          const academicYear = academicYearsRes.data.find((s) => s.id === schedule.academic_year_id);
          return {
            ...schedule,
            school_name: school ? school.name : "Unknown School",
            teacher_name: teacher ? teacher.user.name : "Unknown Teacher",
            subject_name: subject ? subject.name : "Unknown Subject",
            classroom_name: classroom ? classroom.name : "Unknown Classroom",
            academic_year: academicYear ? academicYear.academic_year : "Unknown Academic Year",
          };
        });
  
        setData(schedulesWithSchoolNames);
  
        console.log("Fetched Data:", schedulesWithSchoolNames);
      } catch (err) {
        console.error("Error Response:", err.response?.data || err.message);
      }
    };
  
    fetchData();
  }, []);
  
  const filteredData = schoolFilter
    ? data.filter((item) => item.school_id == schoolFilter)
    : data;  

  const handleEdit = (id) => {
    router.visit(`/manages/class-schedule/edit/${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete schedule ID:", id);
  };

  const handleView = (id) => {
    console.log("View schedule ID:", id);
  };

  const columns = [
    { header: "School", field: "school_name" },
    { header: "Teacher", field: "teacher_name" },
    { header: "Subject", field: "subject_name" },
    { header: "Classroom", field: "classroom_name" },
    { header: "Academic Year", field: "academic_year" },
    { header: "Day", field: "day" },
    { header: "Start Time", field: "start_time" },
    { header: "End Time", field: "end_time" },
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
      <Breadcrumb pageName="Class Schedule">
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

export default ClassSchedule;

import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import TableThree from "../../../components/Tables/TableThree";
import { FaPlus } from "react-icons/fa6";
import AxiosClient from "../../../AxiosClient";
import { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { Link, router } from "@inertiajs/react";

const AcademicYears = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const academicYearsRes = await AxiosClient.get("/api/academic-years");
        const schoolsRes = await AxiosClient.get("/api/schools");

        const academicYearsWithSchoolNames = academicYearsRes.data.map(
          (year) => {
            const school = schoolsRes.data.find((s) => s.id === year.school_id);
            return {
              ...year,
              school_name: school ? school.name : "Unknown School",
            };
          }
        );

        setData(academicYearsWithSchoolNames);
      } catch (err) {
        console.error("Error Response:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id) => {
    router.visit(`/manages/academic-years/edit/${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete school ID:", id);
  };

  const handleView = (id) => {
    console.log("View school ID:", id);
  };

  const columns = [
    { header: "School", field: "school_name" },
    { header: "Academic Year", field: "academic_year" },
    { header: "Semester", field: "semester" },
    { header: "Start Date", field: "start_date" },
    { header: "End Date", field: "end_date" },
    { header: "Active", field: "is_active" },
    {
      header: "Action",
      render: (rowData) => (
        <div className="flex items-center space-x-3.5">
          <button
            className="hover:text-primary"
            onClick={() => handleView(rowData.id)}
          >
            <AiOutlineEye size={18} />
          </button>

          <button
            className="hover:text-primary"
            onClick={() => handleEdit(rowData.id)}
          >
            <AiOutlineEdit size={18} />
          </button>

          <button
            className="hover:text-primary"
            onClick={() => handleDelete(rowData.id)}
          >
            <AiOutlineDelete size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb pageName="Academic Years">
        <Link
          to="/manages/academic-years/create"
          className="self-end inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-center text-white hover:bg-opacity-90 hover:text-white"
        >
          <FaPlus className="mr-1" /> Create
        </Link>
      </Breadcrumb>

      <div className="flex flex-col gap-9">
        <TableThree tableData={data} columns={columns} />
      </div>
    </>
  );
};

export default AcademicYears;

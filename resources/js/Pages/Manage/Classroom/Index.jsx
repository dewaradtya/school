import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import TableThree from "../../../components/Tables/TableThree";
import { useEffect, useState } from "react";
import AxiosClient from "../../../AxiosClient";
import { FaPlus } from "react-icons/fa";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { Link, router } from "@inertiajs/react";

const Classroom = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classroomsRes = await AxiosClient.get("/api/classrooms");
        const schoolsRes = await AxiosClient.get("/api/schools");

        const classroomsWithSchoolNames = classroomsRes.data.map((year) => {
          const school = schoolsRes.data.find((s) => s.id === year.school_id);
          return {
            ...year,
            school_name: school ? school.name : "Unknown School",
          };
        });

        setData(classroomsWithSchoolNames);
      } catch (err) {
        console.error("Error Response:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id) => {
    router.visit(`/manages/classroom/edit/${id}`);
  };

  const handleDelete = (id) => {
    console.log("Delete school ID:", id);
  };

  const handleView = (id) => {
    console.log("View school ID:", id);
  };

  const columns = [
    { header: "School", field: "school_name" },
    { header: "Grade", field: "grade" },
    { header: "name", field: "name" },
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
      <Breadcrumb pageName="Classroom">
        <Link
          to="/manages/classroom/create"
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

export default Classroom;

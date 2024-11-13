import { Link, router, usePage } from "@inertiajs/react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import TableThree from "../../../components/Tables/TableThree";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";

const Student = () => {
  const { students, schools } = usePage().props;
  const [data, setData] = useState([]);

  useEffect(() => {
    const studentsWithSchoolNames = students.map((student) => {
      const school = schools.find((s) => s.id === student.user.school_id);
      return {
        ...student,
        name: student.user.name,
        email: student.user.email,
        school_name: school ? school.name : "Unknown School",
      };
    });

    setData(studentsWithSchoolNames);
  }, [students, schools]);

  const handleEdit = (id) => {
    router.visit(("student.edit", { id }));
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      router.delete(("student.destroy", { id }), {
        onSuccess: () => alert("Data berhasil dihapus"),
      });
    }
  };

  const handleView = (id) => {
    router.visit(("student.show", { id }));
  };

  const columns = [
    { header: "School", field: "school_name" },
    { header: "Name", field: "name" },
    { header: "Email", field: "email" },
    { header: "NIS", field: "nis" },
    { header: "NISN", field: "nisn" },
    { header: "Gender", field: "gender" },
    { header: "Tempat Lahir", field: "place_of_birth" },
    { header: "Tanggal Lahir", field: "date_of_birth" },
    { header: "Religion", field: "religion" },
    { header: "Phone", field: "phone" },
    { header: "Address", field: "address" },
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
      <Breadcrumb pageName="Student">
        <Link
          href={route("student.create")}
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

export default Student;

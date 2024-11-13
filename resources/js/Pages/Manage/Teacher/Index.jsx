import { Link, router, usePage } from "@inertiajs/react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import TableThree from "../../../components/Tables/TableThree";
import { useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";

const Teacher = () => {
  const { teachers, schools } = usePage().props;
  useEffect(() => {
    router.get(("teacher.index"), {
      onSuccess: (page) => {
        const teachersWithSchoolNames = page.props.teachers.map((teacher) => {
          const school = page.props.schools.find((s) => s.id === teacher.user.school_id);
          return {
            ...teacher,
            name: teacher.user.name,
            email: teacher.user.email,
            school_name: school ? school.name : "Unknown School",
          };
        });

        setData(teachersWithSchoolNames);
      },
    });
  }, []);

  const handleEdit = (id) => {
    router.visit(("teacher.edit", { id }));
  };

  const handleDelete = (id) => {
    router.delete(("teacher.destroy", { id }), {
      onSuccess: () => alert("Data berhasil dihapus"),
    });
  };

  const handleView = (id) => {
    router.visit(("teacher.show", { id }));
  };

  const columns = [
    { header: "School", field: "school_name" },
    { header: "Name", field: "name" },
    { header: "Email", field: "email" },
    { header: "NIP", field: "nip" },
    { header: "NUPTK", field: "nuptk" },
    { header: "Position", field: "position" },
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
      <Breadcrumb pageName="Teacher">
        <Link
          href={route("teacher.create")}
          className="self-end inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-center text-white hover:bg-opacity-90 hover:text-white"
        >
          <FaPlus className="mr-1" /> Create
        </Link>
      </Breadcrumb>

      <div className="flex flex-col gap-9">
        <TableThree tableData={teachers} columns={columns} />
      </div>
    </>
  );
};

export default Teacher;

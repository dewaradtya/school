import { Link, router, usePage } from "@inertiajs/react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import TableThree from "../../../components/Tables/TableThree";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";

const School = () => {
  const { schools } = usePage().props;
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(schools);
  }, [schools]);

  const handleEdit = (id) => {
    router.visit(("school.edit", { id }));
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      router.delete(("school.destroy", { id }), {
        onSuccess: () => alert("Data berhasil dihapus"),
      });
    }
  };

  const handleView = (id) => {
    router.visit(("school.show", { id }));
  };

  const columns = [
    { header: "Name", field: "name" },
    { header: "Email", field: "email" },
    { header: "NPSN", field: "npsn" },
    { header: "Phone", field: "phone" },
    { header: "Education Type", field: "education_type" },
    { header: "Postal Code", field: "postal_code" },
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
      <Breadcrumb pageName="School">
        <Link
          href={route("school.create")}
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

export default School;

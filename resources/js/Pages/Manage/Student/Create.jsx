import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import SelectInput from "../../../components/Forms/SelectInput";
import TypeInput, { PasswordInput, TypeTextarea } from "../../../components/Forms/TypeInput";
import ButtonSubmit from "../../../components/Forms/ButtonSubmit";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import AxiosClient from "../../../AxiosClient";
import DatePickerInput from "../../../components/Forms/DatePickerInput";
import { Link } from "@inertiajs/react";

const BASE_URL_API_WILAYAH =
  "https://subchan07.github.io/api-wilayah-indonesia/api";

const genderOptions = [
  { value: "laki-laki", label: "Laki-Laki" },
  { value: "perempuan", label: "Perempuan" },
];

const defaultFormValues = {
  name: "",
  email: "",
  password: "",
  nis: "",
  nisn: "",
  place_of_birth: "",
  date_of_birth: null,
  gender: null,
  religion: "",
  number_of_sibling: "",
  address: "",
  father_name: "",
  father_occupation: "",
  father_phone: "",
  mother_name: "",
  mother_occupation: "",
  mother_phone: "",
  guardian_name: "",
  guardian_occupation: "",
  guardian_phone: "",
  guardian_address: "",
};

const defaultSelectOptions = [{ value: null, label: "" }];


const StudentCreate = () => {
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [religions, setReligions] = useState([]);

  console.log(formValues);

  useEffect(() => {
    AxiosClient.get("/api/enums/religions")
      .then((res) => {
        console.log(res.data);
        setReligions(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching religions:", err);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading("Loading...");

    const { date_of_birth } = formValues;

    AxiosClient.post("/api/students", {
      ...formValues,
      date_of_birth: date_of_birth
        ? date_of_birth.toISOString().split("T")[0]
        : null,
    })
      .then((res) => {
        setFormValues(defaultFormValues);
        toast.success(res.data.message, { id: toastId });
      })
      .catch((err) => {
        if (err.response.status == 500) {
          toast.error(err.response.statusText, { id: toastId });
        } else {
          toast.error(err.response.data.message, { id: toastId });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleChange = (attr, value) => {
    setFormValues({ ...formValues, [attr]: value });
  };

  return (
    <>
      <Breadcrumb pageName="Create Data Siswa">
        <Link
          to="/manages/student"
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
                  <TypeInput
                    label="Name"
                    id="name"
                    value={formValues.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required={false}
                    disabled={isLoading}
                  />
              </div>

              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/2">
                  <TypeInput
                    label="Email"
                    type="email"
                    id="email"
                    value={formValues.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/2">
                  <PasswordInput
                    label="Password"
                    type="password"
                    id="password"
                    value={formValues.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/2">
                  <TypeInput
                    label="Nis"
                    type="nis"
                    id="nis"
                    value={formValues.nis}
                    onChange={(e) => handleChange("nis", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/2">
                  <TypeInput
                    label="Nisn"
                    id="nisn"
                    value={formValues.nisn}
                    onChange={(e) => handleChange("nisn", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/2">
                  <TypeInput
                    label="Phone"
                    id="phone"
                    value={formValues.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/2">
                  <SelectInput
                    label="Gender"
                    id="gender"
                    value={formValues.gender}
                    options={genderOptions}
                    onChange={(e) => handleChange("gender", e || null)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/2">
                  <SelectInput
                    label="Religion"
                    id="religion"
                    value={formValues.religion}
                    options={religions.map((religion) => ({
                      value: religion.value,
                      label: religion.name,
                    }))}
                    onChange={(e) => handleChange("religion", e || null)}
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/2">
                  <TypeInput
                    label="Jumlah Saudara Kandung"
                    type="number"
                    id="number_of_sibling"
                    value={formValues.number_of_sibling}
                    onChange={(e) =>
                      handleChange("number_of_sibling", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/2">
                  <TypeInput
                    label="Tempat Lahir"
                    id="place_of_birth"
                    value={formValues.place_of_birth}
                    onChange={(e) =>
                      handleChange("place_of_birth", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/2">
                  <DatePickerInput
                    id="date_of_birth"
                    label="Tanggal Lahir"
                    value={formValues.date_of_birth}
                    onChange={(e) => handleChange("date_of_birth", e || null)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <TypeTextarea
                  label="Alamat"
                  id="address"
                  value={formValues.address}
                  onChange={(e) =>
                    setFormValues({ ...formValues, address: e.target.value })
                  }
                  placeholder="Masukkan alamat Anda"
                  disabled={isLoading}
                  rows={5}
                />
              </div>

              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/3">
                  <TypeInput
                    label="Nama Ayah"
                    id="father_name"
                    value={formValues.father_name}
                    onChange={(e) =>
                      handleChange("father_name", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/3">
                  <TypeInput
                    label="Pekerjaan Ayah"
                    id="father_occupation"
                    value={formValues.father_occupation}
                    onChange={(e) =>
                      handleChange("father_occupation", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/3">
                  <TypeInput
                    label="Telepon Ayah"
                    id="father_phone"
                    value={formValues.father_phone}
                    onChange={(e) =>
                      handleChange("father_phone", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/3">
                  <TypeInput
                    label="Nama Ibu"
                    id="mother_name"
                    value={formValues.mother_name}
                    onChange={(e) =>
                      handleChange("mother_name", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/3">
                  <TypeInput
                    label="Pekerjaan Ibu"
                    id="mother_occupation"
                    value={formValues.mother_occupation}
                    onChange={(e) =>
                      handleChange("mother_occupation", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/3">
                  <TypeInput
                    label="Telepon Ibu"
                    id="mother_phone"
                    value={formValues.mother_phone}
                    onChange={(e) =>
                      handleChange("mother_phone", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/3">
                  <TypeInput
                    label="Nama Wali"
                    id="guardian_name"
                    value={formValues.guardian_name}
                    onChange={(e) =>
                      handleChange("guardian_name", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/3">
                  <TypeInput
                    label="Pekerjaan Wali"
                    id="guardian_occupation"
                    value={formValues.guardian_occupation}
                    onChange={(e) =>
                      handleChange("guardian_occupation", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/3">
                  <TypeInput
                    label="Telepon Wali"
                    id="guardian_phone"
                    value={formValues.guardian_phone}
                    onChange={(e) =>
                      handleChange("guardian_phone", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <TypeTextarea
                  label="Alamat Wali"
                  id="guardian_address"
                  value={formValues.guardian_address}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      guardian_address: e.target.value,
                    })
                  }
                  placeholder="Masukkan alamat Anda"
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

export default StudentCreate;

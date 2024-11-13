import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import SelectInput from "../../../components/Forms/SelectInput";
import TypeInput, { PasswordInput, TypeTextarea } from "../../../components/Forms/TypeInput";
import ButtonSubmit from "../../../components/Forms/ButtonSubmit";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import AxiosClient from "../../../AxiosClient";
import DatePickerInput from "../../../components/Forms/DatePickerInput";
import { Link, usePage } from "@inertiajs/react";

const genderOptions = [
  { value: "laki-laki", label: "Laki-Laki" },
  { value: "perempuan", label: "Perempuan" },
];

const defaultFormValues = {
  name: "",
  email: "",
  password: "",
  nip: "",
  nuptk: "",
  position: "",
  place_of_birth: "",
  date_of_birth: null,
  gender: null,
  religion: "",
  phone: "",
  address: "",
};

const TeacherUpdate = () => {
  const { id } = usePage().props;
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

  useEffect(() => {
    if (id) {
      AxiosClient.get(`/api/teachers/${id}?load=user`)
        .then((res) => {
          const data = res.data.data;
          setFormValues({
            ...defaultFormValues,
            ...data,
            ...data.user,
            date_of_birth: data.date_of_birth
              ? new Date(data.date_of_birth)
              : null,
          });
        })
        .catch((err) => {
          console.error("Error fetching teacher data:", err);
        });
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading("Loading...");

    const { date_of_birth } = formValues;

    AxiosClient.put(`/api/teachers/${id}`, {
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
        if (err.response.status === 500) {
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
      <Breadcrumb pageName="Update Data Guru">
        <Link
          to="/manages/teacher"
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
                    placeholder="Masukkan jika ingin mengganti password"
                    required={false}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/2">
                  <TypeInput
                    label="Nip"
                    type="nip"
                    id="nip"
                    value={formValues.nip}
                    onChange={(e) => handleChange("nip", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/2">
                  <TypeInput
                    label="Nuptk"
                    id="nuptk"
                    value={formValues.nuptk}
                    onChange={(e) => handleChange("nuptk", e.target.value)}
                    required={false}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/2">
                  <TypeInput
                    label="Position"
                    id="position"
                    value={formValues.position}
                    onChange={(e) => handleChange("position", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/2">
                  <SelectInput
                    label="Gender"
                    id="gender"
                    value={formValues.gender}
                    options={genderOptions}
                    searchable={false}
                    onChange={(e) => handleChange("gender", e || null)}
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
                    label="Phone"
                    id="phone"
                    value={formValues.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required={false}
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
                  required={false}
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

export default TeacherUpdate;

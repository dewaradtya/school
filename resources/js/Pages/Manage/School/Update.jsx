import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import SelectInput from "../../../components/Forms/SelectInput";
import TypeInput from "../../../components/Forms/TypeInput";
import ButtonSubmit from "../../../components/Forms/ButtonSubmit";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { disallowPipeCharacters } from "../../../utils/helper";
import AxiosClient from "../../../AxiosClient";
import { usePage } from "@inertiajs/react";

const BASE_URL_API_WILAYAH =
  "https://subchan07.github.io/api-wilayah-indonesia/api";

const defaultFormValues = {
  name: "",
  npsn: "",
  fax: "",
  phone: "",
  email: "",
  education_type: null,
  province: null,
  regency: null,
  district: null,
  village: null,
  address: "",
  postal_code: "",
};

const defaultSelectOptions = [{ value: null, label: "" }];

const SchoolUpdate = () => {
  const { id } = usePage().props;
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [isLoading, setIsLoading] = useState(false);
  const [educationTypeOptions, setEducationTypeOptions] =
    useState(defaultSelectOptions);
  const [provincieOptions, setProvincieOptions] =
    useState(defaultSelectOptions);
  const [regencieOptions, setRegencieOptions] = useState(defaultSelectOptions);
  const [districtOptions, setDistrictOptions] = useState(defaultSelectOptions);
  const [villageOptions, setVillageOptions] = useState(defaultSelectOptions);

  useEffect(() => {
    if (id) {
      AxiosClient.get(`/api/schools/${id}`)
        .then((res) => {
          const data = res.data.data;
          setFormValues({
            name: data.name || "",
            npsn: data.npsn || "",
            fax: data.fax || "",
            phone: data.phone || "",
            email: data.email || "",
            education_type: data.education_type || null,
            province: data.province || null,
            regency: data.regency || null,
            district: data.district || null,
            village: data.village || null,
            address: data.address || "",
            postal_code: data.postal_code || "",
          });
        })
        .catch((err) => {
          toast.error("Gagal memuat data sekolah.");
        });
    }
  }, [id]);

  useEffect(() => {
    AxiosClient.get("/api/enums/education-types")
      .then((res) => {
        const datas = res.data.data;
        setEducationTypeOptions(
          datas.map((data) => ({ value: data.value, label: data.name }))
        );
      })
      .catch((err) => {
        setEducationTypeOptions(defaultSelectOptions);
        if (err.response.status == 500) {
          toast.error(err.response.statusText);
        } else {
          toast.error(err.response.data.message);
        }
      });

    axios.get(`${BASE_URL_API_WILAYAH}/provinces.json`).then((res) => {
      setProvincieOptions(
        res.data.map((data) => ({ value: data.id, label: data.name }))
      );
    });
  }, []);

  useEffect(() => {
    if (formValues.province == null) {
      setFormValues({
        ...formValues,
        regency: null,
        district: null,
        village: null,
      });
      setRegencieOptions(defaultSelectOptions);
      setDistrictOptions(defaultSelectOptions);
      setVillageOptions(defaultSelectOptions);
      return;
    }

    axios
      .get(`${BASE_URL_API_WILAYAH}/regencies/${formValues.province}.json`)
      .then((res) => {
        // console.log('kab/kota: ', res.data)
        setRegencieOptions(
          res.data.map((data) => ({ value: data.id, label: data.name }))
        );
      });
  }, [formValues.province]);

  useEffect(() => {
    if (formValues.regency == null) {
      setFormValues({ ...formValues, district: null, village: null });
      setDistrictOptions(defaultSelectOptions);
      setVillageOptions(defaultSelectOptions);
      return;
    }

    axios
      .get(`${BASE_URL_API_WILAYAH}/districts/${formValues.regency}.json`)
      .then((res) => {
        // console.log('kecamatan: ', res.data)
        setDistrictOptions(
          res.data.map((data) => ({ value: data.id, label: data.name }))
        );
      });
  }, [formValues.regency]);

  useEffect(() => {
    if (formValues.district == null) {
      setFormValues({ ...formValues, village: null });
      setVillageOptions(defaultSelectOptions);
      return;
    }

    axios
      .get(`${BASE_URL_API_WILAYAH}/villages/${formValues.district}.json`)
      .then((res) => {
        // console.log('kelurahan: ', res.data)
        setVillageOptions(
          res.data.map((data) => ({ value: data.id, label: data.name }))
        );
      });
  }, [formValues.district]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const toastId = toast.loading("Loading...");

    const request = id
      ? AxiosClient.put(`/api/schools/${id}`, formValues)
      : AxiosClient.post("/api/schools", formValues);

    request
      .then((res) => {
        setFormValues(defaultFormValues);
        toast.success(res.data.message, { id: toastId });
      })
      .catch((err) => {
        if (err.response && err.response.status === 500) {
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
      <Breadcrumb pageName="Edit Data Sekolah">
        <Link
          to="/manages/school"
          className="self-end inline-flex items-center justify-center gap-2 text-base font-medium text-boxdark hover:opacity-80 hover:text-black hover:dark:text-white dark:text-bodydark"
        >
          <FaArrowLeft /> Kembali
        </Link>
      </Breadcrumb>

      <div className="flex flex-col">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/2">
                  <TypeInput
                    label="Nama Sekolah"
                    id="name"
                    value={formValues.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/2">
                  <TypeInput
                    label="Nomor Pokok Sekolah Nasional (NPSN)"
                    id="npsn"
                    value={formValues.npsn}
                    onChange={(e) => handleChange("npsn", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-8 flex gap-4 items-end">
                <div className="w-1/2">
                  <TypeInput
                    label="Email"
                    id="email"
                    value={formValues.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/2">
                  <SelectInput
                    label="Jenis Pendidikan"
                    id="education_type"
                    value={formValues.education_type}
                    options={educationTypeOptions}
                    searchable={false}
                    onChange={(e) => handleChange("education_type", e || null)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/2">
                  <TypeInput
                    label="Fax"
                    id="fax"
                    value={formValues.fax}
                    onChange={(e) => handleChange("fax", e.target.value)}
                    required={false}
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/2">
                  <TypeInput
                    label="Telepon"
                    id="phone"
                    value={formValues.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required={false}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col sm:flex-row gap-4 items-end">
                <div className="sm:w-1/3 w-full">
                  <SelectInput
                    label="Provinsi"
                    id="province"
                    value={formValues.province}
                    options={provincieOptions}
                    searchable={true}
                    onChange={(e) => handleChange("province", e || null)}
                    required={false}
                    disabled={isLoading}
                  />
                </div>
                <div className="sm:w-1/3 w-full">
                  <SelectInput
                    label="Kabupaten"
                    id="regency"
                    value={formValues.regency}
                    options={regencieOptions}
                    searchable={true}
                    onChange={(e) => handleChange("regency", e || null)}
                    required={false}
                    disabled={isLoading}
                  />
                </div>
                <div className="sm:w-1/3 w-full">
                  <SelectInput
                    label="Kecamatan"
                    id="district"
                    value={formValues.district}
                    options={districtOptions}
                    searchable={true}
                    onChange={(e) => handleChange("district", e || null)}
                    required={false}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="mb-4.5 flex gap-4 items-end">
                <div className="w-1/3">
                  <TypeInput
                    label="Alamat"
                    id="address"
                    value={formValues.address}
                    onChange={(e) =>
                      handleChange(
                        "address",
                        disallowPipeCharacters(e.target.value)
                      )
                    }
                    required={false}
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/3">
                  <SelectInput
                    label="Kelurahan"
                    id="village"
                    value={formValues.village}
                    options={villageOptions}
                    searchable={true}
                    onChange={(e) => handleChange("village", e || null)}
                    required={false}
                    disabled={isLoading}
                  />
                </div>
                <div className="w-1/3">
                  <TypeInput
                    label="Kode Pos"
                    id="postal_code"
                    value={formValues.postal_code}
                    onChange={(e) =>
                      handleChange("postal_code", e.target.value)
                    }
                    required={false}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <ButtonSubmit text="Submit" isLoading={isLoading} />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SchoolUpdate;

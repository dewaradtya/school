import { useRef, useState } from "react"
import { FaRegEnvelope, FaRegEye, FaRegEyeSlash } from "react-icons/fa"

const TypeInput = (props) => {
    const { type = 'text', label = '', id = '', value = '', disabled = false, required = true, onChange = () => { }, placeholder = '' } = props
    return (
        <>
            <label htmlFor={id} className="mb-2.5 block text-black dark:text-white">{label}</label>
            <input
                type={type}
                id={id}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:bg-slate-100 disabled:dark:bg-slate-700 disabled:cursor-not-allowed dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
            />
        </>
    )
}

export const TypeInputWithIcon = (props) => {
    const { type = 'text', icon = '', label = '', id = '', value = '', disabled = false, required = true, onChange = () => { }, placeholder = '' } = props

    return (
        <>
            <label className="mb-2.5 block font-medium text-black dark:text-white">
                {label}
            </label>
            <div className="relative">
                <input
                    type={type}
                    id={id}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:bg-slate-100 disabled:dark:bg-slate-700 disabled:cursor-not-allowed dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                />
                <span className="absolute right-2.5 top-2.5 text-xl opacity-50">
                    {icon}
                </span>
            </div>
        </>
    )
}

export const TypeTextarea = (props) => {
    const { label = '', id = '', value = '', disabled = false, required = true, onChange = () => { }, placeholder = '', rows = 4 } = props
    return (
        <>
            <label htmlFor={id} className="mb-2.5 block text-black dark:text-white">{label}</label>
            <textarea
                id={id}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:bg-slate-100 disabled:dark:bg-slate-700 disabled:cursor-not-allowed dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
            />
        </>
    )
}

export const PasswordInput = ({ label = "Password", id = "password", value = "", onChange = () => {}, placeholder = '', disabled = false, required = true }) => {
    const [showPassword, setShowPassword] = useState(false);
    const passwordRef = useRef(null);
  
    const togglePassword = () => {
      setShowPassword((prevShow) => !prevShow);
      passwordRef.current.focus();
    };
  
    return (
      <>
        <label className="mb-2.5 block font-medium text-black dark:text-white">
          {label}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id={id}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 text-black outline-none transition focus:border-primary active:border-primary disabled:bg-slate-100 disabled:dark:bg-slate-700 disabled:cursor-not-allowed dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            ref={passwordRef}
          />
          <span className="absolute right-2.5 top-2.5 text-xl opacity-50 cursor-pointer hover:text-primary hover:opacity-100" onClick={togglePassword}>
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
      </>
    );
  };

export default TypeInput

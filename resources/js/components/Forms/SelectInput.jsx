import { SelectPicker } from "rsuite";

const SelectInput = (props) => {
    const { label = '', id = '', value = '', options = [], searchable = true, disabled = false, required = true, onChange = () => { }, placeholder = '' } = props;

    return (
        <>
            <label htmlFor={id} className="mb-2.5 block text-black dark:text-white">{label}</label>
            <SelectPicker
                id={id}
                data={options}
                block={true}
                searchable={searchable}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
            />
        </>
    )
}

export default SelectInput
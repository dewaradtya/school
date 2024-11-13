import { DatePicker } from 'rsuite';

const DatePickerInput = (props) => {
    const { label = '', id = '', value = '', disabled = false, required = true, onChange = () => { }, placeholder = '' } = props;

    return (
        <>
            <label htmlFor={id} className="mb-2.5 block text-black dark:text-white">{label}</label>
            <DatePicker
                id={id}
                block={true}
                oneTap placement='auto'
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
            />
        </>
    )
}

export default DatePickerInput
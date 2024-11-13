const ButtonSubmit = (props) => {
    const { type = "submit", isLoading = false, text = 'Submit', colorClassName = 'bg-primary text-gray' } = props

    return (
        <button type={type} className={`${isLoading ? 'bg-opacity-50' : ''} ${colorClassName} flex w-full justify-center rounded p-3 font-medium hover:bg-opacity-85`} disabled={isLoading}>
            {isLoading ? 'Loading...' : text}
        </button>
    )
}

export default ButtonSubmit
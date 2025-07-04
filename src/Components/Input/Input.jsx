const Input = (props) => {
    const { setInput, placeholder, value } = props
    
    return (
        <div className="pt-2 w-full relative">
            <input  
                onChange={(event) => setInput(event.target.value)} 
                type="text"  
                id={placeholder}  
                value={value || ''}
                className="w-full border-2 border-black rounded-md p-3 pt-4 pb-2 focus:outline-none peer"  
                required 
            />
            <label 
                htmlFor={placeholder}   
                className={`absolute pl-1 pr-1 left-2.5 bg-white text-sm transition-all duration-200 
                    ${value ? 'top-0 text-sm' : 'peer-focus:top-0 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-5'}`}
            >
                {placeholder}
            </label>
        </div>
    )
}

export default Input
import { useState } from "react";

function InputBox({ onSubmit, validate }) {
    const [value1, setValue1] = useState('');       // input value typed by user
    const [value2, setValue2] = useState(''); 
    const [status, setStatus] = useState(null);     // 'success' || 'error' || 'null'
    const [message, setMessage] = useState('');     // message displayed after submitting

    const handleClick = () => {
        const error = validate?.(value1, value2);            // if validate is provided, run it on value
        if (error) {
            setStatus('error');
            setMessage(error);
        } else {
            onSubmit(value1, value2);                        // run provided function on value
            setStatus('success');
            setMessage('Success.');
        }
    };

    return (
        <div>
            <input 
                type="text" 
                value={value1} 
                onChange={(e) => setValue1(e.target.value)}
                className="input-field"
                placeholder="Enter feed link"
            />
            <input 
                type="text" 
                value={value2} 
                onChange={(e) => setValue2(e.target.value)}
                className="input-field"
                placeholder="Enter topic"
            />
            <button onClick={handleClick}>Submit</button>

            {status === 'success' && (
                <p style={{ color: 'green', marginTop: '0.5rem' }}>{message}</p>
            )}
            {status === 'error' && (
                <p style={{ color: 'red', marginTop: '0.5rem' }}>{message}</p>
            )}
        </div>
    );
}

export default InputBox;
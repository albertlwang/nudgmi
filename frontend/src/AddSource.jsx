import { useState } from "react";
import InputBox from "./InputBox";


function AddSource({ onSubmit, validate }) {
    const [channelName, setChannelName] = useState('');      // channel name input by user
    const [topic, setTopic] = useState('');
    //const [newTopics, setTopics] = useState([]);        // list of new topisc to attach to given channel
    const [status, setStatus] = useState(null);         // 'success' || 'error' || 'null'
    const [message, setMessage] = useState('');         // message displayed after submitting


    // const addTopic = (topic) => {
    //     setMessage('');
    //     const error = validate?.(topic);            // if validate is provided, run it on value
    //     if (error) {
    //         setStatus('error');
    //         setMessage(error);
    //     } else {
    //         setTopics((prev) => [...prev, topic.trim()]);
    //         setTopic(''); // clear input box
    //     }
    // };
    
    const handleSubmit = async () => {
        setMessage('');
        const error = validate?.(channelName);            // if validate is provided, run it on value
        if (error) {
            setStatus('error');
            setMessage(error);
        } else {
            try {
                await onSubmit(channelName, topic);
                setStatus('success');
                setMessage('Success.');

                setChannelName('');
                setTopic('');
            } catch (err) {
                setStatus('error');
                setMessage(err.message || 'Submission failed.');
            }
        }
    };

    const buttonStyle = {
        padding: '1rem 2rem 1rem 2rem',
        border: '1px solid #374AD9',
        borderRadius: '10px',
        backgroundColor: '#374ad921',
        color: '#374AD9',
        fontWeight: '600',
        cursor: 'pointer'
    };

    return (
        <div>
            <h2 style={{ marginBottom: '5%' }} className="header">Add new source</h2>
            <p>Youtube Channel Link / RSS Feed Link</p>
            <input 
                type="text" 
                value={channelName} 
                onChange={(e) => setChannelName(e.target.value)}
                className="input-field"
                placeholder="Enter feed link"
            />
            <p className="description">Paste either:</p>
            <ul className="description">
                <li>the URL of a Youtube channel homepage.</li>
                <li>the URL of an RSS feed.</li>
            </ul>
            <hr></hr>
            <h3>Add a topic</h3>
            <p className="description">
                Filter the content you receive from this source with topics. 
                Only posts relevant to your topics will show up in your Nudgmi feed.
            </p>
            <p>Topic</p>
            <input 
                type="text" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)}
                className="input-field"
                placeholder="Enter topic"
            />
            {status === 'success' && (
                <p style={{ color: 'green', marginTop: '0.5rem' }}>{message}</p>
            )}
            {status === 'error' && (
                <p style={{ color: 'red', marginTop: '0.5rem' }}>{message}</p>
            )}
            <p>Choose label color</p>

            {/* <button onClick={addTopic(topic)}>Add topic</button>
            <ul> adding:
                {newTopics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                ))}
            </ul> */}
            <hr style={{ marginBottom: '2rem' }}></hr>

            <button style={buttonStyle} onClick={handleSubmit}>+ Add source</button>
        </div>
    )
}

export default AddSource;
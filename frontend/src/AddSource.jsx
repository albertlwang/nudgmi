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

    return (
        <div>
            <h2 className="header">Add new source</h2>
            <p>Youtube Channel Link / RSS Feed Link</p>
            <input 
                type="text" 
                value={channelName} 
                onChange={(e) => setChannelName(e.target.value)}
                className="input-field"
                placeholder="Enter feed link"
            />
            <p>Paste either:</p>
            <ul>
                <li>the URL of a Youtube channel homepage.</li>
                <li>the URL of an RSS feed.</li>
            </ul>
            <hr></hr>
            <h3>Add a topic</h3>
            <p>
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

            <button onClick={handleSubmit}>Add source</button>
        </div>
    )
}

export default AddSource;
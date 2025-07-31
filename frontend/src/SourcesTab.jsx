import { useState } from "react";
import SourceTag from "./SourceTag";
import InputBox from "./InputBox";
import SourceCard from "./SourceCard";
import NewSourceCard from "./NewSourceCard";
import Modal from "./Modal";

function SourcesTab({ sources = [], topics, onDelete, onSubmit, validate }) {
  const [ showModal, setShowModal ] = useState(false);


  return (
    <div className="view">
      <h1 className="header" style={{ marginBottom: '3rem' }}>My Sources</h1>
      {/* <InputBox onSubmit={onSubmit} validate={validate} /> */}
      
      <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          marginTop: '1rem'
        }}>
        {sources.map(source => (
          <div key={source.source} style={{ flex: '0 1 calc(33.333% - 1rem)', boxSizing: 'border-box' }}>
            <SourceCard source={source} topics={topics} />
          </div>
        ))}
        <NewSourceCard onClick={() => setShowModal(true)}/>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="header">Add new source</h2>
          <p>This is your popup content!</p>
        </Modal>
      )}
    </div>
  );
}


export default SourcesTab;
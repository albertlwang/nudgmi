import { useState, useMemo } from "react";
import SourceTag from "./SourceTag";
import InputBox from "./InputBox";
import SourceCard from "./SourceCard";
import NewSourceCard from "./NewSourceCard";
import Modal from "./Modal";
import SourcePage from "./SourcePage";
import AddSource  from "./AddSource";

function SourcesTab({ sources = [], topics, onDelete, onSubmit, validate }) {
  const [ showModal, setShowModal ] = useState(false);
  const [ showSource, setShowSource ] = useState(false);
  const [ selectedSource, setSelectedSource ] = useState(null);

  const currSource = useMemo(
    () => sources.find(s => s.source === selectedSource) ?? null, // use your real unique field
    [sources, selectedSource]
  );

  return !showSource ? (
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
            <SourceCard source={source} topics={topics} onClick={() => { setShowSource(true); setSelectedSource(source.source); }} />
          </div>
        ))}
        <NewSourceCard onClick={() => setShowModal(true)}/>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <AddSource onSubmit={onSubmit} validate={validate}/>
        </Modal>
      )}
    </div>
  )
  :
  (
    <div className="view">
      <div>
        <SourcePage source={currSource} topics={topics} onDelete={onDelete} onClose={() => setShowSource(false)}/>
      </div>

    </div>
  );
}


export default SourcesTab;
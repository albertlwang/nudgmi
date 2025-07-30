import SourceTag from "./SourceTag";
import InputBox from "./InputBox";
import SourceCard from "./SourceCard";

function SourcesTab({ sources = [], topics, onDelete, onSubmit, validate }) {
  return (
    <div className="view">
      <h1 className="header">My Sources</h1>
      <InputBox onSubmit={onSubmit} validate={validate} />
      
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
      </div>
    </div>
  );
}


export default SourcesTab;
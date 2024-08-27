import searchLogo from '../assets/search-svgrepo-com.svg';

const FilterBar  = ({query, setQuery}) => {
    return (
      <div
        style={{
          padding: '6px',
          marginBottom: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          width: '200px',
          display: 'flex',
          justifyContent: 'start',
          gap: '0.5em',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#ffffff'
        }}
      >

        <img src={searchLogo} alt='looking-glass' height={16} width={16} style={{color: 'white'}} />
        <input
          type='text'
          value={query}
          placeholder='query process'
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            border: 'none',
            zIndex: '1',
            backgroundColor: '#ffffff',
            color: 'black'
          }}
        />
      </div>
    );
}
export default FilterBar;

import './SearchBar.css';

type SearchBarProps = {
  placeholder: string;
  mobile?: boolean;
};

const searchIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>;

const searchIconDesktop = <svg className="search-icon-desktop" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>

const SearchBar = ({placeholder, mobile = true}: SearchBarProps) => {
  return (
    <div className={mobile ? 'search-bar-container' : 'search-bar-container-desktop'}>
      {mobile? searchIcon : searchIconDesktop}
      <input className={mobile ? 'search-bar' : 'search-bar-desktop'} type="text" placeholder={placeholder} />
    </div>
  );
};

export default SearchBar;
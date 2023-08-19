import { useState, useEffect, createContext, useContext } from 'react';

const CollapseContext = createContext();
const TitleFilterContext = createContext();
const SetTitleFilterContext = createContext();
let page = 0;
let running = false;

function App() {
  const [cards, setCards] = useState([]);
  const [collapseCards, setCollapseCards] = useState(true);
  const [dropdownColor, setDropdownColor] = useState('orange-400')
  const [titleFilter, setTitleFilter] = useState('');
  const [atScrollHeight, setAtScrollHeight] = useState(false);
  const [scrollFunctionRunning, setScrollFunctionRunning] = useState(false);

  async function getData() {
    const res = await fetch('http://localhost:5000/anime');
    const data = await res.json();
    console.log('running')

    console.log(data)
    let i = (50 * page);
    while (i < 200) {
      const newCard = <CardContainer rank={i + 1} data={data.data[i]} />
      setCards(cards => [...cards, newCard])

      i += 1;
    }
  }
  useEffect(() => {
    getData();
  }, [])
  
  useEffect(() => {
    (async () => {
      const res = await fetch('http://localhost:5000/test')
      const dat = await res.json()
      console.log(dat.data)
    })()
  }, [])

  useEffect(() => {
    console.log(titleFilter)
  }, [titleFilter])

  function toggleDropdown() {
    setCollapseCards(!collapseCards)
    const newColor = dropdownColor === 'orange-400' ? 'green-400' : 'orange-400'
    setDropdownColor(newColor);
  }

  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="App">
      <Navbar />

      <div className="flex justify-center">
        <SetTitleFilterContext.Provider value={setTitleFilter}>
          <Searchbar />
        </SetTitleFilterContext.Provider>
      </div>

      <div className="flex justify-center my-3 gap-3">
        <h2 className={`bg-red-600 my-auto text-white font-semibold lg:text-lg p-0.5 rounded-lg border-red-600 border-4 hover:border-white hover:border-4 hover:cursor-pointer select-none bg-orange`}>Sequels: enabled</h2>

        <h2 onClick={toggleDropdown} className={`bg-${dropdownColor} my-auto text-white font-semibold lg:text-lg p-0.5 rounded-lg border-${dropdownColor} border-4 hover:border-white hover:border-4 hover:cursor-pointer select-none bg-orange`}>Dropdowns: collapsed</h2>

        <div className="flex-col overflow-hidden">
          <h5 className="text-white text-sm font-semibold">Filter by year/season: </h5>
          <input type="text" name="" placeholder="e.g. 2011" className="bg-[#27374D] border-b-4 border-blue-700 text-sm text-white focus:outline-none focus:bg-white focus:text-black transition-colors duration-200" />
        </div>
      </div>

      <CollapseContext.Provider value={collapseCards}>
        <TitleFilterContext.Provider value={titleFilter}>
          <main className="flex flex-col items-center gap-3 text-[#352b52] font-ubuntu overflow-x-hidden overflow-y-hidden">
            {cards}
          </main>
        </TitleFilterContext.Provider>
      </CollapseContext.Provider>

    </div>
  );
}

export default App;

// Components
function Navbar() {
  return (
    <nav className="bg-[#5454C5] flex justify-center gap-4 py-2.5">
      <h2><a href="#" className="hover:border-solid hover:border-b-1 hover:border-green-400 bg-red-300">Home</a></h2>
      <h2><a href="#" className="hover:border-solid hover:border-b-1 hover:border-green-400">About</a></h2>
      <h2 className="border-b-1 border-red">Theme</h2>
    </nav>
  );
}

function Searchbar() {
  const setTitleFilter = useContext(SetTitleFilterContext)

  function filterTitle(event) {
    // console.log(event.target.value);
    setTitleFilter(event.target.value);
  }

  return (
    <input type="text" onChange={filterTitle} name="" placeholder="🔍 Find a title..." className="mt-3 p-2 focus:outline-none bg-[#27374D] border-b-4 border-blue-700 text-2xl sm:text-3xl md:text-4xl lg:text-5xl w-2/4 lg:max-w-[500px] text-white focus:bg-white focus:text-black transition-colors duration-300" />
  )
}

function CardContainer({ rank, data }) {
  const [collapse, setCollapse] = useState(true);
  const collapseCards = useContext(CollapseContext);

  const titleFilter = useContext(TitleFilterContext);
  let show = 'hidden'
  if (data.synonyms.length > 0) {
    data.synonyms.forEach(title => {
      if (title !== null) {
        if (title.toLowerCase().includes(titleFilter.toLowerCase())) {
          show = 'block';
        }
      }
    })
  }
  // const show = data.title.toLowerCase().includes(titleFilter) ? 'block' : 'hidden';

  useEffect(() => {
    setCollapse(collapseCards);
  }, [collapseCards])

  return (
    <div className={`font-bold select-none w-[85vw] ${show} relative`}>
      <Card rank={rank} data={data} col={collapse} func={setCollapse} />
      <div className={`bg-purple-800 rounded-b-md ${(collapse) ? 'max-h-11' : 'max-h-40'} overflow-hidden transition-all duration-300`}>
        <CardDropdown rank={rank} data={data} />
      </div>
    </div>
  )
}

function Card({ rank, data, col, func }) {
  const [hover, setHover] = useState(false)

  function collapse() {
    func(!col)
  }

  function modifyTitle(cursor) {
    if (!data.isSequel) {
      setHover(cursor === 'enter' ? true : false)
    }
  }

  return (
    <>
      <div onClick={collapse} onMouseOver={() => modifyTitle('enter')} onMouseLeave={() => modifyTitle('leave')} className={`flex gap-3 bg-[#5454C5] items-center h-24 w-[100%] py-3 px-3 [&>*]:rounded-md rounded-t-md hover:bg-green-400 hover:cursor-pointer relative z-0`}>
        <h1 data-rank className={`bg-purple-800 p-1 text-xl text-[${data.isSequel ? '#352b52' : '#39FF14'}]`}>{rank}</h1>
        <img data-poster src={`${data.posterURL}`} className='max-h-[100%]' />

        {/* Title container */}
        <div className={`flex flex-col gap-0 text-[${data.isSequel ? '#352b52' : hover ? 'white' : '#39FF14'}]`}>
          <h1 data-title className='text-2xl'>{data.title}</h1>
          <h3 data-season className='capitalize'>{data.season}</h3>
        </div>

        {/* Score container */}
        <div className={`ml-auto bg-purple-800 p-1 flex flex-col items-center text-[${data.highPopularity ? 'yellow' : '#352b52'}]`}>
          <h1 data-score className='text-xl'>{data.score}</h1>
          <h4 data-members className='text-xs'>{data.members}</h4>
        </div>
      </div>
    </>
  )
}

function CardDropdown({ rank, data }) {
  const tagsList = [];
  if (!(data.tags === null)) {
    let i = 0;
    const tagsLength = data.tags.length;
    while (i < tagsLength) {
      if ((data.tags[i].name.includes('Protagonist')) || (data.tags[i].name.includes('Primarily'))) {
        i += 1;
      } else {
        tagsList.push(data.tags[i]);
        i += 1;
        if (tagsList.length >= 5) {
          break
        }
      }

    }
  }
  return (
    <>
      <div className="mt-2 ml-2 flex flex-wrap gap-3 w-[100%] justify-center">
        {tagsList.map(tag => (
          <Tag dataTag={tag} />
        ))}
        {/* <h2 className='absolute z-50 -translate-y-5 opacity-95 text-yellow-200'>test</h2> */}
      </div>

      <div className='flex justify-between p-4 [&>*]:rounded-md'>
        <div className={`flex flex-col items-center px-2 py-1 bg-purple-600 text-[${data.isSequel ? '#352b52' : '#39FF14'}]`}>
          <h2>#{data.noSequelRank}</h2>
          <h2>Rank (no sequels)</h2>
        </div>

        <div className='flex flex-col items-center px-2 py-1 bg-purple-600'>
          <h2>#{rank}</h2>
          <h2>Rank (with sequels)</h2>
        </div>

        <div className={`flex flex-col items-center px-2 py-1 bg-purple-600 text-[${data.highPopularity ? 'yellow' : '#352b52'}]`}>
          <h2>#{data.popularity}</h2>
          <h2>Popularity</h2>
        </div>
      </div>
    </>
  )
}

function Tag({ dataTag }) {
  const [showTagTooltip, setShowTagTooltip] = useState(false)

  return (
    <div onMouseEnter={() => setShowTagTooltip(true)} onMouseLeave={() => setShowTagTooltip(false)} className='flex items-center bg-gray-800 rounded-md text-slate-300'>
      <h2 className={`relative flex gap-2 items-center px-2 py-0.5 rounded-md whitespace-nowrap`}>
        {dataTag.name}
      </h2>
      <h5 className='text-sm pr-2'>{dataTag.rank}%</h5>
      <h6 className={`absolute -translate-y-[2.2rem] ${showTagTooltip ? 'opacity-80' : 'opacity-0'} bg-gray-800 text-slate-300 px-2 py-0.5 rounded-md max-w-xl whitespace-nowrap overflow-x-auto transition-opacity duration-200`}>{dataTag.description}</h6>
    </div>
  )
}
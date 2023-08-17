import { useState, useEffect, createContext, useContext } from 'react';

const CollapseContext = createContext();

function App() {
  const [cards, setCards] = useState([]);
  const [collapseCards, setCollapseCards] = useState(true);
  const [dropdownColor, setDropdownColor] = useState('orange-400')

  useEffect(() => {
    mainProgram(setCards);
  }, [])

  function toggleDropdown() {
    setCollapseCards(!collapseCards)
    const newColor = dropdownColor === 'orange-400' ? 'green-400' : 'orange-400'
    setDropdownColor(newColor);
  }

  return (
    <div className="App">
      <Navbar />

      <div className="flex justify-center">
        <Searchbar />
      </div>

      <div className="flex justify-center my-3 gap-3">
        <h2 className={`bg-red-600 my-auto text-white font-semibold lg:text-lg p-0.5 rounded-lg border-red-600 border-4 hover:border-white hover:border-4 hover:cursor-pointer select-none bg-orange`}>Sequels: enabled</h2>

        <h2 onClick={toggleDropdown} className={`bg-${dropdownColor} my-auto text-white font-semibold lg:text-lg p-0.5 rounded-lg border-${dropdownColor} border-4 hover:border-white hover:border-4 hover:cursor-pointer select-none bg-orange`}>Dropdowns: collapsed</h2>

        <div className="flex-col overflow-hidden">
          <h5 className="text-white text-sm font-semibold">Filter by year/season: </h5>
          <input type="text" name="" placeholder="e.g. 2011" className="bg-[#27374D] border-b-4 border-blue-700 text-sm text-white focus:outline-none focus:bg-white focus:text-black transition-colors duration-200"/>
        </div>
      </div>

      <CollapseContext.Provider value={collapseCards}>      
        <main className="flex flex-col items-center gap-3 text-[#352b52]">
          {cards}
        </main>
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
  return (
    <input type="text" name="" placeholder="🔍 Find a title..." className="mt-3 focus:outline-none bg-[#27374D] border-b-4 border-blue-700 text-2xl sm:text-3xl md:text-4xl lg:text-5xl w-2/4 lg:max-w-[500px] text-white focus:bg-white focus:text-black transition-colors duration-300"/>
  )
}

function CardContainer({rank, data}) {
  const [collapse, setCollapse] = useState(true);
  const collapseCards = useContext(CollapseContext);

  useEffect(() => {
    setCollapse(collapseCards);
  }, [collapseCards])

  return (
    <div className='font-bold select-none'>
      <Card rank={rank} data={data} col={collapse} func={setCollapse}/>
      <div className={`bg-purple-800 rounded-b-md ${(collapse) ? 'max-h-11' : 'max-h-28'} overflow-hidden transition-all duration-300`}>
        <CardDropdown rank={rank} data={data}/>
      </div>
    </div>
  )
}

function Card({rank, data, col, func}){
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
    <div onClick={collapse} onMouseOver={() => modifyTitle('enter')} onMouseLeave={() => modifyTitle('leave')} className={`flex gap-3 bg-[#5454C5] items-center h-24 w-[85vw] py-3 px-3 [&>*]:rounded-md rounded-t-md hover:bg-green-400 hover:cursor-pointer`}>
      <h1 data-rank className={`bg-purple-800 p-1 text-xl text-[${data.isSequel ? '#352b52' : '#39FF14'}]`}>{rank}</h1>
      <img data-poster src={`${data.posterURL}`} className='max-h-[100%]'/>

      {/* Title container */}
      <div className={`flex flex-col gap-0 text-[${data.isSequel ? '#352b52' : hover ? 'white': '#39FF14'}]`}>
        <h1 data-title className='text-xl'>{data.title}</h1>
        <h3 data-season className='text-xs capitalize'>{data.season}</h3>
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

function CardDropdown({rank, data}) {
  return (
    <>    
      <div className="ml-2 flex gap-3">
        <h2 className='mt-2 bg-gray-800 text-slate-300 flex gap-2 items-center px-1 py-0.5 rounded-md'>
          test
          <h5 className='text-sm'>30%</h5>
        </h2>

        <h2 className='mt-2 bg-gray-800 text-slate-300 flex gap-2 items-center px-1 py-0.5 rounded-md'>
          test
          <h5 className='text-sm'>30%</h5>
        </h2>

        <h2 className='mt-2 bg-gray-800 text-slate-300 flex gap-2 items-center px-1 py-0.5 rounded-md'>
          test
          <h5 className='text-sm'>30%</h5>
        </h2>
      </div>

      <div className='flex justify-between p-4 pt-3 [&>*]:rounded-md'>
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

// Helper functions
// Freeze code for a certain duration (in miliseconds)
async function freeze(ms){
  await new Promise(resolve => setTimeout(resolve, ms));
}

function formatNumber(num) {
  if (num >= 1000000) {
      const round = num / 1000000;
      return `${round.toFixed(1)}M`;

  } else if (num >= 10000) {
      const round = num / 1000;
      return `${round.toFixed(0)}K`;

  } else if (num >= 1000) {
      const round = num / 1000;
      return `${round.toFixed(1)}K`;

  } else {
      return `${num}`;
  }
}

// Format season string
function formatSeason(dat) {
  if (dat.season) {
      return `${dat.season} ${dat.year}`
  }
  else {
      const airedOn = dat.aired.prop.from;
      let season;
      switch (true) {
          case airedOn.month < 4:
              season = 'Winter';
              break;
          case airedOn.month < 7:
              season = 'Spring';
              break;
          case airedOn.month < 10:
              season = 'Summer';
              break;
          case airedOn.month < 13:
              season = 'Fall';
      }

      return `${season} ${airedOn.year}`
  }
}

// Fetch a URL and return response.data
async function fetchData(url) {
  const res = await fetch(url);
  const resJSON = await res.json();
  const data = resJSON.data;

  return data;
}

// Main Program
let currentPage = 0;
let currentRank = 0;
let noSequel = 0;
let iterationDelay = 400;
let revert;

async function mainProgram(func) {
  while (true) {
    // Array of anime data, each data is an object
    let data = await fetchData(`https://api.jikan.moe/v4/top/anime?page=${currentPage + 1}`);
    data = data.sort((a, b) => a.rank - b.rank)
    
    console.log(data);
    console.log('running')
    let animeList = [];

    // Iterate through every object in data
    for (const x of data) {
      console.log(x.rank);
      // console.log('ok')
      await pushSingleAnimeData(x, animeList);

      // Freeze requests for 0.4 seconds (1 second after 60 requests)
      await freeze(iterationDelay);
      await new Promise(res => setTimeout(res, iterationDelay))

      // Change delay from 0.4s to 0.75s after 60 requests
      if (x.rank % 60 === 0) {
          revert = x.rank + 35;
          await freeze(10000);
          await new Promise(res => setTimeout(res, 10000))
          iterationDelay = 750;
      }
      // Change delay from 0.75s to 0.45s after 30 requests
      if (x.rank === revert) {
          iterationDelay = 450
      }
    }

    // Add cards to HTML page
    func(previousList => [...previousList, ...animeList])
    currentPage += 1;

    // Freeze 1 second before fetching new page
    await freeze(1000);
    await new Promise(res => setTimeout(res, 1000))
  }
}

async function pushSingleAnimeData(obj, list) {
  const singleAnimeData = await fetchData(`https://api.jikan.moe/v4/anime/${obj.mal_id}/full`);
  const relationsValues = Object.values(singleAnimeData.relations).map(obj => obj.relation);

  const isSequel = relationsValues.includes('Prequel') ? true : false;
  noSequel += isSequel ? 0 : 1;
  console.log(isSequel)
  currentRank += 1;

  const dat = {
      id: obj.mal_id,
      title: obj.title,
      posterURL: obj.images.jpg.image_url,
      score: obj.score.toFixed(2),
      season: formatSeason(obj),
      members: formatNumber(obj.members),
      URL: obj.url,
      isSequel: isSequel,
      noSequelRank: isSequel ? ' -' : noSequel,
      popularity: obj.popularity,
      highPopularity: obj.members > 700000
  }

  list.push(<CardContainer rank={currentRank} data={dat}/>);
}
import React from 'react';
import './App.css';
import Papa from 'papaparse';
import {geoAlbersUsa, geoPath} from 'd3-geo';
import * as _ from 'lodash';

var width = 960 * 2;
var height = 500 * 2;

const projection = geoAlbersUsa()
    .translate([width/2, height/2])    // translate to center of screen
    .scale([1700]);

const path = geoPath()               // path generator that will convert GeoJSON to SVG paths
    .projection(projection);

const mapping = [
  ['Arizona', 'AZ'],
  ['Alabama', 'AL'],
  ['Alaska', 'AK'],
  ['Arkansas', 'AR'],
  ['California', 'CA'],
  ['Colorado', 'CO'],
  ['Connecticut', 'CT'],
  ['Delaware', 'DE'],
  ['Florida', 'FL'],
  ['Georgia', 'GA'],
  ['Hawaii', 'HI'],
  ['Idaho', 'ID'],
  ['Illinois', 'IL'],
  ['Indiana', 'IN'],
  ['Iowa', 'IA'],
  ['Kansas', 'KS'],
  ['Kentucky', 'KY'],
  ['Louisiana', 'LA'],
  ['Maine', 'ME'],
  ['Maryland', 'MD'],
  ['Massachusetts', 'MA'],
  ['Michigan', 'MI'],
  ['Minnesota', 'MN'],
  ['Mississippi', 'MS'],
  ['Missouri', 'MO'],
  ['Montana', 'MT'],
  ['Nebraska', 'NE'],
  ['Nevada', 'NV'],
  ['New Hampshire', 'NH'],
  ['New Jersey', 'NJ'],
  ['New Mexico', 'NM'],
  ['New York', 'NY'],
  ['North Carolina', 'NC'],
  ['North Dakota', 'ND'],
  ['Ohio', 'OH'],
  ['Oklahoma', 'OK'],
  ['Oregon', 'OR'],
  ['Pennsylvania', 'PA'],
  ['Rhode Island', 'RI'],
  ['South Carolina', 'SC'],
  ['South Dakota', 'SD'],
  ['Tennessee', 'TN'],
  ['Texas', 'TX'],
  ['Utah', 'UT'],
  ['Vermont', 'VT'],
  ['Virginia', 'VA'],
  ['Washington', 'WA'],
  ['West Virginia', 'WV'],
  ['Wisconsin', 'WI'],
  ['Wyoming', 'WY'],
];

const convert = (abb) => {
  const tmp =  _.find(mapping, e => e[1] === abb)
  return tmp ? tmp[0] : null;
}


function App() {
  const url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/03-08-2020.csv';

  const [data, setData] = React.useState([]);
  const [states, setStates] = React.useState();

  React.useEffect(() => {
    Papa.parse(url, {
      download: true,
      header: true,
      complete: result => {
        setData(result.data.filter(e => e['Country/Region'] === 'US'))
      }
    });

    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
        .then(re => re.json())
        .then(re => setStates(re.features))
        .catch(e => console.log(e))

  }, []);

  console.log(data)
  console.log(states)

  return (
    <svg width={width} height={height}>
      {
        states && states.map((d,i) => {
          const [x, y] = path.centroid(d)
          x === undefined && console.log(d) 
          y === undefined && console.log(d)
          const state = d.properties.name;
          const state_stats = _.find(data, e => {
            try{
              const abb = e['Province/State'].split(',')[1].trim()
              const full = convert(abb)
              return full === state
            } catch {
              return false
            }

          });
          return (
              <g key={d.properties.name} >
                <path d={path(d)} stroke={'black'} strokeWidth={'1'} fill={'None'}></path>
                <text x={x} y={y} fill={'red'}>{state_stats && state_stats.Confirmed}</text>
              </g>
          )
        })
      }
    </svg>
  );
}

export default App;

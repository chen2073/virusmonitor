import React, { useState, useEffect } from "react"
import { geoPath, geoAlbersUsa } from "d3-geo"
import { feature, mesh } from "topojson-client"


const WorldMap = () => {
    const [geographies, setGeographies] = useState();
    const [states, setStates] = useState();

    useEffect(() => {
        fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json")
        // fetch('https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/us.json')
            .then(response => {
                if (response.status !== 200) {
                    console.log(`There was a problem: ${response.status}`)
                    return
                }
                response.json().then(us => {
                    setGeographies(feature(us, us.objects.nation))
                    setStates(mesh(us, us.objects.states, (a, b) => a !== b))
                })
            })
    }, [])

    const path = geoPath();

    return (
        <svg viewBox="0 0 1000 800">
            <g className="us" fill="none" stroke="#000" stroke-linejoin="round" stroke-linecap="round">
                <path stroke-width="0.5" d={path(states)}></path>
                <path d={path(geographies)}></path>
            </g>
        </svg>
    )
}

export default WorldMap
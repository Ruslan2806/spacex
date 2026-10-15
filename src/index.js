import {LaunchLibrary} from "./api/launch-library";
import * as d3 from "d3";
import * as Geo from './geo.json'

document.addEventListener("DOMContentLoaded", setup)

function setup(){
    const launchLibrary = new LaunchLibrary();
    launchLibrary.spacexData().then(({ launches, launchpads, total })=>{
        const listContainer = document.getElementById("listContainer")
        document.querySelector(".aside h3").textContent = `SpaceX launches (${launches.length} of ${total})`;
        renderLaunches(launches, listContainer);
        drawMap(launchpads);
    }).catch(error => {
        console.error("Unable to load SpaceX launch data", error);
        document.getElementById("listContainer").textContent =
            "Не удалось загрузить данные. Проверьте подключение к Launch Library 2 и обновите страницу позже.";
    });
}
function renderLaunches(launches, container){
    const list = document.createElement("ul");
    launches.forEach(launch=>{
        const item = document.createElement("li");
        item.textContent = launch.name;
        item.tabIndex = 0;
        item.dataset.launchpads = JSON.stringify(launch.launchpad || []);
        const highlight = () => setActiveLaunchpads(launch.launchpad || []);
        item.addEventListener("mouseenter", highlight);
        item.addEventListener("mouseleave", clearActiveLaunchpads);
        item.addEventListener("focus", highlight);
        item.addEventListener("blur", clearActiveLaunchpads);
        list.appendChild(item);
    })
    container.replaceChildren(list);
}

function setActiveLaunchpads(launchpadIds){
    const ids = new Set(Array.isArray(launchpadIds) ? launchpadIds : [launchpadIds]);
    d3.selectAll(".launchpad-marker")
        .classed("is-active", d => ids.has(d.id))
        .attr("r", d => ids.has(d.id) ? 8 : 5);
    d3.selectAll(".launchpad-marker.is-active").raise();
}

function clearActiveLaunchpads(){
    d3.selectAll(".launchpad-marker")
        .classed("is-active", false)
        .attr("r", 5);
}

function drawMap(launchpads){
    const width = 640;
    const height = 480;
    const margin = {top: 20, right: 10, bottom: 40, left: 100};
    const svg = d3.select('#map').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    const projection = d3.geoMercator()
        .scale(70)
        .center([0,20])
        .translate([width / 2 - margin.left, height / 2]);
    svg.append("g")
        .selectAll("path")
        .data(Geo.features)
        .enter()
        .append("path")
        .attr("class", "topo")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("fill", "#d8e1e8")
        .style("opacity", .7)

    const validLaunchpads = launchpads.filter(launchpad =>
        Number.isFinite(launchpad.longitude) && Number.isFinite(launchpad.latitude)
    );

    svg.append("g")
        .attr("class", "launchpad-markers")
        .selectAll("circle")
        .data(validLaunchpads, launchpad => launchpad.id)
        .join("circle")
        .attr("class", "launchpad-marker")
        .attr("cx", launchpad => projection([launchpad.longitude, launchpad.latitude])[0])
        .attr("cy", launchpad => projection([launchpad.longitude, launchpad.latitude])[1])
        .attr("r", 5)
        .append("title")
        .text(launchpad => launchpad.name);
}

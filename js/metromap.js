/* Metro Mapper
 *
 * By Cyrille Médard de Chardon 2024
 *
 */

"use strict";

var MM = {};

MM.tests = {
    "data": [
        {
            "stations":[
                {"name":"A", "location": [10, 10]},
                {"name":"B", "location": [20, 20]},
                {"name":"C", "location": [10, 20]},
            ],
            "lines":[
                {"name":"First", "sequence":["A", "B", "C"]}
            ],
            "proj": "cartographic"
        },
        {
            /* Two lines, the S and Z lines
             * one line '-' 
             * both lines '='
             *
             * A===B
             *  \ /
             *   C
             *  / \
             * D===E
             */
             
            "stations":[
                {"name":"A", "location": [-123.01,    49.01]},
                {"name":"B", "location": [-123.0099,  49.01]},
                {"name":"C", "location": [-123.00995, 49.0099]},
                {"name":"D", "location": [-123.01,    49.0098]},
                {"name":"E", "location": [-123.0099,  49.0098]},
            ],
            "lines":[
                {"name":"Zed line", "sequence":["A", "B", "C", "D", "E"]},
                {"name":"Ess line", "sequence":["B", "A", "C", "E", "D"]},
            ],
            "proj": "WGS84"
        }
    ]
};

MM.parseData = function( data ) {
    /*
     * - Converts lat/lng to projection
     * - Determines starting paths
     * - Then maps
     */

    if ( data.proj !== "cartographic" ) {
        // project the data and overwrite location data
    }

    // Make the given projected data as the 'main' data model
    MM.data = data;

    // Determine the network paths
    MM.pathNetwork();

    // Draw the data
    MM.drawNetwork();
};

MM.calculateLinePaths = function(mline)
{
    // on initialization there is no 
    console.log(mline);

    // create a path for each station pair
};

MM.pathNetwork = function()
{
    
    let paths_data = d3.map(MM.data.lines, (d) => {

            let line_paths = MM.calculateLinePaths(d);

            return { 
            };
        }
    );

};

MM.calculateExtent = function( d )
{
    let ext = {
        "xmin":d[0].location[0],
        "xmax":d[0].location[0],
        "ymin":d[0].location[1],
        "ymax":d[0].location[1]};

    for (let i = 0; i < d.length; i += 1) {
        ext.xmin = d[i].location[0] < ext.xmin ? d[i].location[0] : ext.xmin;
        ext.xmax = d[i].location[0] > ext.xmax ? d[i].location[0] : ext.xmax;
        ext.ymin = d[i].location[1] < ext.ymin ? d[i].location[1] : ext.ymin;
        ext.ymax = d[i].location[1] > ext.ymax ? d[i].location[1] : ext.ymax;
    }
    return ext;
};

// Draw the data
MM.drawNetwork = function()
{
    let stns_ext = MM.calculateExtent( MM.data.stations );
    let xspan = stns_ext.xmax - stns_ext.xmin;
    let yspan = stns_ext.ymax - stns_ext.ymin;
    let margin_mult = 0.1;
    let stn_radius = xspan / 50;

    let svg = d3.select("#metromap")
        .attr("viewBox",
            (stns_ext.xmin - xspan * margin_mult) + " " +
            (stns_ext.ymin - yspan * margin_mult) + " " +
            (xspan + 2 * xspan * margin_mult) + " " +
            (yspan + 2 * yspan * margin_mult)
        );

    let glbl   = d3.select(document.getElementById('mmlabels'));
    let gpaths = d3.select(document.getElementById('mmpaths'));

    // Add labels

    // Add paths

    // Add stations
    let stns_data = d3.map(MM.data.stations, (d) => {
            return { 
                x: parseFloat(d.location[0]),
                y: parseFloat(d.location[1]),
            };
        }
    );

    // get the svg element to get pixel width
    let s = document.getElementById('metromap');
    const xscale = (xspan + 2 * xspan * margin_mult)/s.clientWidth;
    const yscale = (yspan + 2 * yspan * margin_mult)/s.clientHeight;

    let gstns = d3.select("#mmstations")
        .selectAll("circle")
        .data(stns_data)
        .enter()
        .append("circle")
        .attr("class", "station")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("stroke-width", stn_radius/5)
        .attr("r", stn_radius)
        .on('mousedown', (d) => {
            // save mouse x/y to svg object
            d.target.mx = d.x;
            d.target.my = d.y;
        })
        .on('mousemove', (d) => {
            if ( d.target.mx !== undefined ) {
                // this isn't the best way to do dragging... use obj-mouse offset instead
                d.target.setAttribute("cx", parseFloat(d.target.getAttribute("cx"), 10) - (d.target.mx - d.x) * xscale);
                d.target.setAttribute("cy", parseFloat(d.target.getAttribute("cy"), 10) - (d.target.my - d.y) * yscale);

                // reset the last coordinate
                d.target.mx = d.x;
                d.target.my = d.y;
            }
        })
        .on('mouseup', (d) => {
            console.log(d);
            d.target.mx = undefined;
            d.target.my = undefined;
        })
    ;
};

// may not be needed
MM.makeNodeDraggable = function(node) { };

// initialized stuff
(function () {

    //let MM.svg = d3.select("#metromap");

    // for testing
    MM.parseData( MM.tests.data[0] );

}());

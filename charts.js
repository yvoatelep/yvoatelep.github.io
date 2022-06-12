function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    console.log(data)
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    console.log(firstSample);
    console.log("----")
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.

    var filteredSamples = samples.filter(row => row.id == sample)

    //  5. Create a variable that holds the first sample in the array.
    var aSample = filteredSamples[0]
    console.log(aSample)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuids = aSample.otu_ids
    var otulabels = aSample.otu_labels
    var sampleValues = aSample.sample_values

    console.log(otuids, otulabels, sampleValues)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuids.map(otuid => "OTU " + otuid).slice(0, 10)
    console.log(yticks)
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0, 10),
      y: yticks,
      type: "bar",
      orientation: "h"
    }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "BarChart"


    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);




    //  // 1. Create the trace for the bubble chart.

    var bubbleData = {
      x: otuids,
      y: sampleValues,
      text: otulabels,
      mode: 'markers',
      marker: {
        color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
        size: [40, 60, 80, 100]
      }
    };

    var data2 = [bubbleData];

    // 2. Create the layout for the bubble chart.
    var layout2 = {
      title: 'Bacteria Cultures Per Sample',
      showlegend: false,
      height: 600,
      width: 600
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', data2, layout2);


    var gaugeData = [

      {
    
        domain: { x: [0, 10], y: [0, 1] },
    
        value: 10,
    
        title: { text: "Scrubs per Week" },
    
        type: "indicator",
    
        mode: "gauge+number+delta",
    
        delta: { reference: 380 },
    
        gauge: {
    
          axis: { range: [null, 10] },
    
          steps: [
    
            { range: [0, 2], color: "red" },
    
            { range: [2, 4], color: "orange" }
    
        { range: [4, 6], color: "yellow" }
        
        { range: [6, 8], color: "light green" }
            
        { range: [8, 10], color: "green" }
          ],
    
          threshold: {
    
            line: { color: "black", width: 4 },
    
            thickness: 0.75,
    
            value: 490
    
          }
    
        }
    
      }
    
    ];
    
    
    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    
    Plotly.newPlot('gauge', gaugeData, layout);

    // // // 4. Create the trace for the gauge chart.
    // // var gaugeData = [

    // // ];

    // // // 5. Create the layout for the gauge chart.
    // // var gaugeLayout = { 

    // // };

    // // // 6. Use Plotly to plot the gauge data and layout.
    // // Plotly.newPlot();
  });
}

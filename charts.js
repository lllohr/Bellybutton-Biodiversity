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

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
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
    buildGauge(result);
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = samplesArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;

    // // 7. Create the yticks for the bar chart.
    // // Hint: Get the the top 10 otu_ids and map them in descending order  
    // //  so the otu_ids with the most bacteria are last. 
    var sorted_sample_values = sample_values.sort((a,b) =>
    a - b).reverse(); 

    var sample_values_slice = sorted_sample_values.slice(0,10).reverse();
    var yticks_slice = otu_ids.slice(0,10);
    var yticks = yticks_slice.map(x => 'OTU ' + x ).reverse();


    // // 8. Create the trace for the bar chart. 
    var trace = {
      x: sample_values_slice,
      y: yticks,
      type: "bar",
      orientation: 'h',
      opacity: 0.5,
      
    };

    // // 9. Create the layout for the bar chart. 
    var layout = {
      title: "<b>Top Ten Bacteria Cultures Found</b>",
//       font: { color: "darkblue", weight: "bold", family: "Arial" },
//       margin: { t: 25, r: 25, l: 25, b: 50 },
      paper_bgcolor: "lightyellow"   
    };
    
    // // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [trace], layout);

  

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
      },
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b>Bacteria Cultures Per Sample</b>",
      showlegend: false,
      xaxis: {title: "OTU ID" },
      height: 480,
      width: 1100,
      hovermode:'closest',
//       font: { color: "darkblue", weight: "bold", family: "Arial" }
      paper_bgcolor: "lightyellow"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",[bubbleData],bubbleLayout);
  });
}

function buildGauge(data){
  var frequency = parseFloat(data.wfreq);
   // 4. Create the trace for the gauge chart.
  var gaugeData = [{
    domain: { x: [0, 1], y: [0, 1] },
    value: frequency,
    type: "indicator",
    mode: "gauge+number",
    title: {text: "<b>Belly Button Washing Frequency</b><br> Washes per Week"
    },
    
    gauge: {
      axis: { range: [null, 10]},
      bar: { color: "black"},
    
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "orange"},
        { range: [4, 6], color: "yellow"},
        { range: [6, 8], color: "limegreen"},
        { range: [8, 10], color: "green"},
      ],
    },
  }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      font: { color: "darkblue", family: "Arial" },
      margin: { t: 100, r: 100, l: 100, b: 100 },
      line: {
      color: '600000'
      },
      width: 480,
      height: 450,
      paper_bgcolor: "lightyellow",
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
}



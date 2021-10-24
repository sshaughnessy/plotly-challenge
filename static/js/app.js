// get options into the drop down - complete 
// there's default info in plot 1 and 2 and demo - complete
// event listener to update plot 1,2, and demo on change


// data path
const url = "data/samples.json";

// get the Test Subject ID No. into the dropdown
d3.json(url).then(function(data) {
    console.log(data);

    var dropDownData = data.names

    dropDownData.forEach(n => {
        d3.select("#selDataset").append("option").text(n);
    })
})

// default bubble, bar, and demo panel
function defaultPlot() {
    d3.json(url).then(function(data) {
        // default is the first option 940
        defaultData = data.samples.filter(sample => sample.id === "940")[0];
        console.log(defaultData);

        // default bubble datapoints
        var allSamples = defaultData.sample_values;
        var allIDS = defaultData.otu_ids;
        var allLabels = defaultData.otu_labels;
            //make sure it worked
            console.log(allSamples);
            console.log(allIDS);
            console.log(allLabels);
        // default bubble
        var traceBubble = {
            x: allIDS,
            y: allSamples,
            text: allLabels,
            mode: "markers",
            marker: {
                color: allIDS,
                size: allSamples
            }
        };

        var dataBubble = [traceBubble];

        var layoutBubble = {
            title: "bubble chart",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Value"},
            showlegend: false
        };

        Plotly.newPlot("bubble", dataBubble, layoutBubble);
        // default bar datapoints
        var top10Samples = allSamples.slice(0,10).reverse();
        var top10IDS = allIDS.slice(0,10).reverse();
        var top10Labels = allLabels.slice(0,10).reverse();
        // default bar
        var traceBar = {
            x: top10Samples,
            y: top10IDS.map(id => `OTU ${id}`),
            text: top10Labels,
            type: "bar",
            orientation: "h"
        };

        var dataBar = [traceBar];

        var layoutBar = {
            title: "Top 10 OTUs for Selected Individual",
            xaxis: {title: "Sample Value"},
            yaxis: {title: "OTU ID"},
            autosize: false,
            width: 450,
            height: 600
        };

        Plotly.newPlot("bar", dataBar, layoutBar);

        //default demo info
        var defaultDemo = data.metadata.filter(sample => sample.id === 940)[0];
        console.log(defaultDemo);

        Object.entries(defaultDemo).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));
    }); 
    
}

defaultPlot();

// call updatePlot on change to the DOM
d3.selectAll("#selDataset"). on("change", updatePlot);

// define update function
function updatePlot() {
    d3.json(url).then(function(data) {
    //select menu
    var dropDown = d3.select("#selDataset");
    // select menu selection
    var selection = dropDown.property("value");
    // create update data variables based on selection
    var update = data.samples.filter(sample => sample.id === selection);
    var updateData = update[0];
    console.log(updateData);
    // bubble
    var allSampleUpdate = updateData.sample_values;
    console.log(allSampleUpdate);
    var allIDSUpdate = updateData.otu_ids;
    var allLabelsUpdate = updateData.otu_labels;

    Plotly.restyle("bubble", "x", [allIDSUpdate]);
    Plotly.restyle("bubble", "y", [allSampleUpdate]);
    Plotly.restyle("bubble", "text", [allLabelsUpdate]);
    Plotly.restyle("bubble", "marker.color", [allIDSUpdate]);
    Plotly.restyle("bubble", "marker.size", [allSampleUpdate]);

    // bar
    var top10SampleUpdate = allSampleUpdate.slice(0,10).reverse();
    var top10IDSUpdate = allIDSUpdate.slice(0,10).reverse();
    var top10LabelsUpdate = allLabelsUpdate.slice(0,10).reverse();

    Plotly.restyle("bar", "x", [top10SampleUpdate]);
    Plotly.restyle("bar", "y", [top10IDSUpdate.map(id => `OUT ${id}`)]);
    Plotly.restyle("bar", "text", [top10LabelsUpdate]);

    // demo
    var demoUpdate = data.metadata.filter(sample => sample.id == selection)[0];
    console.log(demoUpdate);
    
    //clear panel
    d3.select("sample-metadata").html("");

    Object.entries(demoUpdate).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));

    });
};


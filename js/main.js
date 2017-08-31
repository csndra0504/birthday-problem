var start = new Date('Jan 1,2017');
var end = new Date('Jan 1,2018');

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getBirthdaysSet() {
    var datesMap = {};
    var foundPair = false;

    for (var i = 0; i < 23; i++) {
        var random = randomDate(start, end);
        var obj = {
            timeStamp: random.getTime(),
            display: moment(random).format('MMM DD')
        };
        datesMap[obj.display] = datesMap[obj.display] || { timeStamp: obj.timeStamp, count: 0 };
        datesMap[obj.display].count++;
        if (datesMap[obj.display].count > 1) {
            foundPair = true;
        }
    }

    var dates = [];

    for (var key in datesMap) {
        dates.push({
            display: key,
            value: datesMap[key].count,
            timeStamp: datesMap[key].timeStamp
        });
    }

    dates.sort(function (a, b) {
        return a.timeStamp - b.timeStamp;
    });
    return { foundPair: foundPair, data: dates };
}

function createChart(data) {
    var margin = { top: 20, right: 20, bottom: 50, left: 20 };
    var containerWidth = parseInt(d3.select('#container').style('width'), 10);
    var width = containerWidth - margin.left - margin.right - 20;
    var height = 150 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.2);
    var y = d3.scaleLinear()
        .range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select('#charts').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');


    // Scale the range of the data in the domains
    x.domain(data.map(function (d) {
        return d.display;
    }));
    y.domain([0, 3]);

    // append the rectangles for the bar chart
    svg.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function (d) {
            return x(d.display);
        })
        .attr('width', x.bandwidth())
        .attr('y', function (d) {
            return y(d.value);
        })
        .attr('height', function (d) {
            return height - y(d.value);
        });

    svg.selectAll("text")
        .attr("transform", "rotate(90)")

    // add the x Axis
    svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    // add the y Axis
    svg.append('g')
        .call(d3.axisLeft(y).ticks(4));
}

function runTest() {
    document.querySelector('#charts').innerHTML = '';
    const samples = parseInt(document.querySelector('#samples').value, 10);
    var pairCount = 0;

    for (var i = 0; i < samples; i++) {
        const set = getBirthdaysSet();
        pairCount += set.foundPair ? 1 : 0;
        createChart(set.data);
    }
    document.querySelector('#pairCount').innerHTML = '<h3>Sets with a Pair:  ' + pairCount + '</h3>';
    return false;
}

runTest();

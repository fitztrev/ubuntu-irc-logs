// Generates a hex color code for the user based on their username
var userColor = _.memoize(function(username){
    return String(CryptoJS.MD5(username)).substr(0, 6);
});

// Get Handlebars templates
var templates = {};
var loadTemplates = function(){
    $.ajax({
        url:      'templates.html',
        dataType: 'html',
        async:     false,
        success: function(source){
            $(source).filter('script').each(function(){
                templates[$(this).attr('id')] = Handlebars.compile( $(this).html() );
            });
        }
    });
};

// Builds the nav
var setupNav = function(channelName){
    var links = [];
    // Show the last 5 days
    for ( i=0; i<5; i++ ) {
        var current_day = moment().subtract('days', i);

        // Determine what the link should say
        if ( i == 0 ) {
            var day = 'Today';
        } else if ( i == 1 ) {
            var day = 'Yesterday';
        } else {
            var day = current_day.format('dddd'); // format of "Monday"
        }

        links.push({
            yyyy:    current_day.format('YYYY'),
            mm:      current_day.format('MM'),
            dd:      current_day.format('DD'),
            channel: channelName.replace('#', ''),
            day:     day
        });
    }
    $('.nav').html( templates.nav({ links: links }) );
};

var loadPage = function(){
    // IRC channel to display
    // Must be one of these: http://irclogs.ubuntu.com/2013/01/01/
    // Can be set in URL with hash. Defaults to #ubuntu-us-mi
    var channelName = window.location.hash || '#ubuntu-us-mi';

    // Set the page title + header
    $('title').text(channelName + ' IRC Logs');
    $('#title').text(channelName);

    // Build navigation links
    setupNav(channelName);

    // On page load, trigger a click on the first item to show today's logs
    $('.nav a').first().trigger('click');
};

$(function(){
    loadTemplates();
    loadPage();
    window.onhashchange = loadPage;
});

$(document).on('click', '.nav a', function(e){
    // Set the "active" class for the nav item
    $('.nav li').removeClass('active');
    $(this).parent().addClass('active');

    $('#logs').hide();
    $('#loading').show();

    // Use YQL to scrape + parse the data
    // We'll have to scrape it as a CSV, even though it's a TXT file, since YQL doesn't support TXT scraping.
    var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from csv where url="' + $(this).attr('href') + '"') + '&format=json&_maxage=600&callback=?';
    $.getJSON(yql, function(data){
        var entries = [];
        // Loop through each log line
        _.each(data.query.results.row, function(row){
            // First, fix the row since it was delimited by commas by YQL
            var log = _.toArray(row).join(',');

            var time,
                username,
                entry = {};

            // Grab the time "[HH:MM]"
            if ( time = log.match(/\[([0-9]{2}:[0-9]{2})\]/) ) {
                entry.time = moment(time[1], 'HH:mm').subtract(new Date().getTimezoneOffset(), 'minutes').format('h:mma').slice(0, -1);
            }

            // Grab the username "<username>"
            if ( username = log.match(/<([A-Za-z0-9\-_]+)>/) ) {
                entry.color    = userColor(username[1]);
                entry.username = username[1];
                entry.message  = log.match(/(.*)> (.*)/)[2];
            } else if ( time ) {
                // Remove the time from the log line
                entry.message = log.replace(time[0], '');
            } else {
                entry.notice = log;
            }

            entries.push(entry);
        });

        $('#logs').html( templates.logs({ entries: entries }) ).show();
        $('#loading').hide();
    });

    e.preventDefault();
});

## Ubuntu IRC logs

An alternative way to read logs for Ubuntu IRC channels.

[http://fitztrev.github.io/ubuntu-irc-logs/](http://fitztrev.github.io/ubuntu-irc-logs/) - *Defaults to #ubuntu-us-mi*

Just change the hash in the URL to view any of the [other channels](http://irclogs.ubuntu.com/2013/10/23/):

[http://fitztrev.github.io/ubuntu-irc-logs/**#ubuntu**](http://fitztrev.github.io/ubuntu-irc-logs/#ubuntu)

## Contributing

Pull requests welcome. ;)

This is probably one of the easiest projects to get up and running.

1. Clone the project

    ```
    git clone https://github.com/fitztrev/ubuntu-irc-logs.git
    ```

2. Start a simple web server.

    ```
    cd ubuntu-irc-logs
    python -m SimpleHTTPServer 8000
    ```

3. Open [http://localhost:8000](http://localhost:8000)


## To Do

Here are a couple ideas that I plan to implement at some point. If you would like to help, please feel free.

* Responsive layout. It's already pretty much there. Just need to have a collapsible nav menu.
* Automatically adjust username color if it's too light to be legible against the background.
* Make the timestamp clickable so somebody can link to a specific log entry.
* Move from Underscore to Lo-Dash.
* Automatically create links for URLs that have been posted.

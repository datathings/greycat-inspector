Greycat Inspector
-----------------

GreyCqt inspector is a graph viewer. It shows and allow graphical navigation through the nodes.

# Getting start

## Requirements

- [npm](https://www.npmjs.com/)

## Install

- clone the repository in $INPECTOR folder: `git clone https://github.com/datathings/greycat-stack.git $INPECTOR`
- `cd $INPECTOR`
- `npm install`

## Small overview on how it works

GreyCat Inspector creates graph visualization and gets data throw a web socket connection. It uses the [GreyCat-WebSocket](https://github.com/datathings/greycat/tree/master/plugins/websocket) plugin. The inspector defines a **websocket client** (WSClient). *(So it needs a websocket server for establishing a connection)

## How to setup and run the server

*Here the code is in Java, but it could also be in javascript*

The following code shows how to create a code and to setup a websocket server.

```java
Graph graph = new GraphBuilder().build();

int port = 12345;
WSSharedServer.attach(graph,port);

graph.connect(hasSucceed -> {

});
```

Now you can execute your server :)

## How to setup and run the inspector

In $INPECTOR folder, **execute the following command**: `npm start`. Your default browser should open a blank web page on http://localhost:3000/` with two menu: "Connections" and "New". **Click on "New"**. Then fill the form:

- "Name" is the name of your connection, put whatever you want. Here we will put "Example"
- "Address" is the URL on which the inspector should connect **without the protocol** and the port that you defined in your server. As we are running everything locally, here it will be: `localhost:12345/ws`
- "Remember" allows you to save your connection settings if you want to switch the inspector off.

The other information are not required in this simple example, but I think they are easy to understand how to use them.

Now two other menus should appear: "Connect" and "Edit".
Just click on "Connect" and enjoy :)

## IMPORTANT

When you connect the inspector with your server, it will look for the elements to show. As the indexes are the entry point of any graph, **you should define at least one index**. Indeed, it will first get all the index using the `Graph.indexNames` method.

# Sending Feedback

We are always open to your feedback.

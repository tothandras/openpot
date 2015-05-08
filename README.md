OpenPot
==

### Fetch and install

`$ go get github.com/tothandras/openpot`

### Build and run the Docker image

Invoke Docker from the package directory to build an image using the Dockerfile:

`$ docker build -t openpot .`

Run a container:

`$ docker run --publish 8080:8080 --name openpotapp --rm openpot`

### Development

Install dependencies and run gulp
```
$ npm install -g bower
$ npm install -g gulp
$ npm install && bower install
$ gulp --watch
```

Run the server

`$ go run main.go`

Open http://localhost:8080

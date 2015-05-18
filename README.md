OpenPot
==

### Fetch and install

`$ go get github.com/tothandras/openpot`

### Build and run the Docker image

Invoke Docker from the package directory to build an image using the Dockerfile:

`$ docker build -t openpot .`

Run the containers:


`$ docker run --publish 8080:8080 --name openpotapp --rm openpot -e AWS_ACCESS_KEY_ID=XXX AWS_SECRET_ACCESS_KEY=YYY`

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

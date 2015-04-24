FROM centos:latest
MAINTAINER Andras Toth <andras.toth93@gmail.com>

RUN yum update -y
RUN yum install -y curl tar git hg gcc libc6-dev make openssh-client

ENV GOLANG_VERSION 1.4.2

RUN curl -sSL https://golang.org/dl/go$GOLANG_VERSION.src.tar.gz \
		| tar -v -C /usr/src -xz

RUN cd /usr/src/go/src && ./make.bash --no-clean 2>&1

ENV PATH /usr/src/go/bin:$PATH

RUN mkdir -p /go/src /go/bin && chmod -R 777 /go
ENV GOPATH /go
ENV PATH $PATH:$GOROOT/bin:$GOPATH/bin

ADD . /go/src/github.com/tothandras/openpot
RUN go get -v -d all
RUN go install github.com/tothandras/openpot
RUN mkdir /keys -p
RUN ssh-keygen -q -t rsa -N '' -f /keys/app.rsa
ENTRYPOINT openpot -port=8080 -db=172.17.0.70
EXPOSE 8080

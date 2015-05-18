FROM centos:latest
MAINTAINER Andras Toth <andras.toth93@gmail.com>

RUN yum update -y
RUN yum install -y curl tar git hg gcc libc6-dev make openssl
#RUN yum install -y epel-release
#RUN yum install -y nodejs npm
#RUN npm install -g npm
#RUN npm install -g gulp bower

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
#RUN cd /go/src/github.com/tothandras/openpot && npm install && bower install && gulp --release

RUN mkdir /keys -p
RUN openssl genrsa -out /keys/app.rsa 1024
RUN openssl rsa -pubout -in /keys/app.rsa -out /keys/app.rsa.pub

#ENV AWS_ACCESS_KEY_ID AKIAJ7OGLEBV27YXMYHQ
#ENV AWS_SECRET_ACCESS_KEY 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

ENTRYPOINT openpot -port=8080 -db=172.17.0.70
EXPOSE 8080

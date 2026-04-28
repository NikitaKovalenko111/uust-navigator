FROM golang:1.25.4

WORKDIR /server

COPY . /server/

RUN go mod download
RUN go build ./cmd/main.go

EXPOSE 3001

CMD ["./main"]
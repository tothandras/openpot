package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/GeertJohan/go.rice"
	jwt "github.com/dgrijalva/jwt-go"
)

var (
	privateKey []byte
	publicKey  []byte
	port       = flag.String("port", "80", "port number")
)

type UserData struct {
	ID          string `json:"id" bson:"_id,omitempty"`
	Email       string `json:"email" bson:"email"`
	FirstName   string `json:"firstName" bson:"firstName"`
	LastName    string `json:"lastName" bson:"lastName"`
	ImageURL    string `json:"imageURL" bson:"imageURL"`
	Description string `json:"description" bson:"description"`
}

func init() {
	privateKey, _ = ioutil.ReadFile("keys/app.rsa")
	flag.Parse()
	publicKey, _ = ioutil.ReadFile("keys/app.rsa.pub")
}

func verify(username string, password string) bool {
	return username == "a@a.com" && password == "password"
}

func createToken(w http.ResponseWriter, r *http.Request) {

	email, password, ok := r.BasicAuth()
	if !ok || !verify(email, password) {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Bad creditentals")
		return
	}

	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims["a@a.com"] = email
	token.Claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	tokenString, err := token.SignedString(publicKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	data := map[string]string{
		"id": "asdsdgs3r238yhsdf",
		"email": email,
		"token": tokenString,
	}
	json, err := json.Marshal(data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, string(json))
}

// only accessible with a valid token
func api(w http.ResponseWriter, r *http.Request) {
	token, err := jwt.ParseFromRequest(r, func(token *jwt.Token) (interface{}, error) {
		return publicKey, nil
	})

    if err == nil && token.Valid {
		user := UserData{
			ID: "asd53vdf05we4f8",
			Email: token.Claims["a@a.com"].(string),
			FirstName:  "Andras",
			LastName: "Toth",
			ImageURL: "https://avatars2.githubusercontent.com/u/4157749?v=3&s=460",
			Description: "Test Description",
		}
		b, err := json.Marshal(user)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintf(w, "Server error")
			return
		}
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, string(b))
	} else {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "Unathorized request")
	}
}

func fileHandler(w http.ResponseWriter, r *http.Request) {
	url := r.URL.String()
	if strings.Contains(url, ".") {
		url = "/"
	}
	box := rice.MustFindBox("static")
	http.StripPrefix(url, http.FileServer(box.HTTPBox())).ServeHTTP(w, r)
}

func main() {
	http.HandleFunc("/auth", createToken)
	http.HandleFunc("/api", api)
	http.HandleFunc("/", fileHandler)

	log.Println("Server is running on port: " + *port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+*port, nil))
}

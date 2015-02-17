package main

import (
	"encoding/json"
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
)

func init() {
	privateKey, _ = ioutil.ReadFile("keys/app.rsa")
	// publicKey, _ := ioutil.ReadFile("keys/app.rsa.pub")
}

func verify(username string, password string) bool {
	return username == "username" && password == "password"
}

func createToken(w http.ResponseWriter, r *http.Request) {

	// decoder := json.NewDecoder(r.Body)
	// var user User
	// err := decoder.Decode(&user)
	// if err != nil {
	// 	w.WriteHeader(http.StatusBadRequest)
	// 	return
	// }
	username, password, ok := r.BasicAuth()
	if !ok || !verify(username, password) {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims["username"] = username
	token.Claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	tokenString, err := token.SignedString(privateKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	data := map[string]string{
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

func api(w http.ResponseWriter, r *http.Request) {
	// toker, err := jwt.Parse(r.Header
	// if err != nil {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	return
	// }
	// fmt.Fprintf(w, "Hello, %q", auth)
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

	http.HandleFunc("/token", createToken)
	http.HandleFunc("/api", api)
	http.HandleFunc("/", fileHandler)

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", nil))
}

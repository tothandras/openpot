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
	Username string `json:"username"`
	Name     string `json:"name"`
	Image    string `json:"image"`
}

func init() {
	privateKey, _ = ioutil.ReadFile("keys/app.rsa")
	flag.Parse()
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
		fmt.Fprintf(w, "Bad creditentals")
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

// only accessible with a valid token
func api(w http.ResponseWriter, r *http.Request) {
	token, err := jwt.ParseFromRequest(r, func(token *jwt.Token) (interface{}, error) {
		return privateKey, nil
	})

	if err == nil && token.Valid {
		user := UserData{
			Username: token.Claims["username"].(string),
			Name: "Toth Andras", // TODO db
			Image: "https://avatars2.githubusercontent.com/u/4157749?v=3&s=460", // TODO db
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

	http.HandleFunc("/token", createToken)
	http.HandleFunc("/api", api)
	http.HandleFunc("/", fileHandler)

	log.Println("Server is running on port: " + *port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+*port, nil))
}

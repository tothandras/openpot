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
	"github.com/julienschmidt/httprouter"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const (
	EMAIL = "email"
	EXP   = "exp"
)

var (
	privateKey     []byte
	publicKey      []byte
	port           = flag.String("port", "80", "port number")
	dbURL          = flag.String("db", "localhost", "mongodb url")
	db             *mgo.Database
	userCollection *mgo.Collection
	potCollection  *mgo.Collection
)

type User struct {
	ID          bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Email       string        `json:"email,omitempty" bson:"email"`
	FirstName   string        `json:"firstName,omitempty" bson:"firstName"`
	LastName    string        `json:"lastName,omitempty" bson:"lastName"`
	Description string        `json:"description,omitempty" bson:"description"`
	Phone       string        `json:"phone,omitempty" bson:"phone"`
	Location    string        `json:"location,omitempty" bson"location"`
	Stars       int           `json:"stars,omitempty" bson:"stars"`
	Following   []string      `json:"following,omitempty" bson:"following"`
	Password    string        `json:"-" bson: "password"`
	//	ImageURL    string   `json:"imageURL"`
}

type Auth struct {
	User  User   `json:"user"`
	Token string `json:"token"`
}

type Pot struct {
	ID          bson.ObjectId `json:"id" bson:"_id,omitempty`
	Cook        bson.ObjectId `json:"cook"`
	Consumer    bson.ObjectId `json:"consumer"`
	Name        string        `json:"name"`
	Description string        `json:"description"`
}

type Message struct {
	ID        bson.ObjectId `json:"id" bson:"_id,omitempty`
	From      bson.ObjectId `json:"from"`
	To        bson.ObjectId `json:"to"`
	Content   string        `json:"content"`
	Timestamp time.Time     `json:"time"`
}

func init() {
	privateKey, _ = ioutil.ReadFile("keys/app.rsa")
	flag.Parse()
	publicKey, _ = ioutil.ReadFile("keys/app.rsa.pub")
}

func verify(r *http.Request) (string, error) {
	token, err := jwt.ParseFromRequest(r, func(t *jwt.Token) (interface{}, error) {
		// Validate the alg
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return "", fmt.Errorf("Unexpected signing method: %v", t.Header["alg"])
		}
		return publicKey, nil
	})

	if err != nil || !token.Valid {
		return "", fmt.Errorf("Token is not valid")
	}

	return token.Claims[EMAIL].(string), nil
}

func private(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	email, err := verify(r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, email)
}

func register(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	user := User{}
	err = json.Unmarshal(body, &user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Incorrect user object")
		return
	}

	err = userCollection.Insert(user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Email already in use")
		return
	}

	w.WriteHeader(http.StatusOK)
	return
}

func login(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	email, password, ok := r.BasicAuth()
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "No username or password")
		return
	}

	user := User{}
	err := userCollection.Find(bson.M{"email": email, "password": password}).One(&user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Bad creditentals")
		return
	}

	token := jwt.New(jwt.SigningMethodRS256)
	token.Claims[EMAIL] = email
	token.Claims[EXP] = time.Now().Add(time.Hour * 48).Unix()

	t, err := token.SignedString(privateKey)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	auth := Auth{user, t}

	b, err := json.Marshal(auth)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, string(b))
}

func GETUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	id := p.ByName("id")
	if id == "" {

		var users []User
		err := userCollection.Find(nil).All(&users)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			log.Print(err)
			return
		}

		b, err := json.Marshal(users)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			log.Print(err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, string(b))

	} else {
		user := User{}
		err := userCollection.FindId(bson.ObjectIdHex(id)).One(&user)
		fmt.Print(user)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintf(w, "User not found")
			return
		}

		b, err := json.Marshal(user)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			log.Print(err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, string(b))

	}
}

func POSTUser(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	id := bson.ObjectIdHex(p.ByName("id"))

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	user := User{}
	err = json.Unmarshal(body, &user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Incorrect user object")
		return
	}

	err = userCollection.Update(id, user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print(err)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func GETPot(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	id := p.ByName("id")
	if id == "" {

		var pots []Pot
		err := potCollection.Find(nil).All(&pots)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			log.Print(err)
			return
		}

		b, err := json.Marshal(pots)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			log.Print(err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, string(b))

	} else {
		pot := Pot{}
		err := potCollection.FindId(bson.ObjectId(id)).One(&pot)
		fmt.Print(pot)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintf(w, "User not found")
			return
		}

		b, err := json.Marshal(pot)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			log.Print(err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, string(b))

	}
}

func handleFiles(w http.ResponseWriter, r *http.Request) {
	box := rice.MustFindBox("static")
	url := r.URL.String()
	if strings.Contains(url, ".") {
		url = "/"
	}
	http.StripPrefix(url, http.FileServer(box.HTTPBox())).ServeHTTP(w, r)
}

func main() {
	session, err := mgo.Dial(*dbURL)
	if err != nil {
		panic(err)
	}
	defer session.Close()
	db = session.DB("openpot")

	userCollection = db.C("user")
	index := mgo.Index{
		Key:        []string{"email"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}
	err = userCollection.EnsureIndex(index)
	if err != nil {
		log.Fatal(err)
	}

	potCollection = db.C("pot")

//	err = userCollection.Insert(&User{
//		bson.NewObjectId(),
//		"d@ad.com",
//		"Bsa",
//		"Asd",
//		"Description sample",
//		"+36701234567",
//		"location",
//		5,
//		[]string{},
//		"pass",
//	})
//
//	if err != nil {
//		fmt.Println(err)
//	}

//		err = potCollection.Insert(&Pot{
//			potID(bson.NewObjectId()),
//
//		})
//
//		if err != nil {
//			fmt.Println(err)
//		}

	router := httprouter.New()
	// AUTH
	router.POST("/auth/register", register)
	router.POST("/auth/login", login)
	// API

	router.GET("/api/user", GETUser)
	router.GET("/api/user/:id", GETUser)
	router.POST("/api/user/:id", POSTUser)

	router.GET("/api/pot", GETPot)
	router.GET("/api/pot/:id", GETPot)

  // Handle files otherwise
	router.NotFound = handleFiles

	log.Println("Server is running on port: " + *port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+*port, router))
}

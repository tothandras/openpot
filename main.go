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

// User represent an app user.
type User struct {
	ID          bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Email       string        `json:"email" bson:"email"`
	FirstName   string        `json:"firstName" bson:"firstName"`
	LastName    string        `json:"lastName" bson:"lastName"`
	Description string        `json:"description,omitempty" bson:"description"`
	Phone       string        `json:"phone,omitempty" bson:"phone"`
	Stars       int           `json:"stars,omitempty" bson:"stars"`
	Following   []string      `json:"following,omitempty" bson:"following"`
	Password    string        `json:"-" bson: "password"`
}

type UserRegistration struct {
	User
	Password string `json:"password"`
}

type Auth struct {
	User  User   `json:"user"`
	Token string `json:"token"`
}

//type Location struct {
//	Lan     float64 `json:"lan" bson:"lan"`
//	Lng     float64 `json:"lng" bson:"lng"`
//	Address string  `json:"address" bson:"address"`
//}

type Pot struct {
	ID          bson.ObjectId   `json:"id" bson:"_id,omitempty"`
	Cook        bson.ObjectId   `json:"cook" bson:"cook"`
	Consumers   []bson.ObjectId `json:"consumer" bson:"consumer"`
	Name        string          `json:"name" bson:"name"`
	Description string          `json:"description" bson:"description"`
	Address     string          `json:"address" bson"address"`
}

//type Message struct {
//	ID        bson.ObjectId `json:"id" bson:"_id,omitempty`
//	From      bson.ObjectId `json:"from"`
//	To        bson.ObjectId `json:"to"`
//	Content   string        `json:"content"`
//	Timestamp time.Time     `json:"time"`
//}

func init() {
	privateKey, _ = ioutil.ReadFile("keys/app.rsa")
	flag.Parse()
	publicKey, _ = ioutil.ReadFile("keys/app.rsa.pub")
}

func verify(r *http.Request) (*User, error) {
	token, err := jwt.ParseFromRequest(r, func(t *jwt.Token) (interface{}, error) {
		// Validate the alg
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", t.Header["alg"])
		}
		return publicKey, nil
	})

	if err != nil || !token.Valid {
		return nil, fmt.Errorf("Token is not valid")
	}

	email := token.Claims[EMAIL].(string)

	user := User{}
	err = userCollection.Find(bson.M{"email": email}).One(&user)
	if err != nil {
		return nil, fmt.Errorf("Token is not valid")
	}

	return &user, nil
}

// DEMO private
func private(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	user, err := verify(r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)

	b, err := json.Marshal(*user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, string(b))
}

func register(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	ur := UserRegistration{}
	err = json.Unmarshal(body, &ur)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Incorrect user object")
		return
	}

	user := ur.User
	user.Password = ur.Password

	if user.Email == "" || user.Password == "" || user.FirstName == "" || user.LastName == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Required fields missing")
		return
	}

	if len(user.Password) < 8 {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Password must be at least 8 characters long")
		return
	}

	err = userCollection.Insert(user)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Email is already in use")
		return
	}

	// TODO send email

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "OK")
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
		pots := make([]Pot, 0)
		err := potCollection.Find(bson.M{"cook": bson.ObjectIdHex(id)}).All(&pots)
		fmt.Print(pots)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			fmt.Fprintf(w, "User not found")
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

	}
}

func POSTPot(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	user, err := verify(r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	pot := Pot{}
	err = json.Unmarshal(body, &pot)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Incorrect pot object")
		return
	}

	if pot.Name == "" || pot.Description == "" || pot.Address == "" {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Required fields missing")
		return
	}
	pot.Cook = user.ID
	fmt.Println(user.ID)

	err = potCollection.Insert(pot)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print(err)
		return
	}

	w.WriteHeader(http.StatusOK)
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

	potCollection = db.C("pot")
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

	router := httprouter.New()
	// AUTH
	router.POST("/auth/register", register)
	router.POST("/auth/login", login)

	// API
	router.GET("/api/user", GETUser)
	router.GET("/api/user/:id", GETUser)
	router.POST("/api/user/:id", POSTUser)

	router.GET("/api/user/:id/pot", GETPot)
	router.GET("/api/pot", GETPot)
	router.POST("/api/pot", POSTPot)

	// Handle files otherwise
	router.NotFound = handleFiles

	log.Println("Server is running on port: " + *port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+*port, router))
}

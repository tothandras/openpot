package main

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base64"
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
	"github.com/mitchellh/goamz/aws"
	"github.com/mitchellh/goamz/s3"
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
	Address     string          `json:"address" bson:"address"`
	Amout       int32           `json:"amount" bson:"amount"`
  Rating      int32           `json:"rating" bson:"rating"`
}

//type Message struct {
//	ID        bson.ObjectId `json:"id" bson:"_id,omitempty`
//	From      bson.ObjectId `json:"from"`
//	To        bson.ObjectId `json:"to"`
//	Content   string        `json:"content"`
//	Timestamp time.Time     `json:"time"`
//}

type S3Policy struct {
	Expiration string        `json:"expiration"`
	Conditions []interface{} `json:"conditions"`
}

type S3Object struct {
	Policy    string `json:"policy"`
	Signature string `json:"signature"`
	Key       string `json:"key"`
	URL       string `json:"url"`
	CDN       string `json:"cdn"`
}

func init() {
	privateKey, _ = ioutil.ReadFile("/keys/app.rsa")
	flag.Parse()
	publicKey, _ = ioutil.ReadFile("/keys/app.rsa.pub")
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

	//  fmt.Printf(user.ID.String())
	return &user, nil
}

// DEMO private
func private(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	user, err := verify(r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

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
		return
	}

	if len(id) == 24 {
		user := User{}
		err := userCollection.FindId(bson.ObjectIdHex(id)).One(&user)
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
		return
	}

	w.WriteHeader(http.StatusBadRequest)
	fmt.Fprintf(w, "Invalid ID")
	return
}

func GETReservation(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	user, err := verify(r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	id := user.ID
	pots := make([]Pot, 0)
	err = potCollection.Find(bson.M{"consumer": id}).All(&pots)
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

func POSTReservation(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
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
  if err != nil || pot.Rating < 1 || pot.Rating > 5 {
    w.WriteHeader(http.StatusBadRequest)
    fmt.Fprintf(w, "Incorrect pot object")
    return
  }

  err = potCollection.Update(bson.M{"_id": pot.ID, "consumer": user.ID}, bson.M{"$set": bson.M{"rating": pot.Rating}})
  if err != nil {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  w.WriteHeader(http.StatusOK)
}

func DELETEReservation(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
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

  err = potCollection.Update(bson.M{"_id": pot.ID, "consumer": user.ID}, bson.M{"$pull": bson.M{"consumer": user.ID}})
  if err != nil {
    w.WriteHeader(http.StatusUnauthorized)
    return
  }

  w.WriteHeader(http.StatusOK)
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

func DELETEPot(w http.ResponseWriter, r *http.Request, p httprouter.Params) {

	user, err := verify(r)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	id := p.ByName("id")
	if id == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	pot := &Pot{}
	potCollection.FindId(bson.ObjectIdHex(id)).One(pot)

	if pot.Cook != user.ID {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "The authorized user is not the cook of the pot")
		return
	}

	err = potCollection.RemoveId(bson.ObjectIdHex(id))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
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

	// reserve
	if pot.ID != "" {
		err = potCollection.Update(bson.M{"_id": pot.ID, "amount": bson.M{"$gt": 0}}, bson.M{"$addToSet": bson.M{"consumer": user.ID}, "$inc": bson.M{"amount": -1}})
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			log.Print(err)
			return
		}

		w.WriteHeader(http.StatusOK)
		return
	}

	// new
	if pot.Name == "" || pot.Description == "" || pot.Address == "" || pot.Amout < 1 {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Required fields missing")
		return
	}
	pot.Cook = user.ID

	id := bson.NewObjectId()
	pot.ID = id
  pot.Rating = 1;
	err = potCollection.Insert(pot)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, id.Hex())
}

func GETS3Policy(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	auth, err := aws.EnvAuth()
	if err != nil {
		log.Fatal(err)
	}

	//  s3Connection := s3.New(auth, aws.EUCentral)
	conditions := make([]interface{}, 0)
	conditions = append(conditions, map[string]string{"bucket": "openpot1"})
	conditions = append(conditions, map[string]s3.ACL{"acl": s3.PublicRead})
	conditions = append(conditions, []string{"starts-with", "$key", ""})
	conditions = append(conditions, []string{"starts-with", "$Content-Type", "image/"})
	conditions = append(conditions, []string{"starts-with", "$filename", ""})

	s3Policy, err := json.Marshal(S3Policy{
		Expiration: time.Now().Add(time.Hour * 48).UTC().Format(time.RFC3339),
		Conditions: conditions,
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print(err)
		return
	}

	s3PolicyBase64 := base64.StdEncoding.EncodeToString(s3Policy)

	mac := hmac.New(sha1.New, []byte(auth.SecretKey))
	mac.Write([]byte(s3PolicyBase64))

	policy := S3Object{
		Policy:    s3PolicyBase64,
		Signature: base64.StdEncoding.EncodeToString(mac.Sum(nil)),
		Key:       auth.AccessKey,
		URL:       "https://openpot1.s3-eu-west-1.amazonaws.com/",
		CDN:       "https://d1f0mp28tfo8uk.cloudfront.net/",
	}

	jsonPolicy, err := json.Marshal(policy)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		log.Print(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, string(jsonPolicy))
}

func handleFiles(w http.ResponseWriter, r *http.Request) {
	box := rice.MustFindBox("static")
	url := r.URL.Path
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
	router.GET("/api/reservation", GETReservation)
  router.POST("/api/reservation", POSTReservation)
  router.DELETE("/api/reservation", DELETEReservation)

	router.GET("/api/user/:id/pot", GETPot)
	router.GET("/api/pot", GETPot)
	router.POST("/api/pot", POSTPot)
	router.DELETE("/api/pot/:id", DELETEPot)

	router.GET("/api/s3policy", GETS3Policy)

	// Handle files otherwise
	router.NotFound = handleFiles

	log.Println("Server is running on port: " + *port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+*port, router))
}

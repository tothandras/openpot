package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestApi(t *testing.T) {
	req, _ := http.NewRequest("GET", "/api", nil)
	w := httptest.NewRecorder()
	fileHandler(w, req)
	if w.Code != http.StatusOK {
		t.Errorf("Home page didn't return %v", http.StatusOK)
	}
}

package testing

import (
	"bytes"
	"encoding/json"
	"gopkg.in/ini.v1"
	"schedule-api/elastic"
	"testing"
)

func TestInit(t *testing.T) {
	cfg, err := ini.Load("../config.ini")
	if err != nil {
		t.Error(err)
	}
	es := elastic.Inject(cfg.Section("elasticsearch"))
	result, err := es.Info()
	if err != nil {
		t.Error(err)
	}
	println(string(result))
}

type MyData struct {
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func TestIndex(t *testing.T) {
	cfg, err := ini.Load("../config.ini")
	if err != nil {
		t.Error(err)
	}
	es := elastic.Inject(cfg.Section("elasticsearch"))
	err = es.Index(MyData{
		Name: "kain",
		Age:  26,
	})
	if err != nil {
		t.Error(err)
	}
	println("success")
}

func TestIndexOther(t *testing.T) {
	cfg, err := ini.Load("../config.ini")
	if err != nil {
		t.Error(err)
	}
	es := elastic.Inject(cfg.Section("elasticsearch"))
	err = es.Index(MyData{
		Name: "xxxx",
		Age:  111,
	})
	if err != nil {
		t.Error(err)
	}
	println("success")
}

func TestSearch(t *testing.T) {
	cfg, err := ini.Load("../config.ini")
	if err != nil {
		t.Error(err)
	}
	es := elastic.Inject(cfg.Section("elasticsearch"))
	result, err := es.Search(map[string]interface{}{
		"query": map[string]interface{}{
			"match": map[string]interface{}{
				"name": "kain",
			},
		},
	})
	if err != nil {
		t.Error(err)
	}
	var buf bytes.Buffer
	err = json.NewEncoder(&buf).Encode(result)
	if err != nil {
		t.Error(err)
	}
	println(buf.String())
}

func TestDelete(t *testing.T) {
	cfg, err := ini.Load("../config.ini")
	if err != nil {
		t.Error(err)
	}
	es := elastic.Inject(cfg.Section("elasticsearch"))
	err = es.Delete(map[string]interface{}{
		"query": map[string]interface{}{
			"match": map[string]interface{}{
				"name": "kain",
			},
		},
	})
	if err != nil {
		t.Error(err)
	}
	println("ok")
}

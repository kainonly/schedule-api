package common

import (
	"encoding/json"
	"github.com/syndtr/goleveldb/leveldb"
	"log"
	"time"
)

var (
	Record chan interface{}
	db     *leveldb.DB
)

type (
	TaskOption struct {
		Identity string                  `json:"identity" validate:"required"`
		TimeZone string                  `json:"time_zone" validate:"required"`
		Start    bool                    `json:"start" validate:"required"`
		Entries  map[string]*EntryOption `json:"entries" validate:"required,dive,required"`
	}
	EntryOption struct {
		CronTime string            `json:"cron_time" validate:"required"`
		Url      string            `json:"url" validate:"required,url"`
		Headers  map[string]string `json:"headers"`
		Body     interface{}       `json:"body"`
		NextDate time.Time         `json:"next_date"`
		LastDate time.Time         `json:"last_date"`
	}
	Logs struct {
		Type     string      `json:"type"`
		Identity string      `json:"identity"`
		Body     interface{} `json:"body"`
		Time     time.Time   `json:"time"`
	}
	RecordSuccess struct {
		Type     string      `json:"type"`
		Identity string      `json:"identity"`
		Key      string      `json:"key"`
		Url      string      `json:"url"`
		Header   interface{} `json:"header"`
		Body     interface{} `json:"body"`
		Response interface{} `json:"response"`
		Time     time.Time   `json:"time"`
	}
	RecordError struct {
		Type     string      `json:"type"`
		Identity string      `json:"identity"`
		Key      string      `json:"key"`
		Url      string      `json:"url"`
		Header   interface{} `json:"header"`
		Body     interface{} `json:"body"`
		Message  []string    `json:"message"`
		Time     time.Time   `json:"time"`
	}
)

// Initialize leveldb
func InitLevelDB(path string) {
	var err error
	db, err = leveldb.OpenFile(path, nil)
	if err != nil {
		log.Fatalln(err)
	}
}

// Set up temporary storage
func SetTemporary(config map[string]*TaskOption) (err error) {
	data, err := json.Marshal(config)
	err = db.Put([]byte("temporary"), data, nil)
	return
}

// Get temporary storage
func GetTemporary() (config map[string]*TaskOption, err error) {
	exists, err := db.Has([]byte("temporary"), nil)
	if exists == false {
		config = make(map[string]*TaskOption)
		return
	}
	data, err := db.Get([]byte("temporary"), nil)
	err = json.Unmarshal(data, &config)
	return
}

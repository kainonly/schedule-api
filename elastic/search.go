package elastic

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"github.com/elastic/go-elasticsearch/v8/esapi"
)

func (c *Elastic) Search(query interface{}) (raws interface{}, err error) {
	var buf bytes.Buffer
	var res *esapi.Response
	err = json.NewEncoder(&buf).Encode(query)
	if err != nil {
		return
	}
	res, err = c.client.Search(
		c.client.Search.WithContext(context.Background()),
		c.client.Search.WithIndex(c.index),
		c.client.Search.WithBody(&buf),
		c.client.Search.WithTrackTotalHits(true),
		c.client.Search.WithPretty(),
	)
	if err != nil {
		return
	}
	defer res.Body.Close()
	if res.IsError() {
		err = errors.New(res.Status())
		return
	}
	err = json.NewDecoder(res.Body).Decode(&raws)
	return
}

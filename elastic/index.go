package elastic

import (
	"bytes"
	"encoding/json"
	"errors"
	"github.com/elastic/go-elasticsearch/v8/esapi"
)

func (c *Elastic) Index(data interface{}) (err error) {
	var buf bytes.Buffer
	var res *esapi.Response
	err = json.NewEncoder(&buf).Encode(data)
	if err != nil {
		return
	}
	res, err = c.client.Index(
		c.index,
		&buf,
	)
	if err != nil {
		return
	}
	defer res.Body.Close()
	if res.IsError() {
		return errors.New(res.Status())
	}
	return
}

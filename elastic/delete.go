package elastic

import (
	"bytes"
	"encoding/json"
	"errors"
	"github.com/elastic/go-elasticsearch/v8/esapi"
)

func (c *Elastic) Delete(query interface{}) (err error) {
	var buf bytes.Buffer
	var res *esapi.Response
	err = json.NewEncoder(&buf).Encode(query)
	if err != nil {
		return
	}
	res, err = c.client.DeleteByQuery(
		[]string{c.index},
		&buf,
	)
	if err != nil {
		return
	}
	if res.IsError() {
		return errors.New(res.Status())
	}
	return
}

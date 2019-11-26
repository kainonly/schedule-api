package elastic

import (
	"errors"
	"io/ioutil"
)

func (c *Elastic) Info() (result []byte, err error) {
	res, err := c.client.Info()
	if err != nil {
		return
	}
	if res.IsError() {
		err = errors.New(res.Status())
		return
	}
	defer res.Body.Close()
	return ioutil.ReadAll(res.Body)
}

package task

import "errors"

func (c *Task) Running(identity string, running bool) (err error) {
	if c.runtime[identity] == nil {
		err = errors.New("this identity does not exists")
		return
	}
	if running {
		c.runtime[identity].Start()
	} else {
		c.runtime[identity].Stop()
	}
	return
}

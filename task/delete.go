package task

import "schedule-api/common"

func (c *Task) Delete(identity string) (err error) {
	c.close(identity)
	delete(c.runtime, identity)
	delete(c.options, identity)
	delete(c.entries, identity)
	return common.SetTemporary(c.options)
}

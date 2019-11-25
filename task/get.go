package task

import "schedule-api/common"

func (c *Task) Get(identity string) *common.TaskOption {
	options := c.options[identity]
	for key, entryId := range c.entries[identity] {
		entry := c.runtime[identity].Entry(entryId)
		options.Entries[key].NextDate = entry.Next
		options.Entries[key].LastDate = entry.Prev
	}
	return c.options[identity]
}

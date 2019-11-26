package task

func (c *Task) Delete(identity string) {
	c.close(identity)
	delete(c.runtime, identity)
	delete(c.options, identity)
	delete(c.entries, identity)
}

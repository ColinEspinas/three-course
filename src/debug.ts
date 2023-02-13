import { Pane } from 'tweakpane'

// Config panel
const pane = new Pane()
const params = {
  label: 'test',
}
pane.addInput(params, 'label')

export { params }

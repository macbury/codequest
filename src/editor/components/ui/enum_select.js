import React from 'react'
import { Form } from 'semantic-ui-react'

export default class EnumSelect extends React.Component {

  get options() {
    let { enumType } = this.props
    return enumType.enums.map((enumItem) => {
      return {
        key: enumItem.key,
        text: enumItem.key,
        value: enumItem.value
      }
    })
  }

  render() {
    let selectProps = {...this.props}
    delete selectProps.enumType
    return (
      <Form.Select options={this.options} {...selectProps} />
    )
  }
}

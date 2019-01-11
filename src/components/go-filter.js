import React from "react";
import { Checkbox, Switch, InputNumber, Form, Row, Col } from "antd";
import FormItem from "antd/lib/form/FormItem";

const namespaces = [
  { label: "Biological process", value: "biological_process" },
  { label: "Cellular component", value: "cellular_component" },
  { label: "Molecular function", value: "molecular_function" }
];

const formItemStyle = {
  marginBottom: 5
};

export class GOFilter extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Form layout="inline">
          <FormItem label="Namespace">
            <Checkbox.Group
              onChange={namespaces => {
                this.props.handleFilterChanged({ namespace: namespaces });
              }}
              options={namespaces}
              defaultValue={this.props.defaults.namespace}
            />
          </FormItem>

          <Row gutter={16}>
            <Col md={24} lg={12} xl={8}>
              <FormItem label="Number of parent terms" style={formItemStyle}>
                <InputNumber
                  min={0}
                  defaultValue={this.props.defaults.parents}
                  onChange={n => this.props.handleFilterChanged({ parents: n })}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

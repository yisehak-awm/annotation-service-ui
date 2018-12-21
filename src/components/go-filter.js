import React from "react";
import { Checkbox, Switch, InputNumber, Form, Row, Col } from "antd";
import FormItem from "antd/lib/form/FormItem";

const options = [
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
              onChange={namespaces =>
                this.props.handleFilterChanged({ namespaces: namespaces })
              }
              options={options}
              defaultValue={[
                "biological_process",
                "cellular_component",
                "molecular_function"
              ]}
            />
          </FormItem>

          <Row gutter={16}>
            <Col md={24} lg={12} xl={8}>
              <FormItem label="Number of parent terms" style={formItemStyle}>
                <InputNumber
                  min={0}
                  defaultValue={0}
                  onChange={n =>
                    this.props.handleFilterChanged({ numberOfParents: n })
                  }
                />
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col md={12} lg={8} xl={6}>
              <FormItem>
                <Switch disabled /> Include Gene Name
              </FormItem>
            </Col>
            <Col md={12} lg={8} xl={6}>
              <FormItem>
                <Switch disabled /> Include Entrez ID
              </FormItem>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

import React from "react";
import { Checkbox, Switch, Form, Row, Col } from "antd";
import FormItem from "antd/lib/form/FormItem";

const options = [
  { label: "SMPDB", value: "smpdb" },
  { label: "Reactome", value: "reactome" }
];

export class GenePathwayFilter extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Form layout="inline">
          <FormItem label="Pathway">
            <Checkbox.Group
              options={options}
              defaultValue={this.props.defaults.namespace}
              onChange={e => this.props.handleFilterChanged({ namespace: e })}
            />
          </FormItem>

          <Row gutter={16}>
            <Col md={12} lg={8} xl={6}>
              <FormItem>
                <Switch
                  onChange={e => {
                    this.props.handleFilterChanged({
                      include_small_molecule: e
                    });
                  }}
                />{" "}
                Small molecules
              </FormItem>
            </Col>
            <Col md={12} lg={8} xl={6}>
              <FormItem>
                <Switch
                  onChange={e => {
                    this.props.handleFilterChanged({ include_prot: e });
                  }}
                />{" "}
                Proteins
              </FormItem>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

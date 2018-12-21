import React from "react";
import { Checkbox, Switch, Form, Row, Col } from "antd";
import FormItem from "antd/lib/form/FormItem";

const options = [
  { label: "SMPDB", value: "SMPDB" },
  { label: "Reactome", value: "Reactome" },
  { label: "Chebi", value: "Chebi" }
];

export class GenePathwayFilter extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Form layout="inline">
          <FormItem label="Namespace">
            <Checkbox.Group options={options} defaultValue={["SMPDB"]} />
          </FormItem>

          <Row gutter={16}>
            <Col md={12} lg={8} xl={6}>
              <FormItem>
                <Switch /> Small molecules
              </FormItem>
            </Col>
            <Col md={12} lg={8} xl={6}>
              <FormItem>
                <Switch /> Proteins
              </FormItem>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

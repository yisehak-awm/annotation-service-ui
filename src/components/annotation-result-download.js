import React from "react";
import { Row, Col, Button, Icon } from "antd";
import logo from "../assets/mozi_globe.png";

export class AnnotationResultDownload extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Row type="flex" justify="center" style={{ paddingTop: "30px" }}>
          <Col style={{ textAlign: "center" }}>
            <img alt="MOZI globe logo" src={logo} style={{ width: "100px" }} />
            <h2>Annotaion result ready!</h2>
            <p>
              The result was too large for visualization. Please click the
              button below to download the annotation result file.{" "}
            </p>
            <Button
              style={{ marginBottom: "15px", border: "none" }}
              onClick={() => this.props.back()}
            >
              <Icon type="left" />
              back
            </Button>
            <Button
              onClick={e => this.props.downloadFile()}
              type="primary"
              style={{ marginTop: "15px" }}
            >
              <Icon type="download" />
              Download annotation results
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

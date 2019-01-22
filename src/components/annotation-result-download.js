import React from "react";
import logo from "../assets/mozi_globe.png";
import { Grid, Button } from "@material-ui/core";
import { ArrowDownward } from "@material-ui/icons";

export class AnnotationResultDownload extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Grid containe style={{ paddingTop: "30px" }}>
          <Grid item style={{ textAlign: "center" }}>
            <img alt="MOZI globe logo" src={logo} style={{ width: "100px" }} />
            <h2>Annotaion result ready!</h2>
            <p>
              The result was too large for visualization. Please click the
              button below to download the annotation result file.{" "}
            </p>
            <Button
              variant="contained"
              onClick={e => this.props.downloadSchemeFile()}
              color="primary"
            >
              <ArrowDownward />
              Download annotation results
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

import React from "react";
import { SERVER_ADDRESS, showNotification } from "../utils";
import { Annotate } from "../proto/annotation_pb_service";
import {
  AnnotationRequest,
  Annotation,
  Gene,
  Filter
} from "../proto/annotation_pb";
import { grpc } from "grpc-web-client";
import { GeneSelectionForm } from "./gene-selection";
import { AnnotationSelection } from "./annotation-selection";
import { Button, Grid } from "@material-ui/core";
import { Check, CheckCircle } from "@material-ui/icons";

export class AnnotationService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      genes: [],
      geneList: null,
      selectedAnnotations: [],
      annotationResult: null,
      busy: false,
      notification: null
    };
    // bind functions
    this.handleGeneAdded = this.handleGeneAdded.bind(this);
    this.handleGeneRemoved = this.handleGeneRemoved.bind(this);
    this.handleGeneListUploaded = this.handleGeneListUploaded.bind(this);
    this.handleAllGenesRemoved = this.handleAllGenesRemoved.bind(this);
    this.handleAnnotationsChanged = this.handleAnnotationsChanged.bind(this);
    this.handleFilterChanged = this.handleFilterChanged.bind(this);
    this.downloadSchemeFile = this.downloadSchemeFile.bind(this);
  }

  handleGeneAdded(input) {
    this.setState(state => {
      let genes = state.genes.slice(0);
      genes = [
        ...genes,
        ...input
          .trim()
          .toUpperCase()
          .split(" ")
      ].filter((g, i, arr) => g && arr.indexOf(g) === i);
      return { genes: genes };
    });
  }

  handleGeneRemoved(gene) {
    this.setState(state => {
      let genes = state.genes.slice(0);
      return { genes: genes.filter(g => g !== gene) };
    });
  }

  handleGeneListUploaded(geneList) {
    const fileReader = new FileReader();
    fileReader.readAsText(geneList);
    fileReader.onload = () => {
      const re = /^[a-z0-9\s]+$/i;
      if (!re.test(fileReader.result)) {
        this.setState({
          notification: {
            message: "The selected file contains invalid characters.",
            busy: false
          }
        });
        return;
      }
      const geneArray = fileReader.result.split("\n");
      const uniqueGeneArray = geneArray.reduce((accumulator, value) => {
        if (value && accumulator.indexOf(value) === -1) accumulator.push(value);
        return accumulator;
      }, []);
      this.setState({ geneList: geneList, genes: uniqueGeneArray });
    };
  }

  handleAllGenesRemoved() {
    this.setState({ genes: [], geneList: null });
  }

  handleAnnotationsChanged(isSelected, annotation) {
    this.setState(state => {
      let selectedAnnotations = state.selectedAnnotations.slice();
      isSelected
        ? selectedAnnotations.push({
            name: annotation,
            filter: this.props.availableAnnotations.find(
              a => a.key === annotation
            ).defaults
          })
        : (selectedAnnotations = selectedAnnotations.filter(
            a => a.name !== annotation
          ));

      return { selectedAnnotations: selectedAnnotations };
    });
  }

  handleFilterChanged(annotation, filter) {
    this.setState(state => {
      const selectedAnnotations = state.selectedAnnotations.map(sa => {
        if (sa.name === annotation) {
          sa.filter = Object.assign({}, sa.filter, filter);
        }
        return sa;
      });
      return { selectedAnnotations: selectedAnnotations };
    });
  }

  isFormValid() {
    let valid = true;
    valid = valid && this.state.selectedAnnotations.length;
    valid = valid && this.state.genes.length;
    // If Gene GO annotation is selected, namespace must be defined
    const GO = this.state.selectedAnnotations.find(
      a => a.name === "gene_go_annotation"
    );
    if (GO) valid = valid && GO.filter.namespace.length;
    // If Gene Pathway annotation is selected, namespace must be defined
    const Pathway = this.state.selectedAnnotations.find(
      a => a.name === "gene_pathway_annotation"
    );
    if (Pathway) {
      valid =
        valid &&
        (Pathway.filter.namespace.includes("smpdb") ||
          Pathway.filter.namespace.includes("reactome"));
    }
    return valid;
  }

  downloadSchemeFile() {
    const json = `data:application/txt, ${encodeURIComponent(
      this.state.annotationResult.schemeFile
    )}`;
    const link = document.createElement("a");
    link.setAttribute("href", json);
    link.setAttribute("download", "annotations-scheme.scm");
    link.click();
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleSubmit() {
    const annotationResult = new AnnotationRequest();
    annotationResult.setGenesList(
      this.state.genes.map(g => {
        const gene = new Gene();
        gene.setGenename(g);
        return gene;
      })
    );
    annotationResult.setAnnotationsList(
      this.state.selectedAnnotations.map(sa => {
        const annotation = new Annotation();
        annotation.setFunctionname(sa.name);
        annotation.setFiltersList(
          sa.filter
            ? Object.keys(sa.filter).map(k => {
                const filter = new Filter();
                filter.setFilter(k);
                filter.setValue(
                  Array.isArray(sa.filter[k])
                    ? sa.filter[k]
                        .reduce((acc, value) => {
                          return acc + " " + value;
                        }, "")
                        .trim()
                    : this.capitalizeFirstLetter(sa.filter[k].toString())
                );
                return filter;
              })
            : []
        );
        return annotation;
      })
    );

    this.setState({
      notification: { message: "Fetching annotation results ...", busy: true }
    });

    grpc.unary(Annotate.Annotate, {
      request: annotationResult,
      host: SERVER_ADDRESS,
      onEnd: ({ status, statusMessage, message }) => {
        if (status === grpc.Code.OK) {
          this.setState(state => ({
            busy: false,
            annotationResult: message.array[0],
            notification: null
          }));
        } else {
          if (statusMessage.includes("Gene Doesn't exist")) {
            const invalidGenes = statusMessage
              .split("`")[1]
              .split(",")
              .map(g => g.trim())
              .filter(g => g);
            this.setState(state => ({
              busy: false,
              genes: state.genes.filter(g => !invalidGenes.includes(g)),
              notification: { message: statusMessage, busy: false }
            }));
          } else {
            this.setState(state => ({
              busy: false,
              notification: { message: statusMessage, busy: false }
            }));
          }
        }
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        {!this.state.annotationResult && (
          <div>
            {this.state.notification &&
              showNotification(this.state.notification, () => {
                this.setState({ notification: null });
              })}
            <GeneSelectionForm
              genes={this.state.genes}
              geneList={this.state.geneList}
              onGeneAdded={this.handleGeneAdded}
              onGeneRemoved={this.handleGeneRemoved}
              onGeneListUploaded={this.handleGeneListUploaded}
              onAllGenesRemoved={this.handleAllGenesRemoved}
            />
            <AnnotationSelection
              handleAnnotationsChanged={this.handleAnnotationsChanged}
              handleFilterChanged={this.handleFilterChanged}
              selectedAnnotations={this.state.selectedAnnotations}
              availableAnnotations={this.props.availableAnnotations}
            />
            <Grid container justify="flex-end">
              <Grid item>
                <Button
                  id="submitButton"
                  variant="contained"
                  onClick={() => this.handleSubmit()}
                  disabled={!this.isFormValid()}
                  color="primary"
                >
                  <Check />
                  Submit
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
        {this.state.annotationResult ? (
          <Grid container justify="center">
            <Grid
              item
              style={{
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "60vh"
              }}
            >
              <CheckCircle style={{ fontSize: "72px", color: "#54C21F" }} />
              <h1 style={{ margin: 5 }}>Your request is being processed</h1>
              <h3 style={{ marginTop: 0, color: "#555" }}>
                Follow the link below to view results.
              </h3>
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={this.state.annotationResult}
                style={{ fontSize: 18 }}
              >
                {this.state.annotationResult}
              </a>
            </Grid>
          </Grid>
        ) : null}
      </React.Fragment>
    );
  }
}

import React from "react";
import { Checkbox } from "antd";
import { GOFilter } from "./go-filter";
import { GenePathwayFilter } from "./gene-pathway-filter";

const filterFormStyle = {
  paddingLeft: "25px",
  marginBottom: "30px",
  marginLeft: "5px",
  paddingTop: "15px",
  borderLeft: "dashed 1px #ddd"
};

export class AnnotationSelection extends React.Component {
  isAnnotationSelected = annotation =>
    this.props.selectedAnnotations.some(sa => sa.name === annotation);

  render() {
    return (
      <React.Fragment>
        <h4>Annotations: </h4>
        {this.props.availableAnnotations.map(a => (
          <React.Fragment key={a.key}>
            <Checkbox
              name={a.key}
              onChange={e => this.props.onAnnotationsChanged(e)}
            >
              {a.name}
            </Checkbox>
            <br />
            {this.isAnnotationSelected(a.key) && (
              <div style={filterFormStyle} layout="inline">
                {a.filter}
              </div>
            )}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }
}

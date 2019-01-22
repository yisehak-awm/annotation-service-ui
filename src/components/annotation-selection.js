import React from "react";

import { Checkbox, FormControlLabel } from "@material-ui/core";

const filterFormStyle = {
  paddingLeft: "25px",
  marginLeft: "5px",
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
            <FormControlLabel
              value="0"
              control={
                <Checkbox
                  name={a.key}
                  onChange={e =>
                    this.props.handleAnnotationsChanged(
                      e.target.checked,
                      e.target.name
                    )
                  }
                />
              }
              label={a.name}
            />
            <br />
            {this.isAnnotationSelected(a.key) && (
              <div style={filterFormStyle} layout="inline">
                {a.fitlerForm(a.defaults, filter =>
                  this.props.handleFilterChanged(a.key, filter)
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }
}

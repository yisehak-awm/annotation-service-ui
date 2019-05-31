import React from "react";
import ReactDOM from "react-dom";
import { AnnotationService } from "./components/annotation-service";
import { GOFilter } from "./components/go-filter";
import { GenePathwayFilter } from "./components/gene-pathway-filter";
import "./style.css";

var availableAnnotations = [
  {
    key: "gene-go-annotation",
    name: "Gene-GO",
    defaults: {
      namespace: [
        "biological_process",
        "cellular_component",
        "molecular_function"
      ],
      parents: 0
    },
    fitlerForm: (defaults, handleFilterChanged) => (
      <GOFilter defaults={defaults} handleFilterChanged={handleFilterChanged} />
    )
  },
  {
    key: "gene-pathway-annotation",
    name: "Gene pathway",
    defaults: {
      namespace: ["smpdb"],
      include_prot: false,
      include_small_molecule: true
    },
    fitlerForm: (defaults, handleFilterChanged) => (
      <GenePathwayFilter
        defaults={defaults}
        handleFilterChanged={handleFilterChanged}
      />
    )
  },
  {
    key: "biogrid-interaction-annotation",
    name: "Biogrid protein interaction",
    fitlerForm: (defaults, handleFilterChanged) => null,
    defaults: {
      interaction: "genes"
    }
  }
];

class App extends React.Component {

   constructor(props){
     super(props);
     this.state = {
       annotations : availableAnnotations
     };
     this.handleInteractionUpdate = this.handleInteractionUpdate.bind(this)
   }

   handleInteractionUpdate(pathwaySelected) {
      if(pathwaySelected){
        availableAnnotations[2].defaults.interaction = "proteins"
      }
      else{
        availableAnnotations = "genes"
      }

      this.setState({
          annotations: availableAnnotations
      })
  }
  render() {
    return <AnnotationService availableAnnotations={this.state.annotations} handleInteractionUpdate={this.handleInteractionUpdate}/>;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

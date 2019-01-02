import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { AnnotationSelection } from "../components/annotation-selection";
import renderer from "react-test-renderer";

configure({ adapter: new Adapter() });

const availableAnnotations = [
  {
    key: "GO",
    name: "Gene-GO",
    defaults: {
      parents: 8,
      namespace: [
        "biological_process",
        "cellular_component",
        "molecular_function"
      ],
      get_entrez_id: false
    },
    fitlerForm: (defaults, handleFilterChanged) => (
      <GOFilter defaults={defaults} handleFilterChanged={handleFilterChanged} />
    )
  }
];

describe("<AnnotationSelection />", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <AnnotationSelection
          availableAnnotations={availableAnnotations}
          selectedAnnotations={[]}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders a checkbox for each selected annotation", () => {
    const wrapper = shallow(
      <AnnotationSelection
        availableAnnotations={availableAnnotations}
        selectedAnnotations={["a"]}
      />
    );
    expect(wrapper.find("Checkbox").length).toEqual(1);
  });
});

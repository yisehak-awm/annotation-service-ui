import React from "react";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { AnnotationSelection } from "../components/annotation-selection";
import renderer from "react-test-renderer";

configure({ adapter: new Adapter() });

const availableAnnotations = [
  {
    key: "test",
    name: "test",
    fitlerForm: (defaults, handleFilterChanged) => null
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
    const wrapper = mount(
      <AnnotationSelection
        availableAnnotations={availableAnnotations}
        selectedAnnotations={[{ name: "test", filter: {} }]}
        handleAnnotationsChanged={(selected, name) => null}
      />
    );
    expect(wrapper.find("Checkbox").length).toEqual(1);
  });
});

import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { AnnotationSelection } from '../annotation-selection'
import renderer from 'react-test-renderer';

configure({ adapter: new Adapter() });


describe('<AnnotationSelection />', () => {

    it('renders correctly', () => {
        const tree = renderer.create(<AnnotationSelection availableAnnotations={['a', 'b']} selectedAnnotations={[]} />).toJSON()
        expect(tree).toMatchSnapshot()
    });


    it('renders a checkbox for each selected annotation', () => {
        const wrapper = shallow(<AnnotationSelection availableAnnotations={['a', 'b']} selectedAnnotations={[]} />)
        expect(wrapper.find('Checkbox').length).toEqual(2)
    })


    it('renders a filter form for each selected annotation', () => {
        const wrapper = shallow(<AnnotationSelection availableAnnotations={['a', 'b']} selectedAnnotations={[{ name: 'a', filter: {} }]} />)
        expect(wrapper.find('Checkbox + Form').length).toEqual(1)
    })


})
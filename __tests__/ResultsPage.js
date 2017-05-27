import { View } from 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ResultsPage from '../src/components/ResultsPage';
import { Card, CardSection, Button } from '../src/components/common';
import renderer from 'react-test-renderer';

const mock = new MockAdapter(axios);

mock.onGet('https://maps.googleapis.com/maps/api/geocode/json?&address=%22E9%205QQ%22').reply(200, {
  users: [
    { id: 1, name: 'Freddy' }
  ]
});

describe('<ResultsPage />', () => {
  it('renders one View component', () => {
    const wrapper = shallow(<ResultsPage />);
      expect(wrapper.find(View).length).toBe(1);
  });

  it('renders one Card component', () => {
    const wrapper = shallow(<ResultsPage />);
      expect(wrapper.find(Card).length).toBe(1);
  });

  it('renders one Button component', () => {
    const wrapper = shallow(<ResultsPage />);
      expect(wrapper.find(Button).length).toBe(1);
  });

  it('renders one CardSection component', () => {
    const wrapper = shallow(<ResultsPage />);
      expect(wrapper.find(CardSection).length).toBe(1);
  });

  it('mocks the API correctly', () => {
    axios.get('https://maps.googleapis.com/maps/api/geocode/json?&address=%22E9%205QQ%22')
      .then(function(response) {
        expect(response.data).toBe("{ users: [ { id: 1, name: 'Freddy' } ] }");
      });
  });
});

it('renders correctly', () => {
  const tree = renderer.create(
    <ResultsPage />).toJSON();
    expect(tree).toMatchSnapshot();
});

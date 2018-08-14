import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adaprer-react-16'
import {UserHome} from './user-home'

const adapter = new Adapter()
enzyme.configure({adapter})

describe('UserHome', () => {
  let userHome

  beforeEach(() => {
    userHome = shallow(<UserHome email="default@email.com" />)
  })

  it('renders the email in an H3', () => {
    expect(userHome.find('h3').text()).to.be.equal('Welcome, default@email.com')
  })
})

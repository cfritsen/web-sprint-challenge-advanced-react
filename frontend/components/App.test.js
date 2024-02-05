import AppFunctional from './AppFunctional.js'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import React from 'react'

// Write your tests here
// test('sanity', () => {
//   expect(true).toBe(false)
// })
const selectors = document => {
  left = document.querySelector('#left')
  right = document.querySelector('#right')
  up = document.querySelector('#up')
  down = document.querySelector('#down')
  email = document.querySelector('#email')
}
  

  describe(`Self-Made Tests`, () => {
    beforeEach(() => {
      render(<AppFunctional />)
      selectors(document)
    })
    afterEach(() => {
      document.body.innerHTML = ''
    })

    test('Left Button says LEFT"', () => {
      expect(left.textContent).toMatch('LEFT')
    })
    test('Right Button says RIGHT"', () => {
      expect(right.textContent).toMatch('RIGHT')
    })
    test('Up Button says UP"', () => {
      expect(up.textContent).toMatch('UP')
    })
    test('Down Button says DOWN"', () => {
      expect(down.textContent).toMatch('DOWN')
    })
    test('Email value changes correctly', () => {
      fireEvent.change(email, {target: {value: 'test@this.sucks'}})
      screen.findByText('test@this.sucks')
    })

  })



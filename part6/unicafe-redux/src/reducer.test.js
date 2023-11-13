import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'
import { configureStore } from '@reduxjs/toolkit'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('ok is incremented', () => {
    const action = {
      type: 'OK'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
  })

  test('bad is incremented', () => {
    const action = {
      type: 'BAD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1
    })
  })

  test('zero resets state', () => {
    const actionGood = {
      type: 'GOOD'
    }
    const actionOk = {
      type: 'OK'
    }
    const actionBad = {
      type: 'BAD'
    }
    const actionZero = {
      type: 'ZERO'
    }
    const store = configureStore({reducer: counterReducer})

    deepFreeze(store)

    store.dispatch(actionGood)
    store.dispatch(actionOk)
    store.dispatch(actionBad)
    expect(store.getState()).toEqual({
      good: 1,
      ok: 1,
      bad: 1
    })

    store.dispatch(actionZero)
    expect(store.getState()).toEqual({
      good: 0,
      ok: 0,
      bad: 0
    })
  })
})
/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main.js'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let getIDTokenMock: jest.SpiedFunction<typeof core.getIDToken>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getIDTokenMock = jest.spyOn(core, 'getIDToken').mockImplementation()
  })

  it('gets a token', async () => {
    getIDTokenMock.mockImplementation(async () => {
      return Promise.resolve('fake-token')
    })
    await main.run()
    expect(runMock).toHaveReturned()
  }, 10000)
})

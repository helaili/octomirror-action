import * as core from '@actions/core'
import * as httplib from '@actions/http-client'
import { BearerCredentialHandler } from '@actions/http-client/lib/auth'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const octomirrorAppUrl: string = core.getInput('octomirror-app-url')
    const token: string = await core.getIDToken()
    const bearer: BearerCredentialHandler = new BearerCredentialHandler(token)
    const http: httplib.HttpClient = new httplib.HttpClient('http-client', [bearer])
    const res: httplib.HttpClientResponse = await http.get(`${octomirrorAppUrl}/api/listAllOrganizations`)

    if (res.message.statusCode !== 200) {
      throw new Error(
        `Failed to get organizations: ${res.message.statusMessage}`
      )
    }
    core.setOutput('organizations', JSON.parse(await res.readBody()))
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

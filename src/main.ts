import * as core from '@actions/core'
import * as httplib from '@actions/http-client'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token: string = await core.getIDToken()
    console.log(`Token is ${token}`)
    const http: httplib.HttpClient = new httplib.HttpClient('http-client')
    const res: httplib.HttpClientResponse = await http.get(
      'https://octomirror.ngrok.dev/api/listAllOrganizations'
    )
    core.debug(`Response code is ${res.message.statusCode}`)
    console.log(`Response code is ${res.message.statusCode}`)
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

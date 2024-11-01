import * as core from '@actions/core'
import * as httplib from '@actions/http-client'
import { BearerCredentialHandler } from '@actions/http-client/lib/auth'
import { Octokit } from "octokit";

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const octomirrorAppUrl: string = core.getInput('app-url')
    const serverUrl: string = core.getInput('server-url')
    const pat: string = core.getInput('pat')
    const token: string = await core.getIDToken()
    const initMode: boolean = core.getInput('init-mode') === 'true';
    const bearer: BearerCredentialHandler = new BearerCredentialHandler(token)
    
    const http: httplib.HttpClient = new httplib.HttpClient('http-client', [
      bearer
    ])

    const octokit = new Octokit({
      auth: pat,
      baseUrl: serverUrl,
    })
    
    if(initMode) {
      const res: httplib.HttpClientResponse = await http.get(
        `${octomirrorAppUrl}/api/listAllOrganizations`
      )

      if (res.message.statusCode !== 200) {
        throw new Error(
          `Failed to get organizations: ${res.message.statusMessage}`
        )
      }

      const orgs = JSON.parse(await res.readBody())
      core.setOutput('organizations', orgs)
      createOrgs(octokit, orgs) 
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function createOrgs(octokit: Octokit, orgs: string[]) {
  // Use octokit to create the orgs
}

import * as core from '@actions/core'
import axios from 'axios'
import { Octokit } from '@octokit/core'

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
    const initMode: boolean = core.getInput('init-mode') === 'true'

    const axiosInstance = axios.create({
      baseURL: octomirrorAppUrl,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const octokit = new Octokit({
      auth: pat,
      baseUrl: serverUrl
    })

    if (initMode) {
      const res = await axiosInstance.get(
        `${octomirrorAppUrl}/api/listAllOrganizations`
      )

      if (res.status !== 200) {
        throw new Error(`Failed to get organizations: ${res.statusText}`)
      }

      const orgs = JSON.parse(res.data)
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

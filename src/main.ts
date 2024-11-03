import * as core from '@actions/core'
import axios from 'axios'
import * as Octokit from '@octokit/core'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const octomirrorAppUrl: string = core.getInput('app-url')
    const serverUrl: string = core.getInput('server-url')
    const adminUser: string = core.getInput('admin-user')
    const pat: string = core.getInput('pat')
    const token: string = await core.getIDToken()
    const initMode: boolean = core.getInput('init-mode') === 'true'
    const dryRun: boolean = core.getInput('dry-run') === 'true'

    const axiosInstance = axios.create({
      baseURL: octomirrorAppUrl,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    console.log(
      `Creating octokit for server ${serverUrl} using PAT ${pat.slice(0, 4)}...`
    )
    const octokit = new Octokit.Octokit({
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

      console.log(res.data)

      const orgs: string[] = res.data as string[]
      core.setOutput('organizations', orgs)
      if (!dryRun) {
        await createOrgs(octokit, orgs, adminUser)
      }
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function createOrgs(
  octokit: Octokit.Octokit,
  orgs: string[],
  adminUser: string
): Promise<void> {
  // Use octokit to create the orgs
  for (const org of orgs) {
    console.log(`Creating org ${org} with owner ${adminUser}...`)
    await octokit.request('POST /admin/organizations', {
      login: org,
      admin: adminUser
    })
  }
}

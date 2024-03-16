import React from "react"
import { Heading } from '@radix-ui/themes';
import "./Goals.css"

export const RulesOfEngagment = () => {
    return <article className="dashboard--student">

        <Heading size="7">Rules of Engagement for NSS Sprint Teams</Heading>

        <ul>
            <li>The point of sprints is for you to really <strong>learn</strong> these concepts that you were exposed to in the individual projects and start becoming a professional developer.</li>
            <li>Your goal is not to "get it done". You will be focused on that on the job, but not here.</li>
        </ul>

        <Heading size="5">Git/Github Workflows</Heading>

        <p>Here's the link again to the <a href="https://gist.github.com/Valerie-Freeman/171fd7e639fcd1f9129bc79144b5f5ea" target="_blank">Github Workflow Reference</a> that everyone must use during this project.</p>

        <Heading size="5">Git Branching Strategy</Heading>

        <p>As a team, review the <a href="https://dev.to/hardikchotaliya/the-ultimate-guide-to-naming-git-branches-best-practices-and-tips-21o6">The Ultimate Guide to Naming Git Branches: Best Practices and Tips</a> article. All branch names must follow the strategy that your team agrees upon.</p>

        <ul>
            <li><strong>Main Branch:</strong> Reserved for production-ready code.</li>
            <li><strong>Development Branch:</strong> Acts as a pre-production branch where code is merged after thorough
                testing.</li>
            <li><strong>Feature Branches:</strong> Created for new features or bug fixes. They should branch off from and merge
                back into the development branch once completed.</li>
            <li><strong>Naming Conventions:</strong> Use descriptive names for branches (e.g.,
                <code>feature/user-authentication</code>, <code>bugfix/login-issue</code>).</li>
            <li><strong>Merge Requests:</strong> Require peer review before merging into the development branch.</li>
            <li><strong>Keep Branches Updated:</strong> Regularly rebase feature branches with the current development branch to
                minimize merge conflicts.</li>
        </ul>

        <Heading size="5">Comprehensive Pull Requests</Heading>

        <p>As a team, review the <a href="https://www.pullrequest.com/blog/writing-a-great-pull-request-description/" target="_blank">Writing A Great Pull Request Description</a> article. When each teammate pushes a branch to be reviewed and/or approved by a peer, it is expected that a comprehensive, detailed description has been added to the pull request.</p>

        <ul>
            <li><strong>Descriptive Titles:</strong> Clearly state the purpose of the pull request (PR).</li>
            <li><strong>Detailed Descriptions:</strong> Include information such as what changes have been made, why the changes
                are necessary, and any specific things to look for during review.</li>
            <li><strong>Link Tickets:</strong> Reference related ticket numbers.</li>
            <li><strong>Small, Manageable Sizes:</strong> Keep PRs focused on a single feature or bug fix to facilitate easier
                review.</li>
            <li><strong>Code Review:</strong> Watch the <a href="https://www.youtube.com/watch?v=lSnbOtw4izI" target="_blank">How to Review a Pull Request in GitHub the RIGHT Way</a> video for how you should review a teammate's PR. Require at least one (preferably more) team member to review the PR for quality, standards, and functionality.</li>
            <li><strong>Documentation Updates:</strong> Ensure any necessary documentation updates are included.</li>
        </ul>

        <Heading size="5">Ticket Creation</Heading>

        <p>As a team, review the <a href="https://medium.com/nyc-planning-digital/writing-a-proper-github-issue-97427d62a20f" target="_blank">Writing a proper GitHub issue</a> article to learn the basics of how you should approach creating a ticket to describe work that must be done on the project.</p>

        <ul>
            <li><strong>Clear Titles:</strong> Use descriptive titles that provide a clear understanding of the task.</li>
            <li><strong>Detailed Descriptions:</strong> Include all necessary details, such as requirements, expected behavior,
                and acceptance criteria.</li>
            <li><strong>Assignment:</strong> Assign tickets to relevant team members based on expertise and workload.</li>
            <li><strong>Tracking Progress:</strong> Update ticket status as it moves through stages (To Do, In Progress, Review,
                Done).</li>
        </ul>

        <Heading size="5">Definition of Done (DoD)</Heading>

        <ul>
            <li><strong>Code Completeness:</strong> Feature implementation is complete as per ticket descriptions and acceptance
                criteria.</li>
            <li><strong>Code Quality:</strong> Code adheres to coding standards, and does not introduce new bugs.</li>
            <li><strong>Documentation:</strong> All necessary documentation has been updated or added. Review the <a href="https://www.makeareadme.com/">Make a README</a> site for tips on creating the team's README for the project.</li>
            <li><strong>Peer Review:</strong> Code has been reviewed and approved by at least one other team member.</li>
            <li><strong>Testing:</strong> Changes are fully tested, including unit, integration, and, where applicable,
                end-to-end tests. Test coverage meets the team’s minimum threshold.</li>
        </ul>

        <Heading size="5">Continuous Integration/Continuous Deployment (CI/CD)</Heading>

        <em>This section is only for sprints done at the end of the program.</em>

        <ul>
            <li><strong>Automated Builds</strong>: Use automated builds to ensure that the codebase is always in a buildable
                state.</li>
            <li><strong>Automated Testing</strong>: Implement automated testing as part of the CI pipeline to catch bugs early
                and ensure software quality.</li>
            <li><strong>Deployment Strategy</strong>: Define strategies for deployment, including blue-green deployments, canary
                releases, or feature flags, to minimize disruption and facilitate rollback if needed.</li>
        </ul>
    </article>
}

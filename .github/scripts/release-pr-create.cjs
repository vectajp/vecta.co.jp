const { prepareReleaseBranch } = require('./release-pr-common.cjs');

module.exports = async ({github, context, version, notes}) => {
  const branch = await prepareReleaseBranch({github, context, version});
  const pr = (await github.rest.pulls.create({
    ...context.repo,
    title: `chore: release ${version}`,
    head: branch,
    base: 'main',
    body: notes,
  })).data;
  await github.rest.issues.addLabels({
    ...context.repo,
    issue_number: pr.number,
    labels: ['ignore for release'],
  });
  return pr.html_url;
};

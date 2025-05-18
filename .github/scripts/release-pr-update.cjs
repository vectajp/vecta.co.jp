const { prepareReleaseBranch, findOpenReleasePR } = require('./release-pr-common.cjs');

module.exports = async ({github, context, version, notes}) => {
  const branch = await prepareReleaseBranch({github, context, version});
  const existingPr = await findOpenReleasePR(github, context, branch);
  if (!existingPr) throw new Error(`No open PR for ${branch}`);
  const pr = (await github.rest.pulls.update({
    ...context.repo,
    pull_number: existingPr.number,
    body: notes,
  })).data;
  return pr.html_url;
};

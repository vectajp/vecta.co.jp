const fs = require('fs');

/**
 * main ブランチの SHA を取得する。
 * @param {import('@actions/github').GitHub} github - GitHub クライアント。
 * @param {import('@actions/github').Context} context - GitHub アクション コンテキスト。
 * @returns {Promise<string>} main ブランチの SHA。
 */
async function getBaseSha(github, context) {
  const {data: mainRef} = await github.rest.git.getRef({
    ...context.repo,
    ref: 'heads/main',
  });
  return mainRef.object.sha;
}

/**
 * 指定したブランチが存在しなければ、baseSha から作成する。
 * @param {import('@actions/github').GitHub} github - GitHub クライアント。
 * @param {import('@actions/github').Context} context - GitHub アクション コンテキスト。
 * @param {string} branch - 作成するブランチ名。
 * @param {string} baseSha - 作成元のコミット SHA。
 * @returns {Promise<void>}
 */
async function ensureBranch(github, context, branch, baseSha) {
  try {
    await github.rest.git.getRef({
      ...context.repo,
      ref: `heads/${branch}`,
    });
  } catch {
    await github.rest.git.createRef({
      ...context.repo,
      ref: `refs/heads/${branch}`,
      sha: baseSha,
    });
  }
}

/**
 * 指定したバージョンでマニフェスト JSON ファイルを更新する。
 * @param {string} manifestPath - マニフェスト JSON ファイルのパス。
 * @param {string} version - 設定するバージョン文字列。
 * @throws {Error} マニフェスト ファイルが存在しない場合。
 * @returns {string} 更新されたマニフェストの内容を JSON 文字列として。
 */
function updateManifest(manifestPath, version) {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`ファイルが見つかりません: ${manifestPath}`);
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest['.'] = version;
  return JSON.stringify(manifest, null, 2);
}

/**
 * 指定したバージョンで package.json を更新する。
 * @param {string} pkgPath - package.json ファイルのパス。
 * @param {string} version - 設定するバージョン文字列。
 * @returns {string|null} 更新された package.json の内容を JSON 文字列として、ファイルが見つからない場合は null。
 */
function updatePackageVersion(pkgPath, version) {
  if (!fs.existsSync(pkgPath)) {
    return null;
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.version = version;
  return JSON.stringify(pkg, null, 2);
}

/**
 * 指定したブランチにツリーアイテムをコミットする。
 * @param {import('@actions/github').GitHub} github - GitHub クライアント。
 * @param {import('@actions/github').Context} context - GitHub アクション コンテキスト。
 * @param {string} branch - コミット先のブランチ名。
 * @param {string} baseSha - コミット元のコミット SHA。
 * @param {Array<object>} treeItems - 新しいツリーのアイテム配列。
 * @param {string} message - コミットメッセージ。
 * @returns {Promise<void>}
 */
async function commitChanges(github, context, branch, baseSha, treeItems, message) {
  const {data: commitData} = await github.rest.git.getCommit({
    ...context.repo,
    commit_sha: baseSha,
  });
  const {data: newTree} = await github.rest.git.createTree({
    ...context.repo,
    base_tree: commitData.tree.sha,
    tree: treeItems,
  });
  const {data: commit} = await github.rest.git.createCommit({
    ...context.repo,
    message,
    tree: newTree.sha,
    parents: [baseSha],
  });
  await github.rest.git.updateRef({
    ...context.repo,
    ref: `heads/${branch}`,
    sha: commit.sha,
    force: true,
  });
}

/**
 * マニフェストと package.json を更新し、リリース用ブランチを作成／準備する。
 * @param {{github: import('@actions/github').GitHub, context: import('@actions/github').Context, version: string}} options - リリースブランチ準備オプション。
 * @returns {Promise<string>} 作成されたリリースブランチ名。
 */
async function prepareReleaseBranch({github, context, version}) {
  const branch = `workflows/release/v${version}`;
  const baseSha = await getBaseSha(github, context);
  await ensureBranch(github, context, branch, baseSha);

  const manifestPath = '.github/release-please-manifest.json';
  const updatedManifest = updateManifest(manifestPath, version);

  const tree = [{
    path: manifestPath,
    mode: '100644',
    type: 'blob',
    content: updatedManifest,
  }];

  const pkgPath = 'package.json';
  const updatedPkg = updatePackageVersion(pkgPath, version);
  if (updatedPkg) {
    tree.push({
      path: pkgPath,
      mode: '100644',
      type: 'blob',
      content: updatedPkg,
    });
  }

  await commitChanges(github, context, branch, baseSha, tree, `chore: release ${version}`);
  return branch;
}

/**
 * 指定したブランチのオープン中のプルリクエストを取得する。
 * @param {import('@actions/github').GitHub} github - GitHub クライアント。
 * @param {import('@actions/github').Context} context - GitHub アクション コンテキスト。
 * @param {string} branch - 検索対象のブランチ名。
 * @returns {Promise<object|undefined>} プルリクエストデータが見つかった場合、それを返す。見つからなかった場合は undefined。
 */
async function findOpenReleasePR(github, context, branch) {
  const {data: pulls} = await github.rest.pulls.list({
    ...context.repo,
    head: `${context.repo.owner}:${branch}`,
    state: 'open',
  });
  return pulls[0];
}

module.exports = {
  prepareReleaseBranch,
  findOpenReleasePR,
};

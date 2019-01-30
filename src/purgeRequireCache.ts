export default function purgeRequireCache(compiler: any, done: any) {
  // missing types for webpack.Compiler
  const { watchFileSystem } = compiler;
  const watcher = watchFileSystem.watcher || watchFileSystem.wfs.watcher;
  // list of changed files in compiler.hooks.watchRun
  // https://stackoverflow.com/questions/43140501/can-webpack-report-which-file-triggered-a-compilation-in-watch-mode
  const changedFiles = Object.keys(watcher.mtimes);

  for (const id of Object.keys(require.cache)) {
    // if node's require cache contains an entry with the filename
    // property included in `changedFiles`, remove it from cache
    // https://nodejs.org/api/modules.html#modules_require_cache
    if (changedFiles.some(file => require.cache[id].filename.includes(file))) {
      delete require.cache[id];
    }
  }

  return done();
}

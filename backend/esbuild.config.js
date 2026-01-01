const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

// Check for production flag in command line arguments or environment
const isProduction = process.argv.includes('--production') || process.env.NODE_ENV === 'production';

// Plugin to mark all node_modules as external
const markNodeModulesAsExternal = {
  name: 'mark-node-modules-as-external',
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      // If it's a node_modules package, mark it as external
      if (args.path[0] !== '.' && args.path[0] !== '/' && !path.isAbsolute(args.path)) {
        return { external: true };
      }
    });
  },
};

const buildOptions = {
  entryPoints: ['app.js'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  outdir: 'dist',
  minify: isProduction,
  sourcemap: !isProduction,
  plugins: [markNodeModulesAsExternal],
  logLevel: 'info',
};

// Function to copy files to dist
function copyFilesToDist() {
  const distPath = path.join(__dirname, 'dist');
  
  // Read the original package.json
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Create production package.json (only production dependencies, correct start script)
  const productionDependencies = { ...packageJson.dependencies };
  // Remove nodemon from production dependencies (it's a dev tool)
  delete productionDependencies.nodemon;
  
  const productionPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    private: packageJson.private,
    scripts: {
      start: 'node app.js'
    },
    dependencies: productionDependencies
  };
  
  // Write production package.json to dist
  fs.writeFileSync(
    path.join(distPath, 'package.json'),
    JSON.stringify(productionPackageJson, null, 2)
  );
  console.log('✓ Copied package.json to dist');
  
  // Copy .env if it exists
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    fs.copyFileSync(envPath, path.join(distPath, '.env'));
    console.log('✓ Copied .env to dist');
  } else {
    // Fallback to .env.example if .env doesn't exist
    const envExamplePath = path.join(__dirname, '.env.example');
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, path.join(distPath, '.env.example'));
      console.log('✓ Copied .env.example to dist (no .env file found)');
    }
  }
  
  // Create a README for the dist folder
  const readmeContent = `# Backend Production Build

This is a production build of the backend application.

## Setup

1. If a \`.env\` file wasn't copied, create one in this directory
2. Run \`npm install\` to install dependencies
3. Run \`npm start\` to start the server

## Environment Variables

Make sure to set up your \`.env\` file with the required environment variables before starting the server.
`;
  fs.writeFileSync(path.join(distPath, 'README.md'), readmeContent);
  console.log('✓ Created README.md');
}

// Build function
async function build() {
  try {
    await esbuild.build(buildOptions);
    copyFilesToDist();
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

// Watch function for development
async function watch() {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  // Copy files on initial watch build
  copyFilesToDist();
  console.log('Watching for changes...');
}

// Run based on command
const command = process.argv[2];
if (command === 'watch') {
  watch();
} else {
  build();
}


const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const EC2_HOST = process.env.EC2_HOST;
const EC2_USER = process.env.EC2_USER || 'ubuntu';
const EC2_SSH_KEY = process.env.EC2_SSH_KEY;
const EC2_DEPLOY_PATH = process.env.EC2_DEPLOY_PATH || '/var/www/portfolio-backend';

if (!EC2_HOST) {
  console.error('Error: EC2_HOST environment variable is required');
  process.exit(1);
}

if (!EC2_SSH_KEY) {
  console.error('Error: EC2_SSH_KEY environment variable is required');
  console.error('This should be the private SSH key content or path to the key file');
  process.exit(1);
}

async function deploy() {
  const distPath = path.join(__dirname, '..', 'backend', 'dist');

  if (!fs.existsSync(distPath)) {
    console.error(`Error: Build directory not found: ${distPath}`);
    console.error('Please run "npm run build" first');
    process.exit(1);
  }

  console.log(`Deploying backend to EC2: ${EC2_USER}@${EC2_HOST}`);
  console.log(`Deploy path: ${EC2_DEPLOY_PATH}`);

  // Create a temporary SSH key file if EC2_SSH_KEY is the key content
  let sshKeyPath = EC2_SSH_KEY;
  let tempKeyFile = null;

  // Check if EC2_SSH_KEY is a file path or key content
  if (!fs.existsSync(EC2_SSH_KEY)) {
    // Assume it's the key content, create a temp file
    tempKeyFile = path.join(__dirname, '..', '.tmp-deploy-key');
    fs.writeFileSync(tempKeyFile, EC2_SSH_KEY, { mode: 0o600 });
    sshKeyPath = tempKeyFile;
    console.log('Created temporary SSH key file');
  }

  try {
    // Create deploy directory on EC2 if it doesn't exist
    // Try without sudo first, then with sudo if needed
    console.log('\nCreating deploy directory on EC2...');
    try {
      execSync(
        `ssh -i "${sshKeyPath}" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "mkdir -p ${EC2_DEPLOY_PATH}"`,
        { stdio: 'inherit' }
      );
    } catch (mkdirError) {
      // If mkdir fails, try with sudo
      console.log('Directory creation failed, trying with sudo...');
      try {
        execSync(
          `ssh -i "${sshKeyPath}" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "sudo mkdir -p ${EC2_DEPLOY_PATH} && sudo chown ${EC2_USER}:${EC2_USER} ${EC2_DEPLOY_PATH}"`,
          { stdio: 'inherit' }
        );
      } catch (sudoError) {
        // If directory might already exist, check and continue
        console.log('Checking if directory already exists...');
        try {
          execSync(
            `ssh -i "${sshKeyPath}" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "test -d ${EC2_DEPLOY_PATH}"`,
            { stdio: 'inherit' }
          );
          console.log('Directory exists, continuing...');
        } catch (testError) {
          console.error('Error: Cannot create or access deployment directory');
          console.error('Please ensure the directory exists and has proper permissions');
          throw mkdirError;
        }
      }
    }

    // Copy dist folder to EC2
    console.log('\nCopying files to EC2...');
    execSync(
      `scp -i "${sshKeyPath}" -o StrictHostKeyChecking=no -r ${distPath}/* ${EC2_USER}@${EC2_HOST}:${EC2_DEPLOY_PATH}/`,
      { stdio: 'inherit' }
    );

    // Copy .env file separately if it exists (scp with /* doesn't copy hidden files)
    const envPath = path.join(distPath, '.env');
    if (fs.existsSync(envPath)) {
      console.log('\nCopying .env file to EC2...');
      execSync(
        `scp -i "${sshKeyPath}" -o StrictHostKeyChecking=no ${envPath} ${EC2_USER}@${EC2_HOST}:${EC2_DEPLOY_PATH}/.env`,
        { stdio: 'inherit' }
      );
      console.log('✓ .env file copied');
    } else {
      console.log('\n⚠ Warning: .env file not found in dist directory');
      console.log('  Make sure to run "npm run env prod" before building to generate the .env file');
    }

    // Install dependencies and restart service on EC2
    console.log('\nInstalling dependencies on EC2...');
    execSync(
      `ssh -i "${sshKeyPath}" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "cd ${EC2_DEPLOY_PATH} && npm install --production"`,
      { stdio: 'inherit' }
    );

    // Restart the backend service (assuming PM2 or systemd)
    console.log('\nRestarting backend service...');
    try {
      // Try PM2 first
      execSync(
        `ssh -i "${sshKeyPath}" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "pm2 restart portfolio-backend || pm2 start ${EC2_DEPLOY_PATH}/app.js --name portfolio-backend || true"`,
        { stdio: 'inherit' }
      );
    } catch (error) {
      // If PM2 fails, try systemd
      try {
        execSync(
          `ssh -i "${sshKeyPath}" -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} "sudo systemctl restart portfolio-backend || true"`,
          { stdio: 'inherit' }
        );
      } catch (systemdError) {
        console.log('Note: Could not automatically restart service. Please restart manually.');
      }
    }

    console.log('\n✓ Deployment complete!');
    console.log(`Backend deployed to: ${EC2_USER}@${EC2_HOST}:${EC2_DEPLOY_PATH}`);
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up temporary key file if created
    if (tempKeyFile && fs.existsSync(tempKeyFile)) {
      fs.unlinkSync(tempKeyFile);
      console.log('Cleaned up temporary SSH key file');
    }
  }
}

deploy().catch((error) => {
  console.error('Deployment failed:', error);
  process.exit(1);
});


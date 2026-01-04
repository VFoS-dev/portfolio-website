const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const fs = require('fs');
const path = require('path');

// Load root .env file if it exists (for AWS configuration)
// This allows configuring AWS_SECRET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID, etc. in root .env
const rootEnvPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath });
}

/**
 * Fetch environment variables from AWS Secrets Manager and generate .env files
 * Usage: node scripts/fetch-env.js <environment> [secret-name]
 * Example: node scripts/fetch-env.js dev portfolio-env-dev
 */
async function fetchAndGenerateEnv(environment, secretName) {
  // Validate environment
  if (!['dev', 'prod'].includes(environment)) {
    console.error('Error: Environment must be "dev" or "prod"');
    process.exit(1);
  }

  // Get secret name from argument or environment variable
  const secretNameToUse = secretName || process.env.AWS_SECRET_NAME || `portfolio-env-${environment}`;
  const awsRegion = process.env.AWS_REGION || 'us-west-2';

  console.log(`Fetching secrets from AWS Secrets Manager...`);
  console.log(`Secret Name: ${secretNameToUse}`);
  console.log(`Region: ${awsRegion}`);
  console.log(`Environment: ${environment}\n`);

  try {
    // Initialize AWS Secrets Manager client
    const client = new SecretsManagerClient({
      region: awsRegion,
      // Credentials will be picked up from:
      // 1. AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables
      // 2. AWS credentials file (~/.aws/credentials)
      // 3. IAM role (if running on EC2/ECS/Lambda)
    });

    // Fetch secret from AWS
    const command = new GetSecretValueCommand({
      SecretId: secretNameToUse,
    });

    const response = await client.send(command);
    let secretString = response.SecretString;

    // If the secret is binary, decode it
    if (response.SecretBinary) {
      secretString = Buffer.from(response.SecretBinary, 'base64').toString('utf-8');
    }

    // Parse the JSON
    const config = JSON.parse(secretString);

    // Validate structure
    if (!config.types || !config.types[environment]) {
      throw new Error(`Environment "${environment}" not found in config.types`);
    }

    if (!config.envs || !Array.isArray(config.envs)) {
      throw new Error('config.envs must be an array');
    }

    // Get file mappings for this environment
    const fileMappings = config.types[environment];
    const envFiles = {};

    // Initialize all target files
    for (const [sourcePath, targetPath] of Object.entries(fileMappings)) {
      const fullTargetPath = path.join(__dirname, '..', targetPath);
      envFiles[targetPath] = {
        path: fullTargetPath,
        content: [],
      };
    }

    // Process each environment variable
    for (const envVar of config.envs) {
      const { key, value, comment, save } = envVar;

      // Skip entries without key or value
      if (!key || value === undefined || value === null) {
        console.warn(`Warning: Skipping entry missing key or value:`, JSON.stringify(envVar));
        continue;
      }

      if (!save) {
        console.warn(`Warning: No "save" mapping found for ${key}, skipping...`);
        continue;
      }

      // Process each file mapping in the save object
      for (const [sourcePath, saveConfig] of Object.entries(save)) {
        // Check if this source file is mapped for the current environment
        if (!fileMappings[sourcePath]) {
          continue;
        }

        const targetPath = fileMappings[sourcePath];
        const envFile = envFiles[targetPath];

        if (!envFile) {
          console.warn(`Warning: Target file ${targetPath} not found in mappings, skipping...`);
          continue;
        }

        // Determine the key to use
        let envKey;
        if (saveConfig === true) {
          // Use the key as-is
          envKey = key;
        } else if (typeof saveConfig === 'string') {
          // Use the custom key name
          envKey = saveConfig;
        } else {
          // Skip if saveConfig is not true or a string
          continue;
        }

        // Format: key=value #comment
        const commentStr = comment ? ` #${comment}` : '';
        const line = `${envKey}=${value}${commentStr}`;
        envFile.content.push(line);
      }
    }

    // Write all .env files
    console.log('Generating .env files...\n');
    for (const [targetPath, envFile] of Object.entries(envFiles)) {
      // Ensure directory exists
      const dir = path.dirname(envFile.path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write file
      const content = envFile.content.join('\n') + '\n';
      fs.writeFileSync(envFile.path, content, 'utf8');
      console.log(`✓ Generated: ${targetPath}`);
      console.log(`  ${envFile.content.length} environment variable(s)`);
    }

    console.log('\n✓ Successfully generated all .env files!');
  } catch (error) {
    console.error('\n✗ Error fetching or generating environment files:');
    if (error.name === 'ResourceNotFoundException') {
      console.error(`  Secret "${secretNameToUse}" not found in AWS Secrets Manager`);
      console.error('  Make sure the secret exists and you have the correct permissions');
    } else if (error.name === 'AccessDeniedException') {
      console.error('  Access denied. Check your AWS credentials and permissions');
    } else {
      console.error(`  ${error.message}`);
      if (error.stack) {
        console.error(`  ${error.stack}`);
      }
    }
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const environment = args[0];
const secretName = args[1];

if (!environment) {
  console.error('Usage: node scripts/fetch-env.js <environment> [secret-name]');
  console.error('  environment: "dev" or "prod"');
  console.error('  secret-name: (optional) AWS Secrets Manager secret name');
  console.error('              Default: portfolio-env-<environment>');
  console.error('\nConfiguration (in order of precedence):');
  console.error('  1. Command line arguments');
  console.error('  2. Root .env file (./.env)');
  console.error('  3. System environment variables');
  console.error('\nEnvironment variables:');
  console.error('  AWS_SECRET_NAME: Override default secret name');
  console.error('  AWS_REGION: AWS region (default: us-west-2)');
  console.error('  AWS_ACCESS_KEY_ID: AWS access key (if not using credentials file)');
  console.error('  AWS_SECRET_ACCESS_KEY: AWS secret key (if not using credentials file)');
  process.exit(1);
}

fetchAndGenerateEnv(environment, secretName);


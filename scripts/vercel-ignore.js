cls
code .env#!/usr/bin/env node

/**
 * This script determines if a Vercel deployment should be skipped
 * Returns exit code 0 to skip deployment, 1 to proceed
 */

const { execSync } = require('child_process');

try {
  // Get the list of changed files
  const changedFiles = execSync('git diff HEAD~1 HEAD --name-only', {
    encoding: 'utf-8'
  }).split('\n').filter(Boolean);

  // Check if only non-deployment files changed
  const deploymentFiles = changedFiles.filter(file => 
    !file.startsWith('apps/mobile/') && 
    !file.includes('README') &&
    !file.includes('.md') &&
    file !== 'deploy.sh'
  );

  // Skip deployment if only non-essential files changed
  if (deploymentFiles.length === 0) {
    console.log('Skipping deployment - only non-deployment files changed');
    process.exit(0);
  }

  // Proceed with deployment
  console.log('Proceeding with deployment');
  process.exit(1);
} catch (error) {
  // If error, proceed with deployment (safer approach)
  console.log('Proceeding with deployment');
  process.exit(1);
}

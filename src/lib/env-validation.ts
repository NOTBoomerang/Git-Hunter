/**
 * Environment Variable Validation Utility
 * Helps users identify missing or invalid environment variables
 */

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface EnvConfig {
  githubToken?: string;
  openaiApiKey?: string;
  githubApi?: string;
  openaiModel?: string;
}

/**
 * Validates environment variables for the Git Hunter application
 */
export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check GitHub Token
  const githubToken = process.env.NEXT_GITHUB_TOKEN;
  if (!githubToken) {
    errors.push('NEXT_GITHUB_TOKEN is not set');
    suggestions.push('Add NEXT_GITHUB_TOKEN=your_github_token to your .env.local file');
    suggestions.push('Create a GitHub Personal Access Token at https://github.com/settings/tokens');
  } else if (githubToken.length < 20) {
    warnings.push('NEXT_GITHUB_TOKEN appears to be too short (should be 40+ characters)');
  } else if (!githubToken.startsWith('ghp_') && !githubToken.startsWith('github_pat_')) {
    warnings.push('NEXT_GITHUB_TOKEN format may be invalid (should start with ghp_ or github_pat_)');
  }

  // Check OpenAI API Key
  const openaiKey = process.env.NEXT_OPENAI_API_KEY;
  if (!openaiKey) {
    errors.push('NEXT_OPENAI_API_KEY is not set');
    suggestions.push('Add NEXT_OPENAI_API_KEY=your_openai_key to your .env.local file');
    suggestions.push('Get an OpenAI API key at https://platform.openai.com/api-keys');
  } else if (openaiKey.length < 50) {
    errors.push('NEXT_OPENAI_API_KEY appears to be too short or truncated');
    suggestions.push('OpenAI API keys should be 51+ characters long and start with sk-proj- or sk-');
  } else if (!openaiKey.startsWith('sk-proj-') && !openaiKey.startsWith('sk-')) {
    warnings.push('NEXT_OPENAI_API_KEY format may be invalid (should start with sk-proj- or sk-)');
  } else if (openaiKey.includes('...') || openaiKey.includes('truncated')) {
    errors.push('NEXT_OPENAI_API_KEY appears to be truncated or incomplete');
    suggestions.push('Make sure to copy the complete API key from OpenAI dashboard');
  }

  // Check optional configurations
  const githubApi = process.env.NEXT_GITHUB_API;
  if (githubApi && !githubApi.startsWith('https://')) {
    warnings.push('NEXT_GITHUB_API should use HTTPS');
  }

  const openaiModel = process.env.OPENAI_MODEL;
  if (openaiModel) {
    const validModels = ['gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'];
    if (!validModels.some(model => openaiModel.includes(model))) {
      warnings.push(`OPENAI_MODEL '${openaiModel}' may not be supported. Recommended: ${validModels.join(', ')}`);
    }
  }

  // Additional suggestions
  if (errors.length === 0) {
    suggestions.push('Consider setting up error monitoring for production deployments');
    suggestions.push('Review rate limits for GitHub API and OpenAI API based on your usage');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
}

/**
 * Get current environment configuration (safe to log)
 */
export function getEnvironmentConfig(): EnvConfig {
  const githubToken = process.env.NEXT_GITHUB_TOKEN;
  const openaiApiKey = process.env.NEXT_OPENAI_API_KEY;
  
  return {
    githubToken: githubToken ? `${githubToken.substring(0, 8)}...` : undefined,
    openaiApiKey: openaiApiKey ? `${openaiApiKey.substring(0, 8)}...` : undefined,
    githubApi: process.env.NEXT_GITHUB_API || 'https://api.github.com',
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini'
  };
}

/**
 * Generate environment setup instructions
 */
export function generateSetupInstructions(validationResult: EnvValidationResult): string {
  const instructions: string[] = [];
  
  instructions.push('# Git Hunter Environment Setup');
  instructions.push('');
  instructions.push('Create a .env.local file in your project root with the following variables:');
  instructions.push('');
  
  if (validationResult.errors.some(e => e.includes('NEXT_GITHUB_TOKEN'))) {
    instructions.push('# GitHub Personal Access Token (required)');
    instructions.push('NEXT_GITHUB_TOKEN=your_github_token_here');
    instructions.push('');
  }
  
  if (validationResult.errors.some(e => e.includes('NEXT_OPENAI_API_KEY'))) {
    instructions.push('# OpenAI API Key (required)');
    instructions.push('NEXT_OPENAI_API_KEY=your_openai_api_key_here');
    instructions.push('');
  }
  
  instructions.push('# Optional configurations:');
  instructions.push('# NEXT_GITHUB_API=https://api.github.com');
  instructions.push('# OPENAI_MODEL=gpt-4o-mini');
  instructions.push('# MAX_FILE_SIZE_BYTES=1048576');
  instructions.push('# MAX_FILES=100');
  instructions.push('');
  instructions.push('## How to get tokens:');
  instructions.push('');
  instructions.push('### GitHub Token:');
  instructions.push('1. Go to https://github.com/settings/tokens');
  instructions.push('2. Click "Generate new token (classic)"');
  instructions.push('3. Select "repo" scope for private repositories, or no scopes for public only');
  instructions.push('4. Copy the generated token');
  instructions.push('');
  instructions.push('### OpenAI API Key:');
  instructions.push('1. Go to https://platform.openai.com/api-keys');
  instructions.push('2. Click "Create new secret key"');
  instructions.push('3. Copy the generated key');
  instructions.push('');
  
  return instructions.join('\n');
}

/**
 * Validate environment on startup (server-side only)
 */
export function validateEnvironmentOnStartup(): void {
  // Only run on server side
  if (typeof window !== 'undefined') {
    return;
  }
  
  const validation = validateEnvironment();
  const config = getEnvironmentConfig();
  
  console.log('\n🔧 Git Hunter Environment Check');
  console.log('================================');
  console.log(`GitHub Token: ${config.githubToken ? '✅ Set' : '❌ Missing'}`);
  console.log(`OpenAI API Key: ${config.openaiApiKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`GitHub API: ${config.githubApi}`);
  console.log(`OpenAI Model: ${config.openaiModel}`);
  
  if (validation.errors.length > 0) {
    console.log('\n❌ Configuration Errors:');
    validation.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (validation.warnings.length > 0) {
    console.log('\n⚠️ Configuration Warnings:');
    validation.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  if (!validation.isValid) {
    console.log('\n📝 Setup Instructions:');
    console.log(generateSetupInstructions(validation));
  } else {
    console.log('\n✅ Environment configuration looks good!');
  }
  
  console.log('================================\n');
}
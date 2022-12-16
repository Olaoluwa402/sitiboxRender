module.exports = {
  apps : [{
    name: 'sitiboxApp',
    script: 'backend/server.js',
 
    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: { 
      NODE_ENV: 'production',
      CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,
      MONGO_URI:process.env.MONGO_URI,
      JWT_SECRET:process.env.JWT_SECRET,
      PAYSTACK_CLIENT_ID: process.env.PAYSTACK_CLIENT_ID,
      PAYSTACK_KEY:process.env.PAYSTACK_KEY,
      API_KEY_VONAGE:process.env.API_KEY_VONAGE,
      API_SECRET_VONAGE:process.env.API_SECRET_VONAGE,
      MAILGUN_DOMAIN:process.env.MAILGUN_DOMAIN,
      MAILGUN_API:process.env.MAILGUN_API
    }
  }],

  deploy : {
    production : {
      user : 'olaoluwa',
      host : '134.209.188.87',
      ref  : 'origin/master',
      repo : 'git@github.com:9jaclinic/sitiboxApp.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.cjs --env production'
    }
  }
};

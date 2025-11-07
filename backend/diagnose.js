const { exec } = require('child_process');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

function checkMongoDB() {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('✅ MongoDB is running and accessible');
      mongoose.disconnect();
      resolve(true);
    })
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.log('\nPossible solutions:');
      console.log('1. Make sure MongoDB is installed and running');
      console.log('2. Check if the MongoDB URI is correct in .env file');
      console.log('3. Ensure MongoDB is listening on the correct port (27017)');
      reject(err);
    });
  });
}

function checkEnvironmentVariables() {
  const requiredVars = [
    'PORT',
    'MONGO_URI',
    'JWT_SECRET'
  ];

  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    return false;
  }

  console.log('✅ All required environment variables are set');
  return true;
}

async function checkPort(port) {
  return new Promise((resolve) => {
    const netstat = process.platform === 'win32' ? 
      `netstat -ano | findstr :${port}` : 
      `lsof -i :${port}`;

    exec(netstat, (error, stdout, stderr) => {
      if (stdout) {
        console.error(`❌ Port ${port} is already in use`);
        console.log('Please either:');
        console.log(`1. Kill the process using port ${port}`);
        console.log(`2. Use a different port in .env file`);
        resolve(false);
      } else {
        console.log(`✅ Port ${port} is available`);
        resolve(true);
      }
    });
  });
}

async function diagnose() {
  console.log('\n🔍 Starting server diagnostics...\n');

  try {
    // Check environment variables
    const envOk = checkEnvironmentVariables();
    if (!envOk) return;

    // Check if port is available
    const portOk = await checkPort(process.env.PORT || 5000);
    if (!portOk) return;

    // Check MongoDB connection
    await checkMongoDB();

    console.log('\n✨ All checks passed! The server should start successfully.');
    console.log('Run the following command to start the server:');
    console.log('npm run dev\n');

  } catch (error) {
    console.error('\n❌ Server diagnostics failed');
  }
}

// Run diagnostics
diagnose();
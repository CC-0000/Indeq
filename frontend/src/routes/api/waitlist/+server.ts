import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

// MongoDB connection string - should be in an environment variable
const DB_URI = MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'indeq';
const COLLECTION_NAME = 'waitlist';

// Create a MongoDB client
const client = new MongoClient(DB_URI);

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    return client.db(DB_NAME);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Email validation function
function isValidEmail(email: string): boolean {
  // RFC 5322 compliant email regex
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email } = await request.json();
    
    // Check if email is provided
    if (!email) {
      return json({ success: false, message: 'Email is required' }, { status: 400 });
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      return json({ success: false, message: 'Please provide a valid email address' }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await connectToDatabase();
    const collection = db.collection(COLLECTION_NAME);
    
    // Check if email already exists
    const existingEmail = await collection.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return json({ 
        success: false, 
        message: 'Email is already on the waitlist' 
      }, { status: 400 });
    }
    
    // Insert email into MongoDB (store as lowercase for consistency)
    await collection.insertOne({ 
      email: email.toLowerCase(), 
      createdAt: new Date(),
      source: 'website'
    });
    
    return json({ 
      success: true, 
      message: 'Successfully added to the waitlist! 🎉' 
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return json({ 
      success: false, 
      message: 'Server error processing your request' 
    }, { status: 500 });
  }
};

// Close MongoDB connection when the server shuts down
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
}); 
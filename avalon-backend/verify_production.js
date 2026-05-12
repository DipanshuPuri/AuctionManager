const fs = require('fs');

const API_URL = 'http://localhost:5001';

async function verify() {
  console.log('--- STARTING PRODUCTION VERIFICATION ---');
  let results = {
    imageUpload: 'FAIL',
    realtime: 'FAIL'
  };

  try {
    // 1. Create Seller & Login
    const sellerEmail = `seller_${Date.now()}@test.com`;
    await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Seller', email: sellerEmail, username: `seller_${Date.now()}`, password: 'password123', role: 'seller'
      })
    });
    const sellerLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: sellerEmail, password: 'password123'
      })
    });
    const sellerLogin = await sellerLoginRes.json();
    const sellerToken = sellerLogin.data.token;

    // 2. Test Image Upload
    try {
      console.log('Testing Image Upload (Supabase Storage)...');
      
      // Node 18+ has native fetch and FormData
      const formData = new FormData();
      formData.append('title', 'Test Auction with Image');
      formData.append('starting_price', '100');
      
      // Node fetch requires Blob for files in FormData
      const fileBuffer = fs.readFileSync('/Users/gurnoor21/Documents/docs/Auction Manager/AuctionManager/test_image.png');
      formData.append('image', new Blob([fileBuffer], { type: 'image/png' }), 'test_image.png');
      
      const uploadRes = await fetch(`${API_URL}/auctions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sellerToken}`
        },
        body: formData
      });
      
      const uploadData = await uploadRes.json();
      
      if (uploadRes.ok && uploadData.data.image_url) {
        console.log('✅ Image uploaded successfully:', uploadData.data.image_url);
        results.imageUpload = 'PASS';
      } else {
        console.error('❌ Image Upload Failed:', uploadData.message);
        results.imageUploadFailReason = uploadData.message;
      }
    } catch (e) {
      console.error('❌ Image Upload Exception:', e.message);
      results.imageUploadFailReason = e.message;
    }

    // 3. Test Realtime System (indirectly by placing a bid)
    console.log('Testing Bid Placement (Triggers Realtime log)...');
    
    const buyerEmail = `buyer_${Date.now()}@test.com`;
    await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Buyer', email: buyerEmail, username: `buyer_${Date.now()}`, password: 'password123', role: 'buyer'
      })
    });
    const buyerLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: buyerEmail, password: 'password123'
      })
    });
    const buyerLogin = await buyerLoginRes.json();
    const buyerToken = buyerLogin.data.token;

    // We need an auction ID to bid on.
    const auctionRes = await fetch(`${API_URL}/auctions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sellerToken}` 
      },
      body: JSON.stringify({
        title: 'Bidding Test Auction', starting_price: 50
      })
    });
    const auctionData = await auctionRes.json();
    const auctionId = auctionData.data.id;

    try {
      const bidRes = await fetch(`${API_URL}/bids`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${buyerToken}` 
        },
        body: JSON.stringify({
          auction_id: auctionId, amount: 100
        })
      });
      const bidData = await bidRes.json();
      
      if (bidRes.ok) {
        console.log('✅ Bid placed successfully.');
        results.realtime = 'PASS (Backend level)';
      } else {
        console.error('❌ Bid Failed:', bidData.message);
        results.realtimeFailReason = bidData.message;
      }
    } catch (e) {
      console.error('❌ Bid Exception:', e.message);
      results.realtimeFailReason = e.message;
    }
    
  } catch (err) {
    console.error('General Error:', err.message);
  }

  console.log('\n--- VERIFICATION RESULTS ---');
  console.log(JSON.stringify(results, null, 2));
}

verify();

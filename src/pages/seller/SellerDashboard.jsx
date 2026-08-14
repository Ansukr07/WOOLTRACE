import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  ShoppingCart, 
  List, 
  Package, 
  Gavel,
  Plus,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useGlobalState } from '../../context/GlobalStateContext';

const salesData = [
  { name: 'Jan', revenue: 15000 },
  { name: 'Feb', revenue: 22000 },
  { name: 'Mar', revenue: 18500 },
  { name: 'Apr', revenue: 29000 },
  { name: 'May', revenue: 45000 },
  { name: 'Jun', revenue: 62000 },
  { name: 'Jul', revenue: 93500 },
];

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { listings, orders } = useGlobalState();

  // Filter global state for this seller
  const sellerListings = listings.filter(l => l.sellerId === user.id);
  const sellerOrders = orders.filter(o => o.items?.some(i => i.sellerId === user.id)); // Assuming order contains items array

  const activeListings = sellerListings.length;
  const pendingOrders = sellerOrders.filter(o => o.status === 'Pending').length;
  const inventoryTotal = sellerListings.reduce((sum, item) => sum + (item.quantity || 0), 0);
  
  // Count total bids across all listings
  const pendingBids = sellerListings.reduce((sum, listing) => {
    return sum + (listing.bids ? listing.bids.filter(b => b.status === 'Pending').length : 0);
  }, 0);

  return (
    <div style={{padding: '32px'}}>
      <div style={{marginBottom: '32px'}}>
        <h1 style={{fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0B120D'}}>
          Good afternoon, {user?.name || 'Seller'}
        </h1>
        <p style={{color: '#666', fontSize: '16px'}}>Manage your wool business from one place.</p>
      </div>

      {/* Top Metrics */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '40px'}}>
        <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5', display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <span style={{fontSize: '13px', color: '#666', textTransform: 'uppercase', fontWeight: '700'}}>Total Sales</span>
            <div style={{backgroundColor: '#DDFF86', padding: '8px', borderRadius: '8px', color: '#0B120D'}}><Wallet size={20} /></div>
          </div>
          <span style={{fontSize: '28px', fontWeight: '800', color: '#0B120D'}}>₹2,84,500</span>
        </div>

        <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5', display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <span style={{fontSize: '13px', color: '#666', textTransform: 'uppercase', fontWeight: '700'}}>Pending Orders</span>
            <div style={{backgroundColor: '#FFAAA4', padding: '8px', borderRadius: '8px', color: '#0B120D'}}><ShoppingCart size={20} /></div>
          </div>
          <span style={{fontSize: '28px', fontWeight: '800', color: '#0B120D'}}>{pendingOrders}</span>
        </div>

        <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5', display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <span style={{fontSize: '13px', color: '#666', textTransform: 'uppercase', fontWeight: '700'}}>Active Listings</span>
            <div style={{backgroundColor: '#BED5E5', padding: '8px', borderRadius: '8px', color: '#0B120D'}}><List size={20} /></div>
          </div>
          <span style={{fontSize: '28px', fontWeight: '800', color: '#0B120D'}}>{activeListings}</span>
        </div>

        <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5', display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <span style={{fontSize: '13px', color: '#666', textTransform: 'uppercase', fontWeight: '700'}}>Inventory</span>
            <div style={{backgroundColor: '#EDEDCE', padding: '8px', borderRadius: '8px', color: '#0B120D'}}><Package size={20} /></div>
          </div>
          <span style={{fontSize: '28px', fontWeight: '800', color: '#0B120D'}}>{inventoryTotal} KG</span>
        </div>
        
        <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5', display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <span style={{fontSize: '13px', color: '#666', textTransform: 'uppercase', fontWeight: '700'}}>Pending Bids</span>
            <div style={{backgroundColor: '#0B120D', padding: '8px', borderRadius: '8px', color: '#DDFF86'}}><Gavel size={20} /></div>
          </div>
          <span style={{fontSize: '28px', fontWeight: '800', color: '#0B120D'}}>{pendingBids}</span>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px'}}>
        {/* Main Chart Area */}
        <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
            <h2 style={{fontSize: '18px', fontWeight: '700'}}>SALES OVERVIEW</h2>
            <div style={{display: 'flex', gap: '8px'}}>
              <button style={{padding: '4px 12px', borderRadius: '20px', border: 'none', backgroundColor: '#0B120D', color: '#DDFF86', fontSize: '12px', fontWeight: '600'}}>Monthly</button>
              <button style={{padding: '4px 12px', borderRadius: '20px', border: 'none', backgroundColor: '#F8F8F3', color: '#666', fontSize: '12px', fontWeight: '600'}}>Yearly</button>
            </div>
          </div>
          
          <div style={{height: '300px', width: '100%'}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5'}}>
            <h2 style={{fontSize: '18px', fontWeight: '700', marginBottom: '24px'}}>QUICK ACTIONS</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              <button 
                onClick={() => navigate('/seller/list-wool')}
                style={{display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '16px', backgroundColor: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'opacity 0.2s'}}
              >
                <Plus size={20} /> LIST WOOL
              </button>
              <button 
                onClick={() => navigate('/seller/list-product')}
                style={{display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '16px', backgroundColor: '#F8F8F3', color: '#0B120D', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'background-color 0.2s'}}
              >
                <Tag size={20} /> ADD PRODUCT
              </button>
              <button 
                onClick={() => navigate('/seller/orders')}
                style={{display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '16px', backgroundColor: '#F8F8F3', color: '#0B120D', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700', cursor: 'pointer'}}
              >
                <ShoppingCart size={20} /> MANAGE ORDERS
              </button>
              <button 
                onClick={() => navigate('/seller/bids')}
                style={{display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '16px', backgroundColor: '#F8F8F3', color: '#0B120D', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700', cursor: 'pointer'}}
              >
                <Gavel size={20} /> VIEW BIDS
              </button>
            </div>
          </div>
          
          <div style={{backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E5E5E5', flex: 1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{fontSize: '18px', fontWeight: '700'}}>RECENT BIDS</h2>
              <button style={{border: 'none', background: 'none', color: '#16A34A', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'}}>
                View All <ArrowRight size={16}/>
              </button>
            </div>
            
            {sellerListings.flatMap(l => l.bids || []).slice(0,3).map(bid => (
              <div key={bid.id} style={{padding: '12px 0', borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontWeight: '700', fontSize: '15px'}}>{bid.buyerName}</div>
                  <div style={{fontSize: '12px', color: '#666'}}>Offered ₹{bid.amount}/kg</div>
                </div>
                <div style={{fontSize: '12px', fontWeight: '800', color: '#D97706', backgroundColor: '#FEF3C7', padding: '4px 8px', borderRadius: '4px'}}>
                  {bid.status}
                </div>
              </div>
            ))}
            
            {sellerListings.flatMap(l => l.bids || []).length === 0 && (
              <p style={{color: '#666', fontSize: '14px'}}>No active bids right now.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function AddEditProduct({ onSave }){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('scented'); // scented or unscented
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate preview when file selected
  useEffect(()=>{
    if(!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  },[file]);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if(f){ setFile(f); setImageUrl(''); } // clear URL when file chosen
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!title || !price || !stock || (!file && !imageUrl)) return alert('Please fill all fields and provide an image');
    setLoading(true);
    try{
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('stock', stock);
      if(file) formData.append('image', file);
      if(imageUrl) formData.append('imageUrl', imageUrl);
      
      await api.post('/admin/product', formData);
      if(onSave) onSave();
      // reset form
      setTitle(''); setDescription(''); setPrice(''); setStock('');
      setFile(null); setImageUrl(''); setPreview('');
    }catch(err){
      console.error(err);
      alert('Failed to create product');
    }finally{
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <h3>Add New Product</h3>
      
      <div className="form-group">
        <label>Product Image</label>
        <div className="image-inputs">
          <div className="upload-area">
            <input type="file" accept="image/*" onChange={handleFile} />
            {preview && <img src={preview} alt="Preview" className="image-preview" />}
          </div>
          <div className="url-input">
            <input 
              type="url" 
              placeholder="Or enter image URL"
              value={imageUrl}
              onChange={e=>{ setImageUrl(e.target.value); setFile(null); }}
            />
            {imageUrl && <img src={imageUrl} alt="URL preview" className="image-preview" />}
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Price (₹)</label>
          <input type="number" value={price} onChange={e=>setPrice(e.target.value)} required />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="scented">Scented</option>
            <option value="unscented">Unscented</option>
          </select>
        </div>
        <div className="form-group">
          <label>Stock</label>
          <input type="number" value={stock} onChange={e=>setStock(e.target.value)} required />
        </div>
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} />
      </div>

      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}

function ProductsList(){
  const [products, setProducts] = useState([]);
  
  const loadProducts = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };

  useEffect(()=>{ loadProducts(); },[]);

  const deleteProduct = async (id) => {
    if(!window.confirm('Delete this product?')) return;
    try{
      await api.delete(`/admin/product/${id}`);
      await loadProducts();
    }catch(err){
      console.error(err);
      alert('Failed to delete');
    }
  };

  return (
    <div className="products-grid">
      {products.map(p=>(
        <div key={p._id} className="product-card">
          <img src={p.images?.[0]} alt={p.title} />
          <div className="details">
            <h4>{p.title}</h4>
            <div>₹{p.price}</div>
            <div>Stock: {p.stock}</div>
            <div>{p.category}</div>
          </div>
          <div className="actions">
            <Link to={`/admin/products/${p._id}/edit`} className="btn secondary">Edit</Link>
            <button onClick={()=>deleteProduct(p._id)} className="btn danger">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrdersList(){
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(()=>{
    api.get('/admin/orders').then(r=>setOrders(r.data)).catch(console.error);
    api.get('/admin/stats').then(r=>setStats(r.data)).catch(()=>{});
  },[]);

  const updateStatus = async (orderId, status) => {
    try{
      await api.put(`/admin/orders/${orderId}/status`, { status });
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    }catch(err){
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div>
      {stats && <div className="stats-grid">
        <div className="stat-card">
          <div className="value">{stats.totalOrders}</div>
          <div className="label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="value">₹{stats.totalRevenue}</div>
          <div className="label">Revenue</div>
        </div>
        <div className="stat-card">
          <div className="value">{stats.customers}</div>
          <div className="label">Customers</div>
        </div>
      </div>}

      <div className="orders-list">
        {orders.map(o=>(
          <div key={o._id} className="order-card">
            <div>
              <div>Order #{o._id}</div>
              <div>Customer: {o.user?.email}</div>
              <div>Amount: ₹{o.totalAmount}</div>
              <div>Items: {o.items?.length}</div>
              <div>Status: {o.statusHistory?.[o.statusHistory.length-1]?.status}</div>
            </div>
            <div className="status-actions">
              <button onClick={()=>updateStatus(o._id, 'Confirmed')} className="btn small">Confirm</button>
              <button onClick={()=>updateStatus(o._id, 'Packed')} className="btn small">Pack</button>
              <button onClick={()=>updateStatus(o._id, 'Shipped')} className="btn small">Ship</button>
              <button onClick={()=>updateStatus(o._id, 'Delivered')} className="btn small">Deliver</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin(){
  const nav = useNavigate();
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/orders">Orders</Link>
      </div>
      
      <div className="admin-content">
        <Routes>
          <Route index element={
            <div>
              <h2>Admin Dashboard</h2>
              <div className="admin-actions">
                <button onClick={()=>nav('/admin/products')} className="btn">Manage Products</button>
                <button onClick={()=>nav('/admin/orders')} className="btn">Manage Orders</button>
              </div>
            </div>
          } />
          <Route path="products" element={
            <div>
              <h2>Products</h2>
              <AddEditProduct onSave={()=>nav('/admin/products')} />
              <ProductsList />
            </div>
          } />
          <Route path="orders" element={
            <div>
              <h2>Orders</h2>
              <OrdersList />
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addProducts, deleteProduct, fetchProducts, updateProducts, decreaseStock } from '../features/productsSlice'
import { addToCart } from '../features/cartSlice'
import './products.css'
import './products-cards.css'


export default function Products() {

  const emptyForm = {
    title:'',
    price:'',
    stock:'',
    brand:'',
    category:'',
    thumbnail:'',
  }

  const [showMode,setShowMode] = useState(false)
  const [isEditing,setIsEditing] =useState(false)
  const [formData,setFormData] = useState(emptyForm)
  const [editId,setEditId] = useState(null)
  const [searchText,setSearchText] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {products,loading,error,successMsg, isFetched} = useSelector((state)=>state.products)
  const cartItems = useSelector((state)=>state.cart.items)
  const userData = useSelector((state) => state.auth.userData)
  const isAdmin = userData?.role === 'admin' || userData?.username === 'Jaydip'

  useEffect(()=>{
      if (!isFetched) {
        dispatch(fetchProducts())
      }
  },[dispatch, isFetched])

  const handleDelete = (id) =>{
    dispatch(deleteProduct(id))
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
    dispatch(decreaseStock({ productId: product.id, quantity: 1 }))
    alert(`${product.title} added to cart!`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title || !formData.price || !formData.stock || !formData.category) {
      return
    }

    if (isNaN(formData.price) || isNaN(formData.stock)) {
      return
    }
    console.log(formData)

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      thumbnail: formData.thumbnail || '',
    }
    console.log(isEditing,"true or false")
    console.log(editId,"editID")

    if (isEditing) {
      dispatch(updateProducts({ id: editId, ...payload }))
    } else {
      dispatch(addProducts(payload))
    }

    setShowMode(false)
  }

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
    console.log(formData)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        thumbnail: reader.result,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleOpenAdd = ()=>{
    setShowMode(true)
    setFormData(emptyForm)
    setIsEditing(false)
  }

  const handleOpenEdit = (products) =>{
    setEditId(products.id)
    setIsEditing(true)
    setShowMode(true)
    setFormData({
      title:products.title||'',
      brand:products.brand||'',
      category:products.category||'',
      rating:products.rating||'',
      price:products.price||'',
      stock:products.stock||'',
      thumbnail: products.thumbnail || products.image || products.images?.[0] || ''
    })
  }

  const handleClose = () => {
    setShowMode(false)
    setIsEditing(false)
    setFormData(emptyForm)
    setEditId(null)
  }

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchText.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchText.toLowerCase())) ||
    p.category.toLowerCase().includes(searchText.toLowerCase())
  )

  if(loading){
    return <h2>Loading.....</h2>
  }

  if(error){
    return <h2>{error}</h2>
  }

  return (
 <div className="products-page">
      <div className="products-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h2>Products</h2>
            <p>
              Total Records: <strong>{products.length}</strong>
              {searchText && ` | Showing: ${filteredProducts.length}`}
              
            </p>
          </div>
          {isAdmin && (
            <button onClick={handleOpenAdd} className="btn-add">
              + Add Product
            </button>
          )}
        </div>

        {successMsg && <div className="success-bar">{successMsg}</div>}
        {error && <div className="error-bar">{error}</div>}

        {/* Search */}
        <div className="search-row">
          <input
            type="text"
            placeholder="Search by title, brand or category..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
        </div>

        {loading && <p className="loading-text">Loading products...</p>}

        {!loading && (
          <div className="products-grid">
            {filteredProducts.length === 0 ? (
              <div className="no-data">No products found.</div>
            ) : (
              filteredProducts.map((product, index) => (
                <div key={product.id} className="product-card">
                  <div className="card-media">
                    <img
                      src={product.thumbnail || product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={product.title}
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    <div className="rating">⭐ {product.rating}</div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{product.title}</h3>
                    <p className="card-category">{product.category}</p>
                    <p className="card-brand">{product.brand || '-'}</p>
                    <div className="card-row">
                      <div className="price">₹{product.price}</div>
                      <div className={product.stock < 10 ? 'stock-low small' : 'stock-ok small'}>{product.stock} left</div>
                    </div>
                    <div className="card-actions">
                      <button onClick={() => handleAddToCart(product)} className="btn-add-cart">🛒 Add</button>
                      {isAdmin && (
                        <>
                          <button onClick={() => handleOpenEdit(product)} className="btn-edit">Edit</button>
                          <button onClick={() => handleDelete(product.id)} className="btn-delete">Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>  

        {/*----- add and edit mode ----------*/}
        {showMode && (
          <div className="modal-overlay" onClick={handleClose}>
            <div className="product-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                <button className="modal-close" onClick={handleClose} aria-label="Close">✕</button>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-row">
                  <div className="modal-field">
                    <label>Title*</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Product title" required />
                  </div>

                  <div className="modal-field">
                    <label>Brand</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" />
                  </div>
                </div>

                <div className="modal-row">
                  <div className="modal-field">
                    <label>Image URL or File</label>
                    <input
                      type="text"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleChange}
                      placeholder="Paste an image URL or choose a file below"
                    />
                  </div>
                </div>

                <div className="modal-row">
                  <div className="modal-field">
                    <label>Select image file</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                  </div>
                </div>

                {formData.thumbnail && (
                  <div className="modal-row">
                    <div className="modal-field">
                      <label>Preview</label>
                      <img
                        src={formData.thumbnail}
                        alt="Preview"
                        className="image-preview"
                      />
                    </div>
                  </div>
                )}

                <div className="modal-row">
                  <div className="modal-field">
                    <label>Price*</label>
                    <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 99.99" required />
                  </div>

                  <div className="modal-field">
                    <label>Stock*</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="e.g. 10" required />
                  </div>
                </div>

                <div className="modal-row">
                  <div className="modal-field" style={{flex:1}}>
                    <label>Category*</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={handleClose}>Cancel</button>
                  <button type="submit" className="btn-save">{isEditing ? 'Update Product' : 'Add Product'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  )
}
